/**
 * 腾讯云相关类型定义
 */

export interface TencentCloudConfig {
  secretId: string
  secretKey: string
  region: string
  bucket: string
}

export interface COSUploadResult {
  videoKey: string
  videoUrl: string
  thumbnailKey?: string
  thumbnailUrl?: string
}

export interface VideoProcessingResult {
  success: boolean
  videoUrl?: string
  thumbnailUrl?: string
  duration?: string
  error?: string
}

export interface SCFEvent {
  videoKey: string
  videoId: string
  bucket: string
  region: string
}

export interface SCFContext {
  requestId: string
  memoryLimit: number
  timeLimit: number
}
