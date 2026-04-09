import { NextRequest, NextResponse } from 'next/server'
import { addVideo } from '@/lib/videoStore'
import { Video } from '@/types'
import { generateUploadUrl, generateKey } from '@/lib/tencentcloud/cos'
import { query } from '@/lib/tencentcloud/db'

/**
 * POST /api/videos
 * 创建视频记录（视频文件已上传到COS）
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      title, 
      description, 
      performer, 
      instrument, 
      category, 
      tags, 
      videoKey,
      videoId,
    } = body
    
    // 验证必填字段
    if (!title || !performer || !videoKey || !videoId) {
      return NextResponse.json(
        { success: false, error: '缺少必填字段' },
        { status: 400 }
      )
    }
    
    // 1. 生成视频URL
    const videoUrl = `https://${process.env.COS_BUCKET}.cos.${process.env.COS_REGION || process.env.TENCENTCLOUD_REGION}.myqcloud.com/${videoKey}`
    
    // 2. 插入数据库（状态为processing，等待SCF处理）
    const result = await query(
      `INSERT INTO videos (
        id, title, description, video_url, video_key, performer, 
        instrument_category, status, tags
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING *`,
      [
        videoId,
        title,
        description || '',
        videoUrl,
        videoKey,
        performer,
        category || 'other',
        'processing',
        tags ? tags.split(',').map((t: string) => t.trim()) : [],
      ]
    )
    
    const video = result.rows[0]
    
    // 3. 触发SCF云函数进行视频处理（实际项目中这里调用SCF API）
    // await triggerSCFProcessing(videoKey, videoId)
    
    return NextResponse.json({ 
      success: true, 
      video,
      message: '视频已提交，正在处理中...'
    })
  } catch (error) {
    console.error('Error creating video record:', error)
    return NextResponse.json(
      { success: false, error: '创建视频记录失败' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/videos
 * 获取视频列表
 */
export async function GET() {
  try {
    const result = await query(
      `SELECT 
        id,
        title,
        description,
        thumbnail_url as "thumbnail",
        video_url as "videoUrl",
        performer,
        instrument_category as category,
        duration,
        uploaded_at as "uploadedAt",
        views,
        likes,
        tags
      FROM videos 
      WHERE status = 'published'
      ORDER BY uploaded_at DESC
      LIMIT 100`
    )
    
    // 转换 duration 为字符串格式，并格式化日期
    const videos = result.rows.map(video => ({
      ...video,
      duration: video.duration ? formatDuration(video.duration) : '未知',
      uploadedAt: formatDate(video.uploadedAt)
    }))
    
    return NextResponse.json({ 
      videos,
      total: result.rowCount || 0
    })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { videos: [], error: '获取视频列表失败' },
      { status: 500 }
    )
  }
}

// 辅助函数：将秒数转换为 MM:SS 格式
function formatDuration(seconds: number): string {
  if (!seconds || seconds <= 0) return '未知'
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

// 辅助函数：格式化日期为精简格式
function formatDate(dateString: string): string {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '未知'
  
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  
  return `${year}年${month}月${day}日`
}
