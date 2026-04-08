'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Eye, Clock, User, Calendar, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import type { Video } from '@/types'

export default function VideoPage() {
  const params = useParams()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedVideos, setRelatedVideos] = useState<Video[]>([])

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        // 获取视频详情
        const response = await fetch(`/api/videos/${params.id}`)
        if (!response.ok) throw new Error('视频不存在')
        const data = await response.json()
        setVideo(data.video)

        // 增加观看次数
        await fetch(`/api/videos/${params.id}/views`, { method: 'POST' })

        // 获取相关视频
        const relatedResponse = await fetch('/api/videos')
        const relatedData = await relatedResponse.json()
        const filtered = relatedData.videos
          .filter((v: Video) => v.id !== params.id)
          .slice(0, 3)
        setRelatedVideos(filtered)
      } catch (error) {
        console.error('Failed to fetch video:', error)
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchVideo()
    }
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-cyan-50/80">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-600 border-t-transparent" />
      </div>
    )
  }

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-cyan-50/80">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent mb-4">视频不存在</h1>
          <Link href="/" className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50/80 via-blue-50/60 to-cyan-50/80">
      <div className="container mx-auto px-4 py-4 md:py-8">
        {/* Back Button - 移动端优化 */}
        <Link
          href="/"
          className="mb-4 md:mb-8 inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-3 rounded-xl md:rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-md md:shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-purple-700 hover:text-purple-800 font-semibold text-sm md:text-base"
        >
          <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" />
          返回首页
        </Link>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-2xl md:rounded-3xl bg-black shadow-lg md:shadow-2xl border border-white/10">
              <div className="aspect-video relative">
                {video.videoUrl ? (
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    poster={video.thumbnail || undefined}
                  >
                    您的浏览器不支持 video 标签。
                  </video>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/90 to-blue-900/90">
                    <div className="text-center text-white p-4 md:p-8">
                      <div className="mb-2 md:mb-4">
                        <Play className="h-12 w-12 md:h-16 md:h-16 mx-auto mb-2 md:mb-4 text-white/80" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold mb-1 md:mb-2">视频无法加载</h3>
                      <p className="text-white/70 text-sm">视频地址无效或视频处理未完成</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Video Info - 移动端优化内边距 */}
            <div className="mt-4 md:mt-8 rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm p-4 md:p-8 shadow-lg md:shadow-xl border border-white/50">
              <h1 className="mb-3 md:mb-6 text-2xl md:text-4xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent leading-tight">
                {video.title}
              </h1>

              <p className="mb-4 md:mb-8 text-sm md:text-lg text-gray-700 leading-relaxed">
                {video.description}
              </p>

              {/* Stats - 移动端优化 */}
              <div className="mb-4 md:mb-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                <div className="text-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
                  <Eye className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-purple-600" />
                  <div className="text-lg md:text-2xl font-bold text-purple-700">{video.views}</div>
                  <div className="text-xs md:text-sm text-gray-600">观看</div>
                </div>
                <div className="text-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <Heart className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-blue-600" />
                  <div className="text-lg md:text-2xl font-bold text-blue-700">{video.likes}</div>
                  <div className="text-xs md:text-sm text-gray-600">点赞</div>
                </div>
                <div className="text-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100">
                  <Clock className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-cyan-600" />
                  <div className="text-lg md:text-2xl font-bold text-cyan-700">{video.duration}</div>
                  <div className="text-xs md:text-sm text-gray-600">时长</div>
                </div>
                <div className="text-center p-3 md:p-4 rounded-xl md:rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100">
                  <Calendar className="h-6 w-6 md:h-8 md:w-8 mx-auto mb-1 md:mb-2 text-teal-600" />
                  <div className="text-lg md:text-2xl font-bold text-teal-700">{video.uploadedAt}</div>
                  <div className="text-xs md:text-sm text-gray-600">发布</div>
                </div>
              </div>

              {/* Performer Info - 移动端垂直布局 */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-50/80 to-blue-50/80 p-4 md:p-6 border border-purple-100/50">
                <div className="flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-lg sm:text-2xl font-bold shadow-lg">
                  {video.performer[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
                    <User className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                    <span className="text-base md:text-xl font-semibold text-gray-900">
                      {video.performer}
                    </span>
                  </div>
                  <div className="text-sm md:text-lg text-gray-600">
                    🎵 演奏乐器: {video.instrument}
                  </div>
                </div>
                <button className="w-full sm:w-auto rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-4 md:px-6 py-2 md:py-3 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  关注
                </button>
              </div>

              {/* Actions - 移动端优化按钮大小 */}
              <div className="mt-4 md:mt-8 flex flex-col sm:flex-row gap-3 md:gap-4">
                <button className="flex-1 flex items-center justify-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border-2 border-purple-200 bg-white px-4 md:px-6 py-3 md:py-4 text-purple-700 font-semibold hover:bg-purple-50 hover:border-purple-300 hover:-translate-y-0.5 transition-all">
                  <Heart className="h-5 w-5 md:h-6 md:w-6" />
                  <span>点赞</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 md:gap-3 rounded-xl md:rounded-2xl border-2 border-blue-200 bg-white px-4 md:px-6 py-3 md:py-4 text-blue-700 font-semibold hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all">
                  <Share2 className="h-5 w-5 md:h-6 md:w-6" />
                  <span>分享</span>
                </button>
              </div>

              {/* Tags - 移动端优化 */}
              <div className="mt-4 md:mt-8 flex flex-wrap gap-2 md:gap-3">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-purple-700 border border-purple-200/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 移动端间距优化 */}
          <div className="space-y-4 md:space-y-8">
            <div className="rounded-2xl md:rounded-3xl bg-white/90 backdrop-blur-sm p-4 md:p-6 shadow-lg md:shadow-xl border border-white/50">
              <h3 className="mb-3 md:mb-6 text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                相关推荐
              </h3>
              <div className="space-y-3 md:space-y-4">
                {relatedVideos.map((relatedVideo) => (
                    <Link
                      key={relatedVideo.id}
                      href={`/video/${relatedVideo.id}`}
                      className="flex gap-3 md:gap-4 rounded-xl md:rounded-2xl p-3 md:p-4 transition-all hover:bg-gradient-to-r from-purple-50/50 to-blue-50/50 hover:shadow-lg hover:-translate-y-0.5 border border-transparent hover:border-purple-100/50"
                    >
                      <div className="relative aspect-video w-24 sm:w-32 flex-shrink-0 overflow-hidden rounded-lg md:rounded-xl">
                        {relatedVideo.thumbnail ? (
                          <Image
                            src={relatedVideo.thumbnail}
                            alt={relatedVideo.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
                            <div className="text-purple-600 opacity-50 font-bold text-xs">无缩略图</div>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                          <Play className="absolute inset-0 m-auto h-6 w-6 md:h-8 md:w-8 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-center min-w-0">
                        <h4 className="line-clamp-2 text-sm md:text-lg font-semibold text-gray-900 mb-0.5 md:mb-1">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2">
                          {relatedVideo.performer}
                        </p>
                        <div className="flex items-center gap-1 md:gap-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{relatedVideo.views} 观看</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-purple-600/90 to-blue-600/90 p-4 md:p-6 text-white shadow-lg md:shadow-xl border border-white/20">
              <h3 className="mb-2 md:mb-3 text-lg md:text-xl font-semibold">
                想要分享你的音乐吗？
              </h3>
              <p className="mb-3 md:mb-4 text-blue-100 leading-relaxed text-sm md:text-base">
                加入我们的社区，让更多人欣赏你的音乐才华，用音乐传递快乐与温暖。
              </p>
              <Link
                href="/upload"
                className="block w-full rounded-xl md:rounded-2xl bg-white/20 backdrop-blur-sm px-4 md:px-6 py-2.5 md:py-3 text-center font-semibold text-white border border-white/30 hover:bg-white/30 hover:shadow-lg hover:-translate-y-0.5 transition-all text-sm md:text-base"
              >
                立即发布
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
