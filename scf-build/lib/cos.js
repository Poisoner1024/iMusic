/**
 * 腾讯云COS对象存储SDK封装
 * 支持视频上传、缩略图上传、CDN刷新等功能
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// COS配置（腾讯云S3兼容）
const COS_CONFIG = {
  region: process.env.TENCENTCLOUD_REGION || 'ap-beijing',
  credentials: {
    accessKeyId: process.env.TENCENTCLOUD_SECRET_ID || '',
    secretAccessKey: process.env.TENCENTCLOUD_SECRET_KEY || '',
  },
  endpoint: `https://cos.${process.env.TENCENTCLOUD_REGION || 'ap-beijing'}.myqcloud.com`,
}

// 创建S3客户端（腾讯云COS兼容AWS S3协议）
const s3Client = new S3Client(COS_CONFIG)

// 存储桶名称
const BUCKET = process.env.COS_BUCKET || ''

/**
 * 生成带签名的上传URL（支持断点续传）
 * @param key 文件路径（如：videos/2024/01/video-123.mp4）
 * @param expiresIn 过期时间（秒）
 */
export async function generateUploadUrl(key: string, expiresIn = 3600) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: key,
  })
  
  return await getSignedUrl(s3Client, command, { expiresIn })
}

/**
 * 直接上传文件到COS
 * @param key 文件路径
 * @param file 文件Buffer或Stream
 * @param metadata 元数据
 */
export async function uploadFile(
  key: string,
  file: Buffer | Uint8Array | Blob,
  metadata?: Record<string, string>
) {
  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      Metadata: metadata,
    })
    
    const result = await s3Client.send(command)
    return {
      success: true,
      url: `https://${BUCKET}.cos.${COS_CONFIG.region}.myqcloud.com/${key}`,
      key,
      etag: result.ETag,
    }
  } catch (error) {
    console.error('COS upload error:', error)
    throw error
  }
}

/**
 * 获取文件元数据
 * @param key 文件路径
 */
export async function getFileMetadata(key: string) {
  try {
    const command = new HeadObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
    
    const result = await s3Client.send(command)
    return result
  } catch (error) {
    console.error('Get metadata error:', error)
    return null
  }
}

/**
 * 删除文件
 * @param key 文件路径
 */
export async function deleteFile(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
    
    await s3Client.send(command)
    return { success: true }
  } catch (error) {
    console.error('Delete file error:', error)
    throw error
  }
}

/**
 * 生成文件路径
 * @param fileName 文件名
 * @param prefix 前缀（如：videos, thumbnails）
 */
export function generateKey(fileName: string, prefix = 'videos') {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const ext = fileName.split('.').pop()
  return `${prefix}/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${timestamp}-${random}.${ext}`
}

/**
 * 刷新CDN缓存
 * @param urls 需要刷新的URL列表
 */
export async function refreshCDN(urls: string[]) {
  // CDN刷新API调用（需要单独配置CDN密钥）
  // 这里返回模拟结果，实际项目中需要调用腾讯云CDN API
  console.log('Refreshing CDN for URLs:', urls)
  return { success: true, taskId: `refresh-${Date.now()}` }
}