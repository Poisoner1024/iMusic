'use client'

import { useState } from 'react'
import { Filter, Music } from 'lucide-react'
import { Video } from '@/types'
import { getCategories } from '@/lib/data'

interface VideoCategoryFilterProps {
  videos: Video[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
}

/**
 * 简化的乐器筛选组件 - 作为视频板块的子元素
 * 从属于精选视频，保障布局一致性
 */
export function VideoCategoryFilter({ videos, selectedCategory, onCategoryChange }: VideoCategoryFilterProps) {
  const categories = getCategories(videos)

  return (
    <div className="mb-6 md:mb-8">
      {/* Filter Header - 从属于精选视频 */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-4 md:mb-6 pb-3 md:pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="rounded-2xl bg-gradient-to-r from-purple-600 to-blue-600 p-2 shadow-md">
            <Filter className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3">
            <h3 className="text-lg md:text-xl font-bold text-gray-900">
              乐器筛选
            </h3>
            <span className="hidden sm:block text-sm text-gray-500">
              按乐器类型筛选视频
            </span>
          </div>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 text-xs md:text-sm text-gray-600">
          <Music className="h-3 w-3 md:h-4 md:w-4 text-purple-600" />
          <span>{categories.length - 1} 种乐器</span>
        </div>
      </div>

      {/* Category Grid - 移动端优化为可滚动 */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-8 gap-2 md:gap-3 min-w-max sm:min-w-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`group relative p-2 md:p-3 rounded-xl md:rounded-2xl border transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                selectedCategory === category.id
                  ? 'border-purple-500 bg-gradient-to-r from-purple-50/80 to-blue-50/80 shadow-md'
                  : 'border-gray-200/60 bg-white/80 backdrop-blur-sm hover:border-purple-300'
              }`}
            >
              <div className="text-center">
                <div className={`text-xl md:text-2xl mb-0.5 md:mb-1 transition-transform duration-300 group-hover:scale-110 ${
                  selectedCategory === category.id ? 'scale-110' : ''
                }`}>
                  {category.icon}
                </div>
                <div className={`text-xs font-semibold transition-colors duration-300 leading-tight ${
                  selectedCategory === category.id
                    ? 'text-purple-700'
                    : 'text-gray-700 group-hover:text-purple-600'
                }`}>
                  {category.name}
                </div>
                <div className={`hidden sm:block text-xs font-medium transition-colors duration-300 ${
                  selectedCategory === category.id
                    ? 'text-purple-600'
                    : 'text-gray-500 group-hover:text-purple-500'
                }`}>
                  {category.count}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Info - 移动端优化 */}
      {selectedCategory !== 'all' && (
        <div className="mt-3 md:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-purple-700 font-medium">
              当前筛选:
            </span>
            <span className="px-2 md:px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs md:text-sm font-semibold">
              {categories.find(c => c.id === selectedCategory)?.name}
            </span>
          </div>
          <button
            onClick={() => onCategoryChange('all')}
            className="text-xs md:text-sm text-purple-600 hover:text-purple-700 font-medium self-start sm:self-auto"
          >
            清除筛选
          </button>
        </div>
      )}
    </div>
  )
}
