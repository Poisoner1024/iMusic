import { Video } from '@/types'
import { mockVideos } from './data'

// 本地存储的键名
const STORAGE_KEY = 'imusic_videos'

// 获取所有视频
export function getVideos(): Video[] {
  if (typeof window === 'undefined') return mockVideos
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
    // 如果没有存储的数据，初始化为 mockVideos
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockVideos))
    return mockVideos
  } catch (error) {
    console.error('Error loading videos:', error)
    return mockVideos
  }
}

// 添加新视频
export function addVideo(video: Video): void {
  if (typeof window === 'undefined') return
  
  try {
    const videos = getVideos()
    const newVideos = [video, ...videos]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newVideos))
  } catch (error) {
    console.error('Error adding video:', error)
  }
}

// 重置为默认数据
export function resetVideos(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockVideos))
  } catch (error) {
    console.error('Error resetting videos:', error)
  }
}
