'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { VideoCard } from '@/components/VideoCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { mockVideos, getCategories } from '@/lib/data'
import { getVideos } from '@/lib/videoStore'
import { Sparkles, Heart, Users, Play, Target, Trophy, ArrowRight } from 'lucide-react'
import { Video } from '@/types'

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [categories, setCategories] = useState(getCategories(mockVideos))
  const [loading, setLoading] = useState(true)

  // 加载视频数据
  useEffect(() => {
    const loadedVideos = getVideos()
    setVideos(loadedVideos)
    setCategories(getCategories(loadedVideos))
    setLoading(false)
  }, [])

  // 监听存储变化，支持多标签页同步
  useEffect(() => {
    const handleStorageChange = () => {
      const loadedVideos = getVideos()
      setVideos(loadedVideos)
      setCategories(getCategories(loadedVideos))
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const filteredVideos =
    selectedCategory === 'all'
      ? videos
      : videos.filter((video) => video.category === selectedCategory)

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
          <p className="mb-4 text-2xl font-semibold text-primary-100">
            MUSIC HAPPY TO LIFE HAPPINESS
          </p>
          <p className="mb-8 text-xl text-primary-100">
            言传不如身教，身教不如境教 - 向前一步
          </p>
          <div className="mx-auto flex max-w-4xl justify-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <Play className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">{videos.length}</div>
                <div className="text-sm text-primary-100">视频</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">
                  {new Set(videos.map(v => v.performer)).size}
                </div>
                <div className="text-sm text-primary-100">会员</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6" />
              <div>
                <div className="text-2xl font-bold">
                  {videos.reduce((sum, v) => sum + v.likes, 0)}
                </div>
                <div className="text-sm text-primary-100">爱心</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* 社团理念 Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            我们的理念
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">使命</h3>
              <p className="text-gray-600">
                把音乐快乐带给每个家庭
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Trophy className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">愿景</h3>
              <p className="text-gray-600">
                MUSIC HAPPY TO LIFE HAPPINESS
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">理念</h3>
              <p className="text-gray-600">
                言传不如身教，身教不如境教
              </p>
            </div>
            <div className="rounded-xl bg-white p-6 text-center shadow-lg">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-100">
                <Sparkles className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">价值观</h3>
              <p className="text-gray-600">
                向前一步
              </p>
            </div>
          </div>
        </section>

        {/* 活动剪影预览 Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-center text-3xl font-bold text-gray-900 flex-1">
              📸 活动剪影
            </h2>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              查看更多
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { src: '/images/gallery/page2_img4.jpeg', title: '社团大合影', desc: 'IM大家庭的温馨时刻' },
              { src: '/images/gallery/page9_img2.jpeg', title: '音乐表演', desc: '小女孩与老师的温馨演出' },
              { src: '/images/gallery/page8_img5.jpeg', title: '户外音乐活动', desc: '蓝天白云下的音乐时光' },
              { src: '/images/gallery/page10_img4.jpeg', title: '生日音乐派对', desc: '用音乐传递祝福' },
            ].map((img, idx) => (
              <Link 
                key={idx} 
                href="/gallery"
                className="group relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg"
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${img.src})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                  <h3 className="font-bold text-lg">{img.title}</h3>
                  <p className="text-sm text-white/80">{img.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* 核心活动 Section */}
        <section className="mb-16">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
            核心活动
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">🎵 吉他公益课</h3>
              <p className="mb-4 text-gray-600">
                核心：公益 NO PROFIT，建设公益师资资源
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 免费音乐教育</li>
                <li>• 专业师资团队</li>
                <li>• 美好的愿景</li>
              </ul>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">👨‍👩‍👧‍👦 家庭乐团</h3>
              <p className="mb-4 text-gray-600">
                多元化多样化的家庭乐团 & 音乐会
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 亲子合奏</li>
                <li>• 定期音乐会</li>
                <li>• 跨越国界</li>
              </ul>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary-50 to-primary-100 p-6 shadow-lg">
              <h3 className="mb-3 text-xl font-bold text-gray-900">🌍 公益路演</h3>
              <p className="mb-4 text-gray-600">
                社会公益音乐活动
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• 福利机构送温暖</li>
                <li>• 音乐慰问演出</li>
                <li>• 社区活动支持</li>
                <li>• 偏远贫困区走访</li>
              </ul>
            </div>
          </div>
        </section>

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
          <Link
            href="/upload"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Play className="h-4 w-4" />
            发布视频
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-600 border-t-transparent" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        )}

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
