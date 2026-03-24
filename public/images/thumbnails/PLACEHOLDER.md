# 占位符图片说明

## 需要添加的图片文件

### 视频封面图（thumbnails/）

以下文件需要添加到 `public/images/thumbnails/` 目录：

1. `piano-family.jpg` - 钢琴家庭合奏封面（800x450）
2. `guitar-singing.jpg` - 吉他弹唱封面（800x450）

### 如何添加图片

#### 方法1：手动上传
1. 将图片文件复制到 `public/images/thumbnails/` 目录
2. 确保文件名与代码中的路径一致

#### 方法2：使用在线图片生成
可以访问以下网站生成占位符图片：
- https://placeholder.com/
- https://via.placeholder.com/

例如，创建一个 800x450 的图片：
```
https://via.placeholder.com/800x450/0ea5e9/ffffff?text=Piano+Family
```

#### 方法3：下载免费图片
推荐免费图片网站：
- Unsplash: https://unsplash.com/
- Pexels: https://pexels.com/
- Pixabay: https://pixabay.com/

搜索关键词：piano, guitar, family music

### 临时解决方案

在添加真实图片之前，可以暂时使用外部URL。代码中已经混合使用了本地路径和外部URL：
- 本地路径示例：`/images/thumbnails/piano-family.jpg`
- 外部URL示例：`https://images.unsplash.com/photo-...`

添加本地图片后，记得将对应的视频数据从外部URL改为本地路径。
