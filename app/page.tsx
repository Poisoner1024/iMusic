'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { VideoCard } from '@/components/VideoCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { mockVideos, categories } from '@/lib/data'
import { Sparkles, Heart, Users, Play } from 'lucide-react'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredVideos =
    selectedCategory === 'all'
      ? mockVideos
      : mockVideos.filter((video) => video.category === selectedCategory)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-20 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto relative px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold md:text-6xl">
            让每个家庭享受音乐的美好
          </h1>
          <p className="mb-8 text-xl text-primary-100">
            分享家庭音乐演奏视频，传递音乐的美好
          </p>
          <div className="mx-auto flex max-w-4xl justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Play className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{mockVideos.length}</div>
                <div className="text-sm text-primary-100">视频</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">1,234</div>
                <div className="text-sm text-primary-100">演奏者</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">
                  {mockVideos.reduce((sum, v) => sum + v.likes, 0)}
                </div>
                <div className="text-sm text-primary-100">点赞</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            <Sparkles className="inline h-6 w-6" /> 分类浏览
          </h2>
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Video Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            精选视频 ({filteredVideos.length})
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="py-20 text-center">
            <div className="mb-4 text-6xl">🎵</div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              暂无视频
            </h3>
            <p className="text-gray-600">
              该分类下还没有视频，快来发布第一个吧！
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">© 2024 iMusic. 让每个家庭享受音乐的美好</p>
          <p className="text-sm">
            用爱传递音乐，用心分享美好
          </p>
        </div>
      </footer>
    </div>
  )
}
