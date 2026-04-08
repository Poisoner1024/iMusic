# IM公益声传社团 - iMusic项目

让每个家庭享受音乐的美好。IM公益声传社团致力于为每一个热爱音乐的家庭提供学习和交流的平台。

## 项目简介

这是一个基于Next.js的音乐视频分享平台，允许用户上传、观看和分享音乐表演视频。项目采用腾讯云作为后端服务，包括对象存储（COS）和PostgreSQL数据库。

### 主要特性

- 🎵 视频上传与播放
- 👨‍👩‍👧‍👦 家庭音乐分享
- 🎸 多乐器分类支持
- ☁️ 腾讯云后端存储
- 📱 响应式设计
- 🔒 安全的文件上传
- 🎬 视频转码和缩略图生成

## 技术栈

### 前端
- **Next.js 14** - React框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库

### 后端
- **腾讯云COS** - 对象存储服务（视频文件）
- **腾讯云PostgreSQL** - 数据库服务
- **腾讯云SCF** - 云函数（视频处理）
- **Next.js API Routes** - API接口

## 快速开始

### 环境要求

- Node.js 18.0+
- npm或yarn包管理器
- 腾讯云账号（用于生产环境部署）

### 安装步骤

1. **克隆项目**

```bash
git clone <repository-url>
cd imusic
```

2. **安装依赖**

```bash
npm install
# 或
yarn install
```

3. **配置环境变量**

创建`.env.local`文件，参考`.env.example`：

```env
# 数据库配置
DATABASE_URL=postgresql://user:password@host:port/dbname

# 腾讯云COS配置
COS_SECRET_ID=your_tencentcloud_secret_id
COS_SECRET_KEY=your_tencentcloud_secret_key
COS_BUCKET=your_cos_bucket_name
COS_REGION=ap-shanghai

# 腾讯云SCF配置
TENCENTCLOUD_REGION=ap-shanghai
```

4. **初始化数据库**

```bash
# 确保DATABASE_URL环境变量已设置
npm run db:init
```

5. **启动开发服务器**

```bash
npm run dev
```

