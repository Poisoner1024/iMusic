# IM 公益声传社团

> 让每个家庭都能享受音乐的美好，MUSIC HAPPY TO LIFE HAPPINESS

## 核心理念

### 使命
把音乐快乐带给每个家庭

### 愿景
MUSIC HAPPY TO LIFE HAPPINESS

### 理念
言传不如身教，身教不如境教

### 价值观
向前一步

## 核心活动

### 1. 吉他公益课开设
- 核心：公益 NO PROFIT
- 建设公益师资资源
- 美好的愿景

### 2. 组建家庭乐团 & 音乐会
- 各种形式多元化多样化
- 伟大的使命

### 3. 会员分享
- 分享加入声传公益社团的心路点滴
- enjoy 家庭音乐

### 4. 共同见证成长
- 所有热爱音乐的专业音乐人
- 亲子音乐家庭
- 共同见证 IM 的成长之路

### 5. 心中有爱，眼中有光
- 期待所有的会员，心中有爱❤️
- 眼中有光✨
- 共同迎接美好的未来

## 功能特性

### 🎵 视频展示
- 精美的视频卡片展示
- 支持多种乐器分类（钢琴、吉他、大提琴等）
- 响应式设计，适配各种设备
- 视频播放页面的详细信息展示

### 📤 视频上传
- 分步式上传流程
- 支持视频信息编辑
- 乐器类型选择
- 标签管理

### 🔍 分类筛选
- 按乐器类型筛选视频
- 实时更新视频数量
- 流畅的切换动画

### 📊 数据统计
- 视频观看次数
- 点赞数统计
- 演奏者信息展示

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **UI 组件**: React 18
- **样式**: Tailwind CSS
- **语言**: TypeScript
- **图标**: Lucide React
- **图片**: Next.js Image Optimization

## 开始使用

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
npm run build
npm start
```

## 项目结构

```
iMusic/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── video/            # 视频详情页
│   │   └── [id]/
│   │       └── page.tsx
│   └── upload/           # 视频上传页
│       └── page.tsx
├── components/            # React 组件
│   ├── VideoCard.tsx     # 视频卡片组件
│   ├── Header.tsx        # 头部导航
│   └── CategoryFilter.tsx # 分类筛选器
├── lib/                  # 工具函数和数据
│   ├── utils.ts          # 通用工具
│   └── data.ts           # 模拟数据
├── types/                # TypeScript 类型定义
│   └── index.ts
└── public/               # 静态资源
```

## 未来计划

- [ ] 用户认证系统
- [ ] 视频文件存储（集成云存储服务）
- [ ] 视频转码和处理
- [ ] 评论系统
- [ ] 用户关注功能
- [ ] 视频搜索功能
- [ ] 个人主页
- [ ] 数据分析仪表盘
- [ ] 移动端 App
- [ ] 实时通知系统

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
