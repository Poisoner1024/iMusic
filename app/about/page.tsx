'use client'

import { Header } from '@/components/Header'
import { 
  Container, Section, Heading1, Heading2, Heading3, BodyText, Caption,
  QuoteCard, GridLayout, HeroGrid
} from '@/components/DesignSystem'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Users, Heart, Music, Calendar, MapPin } from 'lucide-react'

export default function About() {
  const teamMembers = [
    {
      name: '创始人团队',
      role: '核心发起人',
      description: '由一群热爱音乐、关注家庭教育的专业人士组成，致力于推广公益音乐教育。',
      image: '/images/gallery/page2_img4.jpeg'
    },
    {
      name: '公益教师',
      role: '专业指导',
      description: '来自各音乐院校的专业教师，用爱心和专业指导每一个热爱音乐的孩子。',
      image: '/images/gallery/page7_img7.jpeg'
    },
    {
      name: '志愿者团队',
      role: '活动支持',
      description: '来自各行各业的爱心志愿者，为每一次活动提供全方位的支持与帮助。',
      image: '/images/gallery/page8_img5.jpeg'
    }
  ]

  const milestones = [
    { year: '2024', event: 'IM公益声传社团成立', description: '正式启动家庭音乐公益项目' },
    { year: '2024', event: '首场吉他公益课', description: '为50+孩子提供免费音乐教育' },
    { year: '2024', event: '家庭乐团成立', description: '首个跨国家庭音乐团体诞生' },
    { year: '2024', event: '社区公益路演', description: '走进社区传递音乐温暖' }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/page2_img4.jpeg"
            alt="IM公益声传社团"
            fill
            className="object-cover opacity-20"
            priority
          />
        </div>
        
        <Container>
          <div className="text-center relative z-10">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 mb-8 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              返回首页
            </Link>
            
            <Heading1 className="mb-4 text-white">
              关于社团
            </Heading1>
            
            <BodyText className="text-white/90 max-w-2xl mx-auto">
              让每个家庭都能享受音乐的美好，MUSIC HAPPY TO LIFE HAPPINESS
            </BodyText>
          </div>
        </Container>
      </Section>

      {/* 使命愿景 */}
      <Section>
        <Container>
          <HeroGrid>
            <div>
              <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
                Our Mission
              </Caption>
              <Heading2 className="mb-6">
                我们的使命
              </Heading2>
              <BodyText className="leading-relaxed mb-8">
                把音乐快乐带给每个家庭
              </BodyText>
              
              <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
                Our Vision
              </Caption>
              <Heading3 className="mb-4">
                我们的愿景
              </Heading3>
              <BodyText className="leading-relaxed">
                MUSIC HAPPY TO LIFE HAPPINESS
              </BodyText>
            </div>
            
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
          </HeroGrid>
        </Container>
      </Section>

      {/* 核心价值 */}
      <Section className="bg-secondary-50">
        <Container>
          <div className="text-center mb-16">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              Core Values
            </Caption>
            <Heading2 className="mb-4">
              核心价值
            </Heading2>
          <BodyText className="max-w-2xl mx-auto">
              言传不如身教，身教不如境教 - 向前一步，让每个家庭都能享受音乐的美好
          </BodyText>
          </div>

          <GridLayout>
            <div className="card-hover p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="h-8 w-8 text-primary-600" />
              </div>
              <Heading3 className="mb-4">爱心公益</Heading3>
              <BodyText>
                坚持公益性质，为每个孩子提供平等的音乐学习机会，
                让音乐教育不再有经济门槛。
              </BodyText>
            </div>

            <div className="card-hover p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <Heading3 className="mb-4">家庭连接</Heading3>
              <BodyText>
                通过家庭音乐活动，增进亲子关系，
                让音乐成为家庭成员之间情感交流的纽带。
              </BodyText>
            </div>

            <div className="card-hover p-8 text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Music className="h-8 w-8 text-primary-600" />
              </div>
              <Heading3 className="mb-4">专业指导</Heading3>
              <BodyText>
                由专业音乐教师提供指导，确保教学质量，
                让每个孩子都能获得专业的音乐教育。
              </BodyText>
            </div>
          </GridLayout>
        </Container>
      </Section>

      {/* 发展历程 */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              Our Journey
            </Caption>
            <Heading2 className="mb-4">
              发展历程
            </Heading2>
            <BodyText className="max-w-2xl mx-auto">
              从一个小小的想法开始，到如今服务100+个家庭的重要里程碑
            </BodyText>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* 时间线 */}
            <div className="absolute left-1/2 -translate-x-1/2 w-0.5 h-full bg-primary-200"></div>
            
            {milestones.map((milestone, index) => (
              <div 
                key={index}
                className={`flex items-center mb-12 ${
                  index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                  <div className="card-hover p-6">
                    <div className="text-2xl font-bold text-primary-600 mb-2">
                      {milestone.year}
                    </div>
                    <Heading3 className="mb-2">{milestone.event}</Heading3>
                    <BodyText className="text-gray-600">{milestone.description}</BodyText>
                  </div>
                </div>
                
                <div className="relative w-8 h-8 bg-primary-600 rounded-full border-4 border-white shadow-lg z-10"></div>
                
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 团队介绍 */}
      <Section className="bg-secondary-900 text-white">
        <Container>
          <div className="text-center mb-16">
            <Caption className="text-primary-400 font-semibold tracking-wider uppercase mb-3">
              Our Team
            </Caption>
            <Heading2 className="mb-4 text-white">
              团队介绍
            </Heading2>
            <BodyText className="text-secondary-300 max-w-2xl mx-auto">
              由专业音乐教师、爱心志愿者和热心家长组成的强大团队
            </BodyText>
          </div>

          <GridLayout>
            {teamMembers.map((member, index) => (
              <div key={index} className="card-hover bg-secondary-800 overflow-hidden">
                <div className="relative h-48">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-secondary-900/80 to-transparent" />
                </div>
                <div className="p-6">
                  <Heading3 className="text-white mb-2">{member.name}</Heading3>
                  <Caption className="text-primary-400 mb-4">{member.role}</Caption>
                  <BodyText className="text-secondary-300">{member.description}</BodyText>
                </div>
              </div>
            ))}
          </GridLayout>
        </Container>
      </Section>

      {/* 创始人引言 */}
      <Section>
        <Container>
          <div className="max-w-4xl mx-auto">
            <QuoteCard
              quote="言传不如身教，身教不如境教。我们希望通过音乐创造一个美好的环境，让每个孩子都能在音乐的陪伴下健康成长。"
              author="IM公益声传创始人"
              role="社团发起人"
              location="2024年"
            />
          </div>
        </Container>
      </Section>

      {/* CTA 区块 */}
      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6 text-white">
              加入我们，一起创造音乐的美好
            </Heading2>
            <BodyText className="text-white/90 mb-10 max-w-2xl mx-auto">
              无论你是音乐爱好者、专业教师，还是热心家长，
              都欢迎加入我们的大家庭，一起用音乐传递爱与温暖
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/upload" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                分享你的音乐
              </Link>
              <Link href="/gallery" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                查看活动剪影
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}