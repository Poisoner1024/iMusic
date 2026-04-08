import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/tencentcloud/db'

/**
 * GET /api/videos/[id]
 * 获取单个视频详情
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query(
      `SELECT 
        id,
        title,
        description,
        thumbnail_url as "thumbnail",
        video_url as "videoUrl",
        performer,
        instrument_category as instrument,
        duration,
        uploaded_at as "uploadedAt",
        views,
        likes,
        tags,
        status
      FROM videos 
      WHERE id = $1 AND status = 'published'`,
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: '视频不存在' },
        { status: 404 }
      )
    }

    // 转换 duration 为字符串格式，并格式化日期
    const video = {
      ...result.rows[0],
      duration: result.rows[0].duration ? formatDuration(result.rows[0].duration) : '未知',
      uploadedAt: formatDate(result.rows[0].uploadedAt)
    }

    return NextResponse.json({
      success: true,
      video,
    })
  } catch (error) {
    console.error('Error fetching video:', error)
    return NextResponse.json(
      { success: false, error: '获取视频失败' },
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
