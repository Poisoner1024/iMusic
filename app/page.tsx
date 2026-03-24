'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { VideoCard } from '@/components/VideoCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { mockVideos, getCategories } from '@/lib/data'
import { galleryImages } from '@/lib/galleryData'
import { getVideos } from '@/lib/videoStore'
import { 
  Sparkles, Heart, Users, Play, ArrowRight, Music, 
  Globe, BookOpen, Users2, Calendar, MapPin, Star,
  Quote, ChevronRight, Camera
} from 'lucide-react'
import { Video } from '@/types'

// 影响领域数据 - Playing For Change 风格标签云
const impactAreas = [
  { id: 'family', name: '家庭音乐', icon: '👨‍👩‍👧‍👦', color: 'from-rose-500 to-pink-600' },
  { id: 'education', name: '公益教育', icon: '🎓', color: 'from-blue-500 to-cyan-600' },
  { id: 'community', name: '社区活动', icon: '🏘️', color: 'from-green-500 to-emerald-600' },
  { id: 'performance', name: '舞台演出', icon: '🎭', color: 'from-purple-500 to-violet-600' },
  { id: 'charity', name: '公益路演', icon: '❤️', color: 'from-orange-500 to-amber-600' },
  { id: 'heritage', name: '文化传承', icon: '📜', color: 'from-indigo-500 to-blue-600' },
  { id: 'youth', name: '青少年培养', icon: '🌱', color: 'from-teal-500 to-cyan-600' },
  { id: 'inclusion', name: '多元融合', icon: '🤝', color: 'from-fuchsia-500 to-pink-600' },
]

// 会员感言数据
const testimonials = [
  {
    id: 1,
    quote: "音乐让我的生活变得丰富多彩，在IM社团我找到了志同道合的朋友，一起享受音乐的美好。",
    name: "王小雅",
    role: "会员 001号",
    age: "12岁",
    instrument: "大提琴"
  },
  {
    id: 2,
    quote: "带孩子参加家庭乐团活动是我们每周最期待的事情，音乐让我们全家更亲密。",
    name: "张女士",
    role: "会员家长",
    age: "",
    instrument: "家庭合唱"
  },
  {
    id: 3,
    quote: "言传不如身教，身教不如境教。在这里，孩子们不仅学会了乐器，更懂得了什么是坚持和热爱。",
    name: "李老师",
    role: "公益教师",
    age: "",
    instrument: "吉他"
  }
]

