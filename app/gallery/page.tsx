'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Header'
import { galleryImages, galleryCategories, type GalleryImage } from '@/lib/galleryData'
import { ArrowLeft, Calendar, MapPin, Users, Heart, Sparkles } from 'lucide-react'

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const filteredImages = selectedCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory)

  // 按日期降序排序
  const sortedImages = [...filteredImages].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 py-16 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto relative px-4">
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-primary-100 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              返回首页
            </Link>
          </div>
          <div className="text-center">
            <h1 className="mb-4 text-4xl font-bold md:text-5xl">
              <Sparkles className="inline h-8 w-8 mr-2" />
              活动剪影
            </h1>
            <p className="mb-4 text-xl text-primary-100">
              记录 IM 公益声传社团的美好瞬间
            </p>
            <p className="text-lg text-primary-200 max-w-2xl mx-auto">
              言传不如身教，身教不如境教。在这里，我们用镜头记录下每一个温暖的音乐时刻，
              见证每一位会员的成长与欢乐。
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Statistics */}
        <section className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{galleryImages.length}</div>
              <div className="text-gray-600 text-sm">精彩瞬间</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">
                {new Set(galleryImages.map(img => img.category)).size}
              </div>
              <div className="text-gray-600 text-sm">活动类型</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">100+</div>
              <div className="text-gray-600 text-sm">参与家庭</div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-md text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">∞</div>
              <div className="text-gray-600 text-sm">快乐传递</div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-10">
          <div className="flex flex-wrap gap-3 justify-center">
            {galleryCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  selectedCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {category.id === 'all' 
                    ? galleryImages.length 
                    : galleryImages.filter(img => img.category === category.id).length
                  }
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="mb-16">
          {sortedImages.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">暂无该分类的照片</h3>
              <p className="text-gray-600">该分类下还没有活动照片，敬请期待！</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sortedImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => setSelectedImage(image)}
                  className="group cursor-pointer bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <Image
                      src={image.src}
                      alt={image.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                        {galleryCategories.find(c => c.id === image.category)?.icon} {' '}
                        {galleryCategories.find(c => c.id === image.category)?.name}
                      </span>
                    </div>

                    {/* Hover Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-sm line-clamp-2">{image.description}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {image.title}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(image.date).toLocaleDateString('zh-CN', { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 md:p-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              <Heart className="inline h-6 w-6 text-primary-600 mr-2" />
              关于活动剪影
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              这些照片记录了 IM 公益声传社团从成立至今的点点滴滴。从吉他公益课的专注练习，
              到家庭音乐会的温馨合奏；从社团活动的欢乐聚会，到公益演出的温暖瞬间。
              每一张照片都承载着我们对音乐的热爱，对美好生活的追求。
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              我们的愿景是 <strong>MUSIC HAPPY TO LIFE HAPPINESS</strong>，
              让每个家庭都能享受音乐的美好。这些剪影，正是我们共同成长的见证。
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex items-center gap-2 text-gray-600">
                <Users className="h-5 w-5 text-primary-600" />
                <span>前100位会员专属编号</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-5 w-5 text-primary-600" />
                <span>公益教学 · 家庭乐团</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Heart className="h-5 w-5 text-primary-600" />
                <span>心中有爱 · 眼中有光</span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-5xl w-full bg-white rounded-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:bg-white transition-colors"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2">
              {/* Image */}
              <div className="relative aspect-[4/3] md:aspect-auto md:h-[600px] bg-gray-900">
                <Image
                  src={selectedImage.src}
                  alt={selectedImage.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Info */}
              <div className="p-8 flex flex-col">
                <div className="mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                    {galleryCategories.find(c => c.id === selectedImage.category)?.icon} {' '}
                    {galleryCategories.find(c => c.id === selectedImage.category)?.name}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {selectedImage.title}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow">
                  {selectedImage.description}
                </p>

                <div className="flex items-center gap-2 text-gray-500 text-sm pt-4 border-t">
                  <Calendar className="h-4 w-4" />
                  <span>拍摄于 {new Date(selectedImage.date).toLocaleDateString('zh-CN', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-gray-500 italic">
                    &ldquo;LET'S TOGETHER ENJOY MUSIC HAPPY TO LIFE HAPPINESS&rdquo; — MIYA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p className="mb-2">© 2024 IM 公益声传社团. 让每个家庭享受音乐的美好</p>
          <p className="text-sm">
            用爱传递音乐，用心分享美好
          </p>
        </div>
      </footer>
    </div>
  )
}
