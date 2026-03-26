'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Container, Section, Heading1, Heading2, Heading3, BodyText, Caption,
  HeroSection
} from '@/components/DesignSystem'
import { Header } from '@/components/Header'
import { 
  Mail, Phone, MapPin, Users, Heart, Send, 
  Clock, Globe, MessageCircle, Music
} from 'lucide-react'

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'general',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    alert('感谢您的留言！我们会尽快与您联系。')
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <HeroSection className="bg-secondary-900 text-white">
        <Container>
          <div className="text-center py-20">
            <MessageCircle className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <Caption className="text-primary-400 uppercase mb-4">联系我们</Caption>
            <Heading1 className="mb-6">让音乐连接你我</Heading1>
            <BodyText className="max-w-2xl mx-auto text-white/90">
              欢迎与我们取得联系，共同推广公益音乐事业
            </BodyText>
          </div>
        </Container>
      </HeroSection>

      <Section>
        <Container>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* 联系信息 */}
            <div>
              <Heading2 className="mb-6">联系信息</Heading2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <Heading3 className="mb-1">电子邮箱</Heading3>
                    <BodyText className="text-secondary-600">contact@im-music.org</BodyText>
                  </div>
                </div>

                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <Heading3 className="mb-1">联系电话</Heading3>
                    <BodyText className="text-secondary-600">+86 010-12345678</BodyText>
                  </div>
                </div>

                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <Heading3 className="mb-1">地址</Heading3>
                    <BodyText className="text-secondary-600">北京市朝阳区音乐文化中心</BodyText>
                  </div>
                </div>

                <div className="flex items-start">
                  <Clock className="h-6 w-6 text-primary-600 mr-4 mt-1" />
                  <div>
                    <Heading3 className="mb-1">工作时间</Heading3>
                    <BodyText className="text-secondary-600">周一至周五 9:00-18:00</BodyText>
                  </div>
                </div>
              </div>

              {/* 微信公众号 */}
              <div className="mt-8 p-6 bg-secondary-50 rounded-2xl">
                <Heading3 className="mb-4">关注微信公众号</Heading3>
                <BodyText className="text-secondary-600 mb-4">
                  扫码关注IM公益声传社团公众号，获取最新活动信息
                </BodyText>
                <div className="w-32 h-32 bg-white border-2 border-dashed border-secondary-300 rounded-lg flex items-center justify-center">
                  <BodyText className="text-secondary-500 text-sm">二维码</BodyText>
                </div>
              </div>
            </div>

            {/* 联系表单 */}
            <div>
              <Heading2 className="mb-6">发送消息</Heading2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    您的姓名 *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                    placeholder="请输入您的姓名"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    电子邮箱 *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                    placeholder="example@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    联系电话
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                    placeholder="可选填写"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    联系类型 *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600"
                  >
                    <option value="general">一般咨询</option>
                    <option value="cooperation">合作意向</option>
                    <option value="membership">会员申请</option>
                    <option value="teaching">师资申请</option>
                    <option value="other">其他</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-900 mb-2">
                    留言内容 *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-600 focus:border-primary-600 resize-none"
                    placeholder="请详细描述您的需求或问题..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary"
                >
                  <Send className="h-5 w-5 mr-2" />
                  发送消息
                </button>
              </form>
            </div>
          </div>
        </Container>
      </Section>

      {/* 合作机构 */}
      <Section className="bg-secondary-50">
        <Container>
          <div className="text-center mb-12">
            <Heading2 className="mb-4">合作机构</Heading2>
            <BodyText className="max-w-2xl mx-auto">
              期待与更多福利机构、学校、社区组织建立合作关系
            </BodyText>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 text-center border">
              <Heart className="h-10 w-10 text-rose-500 mx-auto mb-4" />
              <Heading3 className="mb-2">福利机构</Heading3>
              <BodyText className="text-secondary-600 text-sm">
                为福利机构提供音乐慰问演出，用音乐传递温暖
              </BodyText>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border">
              <Users className="h-10 w-10 text-primary-600 mx-auto mb-4" />
              <Heading3 className="mb-2">社区组织</Heading3>
              <BodyText className="text-secondary-600 text-sm">
                支持社区音乐活动，丰富居民文化生活
              </BodyText>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center border">
              <Music className="h-10 w-10 text-amber-600 mx-auto mb-4" />
              <Heading3 className="mb-2">学校合作</Heading3>
              <BodyText className="text-secondary-600 text-sm">
                为学校提供音乐教育资源，培养音乐兴趣
              </BodyText>
            </div>
          </div>
        </Container>
      </Section>

      <Section className="bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <Container>
          <div className="text-center">
            <Heading2 className="mb-6 text-white">让音乐连接更多家庭</Heading2>
            <BodyText className="text-white/90 mb-8 max-w-2xl mx-auto">
              无论您是音乐爱好者、专业音乐人，还是公益机构，都欢迎与我们联系
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