// 统计数据
const stats = [
  { value: '100+', label: '会员家庭', icon: Users, color: 'text-rose-500' },
  { value: '16', label: '活动剪影', icon: Camera, color: 'text-blue-500' },
  { value: '6', label: '乐器类型', icon: Music, color: 'text-green-500' },
  { value: '∞', label: '快乐传递', icon: Heart, color: 'text-purple-500' },
]

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [videos, setVideos] = useState<Video[]>(mockVideos)
  const [categories, setCategories] = useState(getCategories(mockVideos))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadedVideos = getVideos()
    setVideos(loadedVideos)
    setCategories(getCategories(loadedVideos))
    setLoading(false)
  }, [])

  useEffect(() => {
    const handleStorageChange = () => {
      const loadedVideos = getVideos()
      setVideos(loadedVideos)
      setCategories(getCategories(loadedVideos))
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const filteredVideos = selectedCategory === 'all'
    ? videos
    : videos.filter((video) => video.category === selectedCategory)

  // 获取最新的4张活动照片
  const featuredImages = galleryImages.slice(0, 4)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section - Playing For Change 风格 */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* 背景图片轮播效果 */}
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/page2_img4.jpeg"
            alt="IM公益声传社团"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
        </div>

        {/* Hero 内容 */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          {/* 副标题 */}
          <p className="mb-6 text-lg md:text-xl font-medium tracking-widest text-white/80 uppercase">
            MUSIC the heartbeat of family happiness
          </p>
          
          {/* 主标题 */}
          <h1 className="mb-8 text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
            <span className="block mb-2">让每个家庭</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300">
              享受音乐的美好
            </span>
          </h1>
          
          {/* 理念标语 */}
          <p className="mb-10 text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
            言传不如身教，身教不如境教
            <span className="block mt-2 text-lg text-white/70">— 向前一步，让音乐传递爱与快乐</span>
          </p>

          {/* CTA 按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-full transition-all transform hover:scale-105"
            >
              <Play className="h-5 w-5" />
              探索我们的故事
            </Link>
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-semibold rounded-full transition-all border border-white/30"
            >
              <Music className="h-5 w-5" />
              分享你的音乐
            </Link>
          </div>

          {/* 统计数据 - 大数字展示 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { value: videos.length, label: '音乐视频', suffix: '' },
              { value: new Set(videos.map(v => v.performer)).size, label: '会员', suffix: '+' },
              { value: videos.reduce((sum, v) => sum + v.likes, 0), label: '爱心', suffix: '' },
              { value: 16, label: '活动剪影', suffix: '' },
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-white mb-1">
                  {stat.value}{stat.suffix}
                </div>
                <div className="text-sm text-white/70 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </section>

      {/* 影响领域 - Playing For Change 风格标签云 */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-rose-600 font-semibold tracking-wider uppercase mb-3">AREAS OF IMPACT</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              我们的影响领域
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              感受音乐带来的改变，了解我们在各个领域的努力与成果
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 max-w-5xl mx-auto">
            {impactAreas.map((area) => (
              <div
                key={area.id}
                className={`group px-6 py-4 rounded-2xl bg-gradient-to-r ${area.color} text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 cursor-pointer`}
              >
                <span className="text-2xl mr-2">{area.icon}</span>
                <span className="font-semibold">{area.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 使命宣言区块 */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-rose-400 font-semibold tracking-wider uppercase mb-4">Our Mission</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                把音乐快乐<br />带给每个家庭
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                IM 公益声传社团致力于为每一个热爱音乐的家庭提供学习和交流的平台。
                我们相信，音乐不仅能够陶冶情操，更能增进家庭成员之间的情感连接，
                让每个家庭都能在音乐的陪伴下共同成长。
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-rose-400">2024</div>
                  <div className="text-gray-400 text-sm">成立年份</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-rose-400">100+</div>
                  <div className="text-gray-400 text-sm">会员家庭</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-rose-400">∞</div>
                  <div className="text-gray-400 text-sm">美好传递</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/gallery/page9_img2.jpeg"
                      alt="音乐表演"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/gallery/page7_img7.jpeg"
                      alt="吉他练习"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/gallery/page8_img5.jpeg"
                      alt="户外活动"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="relative h-48 rounded-2xl overflow-hidden">
                    <Image
                      src="/images/gallery/page9_img3.jpeg"
                      alt="儿童合奏"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 会员感言 - Testimonials */}
      <section className="py-20 bg-gradient-to-br from-rose-50 via-white to-purple-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-rose-600 font-semibold tracking-wider uppercase mb-3">Testimonials</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              他们的心声
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
              >
                <Quote className="absolute top-6 right-6 h-10 w-10 text-rose-200" />
                <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="border-t pt-4">
                  <div className="font-bold text-gray-900">{testimonial.name}</div>
                  <div className="text-rose-600 text-sm">{testimonial.role}</div>
                  {testimonial.age && (
                    <div className="text-gray-500 text-sm">{testimonial.age} · {testimonial.instrument}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 活动剪影 - Stories from the Ground */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
            <div>
              <p className="text-rose-600 font-semibold tracking-wider uppercase mb-3">Stories from the Ground</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                活动剪影
              </h2>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-rose-600 font-semibold hover:text-rose-700 transition-colors mt-4 md:mt-0"
            >
              查看全部照片
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredImages.map((image, idx) => (
              <Link
                key={image.id}
                href="/gallery"
                className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-white font-bold text-lg">{image.title}</h3>
                  <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 核心活动 - Program Cards */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <p className="text-rose-600 font-semibold tracking-wider uppercase mb-3">Our Programs</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              核心活动
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              多元化的音乐活动，让每一个家庭都能找到属于自己的音乐之路
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: '吉他公益课',
                subtitle: 'GUITAR FOR ALL',
                description: '核心：公益 NO PROFIT，建设公益师资资源。为每一个热爱音乐的孩子提供免费学习机会。',
                highlight: '免费音乐教育 · 专业师资团队',
                image: '/images/gallery/page7_img7.jpeg',
                color: 'from-amber-500 to-orange-600'
              },
              {
                title: '家庭乐团',
                subtitle: 'FAMILY ORCHESTRA',
                description: '多元化多样化的家庭乐团 & 音乐会，让音乐成为家庭情感的纽带。',
                highlight: '亲子合奏 · 定期音乐会 · 跨越国界',
                image: '/images/gallery/page11_img2.jpeg',
                color: 'from-rose-500 to-pink-600'
              },
              {
                title: '公益路演',
                subtitle: 'CHARITY PERFORMANCE',
                description: '社会公益音乐活动，用音乐温暖每一个角落，传递爱的力量。',
                highlight: '福利机构送温暖 · 社区活动支持',
                image: '/images/gallery/page8_img5.jpeg',
                color: 'from-purple-500 to-violet-600'
              }
            ].map((program, idx) => (
              <div key={idx} className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={program.image}
                    alt={program.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${program.color} opacity-60`} />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="text-xs font-semibold tracking-wider opacity-80">{program.subtitle}</p>
                    <h3 className="text-2xl font-bold">{program.title}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4 leading-relaxed">{program.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {program.highlight.split(' · ').map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <button className="text-rose-600 font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                    了解更多 <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 视频板块 */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <p className="text-rose-600 font-semibold tracking-wider uppercase mb-3">Music Videos</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                精选视频
              </h2>
            </div>
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelect={setSelectedCategory}
            />
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-rose-600 border-t-transparent" />
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
              <h3 className="mb-2 text-xl font-semibold text-gray-900">暂无视频</h3>
              <p className="text-gray-600">该分类下还没有视频，快来发布第一个吧！</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA 区块 */}
      <section className="py-20 bg-gradient-to-r from-rose-600 to-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            准备好开始你的音乐之旅了吗？
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            加入我们，和100+个家庭一起，用音乐创造美好回忆
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/upload"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-rose-600 font-semibold rounded-full hover:bg-gray-100 transition-colors"
            >
              <Play className="h-5 w-5" />
              分享你的音乐
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-colors border border-white/30"
            >
              了解更多
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-2xl font-bold mb-4">IM 公益声传</h3>
              <p className="text-gray-400 mb-4">
                让每个家庭享受音乐的美好
              </p>
              <p className="text-gray-500 text-sm">
                MUSIC HAPPY TO LIFE HAPPINESS
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition-colors">首页</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">活动剪影</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">关于社团</Link></li>
                <li><Link href="/upload" className="hover:text-white transition-colors">发布视频</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">核心活动</h4>
              <ul className="space-y-2 text-gray-400">
                <li>吉他公益课</li>
                <li>家庭乐团</li>
                <li>公益路演</li>
                <li>会员分享</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">联系我们</h4>
              <p className="text-gray-400 text-sm">
                让音乐成为连接每个家庭的桥梁
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-gray-500">
            <p>© 2024 IM 公益声传社团. 让每个家庭享受音乐的美好</p>
          </div>
        </div>
      </footer>
    </div>
  )
}


