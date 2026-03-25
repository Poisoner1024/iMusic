import { Search, Plus, Music } from 'lucide-react'
import Link from 'next/link'

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="rounded-full bg-gradient-to-br from-rose-500 to-purple-600 p-2.5 shadow-lg group-hover:shadow-xl transition-shadow">
                <Music className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                IM 公益声传
              </span>
            </Link>
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                首页
              </Link>
              <Link
                href="/gallery"
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                活动剪影
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 text-sm font-medium text-gray-600 rounded-full hover:bg-rose-50 hover:text-rose-600 transition-all"
              >
                关于社团
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
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
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-rose-600 to-purple-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-rose-500/25 hover:shadow-xl hover:shadow-rose-500/30 transition-all hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">发布视频</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
