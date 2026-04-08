import { Video } from '@/types'
import { Play, Eye, Heart, Users, Globe, Music } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  const [imgError, setImgError] = useState(false)
  
  // 检查缩略图是否存在
  const hasValidThumbnail = video.thumbnail && video.thumbnail !== '' && video.thumbnail !== null

  return (
    <Link href={`/video/${video.id}`}>
      <div className="group relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/50 shadow-lg md:shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 md:hover:-translate-y-2 md:hover:scale-105">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          {hasValidThumbnail && !imgError ? (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-purple-200 to-blue-200 flex items-center justify-center">
              <Music className="h-12 w-12 md:h-16 md:w-16 text-purple-600 opacity-50" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
            <div className="rounded-full bg-gradient-to-r from-purple-600/90 to-blue-600/90 p-4 md:p-5 shadow-2xl border border-white/20">
              <Play className="h-8 w-8 md:h-10 md:w-10 fill-white text-white" />
            </div>
          </div>
          <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 rounded-xl md:rounded-2xl bg-black/80 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-white border border-white/20">
            {video.duration}
          </div>
          <div className="absolute top-2 md:top-4 left-2 md:left-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm px-2 md:px-3 py-1 md:py-2 text-xs md:text-sm text-white border border-white/20">
            {video.instrument}
          </div>
        </div>

        {/* Content - 移动端减小内边距 */}
        <div className="p-4 md:p-6">
          <h3 className="mb-2 md:mb-3 line-clamp-2 text-base md:text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {video.title}
          </h3>
          <p className="mb-3 md:mb-4 line-clamp-2 text-sm md:text-base text-gray-600 leading-relaxed">
            {video.description}
          </p>

          {/* Metadata - 移动端简化为单列 */}
          <div className="mb-3 md:mb-4">
            <div className="flex flex-wrap gap-2 md:gap-3">
              <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-xl md:rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50">
                <Users className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
                <span className="text-xs md:font-semibold text-purple-700">{video.performer}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/50">
                <Globe className="h-3 w-3 md:h-4 md:w-4 text-blue-600" />
                <span className="text-xs md:font-medium text-blue-700">{video.instrument}</span>
              </div>
            </div>
          </div>

          {/* Stats - 移动端调整间距 */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-3 md:gap-6">
              <div className="flex items-center gap-1 md:gap-2 text-gray-600">
                <Eye className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                <span className="text-xs md:font-semibold">{video.views}</span>
              </div>
              <div className="flex items-center gap-1 md:gap-2 text-gray-600">
                <Heart className="h-4 w-4 md:h-5 md:w-5 text-red-500" />
                <span className="text-xs md:font-semibold">{video.likes}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-1 md:gap-2">
              {video.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-2 md:px-3 py-0.5 md:py-1 text-xs font-medium text-purple-700 border border-purple-200/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Effect Border - 移动端去除 */}
        <div className="hidden md:block absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-300/50 transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  )
}
