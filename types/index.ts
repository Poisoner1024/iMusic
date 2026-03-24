export interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  videoUrl: string
  performer: string
  instrument: string
  duration: string
  uploadedAt: string
  views: number
  likes: number
  category: string
  tags: string[]
}

export interface Category {
  id: string
  name: string
  icon: string
  count: number
}
