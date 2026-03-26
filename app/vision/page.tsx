'use client'

import Image from 'next/image'
import Link from 'next/link'
import { 
  Container, Section, Heading1, Heading2, Heading3, BodyText, Caption,
  HeroSection
} from '@/components/DesignSystem'
import { Header } from '@/components/Header'
import { 
  Globe, Users, Music, Calendar, Target, Rocket, Heart, Star
} from 'lucide-react'

const visionPlans = [
  {
    title: '中西合奏交响乐团组建',
    progress: 30,
    description: '组建融合中西方乐器的交响乐团',
    timeline: '2024-2026'
  },
  {
    title: 'IM营地创办',
    progress: 20,
    description: '建立专属的音乐营地',
    timeline: '2025-2027'
  },
  {
    title: '香港社团注册',
    progress: 60,
    description: '完成香港地区的社团注册',
    timeline: '2024-2025'
  },
  {
    title: 'IM走向世界',
    progress: 10,
    description: '将IM理念推广到全球',
    timeline: '2026-2030'
  }
]

export default function Vision() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection className="bg-secondary-900 text-white">
        <Container>
          <div className="text-center py-20">
            <Rocket className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <Caption className="text-primary-400 uppercase mb-4">展望未来</Caption>
            <Heading1 className="mb-6">IM 走向世界</Heading1>
            <BodyText className="max-w-2xl mx-auto text-white/90">
              MUSIC HAPPY TO LIFE HAPPINESS - 让每个家庭享受音乐的美好
            </BodyText>
          </div>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <div className="text-center mb-16">
            <Heading2 className="mb-4">愿景路线图</Heading2>
            <BodyText className="max-w-2xl mx-auto">
              图文展示IM未来规划，共同见证社团成长
            </BodyText>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            {visionPlans.map((plan, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 border">
                <div className="flex items-center justify-between mb-4">
                  <Heading3>{plan.title}</Heading3>
                  <span className="text-primary-600 font-medium">{plan.timeline}</span>
                </div>
                <BodyText className="mb-4">{plan.description}</BodyText>
                <div className="flex items-center">
                  <div className="flex-1 bg-secondary-200 rounded-full h-2 mr-4">
                    <div className="bg-primary-600 h-2 rounded-full" style={{width: `${plan.progress}%`}} />
                  </div>
                  <span className="text-sm font-medium">{plan.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section className="bg-secondary-50">
        <Container>
          <div className="text-center mb-12">
            <Heading2 className="mb-4">核心价值观</Heading2>
            <BodyText className="max-w-2xl mx-auto">
              心中有爱❤️，眼中有光✨，共同迎接美好未来
            </BodyText>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border">
              <Heart className="h-10 w-10 text-rose-500 mx-auto mb-3" />
              <Heading3 className="mb-2">心中有爱</Heading3>
              <BodyText className="text-secondary-600 text-sm">期待所有会员，心中有爱</BodyText>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border">
              <Star className="h-10 w-10 text-amber-500 mx-auto mb-3" />
              <Heading3 className="mb-2">眼中有光</Heading3>
              <BodyText className="text-secondary-600 text-sm">眼中有光，用音乐照亮生活</BodyText>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border">
              <Target className="h-10 w-10 text-primary-600 mx-auto mb-3" />
              <Heading3 className="mb-2">向前一步</Heading3>
              <BodyText className="text-secondary-600 text-sm">价值观：勇敢追求音乐梦想</BodyText>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border">
              <Users className="h-10 w-10 text-green-600 mx-auto mb-3" />
              <Heading3 className="mb-2">共同成长</Heading3>
              <BodyText className="text-secondary-600 text-sm">热爱音乐的家庭共同见证成长</BodyText>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6 text-white">一起创造音乐的未来</Heading2>
            <BodyText className="text-white/90 mb-8 max-w-2xl mx-auto">
              加入IM公益声传社团，和我们一起实现这些美好的愿景
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="btn-secondary bg-white text-primary-600">
                <Users className="h-5 w-5" />
                加入我们
              </Link>
              <Link href="/about" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                了解更多
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}