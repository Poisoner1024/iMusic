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
  BookOpen, Users, Calendar, MapPin, Music, Star, 
  ArrowRight, Clock, Award, Heart
} from 'lucide-react'

// 师资团队数据
const teachers = [
  {
    name: 'MIYA老师',
    role: '吉他公益教师',
    expertise: '吉他教学 · 音乐教育',
    experience: '5年教学经验',
    description: '热爱音乐教育，致力于将音乐快乐传递给每一个家庭',
    image: '/images/gallery/page7_img7.jpeg'
  },
  {
    name: 'IRIS老师',
    role: '音乐教育专家',
    expertise: '声乐指导 · 合唱训练',
    experience: '8年教学经验',
    description: '用音乐温暖心灵，让每个孩子都能享受音乐的美好',
    image: '/images/gallery/page8_img5.jpeg'
  }
]

// 课程安排数据
const classSchedule = [
  {
    title: '吉他入门班',
    level: '零基础',
    time: '每周六 10:00-11:30',
    location: '北京社区活动中心',
    capacity: '15人/班',
    status: '报名中'
  },
  {
    title: '家庭合奏班',
    level: '初级',
    time: '每周日 14:00-16:00',
    location: 'IM音乐工作室',
    capacity: '8组家庭/班',
    status: '报名中'
  },
  {
    title: '音乐启蒙班',
    level: '儿童启蒙',
    time: '每周三 16:00-17:00',
    location: '合作幼儿园',
    capacity: '12人/班',
    status: '已满'
  }
]

export default function Classes() {
  const [selectedClass, setSelectedClass] = useState(0)

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <HeroSection className="relative overflow-hidden bg-secondary-900 text-white">
        <Container>
          <div className="text-center py-20">
            <Caption className="text-primary-400 font-semibold tracking-wider uppercase mb-4">
              公益课堂
            </Caption>
            <Heading1 className="mb-6">
              吉他公益课
            </Heading1>
            <BodyText className="max-w-2xl mx-auto text-lg text-white/90">
              核心：公益 NO PROFIT，建设公益师资资源。为每一个热爱音乐的孩子提供免费学习机会
            </BodyText>
          </div>
        </Container>
      </HeroSection>

      {/* 课程介绍 */}
      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Heading2 className="mb-6">课程介绍</Heading2>
              <BodyText className="leading-relaxed mb-6">
                我们的吉他公益课致力于为每一个热爱音乐的家庭提供免费学习机会。
                课程采用小班制教学，注重个性化指导，让每个学员都能在轻松愉快的氛围中学习音乐。
              </BodyText>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <Award className="h-6 w-6 text-primary-600 mr-3" />
                  <span className="font-semibold">课程目标：</span>
                  <span className="ml-2">零基础入门，掌握基础演奏技巧</span>
                </div>
                <div className="flex items-center">
                  <Users className="h-6 w-6 text-primary-600 mr-3" />
                  <span className="font-semibold">适合人群：</span>
                  <span className="ml-2">6岁以上儿童及成人音乐爱好者</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-6 w-6 text-primary-600 mr-3" />
                  <span className="font-semibold">课程时长：</span>
                  <span className="ml-2">每期12节课，每周1次</span>
                </div>
              </div>
            </div>
            
            <div className="relative h-80 rounded-2xl overflow-hidden">
              <Image
                src="/images/gallery/page7_img7.jpeg"
                alt="吉他公益课"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </Container>
      </Section>

      {/* 师资介绍 */}
      <Section className="bg-secondary-50">
        <Container>
          <div className="text-center mb-12">
            <Heading2 className="mb-4">师资介绍</Heading2>
            <BodyText className="max-w-2xl mx-auto">
              我们的师资团队由热爱音乐教育的专业教师组成，致力于将音乐快乐传递给每一个家庭
            </BodyText>
          </div>

          <GridLayout>
            {teachers.map((teacher, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden mr-4">
                    <Image
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <Heading3 className="mb-1">{teacher.name}</Heading3>
                    <Caption className="text-primary-600">{teacher.role}</Caption>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Star className="h-4 w-4 text-amber-500 mr-2" />
                    <span className="font-medium">{teacher.expertise}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Award className="h-4 w-4 text-primary-600 mr-2" />
                    <span>{teacher.experience}</span>
                  </div>
                </div>
                
                <BodyText className="mt-4 text-secondary-600">
                  {teacher.description}
                </BodyText>
              </div>
            ))}
          </GridLayout>
        </Container>
      </Section>

      {/* 课程安排 */}
      <Section>
        <Container>
          <div className="text-center mb-12">
            <Heading2 className="mb-4">课程安排</Heading2>
            <BodyText className="max-w-2xl mx-auto">
              查看最新的课程时间安排，选择适合您的班级
            </BodyText>
          </div>

          <div className="max-w-4xl mx-auto">
            {classSchedule.map((classItem, idx) => (
              <div key={idx} className="bg-white border border-secondary-200 rounded-lg p-6 mb-4 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="mb-4 md:mb-0">
                    <Heading3 className="mb-2">{classItem.title}</Heading3>
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center text-sm">
                        <BookOpen className="h-4 w-4 text-primary-600 mr-2" />
                        <span>难度：{classItem.level}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 text-primary-600 mr-2" />
                        <span>{classItem.time}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="h-4 w-4 text-primary-600 mr-2" />
                        <span>{classItem.location}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Users className="h-4 w-4 text-primary-600 mr-2" />
                        <span>{classItem.capacity}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium mr-4 ${
                      classItem.status === '报名中' ? 'bg-green-100 text-green-800' : 'bg-secondary-100 text-secondary-800'
                    }`}>
                      {classItem.status}
                    </span>
                    {classItem.status === '报名中' && (
                      <Link 
                        href="/join" 
                        className="btn-primary text-sm"
                      >
                        立即报名
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6">准备好开始音乐之旅了吗？</Heading2>
            <BodyText className="text-white/90 mb-8 max-w-2xl mx-auto">
              加入我们的吉他公益课，和众多音乐爱好者一起，用音乐创造美好回忆
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/join" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                <Users className="h-5 w-5" />
                立即报名
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
                <li><Link href="/classes" className="hover:text-white transition-colors">公益课堂</Link></li>
                <li><Link href="/activities" className="hover:text-white transition-colors">活动动态</Link></li>
                <li><Link href="/join" className="hover:text-white transition-colors">加入我们</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">课程信息</h4>
              <ul className="space-y-2 text-secondary-400">
                <li>吉他入门班</li>
                <li>家庭合奏班</li>
                <li>音乐启蒙班</li>
                <li>师资申请</li>
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