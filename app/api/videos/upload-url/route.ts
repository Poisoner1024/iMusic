import { NextRequest, NextResponse } from 'next/server'
import { generateUploadUrl, generateKey } from '@/lib/tencentcloud/cos'
import { v4 as uuidv4 } from 'uuid'

/**
 * POST /api/videos/upload-url
 * 获取COS上传凭证
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fileName, fileType, contentLength } = body
    
    // 验证参数
    if (!fileName || !fileType) {
      return NextResponse.json(
        { success: false, error: '缺少必要参数' },
        { status: 400 }
      )
    }
    
    // 验证文件类型
    if (!fileType.startsWith('video/')) {
      return NextResponse.json(
        { success: false, error: '只允许上传视频文件' },
        { status: 400 }
      )
    }
    
    // 验证文件大小（最大500MB）
    const MAX_SIZE = 500 * 1024 * 1024 // 500MB
    if (contentLength && contentLength > MAX_SIZE) {
      return NextResponse.json(
        { success: false, error: '文件大小超过限制（最大500MB）' },
        { status: 400 }
      )
    }
    
    // 生成COS存储Key
    const videoKey = generateKey(fileName, 'videos')
    
    // 生成带签名的上传URL（1小时有效期）
    const uploadUrl = await generateUploadUrl(videoKey, 3600)
    
    // 生成视频ID（UUID）
    const videoId = uuidv4()
    
    return NextResponse.json({
      success: true,
      uploadUrl,
      videoKey,
      videoId,
      method: 'PUT',
      headers: {
        'Content-Type': fileType,
      },
      expiresAt: new Date(Date.now() + 3600 * 1000).toISOString(),
    })
  } catch (error) {
    console.error('Generate upload URL error:', error)
    return NextResponse.json(
      { success: false, error: '生成上传凭证失败' },
      { status: 500 }
    )
  }
}