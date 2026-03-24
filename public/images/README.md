# 图片目录使用说明

## 目录结构

```
public/images/
├── thumbnails/    # 视频封面缩略图
├── avatars/       # 用户头像
├── banners/       # 横幅图片
└── uploads/       # 用户上传的图片
```

## 使用方法

### 1. 在代码中引用本地图片

```typescript
// 方式1：直接使用路径
thumbnail: '/images/thumbnails/video-1.jpg'

// 方式2：使用 Next.js Image 组件
import Image from 'next/image'

<Image
  src="/images/thumbnails/video-1.jpg"
  alt="视频封面"
  width={800}
  height={450}
/>
```

### 2. 图片命名规范

建议使用有意义的文件名，例如：
- `thumbnail-[video-id].jpg`
- `avatar-[user-id].png`
- `banner-[page-name].jpg`

### 3. 图片格式推荐

- **缩略图**: WebP, JPG (压缩质量 80%)
- **头像**: PNG, JPG (尺寸 200x200)
- **横幅**: WebP, JPG (宽度 1920)
- **上传**: 用户可自由选择

### 4. 图片尺寸建议

| 用途 | 尺寸 | 格式 | 说明 |
|------|------|------|------|
| 视频封面 | 800x450 | WebP/JPG | 16:9 比例 |
| 用户头像 | 200x200 | PNG/JPG | 正方形 |
| 页面横幅 | 1920x600 | WebP/JPG | 宽屏横幅 |

### 5. 优化建议

- 使用 WebP 格式以获得更好的压缩率
- 为不同设备提供多尺寸版本
- 使用 Next.js 的 `next/image` 组件自动优化
