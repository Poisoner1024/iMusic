// 活动剪影数据
export interface GalleryImage {
  id: string
  src: string
  title: string
  description: string
  category: 'teaching' | 'performance' | 'party' | 'charity' | 'family'
  date: string
}

export const galleryImages: GalleryImage[] = [
  // 社团活动
  {
    id: '1',
    src: '/images/gallery/page2_img4.jpeg',
    title: '社团大合影',
    description: 'IM公益声传社团大家庭的温馨合影，记录美好时光',
    category: 'party',
    date: '2024-01-20'
  },
  {
    id: '2',
    src: '/images/gallery/page10_img4.jpeg',
    title: '生日音乐派对',
    description: '在温馨的生日聚会上，用吉他弹奏祝福',
    category: 'party',
    date: '2024-03-05'
  },
  {
    id: '3',
    src: '/images/gallery/page10_img5.jpeg',
    title: '聚餐合影',
    description: '社团成员欢乐聚餐，分享音乐与生活',
    category: 'party',
    date: '2024-03-01'
  },
  
  // 舞台演出
  {
    id: '4',
    src: '/images/gallery/page3_img4.jpeg',
    title: '舞台合奏',
    description: '吉他与二胡的完美合奏，展现中西音乐融合之美',
    category: 'performance',
    date: '2024-02-20'
  },
  
  // 公益授课
  {
    id: '5',
    src: '/images/gallery/page7_img7.jpeg',
    title: '吉他练习',
    description: '专注的吉他练习，享受音乐学习的过程',
    category: 'teaching',
    date: '2024-01-10'
  },
  {
    id: '6',
    src: '/images/gallery/page7_img8.jpeg',
    title: '户外吉他练习',
    description: '在自然环境中练习吉他，感受音乐与自然的融合',
    category: 'teaching',
    date: '2024-01-08'
  },
  {
    id: '7',
    src: '/images/gallery/page7_img9.jpeg',
    title: '双人吉他练习',
    description: '户外双人吉他练习，互相学习共同进步',
    category: 'teaching',
    date: '2024-01-05'
  },
  {
    id: '8',
    src: '/images/gallery/page9_img2.jpeg',
    title: '音乐表演',
    description: '小女孩与老师的温馨音乐表演',
    category: 'teaching',
    date: '2024-02-15'
  },
  {
    id: '9',
    src: '/images/gallery/page9_img3.jpeg',
    title: '儿童合奏',
    description: '大提琴与二胡的儿童合奏表演',
    category: 'teaching',
    date: '2024-02-10'
  },
  {
    id: '10',
    src: '/images/gallery/page9_img4.jpeg',
    title: '单簧管演奏',
    description: '小男孩专注的单簧管演奏',
    category: 'teaching',
    date: '2024-02-08'
  },
  {
    id: '11',
    src: '/images/gallery/page9_img10.jpeg',
    title: '儿童演唱',
    description: '小女孩自信的演唱表演',
    category: 'teaching',
    date: '2024-02-05'
  },
  
  // 家庭音乐
  {
    id: '12',
    src: '/images/gallery/page11_img2.jpeg',
    title: '家庭音乐时光',
    description: '一家人在一起享受音乐的美好时光',
    category: 'family',
    date: '2024-02-25'
  },
  {
    id: '13',
    src: '/images/gallery/page11_img2.jpeg',
    title: '家庭音乐练习',
    description: '二胡与手风琴的家庭音乐练习',
    category: 'family',
    date: '2024-03-10'
  },
  
  // 儿童乐队
  {
    id: '14',
    src: '/images/gallery/page11_img4.jpeg',
    title: '儿童乐队合奏',
    description: '多位小朋友组成的乐队合奏表演',
    category: 'performance',
    date: '2024-03-08'
  },
  
  // 户外活动
  {
    id: '15',
    src: '/images/gallery/page8_img5.jpeg',
    title: '户外音乐活动',
    description: '在蓝天白云下，孩子们演奏二胡和吉他',
    category: 'charity',
    date: '2024-02-15'
  },
  {
    id: '16',
    src: '/images/gallery/page11_img5.jpeg',
    title: '活动主持',
    description: '社团活动中的主持与互动',
    category: 'party',
    date: '2024-03-12'
  }
]

// 分类定义
export const galleryCategories = [
  { id: 'all', name: '全部', icon: '📸' },
  { id: 'teaching', name: '公益授课', icon: '🎸' },
  { id: 'performance', name: '舞台演出', icon: '🎭' },
  { id: 'party', name: '社团活动', icon: '🎉' },
  { id: 'family', name: '家庭音乐', icon: '👨‍👩‍👧‍👦' },
  { id: 'charity', name: '公益活动', icon: '❤️' }
]

// 根据分类获取图片
export function getImagesByCategory(category: string): GalleryImage[] {
  if (category === 'all') return galleryImages
  return galleryImages.filter(img => img.category === category)
}
