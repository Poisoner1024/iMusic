import { Video } from '@/types'

// 默认视频数据
export const mockVideos: Video[] = [
  {
    id: '1',
    title: '家庭钢琴合奏 - 致爱丽丝',
    description: '一家三口的温馨钢琴演奏，展现家庭音乐的和谐之美',
    thumbnail: '/images/thumbnails/piano-family.svg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    performer: '张家庭',
    duration: '5:30',
    uploadedAt: '2024-01-15',
    views: 1234,
    likes: 89,
    category: 'piano',
    tags: ['钢琴', '家庭', '合奏', '贝多芬']
  },
  {
    id: '2',
    title: '吉他弹唱 - 时光倒流',
    description: '温馨的吉他弹唱，记录美好时光',
    thumbnail: '/images/thumbnails/guitar-singing.svg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    performer: '李明',
    duration: '4:15',
    uploadedAt: '2024-01-10',
    views: 892,
    likes: 67,
    category: 'guitar',
    tags: ['吉他', '弹唱', '流行']
  },
  {
    id: '3',
    title: '大提琴独奏 - 四季春',
    description: '优美的大提琴独奏，感受春天的气息',
    thumbnail: '/images/thumbnails/cello.svg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    performer: '王小雅',
    duration: '6:20',
    uploadedAt: '2024-01-08',
    views: 2341,
    likes: 156,
    category: 'violin',
    tags: ['大提琴', '古典', '维瓦尔第']
  },
  {
    id: '4',
    title: '架子鼓表演 - 激情燃烧',
    description: '充满活力的架子鼓演奏，展现年轻活力',
    thumbnail: '/images/thumbnails/drums.svg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    performer: '陈子轩',
    duration: '3:45',
    uploadedAt: '2024-01-05',
    views: 567,
    likes: 43,
    category: 'drum',
    tags: ['架子鼓', '摇滚', '年轻']
  },
  {
    id: '5',
    title: '二胡演奏 - 高山流水',
    description: '传统二胡演奏，传承中华文化',
    thumbnail: '/images/thumbnails/erhu.svg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    performer: '刘诗韵',
    duration: '7:10',
    uploadedAt: '2024-01-03',
    views: 3456,
    likes: 234,
    category: 'guzheng',
    tags: ['二胡', '传统', '经典']
  },
  {
    id: '6',
    title: '家庭合唱 - 温馨家园',
    description: '全家一起合唱，传递爱与温暖',
    thumbnail: '/images/thumbnails/choir.svg',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    performer: '王家庭',
    duration: '4:50',
    uploadedAt: '2024-01-01',
    views: 4567,
    likes: 321,
    category: 'vocal',
    tags: ['合唱', '家庭', '温馨']
  },
]

// 根据视频数据动态生成分类
export function getCategories(videos: Video[] = []) {
  // 安全检查：确保videos是数组
  const safeVideos = Array.isArray(videos) ? videos : []
  
  const categories = [
    { id: 'all', name: '全部', icon: '🎵', count: safeVideos.length },
    { id: 'piano', name: '钢琴', icon: '🎹', count: safeVideos.filter(v => v.category === 'piano').length },
    { id: 'guitar', name: '吉他', icon: '🎸', count: safeVideos.filter(v => v.category === 'guitar').length },
    { id: 'violin', name: '大提琴', icon: '🎻', count: safeVideos.filter(v => v.category === 'violin').length },
    { id: 'drum', name: '架子鼓', icon: '🥁', count: safeVideos.filter(v => v.category === 'drum').length },
    { id: 'guzheng', name: '二胡', icon: '🪕', count: safeVideos.filter(v => v.category === 'guzheng').length },
    { id: 'vocal', name: '声乐', icon: '🎤', count: safeVideos.filter(v => v.category === 'vocal').length },
  ]
  return categories
}

// 默认分类（用于初始化）
export const categories = getCategories(mockVideos)