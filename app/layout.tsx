import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IM公益声传 - 音乐驱动家庭美好',
  description: '让每个家庭享受音乐的美好，通过音乐连接社区，传递温暖与希望',
  keywords: '公益音乐,家庭乐团,社区活动,音乐教育,IM公益声传',
  openGraph: {
    title: 'IM公益声传 - 音乐驱动家庭美好',
    description: '让每个家庭享受音乐的美好，通过音乐连接社区，传递温暖与希望',
    type: 'website',
    locale: 'zh_CN',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  )
}