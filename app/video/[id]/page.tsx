'use client'

import { mockVideos } from '@/lib/data'
import { useParams } from 'next/navigation'
import { ArrowLeft, Heart, Share2, Eye, Clock, User, Calendar } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function VideoPage() {
  const params = useParams()
  const video = mockVideos.find((v) => v.id === params.id)

  if (!video) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">视频不存在</h1>
          <Link href="/" className="text-primary-600 hover:underline">
            返回首页
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          返回首页
        </Link>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl bg-black shadow-2xl">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={video.videoUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Video Info */}
            <div className="mt-6 rounded-xl bg-white p-6 shadow-lg">
              <h1 className="mb-4 text-3xl font-bold text-gray-900">
                {video.title}
              </h1>

              <p className="mb-6 text-gray-600">{video.description}</p>

              {/* Stats */}
              <div className="mb-6 flex flex-wrap gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{video.views} 次观看</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span>{video.likes} 次点赞</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>时长 {video.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{video.uploadedAt}</span>
                </div>
              </div>

              {/* Performer Info */}
              <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white text-xl font-bold">
                  {video.performer[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="font-semibold text-gray-900">
                      {video.performer}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    演奏乐器: {video.instrument}
                  </div>
                </div>
                <button className="rounded-full bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                  关注
                </button>
              </div>

              {/* Actions */}
              <div className="mt-6 flex gap-3">
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                  <Heart className="h-5 w-5" />
                  <span>点赞</span>
                </button>
                <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 text-gray-700 transition-colors hover:bg-gray-50">
                  <Share2 className="h-5 w-5" />
                  <span>分享</span>
                </button>
              </div>

              {/* Tags */}
              <div className="mt-6 flex flex-wrap gap-2">
                {video.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary-50 px-3 py-1 text-sm text-primary-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h3 className="mb-4 text-lg font-semibold text-gray-900">
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
                      className="flex gap-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                    >
                      <div className="relative aspect-video w-40 flex-shrink-0 overflow-hidden rounded-lg">
                        <Image
                          src={relatedVideo.thumbnail}
                          alt={relatedVideo.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-center">
                        <h4 className="line-clamp-2 text-sm font-medium text-gray-900">
                          {relatedVideo.title}
                        </h4>
                        <p className="mt-1 text-xs text-gray-600">
                          {relatedVideo.performer}
                        </p>
                        <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                          <Eye className="h-3 w-3" />
                          <span>{relatedVideo.views}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 p-6 text-white shadow-lg">
              <h3 className="mb-2 text-lg font-semibold">
                想要分享你的音乐吗？
              </h3>
              <p className="mb-4 text-sm text-primary-100">
                加入我们的社区，让更多人欣赏你的音乐才华
              </p>
              <Link
                href="/upload"
                className="block rounded-lg bg-white px-4 py-2 text-center text-sm font-medium text-primary-600 transition-colors hover:bg-primary-50"
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
