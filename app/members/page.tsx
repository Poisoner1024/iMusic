'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Container, Section, Heading1, Heading2, Heading3, BodyText, Caption,
  GridLayout, HeroSection
} from '@/components/DesignSystem'
import { Header } from '@/components/Header'
import { 
  Play, Music, Users, Heart, MessageCircle, 
  Calendar, Video, Star, Quote, ArrowRight
} from 'lucide-react'

// 会员故事数据
const memberStories = [
  {
    id: '1',
    title: '音乐让我们的生活更美好',
    author: '张家庭',
    memberNumber: '025',
    instruments: '吉他、钢琴',
    content: '加入IM公益声传社团已经半年了，这半年里我们全家都沉浸在音乐的快乐中。孩子从对音乐一无所知，到现在能够弹奏简单的曲子，这种成长让我们感到无比欣慰...',
    image: '/images/gallery/page11_img2.jpeg',
    likes: 128,
    date: '2024-03-15'
  },
  {
    id: '2',
    title: '和孩子一起成长的音乐之路',
    author: '李家庭',
    memberNumber: '032',
    instruments: '小提琴、大提琴',
    content: '作为一位母亲，我深知陪伴的重要性。在IM社团，我们不仅学会了演奏乐器，更重要的是学会了如何用音乐来表达爱。每个周末的家庭乐团活动，都是我们全家最期待的时刻...',
    image: '/images/gallery/page9_img2.jpeg',
    likes: 95,
    date: '2024-03-10'
  },
  {
    id: '3',
    title: '从音乐爱好者到公益教师',
    author: '王老师',
    memberNumber: '018',
    instruments: '吉他、声乐',
    content: '作为一名专业音乐教师，我一直在寻找能够回馈社会的方式。加入IM公益声传社团后，我发现这里正是我想要的平台。看着孩子们从不会拿吉他到能够自信地演奏...',
    image: '/images/gallery/page7_img7.jpeg',
    likes: 156,
    date: '2024-03-05'
  }
]

// 演出视频数据
const performanceVideos = [
  {
    id: '1',
    title: '家庭合奏《小星星变奏曲》',
    performer: '张家庭',
    instruments: '钢琴+吉他',
    thumbnail: '/images/gallery/page11_img2.jpeg',
    category: '合奏',
    views: 523
  },
  {
    id: '2',
    title: '儿童独奏《天空之城》',
    performer: '李小明（12岁）',
    instruments: '吉他',
    thumbnail: '/images/gallery/page9_img3.jpeg',
    category: '吉他',
    views: 892
  },
  {
    id: '3',
    title: '亲子合唱《Let It Be》',
    performer: '李家庭',
    instruments: '声乐',
    thumbnail: '/images/gallery/page8_img5.jpeg',
    category: '声乐',
    views: 445
  },
  {
    id: '4',
    title: '小提琴独奏《梁祝》片段',
    performer: '王小雅（10岁）',
    instruments: '小提琴',
    thumbnail: '/images/gallery/page9_img2.jpeg',
    category: '小提琴',
    views: 678
  }
]

// 家庭乐团数据
const familyOrchestras = [
  {
    name: '阳光家庭乐团',
    members: 8,
    instruments: '吉他、钢琴、小提琴、声乐',
    style: '流行音乐、经典儿歌',
    description: '由8个热爱音乐的家庭组成，擅长演奏流行音乐和经典儿歌改编作品',
    image: '/images/gallery/page11_img2.jpeg',
    representative: '《童年》合奏版'
  },
  {
    name: '和谐之声乐团',
    members: 6,
    instruments: '大提琴、手风琴、吉他',
    style: '古典音乐、民谣',
    description: '专注于古典音乐演奏，将高雅艺术带入家庭生活',
    image: '/images/gallery/page8_img5.jpeg',
    representative: '《卡农》改编版'
  }
]

