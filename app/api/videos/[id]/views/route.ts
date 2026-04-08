import { NextRequest, NextResponse } from 'next/server'
import { query } from '@/lib/tencentcloud/db'

/**
 * POST /api/videos/[id]/views
 * 增加视频观看次数
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const result = await query(
      `UPDATE videos 
       SET views = views + 1 
       WHERE id = $1 
       RETURNING views`,
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
      views: result.rows[0].views,
    })
  } catch (error) {
    console.error('Error updating views:', error)
    return NextResponse.json(
      { success: false, error: '更新观看次数失败' },
      { status: 500 }
    )
  }
}
