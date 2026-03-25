'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { VideoCard } from '@/components/VideoCard'
import { CategoryFilter } from '@/components/CategoryFilter'
import { 
  Container, Section, HeroSection, Heading1, Heading2, Heading3, BodyText, Caption,
  StatNumber, TagCloud, QuoteCard, ProgramCard, GridLayout, HeroGrid
} from '@/components/DesignSystem'
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
  '家庭音乐', '公益教育', '社区活动', '舞台演出', 
  '公益路演', '文化传承', '青少年培养', '多元融合'
]

// 会员感言数据
const testimonials = [
  {
    quote: "音乐让我的生活变得丰富多彩，在IM社团我找到了志同道合的朋友，一起享受音乐的美好。",
    author: "王小雅",
    role: "会员 001号",
    location: "12岁"
  },
  {
    quote: "带孩子参加家庭乐团活动是我们每周最期待的事情，音乐让我们全家更亲密。",
    author: "张女士",
    role: "会员家长",
    location: "家庭合唱"
  },
  {
    quote: "言传不如身教，身教不如境教。在这里，孩子们不仅学会了乐器，更懂得了什么是坚持和热爱。",
    author: "李老师",
    role: "公益教师",
    location: "吉他教学"
  }
]

// 核心活动数据
const programs = [
  {
    title: '吉他公益课',
    description: '核心：公益 NO PROFIT，建设公益师资资源。为每一个热爱音乐的孩子提供免费学习机会。',
    highlight: '免费音乐教育 · 专业师资团队',
    image: '/images/gallery/page7_img7.jpeg',
    location: '北京',
    participants: '每周 50+ 学员'
  },
  {
    title: '家庭乐团',
    description: '多元化多样化的家庭乐团 & 音乐会，让音乐成为家庭情感的纽带。',
    highlight: '亲子合奏 · 定期音乐会 · 跨越国界',
    image: '/images/gallery/page11_img2.jpeg',
    location: '全国',
    participants: '100+ 家庭参与'
  },
  {
    title: '公益路演',
    description: '社会公益音乐活动，用音乐温暖每一个角落，传递爱的力量。',
    highlight: '福利机构送温暖 · 社区活动支持',
    image: '/images/gallery/page8_img5.jpeg',
    location: '各地社区',
    participants: '16 场活动'
  }
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
      <HeroSection className="relative overflow-hidden">
        {/* 背景图片 */}
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/page2_img4.jpeg"
            alt="IM公益声传社团"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          
          {/* 主题文字叠加在图片上 */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight mb-4">
                <span className="block text-white/90 mb-2">让每个家庭</span>
                <span className="gradient-text bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
                  享受音乐的美好
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 mx-auto mb-6 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Hero 内容 */}
        <Container>
          <div className="text-center text-white pt-32">
            {/* 副标题 */}
            <Caption className="mb-6 text-lg md:text-xl tracking-widest uppercase text-white/80">
              MUSIC the heartbeat of family happiness
            </Caption>
            
            {/* 理念标语 */}
            <BodyText className="mb-10 max-w-3xl mx-auto text-white/90">
              言传不如身教，身教不如境教
              <span className="block mt-2 text-lg text-white/70">— 向前一步，让音乐传递爱与快乐</span>
            </BodyText>

            {/* CTA 按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/gallery" className="btn-primary">
                <Play className="h-5 w-5" />
                探索我们的故事
              </Link>
              <Link href="/upload" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                <Music className="h-5 w-5" />
                分享你的音乐
              </Link>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { number: videos.length.toString(), label: '音乐视频' },
                { number: `${new Set(videos.map(v => v.performer)).size}+`, label: '会员' },
                { number: videos.reduce((sum, v) => sum + v.likes, 0).toString(), label: '爱心' },
                { number: '16', label: '活动剪影' },
              ].map((stat, idx) => (
                <StatNumber key={idx} number={stat.number} label={stat.label} />
              ))}
            </div>
          </div>
        </Container>

        {/* 滚动提示 */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-white/70 rounded-full" />
          </div>
        </div>
      </HeroSection>

      {/* 影响领域 - Playing For Change 风格标签云 */}
      <Section className="gradient-bg">
        <Container>
          <div className="text-center mb-12">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              AREAS OF IMPACT
            </Caption>
            <Heading2 className="mb-4">
              我们的影响领域
            </Heading2>
            <BodyText className="max-w-2xl mx-auto">
              感受音乐带来的改变，了解我们在各个领域的努力与成果
            </BodyText>
          </div>

          <TagCloud tags={impactAreas} />
        </Container>
      </Section>

      {/* 使命宣言区块 */}
      <Section className="bg-secondary-900 text-white">
        <Container>
          <HeroGrid>
            <div>
              <Caption className="text-primary-400 font-semibold tracking-wider uppercase mb-4">
                Our Mission
              </Caption>
              <Heading2 className="mb-6 text-white leading-tight">
                把音乐快乐<br />带给每个家庭
              </Heading2>
              <BodyText className="text-secondary-300 leading-relaxed mb-8">
                IM 公益声传社团致力于为每一个热爱音乐的家庭提供学习和交流的平台。
                我们相信，音乐不仅能够陶冶情操，更能增进家庭成员之间的情感连接，
                让每个家庭都能在音乐的陪伴下共同成长。
              </BodyText>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-bold text-primary-400">2024</div>
                  <Caption>成立年份</Caption>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-400">100+</div>
                  <Caption>会员家庭</Caption>
                </div>
                <div>
                  <div className="text-3xl font-bold text-primary-400">∞</div>
                  <Caption>美好传递</Caption>
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
          </HeroGrid>
        </Container>
      </Section>

      {/* 会员感言 - Testimonials */}
      <Section className="gradient-bg">
        <Container>
          <div className="text-center mb-16">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              Testimonials
            </Caption>
            <Heading2>
              他们的心声
            </Heading2>
          </div>

          <GridLayout>
            {testimonials.map((testimonial, idx) => (
              <QuoteCard
                key={idx}
                quote={testimonial.quote}
                author={testimonial.author}
                role={testimonial.role}
                location={testimonial.location}
              />
            ))}
          </GridLayout>
        </Container>
      </Section>

      {/* 核心活动 - Program Cards */}
      <Section className="bg-secondary-50">
        <Container>
          <div className="text-center mb-16">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              Our Programs
            </Caption>
            <Heading2 className="mb-4">
              核心活动
            </Heading2>
            <BodyText className="max-w-2xl mx-auto">
              多元化的音乐活动，让每一个家庭都能找到属于自己的音乐之路
            </BodyText>
          </div>

          <GridLayout>
            {programs.map((program, idx) => (
              <ProgramCard
                key={idx}
                title={program.title}
                description={program.description}
                highlight={program.highlight}
                image={program.image}
                location={program.location}
                participants={program.participants}
              />
            ))}
          </GridLayout>
        </Container>
      </Section>

      {/* 视频板块 */}
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
                Music Videos
              </Caption>
              <Heading2>
                精选视频
              </Heading2>
            </div>
            <CategoryFilter
              videos={videos}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
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
              <Heading3 className="mb-2">暂无视频</Heading3>
              <BodyText>该分类下还没有视频，快来发布第一个吧！</BodyText>
            </div>
          )}
        </Container>
      </Section>

      {/* CTA 区块 */}
      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6 text-white">
              准备好开始你的音乐之旅了吗？
            </Heading2>
            <BodyText className="text-white/90 mb-10 max-w-2xl mx-auto">
              加入我们，和100+个家庭一起，用音乐创造美好回忆
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                <Play className="h-5 w-5" />
                分享你的音乐
              </Link>
              <Link href="/about" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                了解更多
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      {/* Footer */}
      <footer className="bg-secondary-900 text-white py-16">
        <Container>
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <Heading3 className="mb-4 text-white">IM 公益声传</Heading3>
              <BodyText className="text-secondary-400 mb-4">
                让每个家庭享受音乐的美好
              </BodyText>
              <Caption>
                MUSIC HAPPY TO LIFE HAPPINESS
              </Caption>
            </div>
            <div>
              <h4 className="font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/" className="hover:text-white transition-colors">首页</Link></li>
                <li><Link href="/gallery" className="hover:text-white transition-colors">活动剪影</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">关于社团</Link></li>
                <li><Link href="/upload" className="hover:text-white transition-colors">发布视频</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">核心活动</h4>
              <ul className="space-y-2 text-secondary-400">
                <li>吉他公益课</li>
                <li>家庭乐团</li>
                <li>公益路演</li>
                <li>会员分享</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">联系我们</h4>
              <BodyText className="text-secondary-400">
                让音乐成为连接每个家庭的桥梁
              </BodyText>
            </div>
          </div>
          <div className="border-t border-secondary-800 pt-8 text-center text-secondary-500">
            <Caption>© 2024 IM 公益声传社团. 让每个家庭享受音乐的美好</Caption>
          </div>
        </Container>
      </footer>
    </div>
  )
}