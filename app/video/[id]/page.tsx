'use client'

import { mockVideos } from '@/lib/data'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Eye, Clock, User, Calendar, Play } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function VideoPage() {
  const params = useParams()
  const video = mockVideos.find((v) => v.id === params.id)

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
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/50 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all text-purple-700 hover:text-purple-800 font-semibold"
        >
          <ArrowLeft className="h-5 w-5" />
          返回首页
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/90 to-blue-900/90 shadow-2xl border border-white/10">
              <div className="aspect-video relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="mb-4">
                      <Play className="h-16 w-16 mx-auto mb-4 text-white/80" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">视频播放器</h3>
                    <p className="text-white/70">这里是视频播放区域</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-8 rounded-3xl bg-white/90 backdrop-blur-sm p-8 shadow-xl border border-white/50">
              <h1 className="mb-6 text-4xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                {video.title}
              </h1>

              <p className="mb-8 text-lg text-gray-700 leading-relaxed">{video.description}</p>

              {/* Stats */}
              <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100">
                  <Eye className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-purple-700">{video.views}</div>
                  <div className="text-sm text-gray-600">次观看</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100">
                  <Heart className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-blue-700">{video.likes}</div>
                  <div className="text-sm text-gray-600">次点赞</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-teal-50 border border-cyan-100">
                  <Clock className="h-8 w-8 mx-auto mb-2 text-cyan-600" />
                  <div className="text-2xl font-bold text-cyan-700">{video.duration}</div>
                  <div className="text-sm text-gray-600">时长</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-teal-600" />
                  <div className="text-2xl font-bold text-teal-700">{video.uploadedAt}</div>
                  <div className="text-sm text-gray-600">发布日期</div>
                </div>
              </div>

              {/* Performer Info */}
              <div className="flex items-center gap-6 rounded-2xl bg-gradient-to-r from-purple-50/80 to-blue-50/80 p-6 border border-purple-100/50">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-2xl font-bold shadow-lg">
                  {video.performer[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <User className="h-5 w-5 text-purple-600" />
                    <span className="text-xl font-semibold text-gray-900">
                      {video.performer}
                    </span>
                  </div>
                  <div className="text-lg text-gray-600">
                    🎵 演奏乐器: {video.instrument}
                  </div>
                </div>
                <button className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 text-white font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  关注
                </button>
              </div>

              {/* Actions */}
              <div className="mt-8 flex gap-4">
                <button className="flex-1 flex items-center justify-center gap-3 rounded-2xl border-2 border-purple-200 bg-white px-6 py-4 text-purple-700 font-semibold hover:bg-purple-50 hover:border-purple-300 hover:-translate-y-0.5 transition-all">
                  <Heart className="h-6 w-6" />
                  <span>点赞</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-3 rounded-2xl border-2 border-blue-200 bg-white px-6 py-4 text-blue-700 font-semibold hover:bg-blue-50 hover:border-blue-300 hover:-translate-y-0.5 transition-all">
                  <Share2 className="h-6 w-6" />
                  <span>分享</span>
                </button>
              </div>

              {/* Tags */}
              <div className="mt-8 flex flex-wrap gap-3">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-2 text-sm font-medium text-purple-700 border border-purple-200/50"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="rounded-3xl bg-white/90 backdrop-blur-sm p-6 shadow-xl border border-white/50">
              <h3 className="mb-6 text-2xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                相关推荐
              </h3>
              <div className="space-y-4">
                {mockVideos
                  .filter((v) => v.id !== video.id)
                  .slice(0, 3)
                  .map((relatedVideo) => (
                    <Link
                      key={relatedVideo.id}
                      href={`/video/${relatedVideo.id}`}
                      className="flex gap-4 rounded-2xl p-4 transition-all hover:bg-gradient-to-r from-purple-50/50 to-blue-50/50 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-purple-100/50"
                    >
                      <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-xl">
                        <Image
                          src={relatedVideo.thumbnail}
                          alt={relatedVideo.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 transition-opacity hover:opacity-100">
                          <Play className="absolute inset-0 m-auto h-8 w-8 text-white" />
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="line-clamp-2 text-lg font-semibold text-gray-900 mb-1">
                          {relatedVideo.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {relatedVideo.performer}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{relatedVideo.views} 次观看</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="rounded-3xl bg-gradient-to-br from-purple-600/90 to-blue-600/90 p-6 text-white shadow-xl border border-white/20">
              <h3 className="mb-3 text-xl font-semibold">
                想要分享你的音乐吗？
              </h3>
              <p className="mb-4 text-blue-100 leading-relaxed">
                加入我们的社区，让更多人欣赏你的音乐才华，用音乐传递快乐与温暖。
              </p>
              <Link
                href="/upload"
                className="block w-full rounded-2xl bg-white/20 backdrop-blur-sm px-6 py-3 text-center font-semibold text-white border border-white/30 hover:bg-white/30 hover:shadow-lg hover:-translate-y-0.5 transition-all"
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
