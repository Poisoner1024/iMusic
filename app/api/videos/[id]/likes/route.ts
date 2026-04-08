import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/tencentcloud/db'

/**
 * POST /api/videos/[id]/likes
 * 增加视频点赞数
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query(
      `UPDATE videos 
       SET likes = likes + 1 
       WHERE id = $1 
       RETURNING likes`,
      [id]
    )

    if (result.rowCount === 0) {
      return NextResponse.json(
        { success: false, error: '视频不存在' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      likes: result.rows[0].likes,
    })
  } catch (error) {
    console.error('Error updating likes:', error)
    return NextResponse.json(
      { success: false, error: '更新点赞数失败' },
      { status: 500 }
    )
  }
}
