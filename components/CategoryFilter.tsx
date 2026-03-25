'use client'

import { useState } from 'react'
import { Filter, Music } from 'lucide-react'
import { Video } from '@/types'
import { getCategories } from '@/lib/data'

interface CategoryFilterProps {
  videos: Video[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

export function CategoryFilter({ videos, selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const categories = getCategories(videos)

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-3 shadow-lg">
              <Filter className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
              乐器筛选
            </h2>
          </div>
          <div className="text-lg text-gray-600">
            发现不同乐器的精彩演奏
          </div>
        </div>
        
        {/* Total Count */}
        <div className="text-right">
          <div className="text-4xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
            {videos.length}
          </div>
          <div className="text-sm text-gray-600">个视频作品</div>
        </div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`group relative p-4 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
              selectedCategory === category.id
                ? 'border-purple-500 bg-gradient-to-r from-purple-50/80 to-blue-50/80 shadow-lg'
                : 'border-gray-200/50 bg-white/70 backdrop-blur-sm hover:border-purple-300'
            }`}
          >
            <div className="text-center">
              <div className={`text-3xl mb-2 transition-transform duration-300 group-hover:scale-110 ${
                selectedCategory === category.id ? 'scale-110' : ''
              }`}>
                {category.icon}
              </div>
              <div className={`font-semibold mb-1 transition-colors duration-300 ${
                selectedCategory === category.id
                  ? 'text-purple-700'
                  : 'text-gray-700 group-hover:text-purple-600'
              }`}>
                {category.name}
              </div>
              <div className={`text-sm font-medium transition-colors duration-300 ${
                selectedCategory === category.id
                  ? 'text-purple-600'
                  : 'text-gray-500 group-hover:text-purple-500'
              }`}>
                {category.count} 个
              </div>
            </div>
            
            {/* Active Indicator */}
            {selectedCategory === category.id && (
              <div className="absolute top-2 right-2">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 shadow-md"></div>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Stats Section */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl bg-gradient-to-r from-purple-50/80 to-blue-50/80 p-6 border border-purple-100/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 p-2">
              <Music className="h-5 w-5 text-white" />
            </div>
            <div className="text-lg font-semibold text-gray-900">乐器种类</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
            {categories.length - 1}
          </div>
          <div className="text-sm text-gray-600 mt-1">种不同乐器</div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-blue-50/80 to-cyan-50/80 p-6 border border-blue-100/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 p-2">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div className="text-lg font-semibold text-gray-900">当前筛选</div>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            {categories.find(c => c.id === selectedCategory)?.name || '全部'}
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {selectedCategory === 'all' ? '所有视频' : `${categories.find(c => c.id === selectedCategory)?.count} 个作品`}
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-r from-cyan-50/80 to-teal-50/80 p-6 border border-cyan-100/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="rounded-xl bg-gradient-to-r from-cyan-600 to-teal-600 p-2">
              <div className="h-5 w-5 text-white font-bold text-center">👥</div>
            </div>
            <div className="text-lg font-semibold text-gray-900">参与家庭</div>
          </div>
          <div className="text-3xl font-bold bg-gradient-to-r from-cyan-700 to-teal-600 bg-clip-text text-transparent">
            {new Set(videos.map(v => v.performer)).size}
          </div>
          <div className="text-sm text-gray-600 mt-1">个家庭参与</div>
        </div>
      </div>
    </div>
  )
}