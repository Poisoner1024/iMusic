'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { 
  Container, Section, Heading1, Heading2, Heading3, BodyText, Caption,
  TagCloud, GridLayout
} from '@/components/DesignSystem'
import { galleryImages } from '@/lib/galleryData'
import { ArrowLeft, X, ChevronLeft, ChevronRight } from 'lucide-react'

// 图片分类
const categories = ['全部', '公益授课', '舞台演出', '社团活动', '家庭音乐', '公益活动']

export default function Gallery() {
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const filteredImages = selectedCategory === '全部' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === selectedCategory)

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredImages.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length)
  }

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
              活动剪影
            </Heading1>
            
            <BodyText className="text-white/90 max-w-2xl mx-auto">
              记录每一个美好瞬间，见证音乐如何连接家庭与社区
            </BodyText>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-8 max-w-md mx-auto mt-12">
              {[
                { number: galleryImages.length.toString(), label: '精彩瞬间' },
                { number: '6', label: '活动类型' },
                { number: '100+', label: '参与家庭' },
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                  <Caption className="text-white/70">{stat.label}</Caption>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* 分类筛选器 */}
      <Section className="bg-secondary-50">
        <Container>
          <div className="text-center mb-8">
            <Caption className="text-primary-600 font-semibold tracking-wider uppercase mb-3">
              Gallery Categories
            </Caption>
            <Heading2>
              照片分类
            </Heading2>
          </div>
          
          <TagCloud tags={categories} />
        </Container>
      </Section>

      {/* 图片网格 */}
      <Section>
        <Container>
          <GridLayout className="gap-8">
            {filteredImages.map((image, index) => (
              <div 
                key={image.id}
                className="card-hover overflow-hidden cursor-pointer group"
                onClick={() => openLightbox(index)}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={image.src}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-4 right-4">
                    <span className="tag-primary text-xs">
                      {image.category}
                    </span>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <Heading3 className="text-white mb-2">{image.title}</Heading3>
                    <BodyText className="text-white/90 text-sm line-clamp-2">
                      {image.description}
                    </BodyText>
                  </div>
                </div>
              </div>
            ))}
          </GridLayout>

          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <div className="mb-4 text-6xl">📸</div>
              <Heading3 className="mb-2">暂无照片</Heading3>
              <BodyText>该分类下还没有照片，敬请期待更多精彩瞬间！</BodyText>
            </div>
          )}
        </Container>
      </Section>

      {/* 关于活动剪影 */}
      <Section className="bg-secondary-900 text-white">
        <Container>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Caption className="text-primary-400 font-semibold tracking-wider uppercase mb-3">
                About Our Gallery
              </Caption>
              <Heading2 className="mb-6 text-white">
                记录美好，传递温暖
              </Heading2>
              <BodyText className="text-secondary-300 leading-relaxed">
                每一张照片背后都有一个温暖的故事。从吉他公益课到家庭乐团，
                从社区演出到公益活动，我们用镜头记录下每一个珍贵的瞬间。
                这些照片不仅见证了音乐的力量，更记录了家庭与社区之间的情感连接。
              </BodyText>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="relative h-48 rounded-2xl overflow-hidden">
                <Image
                  src="/images/gallery/page9_img2.jpeg"
                  alt="音乐表演"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative h-64 rounded-2xl overflow-hidden mt-8">
                <Image
                  src="/images/gallery/page8_img5.jpeg"
                  alt="户外活动"
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
              <div className="relative h-48 rounded-2xl overflow-hidden mt-8">
                <Image
                  src="/images/gallery/page10_img4.jpeg"
                  alt="生日派对"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* 灯箱弹窗 */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <button 
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors z-10"
          >
            <ChevronRight className="h-8 w-8" />
          </button>

          <div className="max-w-4xl max-h-full w-full">
            <div className="relative aspect-[4/3] mb-4">
              <Image
                src={filteredImages[currentImageIndex].src}
                alt={filteredImages[currentImageIndex].title}
                fill
                className="object-contain"
              />
            </div>
            <div className="bg-white rounded-lg p-6">
              <Heading3 className="mb-2">{filteredImages[currentImageIndex].title}</Heading3>
              <BodyText className="text-gray-600 mb-4">
                {filteredImages[currentImageIndex].description}
              </BodyText>
              <div className="flex justify-between items-center">
                <span className="tag-primary">{filteredImages[currentImageIndex].category}</span>
                <Caption>
                  {currentImageIndex + 1} / {filteredImages.length}
                </Caption>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}