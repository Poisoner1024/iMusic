'use client'

import { ReactNode } from 'react'

// 布局组件
export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`container-max ${className}`}>
      {children}
    </div>
  )
}

export function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`section-padding ${className}`}>
      {children}
    </section>
  )
}

export function HeroSection({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`relative min-h-screen flex items-center justify-center ${className}`}>
      {children}
    </section>
  )
}

// 文字组件
export function Heading1({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h1 className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight ${className}`}>
      {children}
    </h1>
  )
}

export function Heading2({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight ${className}`}>
      {children}
    </h2>
  )
}

export function Heading3({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={`text-2xl md:text-3xl font-bold leading-tight tracking-tight ${className}`}>
      {children}
    </h3>
  )
}

export function BodyText({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-lg leading-relaxed text-gray-700 ${className}`}>
      {children}
    </p>
  )
}

export function Caption({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`text-sm text-gray-500 ${className}`}>
      {children}
    </p>
  )
}

// 数据展示组件
export function StatNumber({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
        {number}
      </div>
      <div className="text-sm font-medium text-gray-600 uppercase tracking-wider">
        {label}
      </div>
    </div>
  )
}

// 标签云组件
export function TagCloud({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {tags.map((tag, index) => (
        <span
          key={tag}
          className="tag-primary animate-float"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

// 引言卡片组件
export function QuoteCard({ 
  quote, 
  author, 
  role, 
  location 
}: { 
  quote: string; 
  author: string; 
  role: string; 
  location: string 
}) {
  return (
    <div className="card-hover p-6">
      <div className="text-4xl text-primary-500 mb-4">"</div>
      <BodyText className="text-gray-800 italic mb-6">
        {quote}
      </BodyText>
      <div className="border-t pt-4">
        <div className="font-semibold text-gray-900">{author}</div>
        <Caption>
          {role} • {location}
        </Caption>
      </div>
    </div>
  )
}

// 项目卡片组件
export function ProgramCard({
  title,
  description,
  highlight,
  image,
  location,
  participants
}: {
  title: string;
  description: string;
  highlight: string;
  image?: string;
  location: string;
  participants: string;
}) {
  return (
    <div className="card-hover overflow-hidden group">
      {image && (
        <div 
          className="h-48 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
          style={{ backgroundImage: `url(${image})` }}
        />
      )}
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <Heading3>{title}</Heading3>
          <span className="tag-secondary text-xs">{location}</span>
        </div>
        
        <BodyText className="text-sm mb-4 line-clamp-3">
          {description}
        </BodyText>
        
        <div className="bg-primary-50 border-l-4 border-primary-500 p-3 mb-4">
          <div className="text-xs font-semibold text-primary-700 uppercase mb-1">
            亮点
          </div>
          <div className="text-sm text-gray-700">{highlight}</div>
        </div>
        
        <Caption className="flex items-center">
          👥 {participants}
        </Caption>
      </div>
    </div>
  )
}

// 网格布局组件
export function GridLayout({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {children}
    </div>
  )
}

export function HeroGrid({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${className}`}>
      {children}
    </div>
  )
}