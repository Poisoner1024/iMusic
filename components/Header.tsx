import { Search, Plus, Music, Home, Users, Calendar, BookOpen, Star, Heart, Globe, Mail } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="rounded-full bg-gradient-to-br from-rose-500 to-purple-600 p-2.5 shadow-lg group-hover:shadow-xl transition-shadow">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                IM 公益声传
              </span>
            </Link>
            <nav className="hidden lg:flex items-center gap-1">
              <Link
                href="/"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Home className="h-4 w-4 inline mr-1" />
                首页
              </Link>
              <Link
                href="/about"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                关于我们
              </Link>
              <Link
                href="/join"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Users className="h-4 w-4 inline mr-1" />
                加入我们
              </Link>
              <Link
                href="/activities"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Calendar className="h-4 w-4 inline mr-1" />
                活动动态
              </Link>
              <Link
                href="/classes"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <BookOpen className="h-4 w-4 inline mr-1" />
                公益课堂
              </Link>
              <Link
                href="/members"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Star className="h-4 w-4 inline mr-1" />
                会员风采
              </Link>
              <Link
                href="/vision"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Globe className="h-4 w-4 inline mr-1" />
                展望未来
              </Link>
              <Link
                href="/contact"
                className="px-3 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                <Mail className="h-4 w-4 inline mr-1" />
                联系我们
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden xl:flex flex-1 max-w-md mx-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="搜索音乐视频..."
                className="w-full rounded-full border border-gray-200 bg-gray-50 py-2.5 pl-11 pr-4 text-sm focus:border-rose-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/upload"
              className="hidden sm:flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-purple-600 px-4 py-2.5 text-sm font-medium text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span>发布视频</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
