/**
 * 腾讯云SCF云函数 - 视频处理
 * 功能：视频转码、缩略图生成、元数据提取
 */

import { uploadFile, generateKey } from './cos'
import { exec } from 'child_process'
import { promisify } from 'util'
import { createReadStream, createWriteStream, unlink } from 'fs'
import { writeFile } from 'fs/promises'
import { tmpdir } from 'os'
import { join } from 'path'

const execAsync = promisify(exec)
const unlinkAsync = promisify(unlink)

interface VideoMetadata {
  duration: number // 秒
  width: number
  height: number
  size: number // 字节
  format: string
}

interface SCFEvent {
  videoKey: string // COS中视频文件的Key
  videoId: string // 视频记录ID
}

/**
 * 主处理函数（SCF入口）
 */
export async function handleVideoProcessing(event: SCFEvent) {
  const { videoKey, videoId } = event
  
  console.log('Starting video processing:', { videoKey, videoId })
  
  try {
    // 1. 下载视频文件到临时目录
    const tempVideoPath = await downloadVideo(videoKey)
    
    // 2. 提取视频元数据
    const metadata = await extractMetadata(tempVideoPath)
    console.log('Video metadata extracted:', metadata)
    
    // 3. 生成缩略图（第5秒的帧）
    const thumbnailPath = await generateThumbnail(tempVideoPath, 5)
    
    // 4. 上传缩略图到COS
    const thumbnailKey = generateKey('thumbnail.jpg', 'thumbnails')
    const thumbnailUpload = await uploadFile(thumbnailKey, await require('fs/promises').readFile(thumbnailPath), {
      'Content-Type': 'image/jpeg',
      'x-cos-meta-video-id': videoId,
    })
    
    // 5. 生成视频转码（可选，根据需求）
    // const transcodedPath = await transcodeVideo(tempVideoPath)
    // const transcodedKey = generateKey('video.mp4', 'videos/transcoded')
    // await uploadFile(transcodedKey, await require('fs/promises').readFile(transcodedPath))
    
    // 6. 清理临时文件
    await cleanupTempFiles([tempVideoPath, thumbnailPath])
    
    // 7. 更新数据库记录
    const { query } = await import('../db')
    await query(
      `UPDATE videos 
       SET duration = $1, 
           file_size = $2, 
           thumbnail_url = $3,
           thumbnail_key = $4,
           status = 'published',
           published_at = NOW()
       WHERE id = $5`,
      [
        metadata.duration,
        metadata.size,
        thumbnailUpload.url,
        thumbnailKey,
        videoId,
      ]
    )
    
    console.log('Video processing completed successfully')
    
    return {
      success: true,
      videoId,
      metadata,
      thumbnailUrl: thumbnailUpload.url,
    }
  } catch (error) {
    console.error('Video processing failed:', error)
    
    // 更新数据库状态为失败
    try {
      const { query } = await import('../db')
      await query(
        `UPDATE videos SET status = 'failed' WHERE id = $1`,
        [videoId]
      )
    } catch (dbError) {
      console.error('Failed to update video status:', dbError)
    }
    
    throw error
  }
}

/**
 * 从COS下载视频文件到临时目录
 */
async function downloadVideo(videoKey: string): Promise<string> {
  const { s3Client } = await import('./cos')
  const { GetObjectCommand } = await import('@aws-sdk/client-s3')
  const { createWriteStream } = await import('fs')
  const { pipeline } = await import('stream')
  const { promisify } = await import('util')
  
  const command = new GetObjectCommand({
    Bucket: process.env.COS_BUCKET || '',
    Key: videoKey,
  })
  
  const response = await s3Client.send(command)
  const tempPath = join(tmpdir(), `video-${Date.now()}.mp4`)
  
  if (response.Body) {
    const streamPipeline = promisify(pipeline)
    // @ts-ignore - 处理ReadableStream
    await streamPipeline(response.Body, createWriteStream(tempPath))
  }
  
  return tempPath
}

