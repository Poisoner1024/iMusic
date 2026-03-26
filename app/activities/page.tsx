'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { 
  Container, Section, Heading1, Heading2, BodyText, Caption,
  GridLayout, ProgramCard
} from '@/components/DesignSystem'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Filter, Calendar, MapPin, Users } from 'lucide-react'

const activityTypes = [
  { id: 'all', name: '全部活动', icon: '📸' },
  { id: 'performance', name: '公益演出', icon: '🎭' },
  { id: 'party', name: '音乐 Party', icon: '🎉' },
  { id: 'teaching', name: '公益授课', icon: '🎸' },
  { id: 'charity', name: '社区活动', icon: '❤️' },
  { id: 'international', name: '国际交流', icon: '🌍' }
]

const activities = [
  {
    id: 1,
    title: '吉他公益课开班仪式',
    description: '首场吉他公益课正式启动，为50+孩子提供免费音乐教育机会',
    date: '2024-03-15',
    location: '北京',
    type: 'teaching',
    image: '/images/gallery/page7_img7.jpeg',
    participants: '50+ 学员',
    highlight: '免费音乐教育 · 专业师资团队'
  },
  {
    id: 2,
    title: '家庭乐团成立音乐会',
    description: '首个跨国家庭音乐团体诞生，展现多元音乐文化融合',
    date: '2024-03-10',
    location: '全国',
    type: 'performance',
    image: '/images/gallery/page11_img4.jpeg',
    participants: '100+ 家庭参与',
    highlight: '亲子合奏 · 定期音乐会 · 跨越国界'
  },
  {
    id: 3,
    title: '社区公益路演',
    description: '走进社区传递音乐温暖，用音乐连接邻里情感',
    date: '2024-03-05',
    location: '各地社区',
    type: 'charity',
    image: '/images/gallery/page8_img5.jpeg',
    participants: '16 场活动',
    highlight: '福利机构送温暖 · 社区活动支持'
  },
  {
    id: 4,
    title: '生日音乐派对',
    description: '在温馨的生日聚会上，用吉他弹奏祝福，共享音乐快乐',
    date: '2024-03-01',
    location: '北京',
    type: 'party',
    image: '/images/gallery/page10_img4.jpeg',
    participants: '30+ 参与者',
    highlight: '音乐庆祝 · 温馨氛围 · 家庭聚会'
  }
]

export default function Activities() {
  const [selectedType, setSelectedType] = useState('all')

  const filteredActivities = selectedType === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === selectedType)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Section className="relative min-h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/gallery/page3_img4.jpeg"
            alt="IM公益声传社团活动"
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
              活动动态
            </Heading1>
            
            <BodyText className="text-white/90 max-w-2xl mx-auto">
              记录每一次音乐活动的精彩瞬间，见证音乐如何连接家庭与社区
            </BodyText>
          </div>
        </Container>
      </Section>

      {/* 活动筛选 */}
      <Section>
        <Container>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
                Activities
              </Caption>
              <Heading2>
                活动列表
              </Heading2>
            </div>
            
            <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
              {activityTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`
                    px-4 py-2 rounded-full border text-sm font-medium transition-all duration-200
                    ${selectedType === type.id
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-300 text-gray-700 hover:border-primary-500'
                    }
                  `}
                >
                  {type.icon} {type.name}
                </button>
              ))}
            </div>
          </div>

          {/* 活动统计 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { number: activities.length.toString(), label: '总活动数' },
              { number: '100+', label: '参与家庭' },
              { number: '50+', label: '受益学员' },
              { number: '16', label: '社区覆盖' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <Caption className="text-gray-600">{stat.label}</Caption>
              </div>
            ))}
          </div>

          {/* 活动网格 */}
          {filteredActivities.length > 0 ? (
            <GridLayout>
              {filteredActivities.map((activity) => (
                <ProgramCard
                  key={activity.id}
                  title={activity.title}
                  description={activity.description}
                  highlight={activity.highlight}
                  image={activity.image}
                  location={activity.location}
                  participants={activity.participants}
                />
              ))}
            </GridLayout>
          ) : (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🎵</div>
              <Heading2 className="mb-2">暂无活动</Heading2>
              <BodyText>该分类下还没有活动，敬请期待！</BodyText>
            </div>
          )}
        </Container>
      </Section>

      {/* 活动详情示例 */}
      <Section className="bg-secondary-50">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="card-hover p-8">
              <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                  <Image
                    src="/images/gallery/page2_img4.jpeg"
                    alt="社团大合影"
                    width={400}
                    height={300}
                    className="rounded-lg w-full h-64 object-cover"
                  />
                </div>
                
                <div>
                  <Caption className="text-primary-600 font-semibold mb-2">
                    <Calendar className="h-4 w-4 inline mr-2" />
                    2024-03-15
                  </Caption>
                  
                  <Heading2 className="mb-4">社团成立庆典</Heading2>
                  
                  <BodyText className="mb-6">
                    IM公益声传社团正式成立，迎来首批50位Founder会员。
                    在这个特别的日子里，我们共同见证了音乐如何连接不同家庭，
                    让每个成员都能在音乐的陪伴下共同成长。
                  </BodyText>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <Caption>北京 · 社团基地</Caption>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <Caption>50+ 参与者</Caption>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* CTA 区块 */}
      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6 text-white">
              想参与我们的活动吗？
            </Heading2>
            <BodyText className="text-white/90 mb-10 max-w-2xl mx-auto">
              加入我们，成为前100位Founder会员，第一时间获取最新活动信息
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                立即加入
              </Link>
              <Link href="/gallery" className="btn-outline text-white border-white hover:bg-white hover:text-gray-900">
                查看相册
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}