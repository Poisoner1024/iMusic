import { Video } from '@/types'
import { Play, Eye, Heart, Users, Globe } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface VideoCardProps {
  video: Video
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <Link href={`/video/${video.id}`}>
      <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-sm border border-white/50 shadow-xl transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 hover:scale-105">
        {/* Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110">
            <div className="rounded-full bg-gradient-to-r from-purple-600/90 to-blue-600/90 p-5 shadow-2xl border border-white/20">
              <Play className="h-10 w-10 fill-white text-white" />
            </div>
          </div>
          <div className="absolute bottom-4 right-4 rounded-2xl bg-black/80 backdrop-blur-sm px-3 py-2 text-sm text-white border border-white/20">
            {video.duration}
          </div>
          <div className="absolute top-4 left-4 rounded-2xl bg-gradient-to-r from-purple-600/90 to-blue-600/90 backdrop-blur-sm px-3 py-2 text-sm text-white border border-white/20">
            {video.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="mb-3 line-clamp-2 text-xl font-bold text-gray-900 group-hover:bg-gradient-to-r group-hover:from-purple-700 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
            {video.title}
          </h3>
          <p className="mb-4 line-clamp-2 text-gray-600 leading-relaxed">
            {video.description}
          </p>

          {/* Metadata */}
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-200/50">
                <Users className="h-4 w-4 text-purple-600" />
                <span className="font-semibold text-purple-700">{video.performer}</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 rounded-2xl bg-gradient-to-r from-blue-100 to-cyan-100 border border-blue-200/50">
                <Globe className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-700">{video.instrument}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-gray-600">
                <Eye className="h-5 w-5 text-purple-600" />
                <span className="font-semibold">{video.views}</span>
                <span className="text-sm">观看</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="h-5 w-5 text-red-500" />
                <span className="font-semibold">{video.likes}</span>
                <span className="text-sm">点赞</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {video.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-gradient-to-r from-purple-100 to-blue-100 px-3 py-1 text-xs font-medium text-purple-700 border border-purple-200/50"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Hover Effect Border */}
        <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-purple-300/50 transition-all duration-300 pointer-events-none" />
      </div>
    </Link>
  )
}