打开[http://localhost:3000](http://localhost:3000)查看应用。

## 项目结构

```
imusic/
├── app/                      # Next.js 13+ app目录
│   ├── api/                  # API路由
│   │   └── videos/           # 视频相关API
│   ├── upload/               # 视频上传页面
│   ├── video/[id]/           # 视频详情页
│   └── ...                   # 其他页面
├── components/               # React组件
│   ├── DesignSystem/         # 设计系统组件
│   ├── Header.tsx            # 头部导航
│   ├── VideoCard.tsx         # 视频卡片组件
│   └── ...
├── lib/                      # 工具库
│   ├── tencentcloud/         # 腾讯云SDK封装
│   │   ├── cos.ts            # COS对象存储
│   │   ├── db.ts             # 数据库连接
│   │   └── scf.ts            # SCF云函数
│   ├── data.ts               # Mock数据
│   └── videoStore.ts         # 本地存储管理
├── types/                    # TypeScript类型定义
├── public/                   # 静态资源
├── scripts/                  # 构建和部署脚本
└── docs/                     # 文档
```

## 后端实现详解

### 1. 数据库设计

项目使用PostgreSQL存储视频元数据，包含以下表：

#### videos表
- `id` - 视频唯一标识
- `title` - 视频标题
- `description` - 视频描述
- `video_url` - 视频URL
- `video_key` - COS存储键
- `thumbnail_url` - 缩略图URL
- `performer` - 表演者
- `instrument_category` - 乐器分类
- `duration` - 视频时长
- `views` - 观看次数
- `likes` - 点赞数
- `status` - 处理状态 (processing/published/failed)
- `tags` - 标签数组
- `uploaded_at` - 上传时间

### 2. 文件上传流程

上传流程采用分步处理，确保大文件上传的稳定性：

```
┌─────────────┐
│  用户选择视频  │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ 1. 获取预签名上传URL  │
│    POST /api/videos   │
│       /upload-url     │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 2. 上传视频到COS     │
│    PUT 预签名URL      │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 3. 创建视频记录      │
│    POST /api/videos   │
│    (状态: processing) │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 4. SCF触发视频处理   │
│    - 转码            │
│    - 生成缩略图      │
│    - 提取时长        │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ 5. 更新状态为published│
│    视频可播放        │
└──────────────────────┘
```

### 3. 视频处理（SCF云函数）

SCF云函数负责视频后处理，包括：

- **视频转码** - 转换为适合网页播放的格式（如H.264）
- **缩略图生成** - 从视频中截取封面图片
- **时长提取** - 读取视频元数据获取时长
- **元数据更新** - 将处理结果写回数据库

详见`lib/tencentcloud/scf.ts`

### 4. API接口清单

#### 视频列表
- `GET /api/videos` - 获取视频列表

#### 视频详情
- `GET /api/videos/[id]` - 获取单个视频详情
- `POST /api/videos/[id]/views` - 增加观看次数
- `POST /api/videos/[id]/likes` - 增加点赞数

#### 视频上传
- `POST /api/videos/upload-url` - 获取COS上传凭证
- `POST /api/videos` - 创建视频记录

## 配置腾讯云

### 1. COS对象存储

1. 登录[腾讯云控制台](https://console.cloud.tencent.com/)
2. 创建存储桶（Bucket）
3. 配置CORS规则：
   ```xml
   <CORSRule>
       <AllowedOrigin>http://localhost:3000</AllowedOrigin>
       <AllowedMethod>PUT</AllowedMethod>
       <AllowedMethod>GET</AllowedMethod>
       <AllowedHeader>*</AllowedHeader>
   </CORSRule>
   ```

### 2. PostgreSQL数据库

1. 创建PostgreSQL实例
2. 获取连接字符串
3. 执行初始化SQL：`lib/db/init.sql`

### 3. SCF云函数

1. 创建云函数
2. 上传处理代码：`lib/tencentcloud/scf.ts`
3. 配置触发器（COS触发）
4. 设置环境变量

详细配置步骤请查看[腾讯云部署指南](docs/TENCENTCLOUD_SETUP.md)

## 开发指南

### 添加新功能

1. **创建API路由** - 在`app/api/`目录下创建新路由
2. **创建页面** - 在`app/`目录下创建新页面
3. **创建组件** - 在`components/`目录下创建React组件
4. **添加类型** - 在`types/`目录下定义TypeScript类型

### 代码规范

- 使用TypeScript，确保类型安全
- 组件使用函数组件和Hooks
- API路由使用Next.js 13+规范
- 使用Tailwind CSS进行样式设计

## 部署

### 部署到腾讯云

```bash
# 1. 安装依赖
npm install

# 2. 构建项目
npm run build

# 3. 部署到腾讯云（使用AnyDev或CloudStudio）
npm run deploy:tencentcloud
```

### 环境变量配置

确保生产环境配置了正确的环境变量：

```env
# 数据库
DATABASE_URL=postgresql://...

# 腾讯云COS
COS_SECRET_ID=...
COS_SECRET_KEY=...
COS_BUCKET=imusic-videos
COS_REGION=ap-shanghai

# 应用配置
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## 开发任务清单

后端数据存储相关任务已完成：

- [x] 腾讯云COS集成 - 视频文件存储
- [x] 腾讯云PostgreSQL集成 - 视频元数据存储
- [x] 腾讯云SCF云函数 - 视频处理（转码、缩略图生成）
- [x] 视频上传API - 分步上传流程
- [x] 视频列表API - 支持分页和筛选
- [x] 视频详情API - 支持观看统计
- [x] 前端上传页面 - 完整的用户界面
- [x] 前端视频详情页 - 支持后端数据
- [x] 前端首页视频列表 - 支持后端数据
- [x] 错误处理和fallback机制

前端页面任务：
- [x] 首页（视频列表）
- [x] 视频上传页面
- [x] 视频详情页面
- [x] 会员档案墙
- [x] 活动剪影（图片画廊）
- [x] 关于我们
- [x] 社团愿景
- [x] 公益活动
- [x] 音乐课堂
- [x] 联系我们

待完成任务：
- [ ] 用户认证系统
- [ ] 评论功能
- [ ] 搜索功能
- [ ] 视频分类筛选优化
- [ ] 管理员后台

详见[开发任务清单](docs/IM公益声传社团-开发任务清单.md)

## 常见问题

### Q: 视频上传失败怎么办？

A: 检查以下事项：
1. COS凭证是否正确配置
2. 文件大小是否超过限制（默认100MB）
3. 网络连接是否稳定
4. 查看浏览器控制台和网络请求详情

### Q: 视频处理状态一直显示"processing"？

A: 可能原因：
1. SCF云函数未正确触发
2. 视频格式不支持
3. 查看SCF日志排查问题

### Q: 如何修改视频上传大小限制？

A: 在`app/api/videos/upload-url/route.ts`中修改：
```typescript
const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
```

### Q: 如何添加新的乐器分类？

A: 1. 在`app/upload/page.tsx`的`instruments`数组中添加
2. 在数据库`videos`表的`instrument_category`字段中添加相应值

## 贡献

欢迎提交Issue和Pull Request来改进项目！

## 许可证

MIT License

## 联系我们

如有问题或建议，请联系：

- 项目地址：[GitHub Repository](https://github.com/your-username/imusic)
- 邮箱：contact@imusic.org

---

**让每个家庭享受音乐的美好** 🎵

*IM公益声传社团 - 用音乐连接家庭与社区*