/**
 * 使用FFmpeg提取视频元数据
 */
async function extractMetadata(videoPath: string): Promise<VideoMetadata> {
  try {
    // ffprobe命令获取元数据
    const { stdout } = await execAsync(
      `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`
    )
    
    const data = JSON.parse(stdout)
    const videoStream = data.streams.find((s: any) => s.codec_type === 'video')
    
    return {
      duration: Math.round(parseFloat(data.format.duration)),
      width: videoStream?.width || 0,
      height: videoStream?.height || 0,
      size: parseInt(data.format.size),
      format: data.format.format_name,
    }
  } catch (error) {
    console.error('Extract metadata error:', error)
    // 返回默认值
    return {
      duration: 0,
      width: 0,
      height: 0,
      size: 0,
      format: 'unknown',
    }
  }
}

/**
 * 使用FFmpeg生成视频缩略图
 */
async function generateThumbnail(videoPath: string, timeInSeconds = 5): Promise<string> {
  const thumbnailPath = join(tmpdir(), `thumbnail-${Date.now()}.jpg`)
  
  try {
    // 生成缩略图命令（第5秒的帧，1280x720）
    await execAsync(
      `ffmpeg -i "${videoPath}" -ss ${timeInSeconds} -vframes 1 -s 1280x720 -f image2 "${thumbnailPath}"`
    )
    
    return thumbnailPath
  } catch (error) {
    console.error('Generate thumbnail error:', error)
    // 生成一个纯色占位图
    await execAsync(
      `ffmpeg -f lavfi -i color=c=0x4f46e5:s=1280x720:d=0.1 -f image2 "${thumbnailPath}"`
    )
    return thumbnailPath
  }
}

/**
 * 视频转码（可选功能）
 */
async function transcodeVideo(videoPath: string): Promise<string> {
  const transcodedPath = join(tmpdir(), `transcoded-${Date.now()}.mp4`)
  
  try {
    // H.264转码，分辨率限制在1080p，码率2Mbps
    await execAsync(
      `ffmpeg -i "${videoPath}" -c:v libx264 -preset medium -crf 23 -maxrate 2000k -bufsize 4000k -vf "scale='min(1920,iw)':min'(1080,ih)':force_original_aspect_ratio=decrease" -c:a aac -b:a 128k "${transcodedPath}"`
    )
    
    return transcodedPath
  } catch (error) {
    console.error('Transcode video error:', error)
    // 转码失败返回原文件
    return videoPath
  }
}

/**
 * 清理临时文件
 */
async function cleanupTempFiles(paths: string[]) {
  for (const path of paths) {
    try {
      await unlinkAsync(path)
      console.log('Cleaned up temp file:', path)
    } catch (error) {
      console.error('Cleanup temp file error:', error)
    }
  }
}

/**
 * SCF云函数入口（腾讯云函数调用）
 */
export async function main_handler(event: any, context: any) {
  console.log('SCF Event:', JSON.stringify(event, null, 2))
  
  try {
    // COS触发器事件格式
    if (event.Records && event.Records[0] && event.Records[0].cos) {
      const cosEvent = event.Records[0].cos
      const bucket = cosEvent.cosBucket.name
      const videoKey = cosEvent.cosObject.key
      
      console.log('Processing COS upload:', { bucket, videoKey })
      
      // 从文件名中提取视频ID
      const match = videoKey.match(/videos\/\d+\/\d+\/\d+-([a-z0-9]+)\.\w+/)
      if (!match) {
        throw new Error('Invalid video key format')
      }
      
      const videoId = match[1]
      
      // 调用处理函数
      const result = await handleVideoProcessing({
        videoKey: decodeURIComponent(videoKey).replace(/^\//, ''),
        videoId,
      })
      
      return {
        statusCode: 200,
        body: JSON.stringify(result),
      }
    }
    
    // API调用格式
    const result = await handleVideoProcessing(event)
    
    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (error) {
    console.error('SCF handler error:', error)
    
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    }
  }
}