export default function Members() {
  const [activeTab, setActiveTab] = useState('stories')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredVideos = selectedCategory === 'all' 
    ? performanceVideos 
    : performanceVideos.filter(video => video.category === selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <HeroSection className="relative overflow-hidden bg-secondary-900 text-white">
        <Container>
          <div className="text-center py-20">
            <Caption className="text-primary-400 font-semibold tracking-wider uppercase mb-4">
              会员风采
            </Caption>
            <Heading1 className="mb-6">
              心中有爱，眼中有光
            </Heading1>
            <BodyText className="max-w-2xl mx-auto text-lg text-white/90">
              分享加入声传公益社团的心路点滴，enjoy 家庭音乐，共同见证 IM 的成长之路
            </BodyText>
          </div>
        </Container>
      </HeroSection>

      {/* 导航标签 */}
      <Section className="bg-secondary-50 border-b border-secondary-200">
        <Container>
          <div className="flex justify-center space-x-8">
            {[
              { id: 'stories', label: '心路分享', icon: MessageCircle },
              { id: 'videos', label: '演出视频', icon: Video },
              { id: 'orchestras', label: '家庭乐团', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* 心路分享 */}
      {activeTab === 'stories' && (
        <>
          <Section>
            <Container>
              <div className="text-center mb-12">
                <Heading2 className="mb-4">心路分享专栏</Heading2>
                <BodyText className="max-w-2xl mx-auto">
                  会员投稿的文章和感言，记录每个家庭的音乐成长故事
                </BodyText>
              </div>

              <div className="max-w-4xl mx-auto space-y-8">
                {memberStories.map((story) => (
                  <article key={story.id} className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="md:flex">
                      <div className="md:w-1/3 relative h-48 md:h-auto">
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex items-center mb-3">
                          <span className="text-sm font-medium text-primary-600 mr-4">会员 {story.memberNumber}号</span>
                          <span className="text-sm text-secondary-600">{story.instruments}</span>
                        </div>
                        <Heading3 className="mb-3">{story.title}</Heading3>
                        <BodyText className="text-secondary-600 mb-4">
                          {story.content}
                        </BodyText>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-secondary-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            {story.date}
                          </div>
                          <div className="flex items-center space-x-4">
                            <button className="flex items-center text-secondary-600 hover:text-primary-600">
                              <Heart className="h-5 w-5 mr-2" />
                              <span className="text-sm">{story.likes}</span>
                            </button>
                            <button className="btn-primary text-sm">
                              阅读全文
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <div className="text-center mt-12">
                <Link href="/join" className="btn-primary">
                  <Users className="h-5 w-5 mr-2" />
                  分享你的故事
                </Link>
              </div>
            </Container>
          </Section>
        </>
      )}

      {/* 演出视频 */}
      {activeTab === 'videos' && (
        <>
          <Section>
            <Container>
              <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8">
                <div>
                  <Heading2 className="mb-4">演出视频展示</Heading2>
                  <BodyText className="max-w-2xl">
                    家庭演奏视频展示，感受音乐带来的温暖与感动
                  </BodyText>
                </div>
                <div className="mt-4 md:mt-0 flex space-x-2">
                  {['all', '吉他', '钢琴', '小提琴', '声乐', '合奏'].map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary-600 text-white'
                          : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
                      }`}
                    >
                      {category === 'all' ? '全部' : category}
                    </button>
                  ))}
                </div>
              </div>

              <GridLayout>
                {filteredVideos.map((video) => (
                  <div key={video.id} className="group cursor-pointer">
                    <div className="relative aspect-video rounded-2xl overflow-hidden mb-4">
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                          <Play className="h-8 w-8 text-primary-600 ml-1" />
                        </div>
                      </div>
                    </div>
                    <Heading3 className="mb-2">{video.title}</Heading3>
                    <div className="flex items-center justify-between text-sm text-secondary-600">
                      <div className="flex items-center">
                        <Music className="h-4 w-4 mr-2" />
                        <span>{video.performer}</span>
                      </div>
                      <span>{video.views} 观看</span>
                    </div>
                  </div>
                ))}
              </GridLayout>
            </Container>
          </Section>
        </>
      )}

      {/* 家庭乐团 */}
      {activeTab === 'orchestras' && (
        <>
          <Section>
            <Container>
              <div className="text-center mb-12">
                <Heading2 className="mb-4">家庭乐团介绍</Heading2>
                <BodyText className="max-w-2xl mx-auto">
                  各家庭乐团的展示页面，了解每个乐团的独特魅力
                </BodyText>
              </div>

              <GridLayout>
                {familyOrchestras.map((orchestra, idx) => (
                  <div key={idx} className="bg-white rounded-2xl shadow-sm border border-secondary-200 overflow-hidden">
                    <div className="relative h-48">
                      <Image
                        src={orchestra.image}
                        alt={orchestra.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <Heading3 className="text-white mb-1">{orchestra.name}</Heading3>
                        <div className="flex items-center text-sm">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{orchestra.members} 个家庭</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm">
                          <Music className="h-4 w-4 text-primary-600 mr-3" />
                          <span>乐器：{orchestra.instruments}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Star className="h-4 w-4 text-primary-600 mr-3" />
                          <span>风格：{orchestra.style}</span>
                        </div>
                      </div>
                      
                      <BodyText className="text-secondary-600 mb-4">
                        {orchestra.description}
                      </BodyText>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-secondary-600">
                          <Quote className="h-4 w-4 mr-2" />
                          代表作：{orchestra.representative}
                        </div>
                        <button className="text-primary-600 hover:text-primary-700 font-medium">
                          了解更多 →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </GridLayout>
            </Container>
          </Section>
        </>
      )}

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6">想成为我们的一员吗？</Heading2>
            <BodyText className="text-white/90 mb-8 max-w-2xl mx-auto">
              加入IM公益声传社团，分享你的音乐故事，和众多音乐家庭一起成长
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                <Users className="h-5 w-5" />
                立即加入
              </Link>
              <Link href="/classes" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                <Music className="h-5 w-5" />
                了解课程
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
                把音乐快乐带给每个家庭
              </BodyText>
              <Caption>
                MUSIC HAPPY TO LIFE HAPPINESS
              </Caption>
            </div>
            <div>
              <h4 className="font-semibold mb-4">快速链接</h4>
              <ul className="space-y-2 text-secondary-400">
                <li><Link href="/" className="hover:text-white transition-colors">首页</Link></li>
                <li><Link href="/members" className="hover:text-white transition-colors">会员风采</Link></li>
                <li><Link href="/activities" className="hover:text-white transition-colors">活动动态</Link></li>
                <li><Link href="/join" className="hover:text-white transition-colors">加入我们</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">会员专区</h4>
              <ul className="space-y-2 text-secondary-400">
                <li>心路分享</li>
                <li>演出视频</li>
                <li>家庭乐团</li>
                <li>会员档案</li>
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
            <Caption>© 2024 IM 公益声传社团. 把音乐快乐带给每个家庭</Caption>
          </div>
        </Container>
      </footer>
    </div>
  )
}