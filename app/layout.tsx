import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'IM公益声传社团 - 把音乐快乐带给每个家庭',
  description: 'MUSIC HAPPY TO LIFE HAPPINESS - IM公益声传社团由IRIS与MIYA发起，致力于通过音乐让每个家庭感受音乐的快乐，享受生活的幸福',
  keywords: 'IM公益声传,公益音乐,家庭乐团,亲子音乐,吉他公益课,音乐教育,音乐公益',
  openGraph: {
    title: 'IM公益声传社团 - 把音乐快乐带给每个家庭',
    description: 'MUSIC HAPPY TO LIFE HAPPINESS - 言传不如身教，身教不如境教',
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