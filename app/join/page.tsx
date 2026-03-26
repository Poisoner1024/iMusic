'use client'

import { useState } from 'react'
import { Header } from '@/components/Header'
import { 
  Container, Section, Heading1, Heading2, Heading3, BodyText, Caption,
  GridLayout
} from '@/components/DesignSystem'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Users, Heart, Music, Calendar, MapPin, UserCheck } from 'lucide-react'

export default function Join() {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null)

  // 模拟已选择的会员号
  const takenNumbers = [1, 19, 24, 50, 75, 100]

  const memberTypes = [
    {
      title: '亲子音乐家庭',
      description: '希望陪伴孩子学习音乐、享受家庭音乐时光的家庭',
      requirements: [
        '认同 IM 共同价值观',
        '愿意向前一步',
        '为实现社团美好愿景、共同使命&理念',
        '有 0-18 岁孩子的家庭'
      ],
      icon: '👨‍👩‍👧‍👦'
    },
    {
      title: '专业音乐人士',
      description: '有教育情怀、愿意公益授课的音乐老师和演奏家',
      requirements: [
        '认同 IM 共同价值观',
        '愿意向前一步',
        '有教育情怀',
        '愿意参与公益教学'
      ],
      icon: '🎵'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <Section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-600 to-accent-600 text-white">
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
              加入我们
            </Heading1>
            
            <BodyText className="text-white/90 max-w-2xl mx-auto">
              成为前100位 Founder 会员，和我们一起把音乐快乐带给每个家庭
            </BodyText>
          </div>
        </Container>
      </Section>

      {/* Founder 会员介绍 */}
      <Section>
        <Container>
          <div className="text-center mb-16">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              Founder Members
            </Caption>
            <Heading2 className="mb-4">
              Founder 会员
            </Heading2>
            <BodyText className="max-w-3xl mx-auto">
              "IM" 具有双重含义：取自发起人 IRIS & MIYA 的首字母，同时寓意"我"——
              社团的每一位会员都是 IM 的主角和 leader，社团未来所有成就与荣誉归属于全体会员。
            </BodyText>
          </div>

          <div className="grid md:grid-cols-2 gap-12 mb-16">
            {memberTypes.map((type, index) => (
              <div key={index} className="card-hover p-8">
                <div className="text-4xl mb-4">{type.icon}</div>
                <Heading3 className="mb-4">{type.title}</Heading3>
                <BodyText className="mb-6">{type.description}</BodyText>
                
                <div className="space-y-2">
                  <Caption className="font-semibold text-gray-700">会员要求：</Caption>
                  {type.requirements.map((req, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-primary-600" />
                      <BodyText className="text-sm">{req}</BodyText>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      {/* 会员号选择 */}
      <Section className="bg-secondary-50">
        <Container>
          <div className="text-center mb-12">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              Choose Your Number
            </Caption>
            <Heading2 className="mb-4">
              选择你的会员号
            </Heading2>
            <BodyText className="max-w-2xl mx-auto">
              前100位 Founder 会员可选择自己喜欢的数字作为会员号
            </BodyText>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-10 gap-2 mb-8">
              {Array.from({ length: 100 }, (_, i) => i + 1).map((number) => {
                const isTaken = takenNumbers.includes(number)
                const isSelected = selectedNumber === number
                
                return (
                  <button
                    key={number}
                    onClick={() => !isTaken && setSelectedNumber(number)}
                    disabled={isTaken}
                    className={`
                      h-12 rounded-lg border-2 font-semibold transition-all duration-200
                      ${isTaken 
                        ? 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed' 
                        : isSelected
                          ? 'bg-primary-600 border-primary-600 text-white shadow-lg transform scale-105'
                          : 'bg-white border-gray-300 text-gray-700 hover:border-primary-500 hover:text-primary-600'
                      }
                    `}
                  >
                    {number}
                  </button>
                )
              })}
            </div>
            
            <div className="text-center">
              <Caption className="text-gray-500">
                灰色数字已被选择，请选择其他可用数字
              </Caption>
            </div>
          </div>
        </Container>
      </Section>

      {/* 申请表单 */}
      <Section>
        <Container>
          <div className="max-w-2xl mx-auto">
            <div className="card-hover p-8">
              <Heading3 className="mb-6 text-center">会员申请表单</Heading3>
              
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      姓名 *
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      会员类型 *
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500">
                      <option value="">请选择</option>
                      <option value="family">亲子音乐家庭</option>
                      <option value="professional">专业音乐人士</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    联系方式（微信/手机） *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    城市 *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    家庭成员信息 / 专业背景
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请简要介绍家庭成员情况或专业音乐背景"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    擅长乐器
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请填写您或家人擅长的乐器"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    加入理由 *
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="请分享您为什么想加入 IM 公益声传社团"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                >
                  提交申请
                </button>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      {/* 会员档案墙（示例） */}
      <Section className="bg-secondary-900 text-white">
        <Container>
          <div className="text-center mb-12">
            <Caption className="text-primary-400 font-semibold tracking-wider uppercase mb-3">
              Founder Members
            </Caption>
            <Heading2 className="mb-4 text-white">
              会员档案墙
            </Heading2>
            <BodyText className="text-secondary-300 max-w-2xl mx-auto">
              已加入的 Founder 会员（仅展示授权公开信息）
            </BodyText>
          </div>

          <GridLayout>
            {[
              { number: '001', name: 'IRIS', type: '发起人', city: '北京' },
              { number: '019', name: 'DIEGO', type: '发起人', city: '中国香港' },
              { number: '024', name: 'MIYA', type: '发起人', city: '北京' },
              { number: '050', name: '张家庭', type: '亲子家庭', city: '上海' },
              { number: '075', name: '李老师', type: '专业教师', city: '广州' }
            ].map((member, index) => (
              <div key={index} className="card-hover bg-secondary-800 p-6 text-center">
                <div className="text-3xl font-bold text-primary-400 mb-2">#{member.number}</div>
                <Heading3 className="text-white mb-2">{member.name}</Heading3>
                <Caption className="text-primary-400 mb-2">{member.type}</Caption>
                <BodyText className="text-secondary-300">{member.city}</BodyText>
              </div>
            ))}
          </GridLayout>
        </Container>
      </Section>

      {/* CTA 区块 */}
      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6 text-white">
              准备好加入我们的音乐大家庭了吗？
            </Heading2>
            <BodyText className="text-white/90 mb-10 max-w-2xl mx-auto">
              选择你的专属会员号，成为前100位 Founder 会员中的一员，
              和我们一起把音乐快乐带给每个家庭
            </BodyText>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="btn-secondary bg-white text-primary-600 hover:bg-gray-100">
                了解更多
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