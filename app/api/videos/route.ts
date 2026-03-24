import { NextRequest, NextResponse } from 'next/server'
import { addVideo } from '@/lib/videoStore'
import { Video } from '@/types'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, performer, instrument, category, tags, file } = body
    
    // 生成新视频 ID
    const newVideo: Video = {
      id: Date.now().toString(),
      title,
      description,
      thumbnail: 'https://images.unsplash.com/photo-1514117445516-2ecfc9c4ec90?w=800&h=450&fit=crop', // 默认缩略图
      videoUrl: '#', // 实际项目中应该上传到云存储后返回 URL
      performer,
      instrument,
      duration: '0:00', // 实际项目中应该解析视频文件获取时长
      uploadedAt: new Date().toISOString().split('T')[0],
      views: 0,
      likes: 0,
      category,
      tags: tags ? tags.split(',').map((t: string) => t.trim()) : [],
    }
    
    // 保存视频数据
    addVideo(newVideo)
    
    return NextResponse.json({ 
      success: true, 
      video: newVideo 
    })
  } catch (error) {
    console.error('Error uploading video:', error)
    return NextResponse.json(
      { success: false, error: '上传失败' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const { getVideos } = await import('@/lib/videoStore')
    const videos = getVideos()
    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { videos: [] },
      { status: 500 }
    )
  }
}
