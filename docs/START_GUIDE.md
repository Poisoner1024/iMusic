# iMusic 项目启动指南

## 🚀 快速启动

### 方式 1：在本地终端启动（推荐）

#### 1. 安装依赖
```bash
cd /workspace/iMusic
npm install
```

#### 2. 启动开发服务器
```bash
npm run dev
```

#### 3. 打开浏览器
访问：**http://localhost:3000**

### 方式 2：在生产模式下启动

```bash
npm run build
npm start
```

然后访问：**http://localhost:3000**

---

## ⏹️ 停止项目运营

### 方式 1：在终端中停止（推荐）

在运行项目的终端窗口中，按：
```
Ctrl + C
```
然后输入 `y` 确认停止。

### 方式 2：通过进程管理停止

如果终端已关闭或无法访问，可以通过以下命令停止：

#### 查找并停止 Next.js 进程
```bash
# 查找占用 3000 端口的进程
lsof -i :3000

# 停止指定进程（将 <PID> 替换为实际的进程ID）
kill -9 <PID>
```

#### 一键停止所有 Node.js 进程
```bash
# 停止所有与 iMusic 相关的进程
pkill -f "next"

# 或停止所有 Node 进程（慎用）
pkill -9 node
```

### 方式 3：使用系统工具停止

#### macOS / Linux
```bash
# 查找并停止
ps aux | grep next
kill -9 <进程ID>
```

#### Windows
```cmd
# 查找端口占用
netstat -ano | findstr :3000

# 停止进程（将 <PID> 替换为实际的进程ID）
taskkill /PID <PID> /F
```

### 验证项目已停止

```bash
# 检查端口是否释放
curl http://localhost:3000
# 如果显示 "Failed to connect" 则表示已停止
```



## 📱 功能测试

### 测试视频上传功能

1. **访问上传页面**
   - 点击首页右上角"发布视频"按钮
   - 或直接访问：http://localhost:3000/upload

2. **上传视频**
   - 点击"选择文件"或拖拽视频文件
   - 填写标题和演奏者（必填）
   - 选择乐器类型
   - 点击"发布视频"

3. **查看结果**
   - 等待 2 秒上传完成
   - 点击"返回首页"
   - 检查新上传的视频是否显示在列表顶部

## 🔍 调试工具

### 查看视频数据
在浏览器控制台执行：
```javascript
JSON.parse(localStorage.getItem('imusic_videos'))
```

### 重置视频数据
```javascript
localStorage.removeItem('imusic_videos')
location.reload()
```

## ⚠️ 常见问题

### 端口被占用
如果 3000 端口被占用，Next.js 会自动使用 3001、3002 等端口。

### 依赖安装失败
尝试使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

### 无法上传视频
检查浏览器控制台是否有错误信息，确保所有依赖已正确安装。

## 📊 项目结构

```
iMusic/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页（视频列表）
│   ├── layout.tsx         # 根布局
│   ├── globals.css        # 全局样式
│   ├── video/            # 视频详情页
│   │   └── [id]/
│   │       └── page.tsx
│   ├── upload/           # 视频上传页
│   │   └── page.tsx
│   └── api/             # API 路由
│       └── videos/
│           └── route.ts   # 视频 API
├── components/            # React 组件
│   ├── VideoCard.tsx     # 视频卡片
│   ├── Header.tsx        # 头部导航
│   └── CategoryFilter.tsx # 分类筛选
├── lib/                  # 工具函数和数据
│   ├── utils.ts          # 通用工具
│   ├── data.ts           # 模拟数据
│   └── videoStore.ts    # 视频存储管理
├── types/                # TypeScript 类型定义
│   └── index.ts
├── public/               # 静态资源
├── package.json          # 项目配置
├── tsconfig.json         # TypeScript 配置
├── tailwind.config.ts    # Tailwind CSS 配置
├── next.config.js        # Next.js 配置
├── README.md            # 项目说明
├── UPLOAD_GUIDE.md      # 上传功能指南
└── TEST_CHECKLIST.md    # 测试清单
```

## 🎯 主要功能

### 1. 首页
- 展示所有视频
- 按乐器分类筛选
- 统计数据展示
- 响应式设计

### 2. 视频详情页
- 视频播放器
- 详细信息展示
- 相关视频推荐

### 3. 视频上传页
- 三步式上传流程
- 文件选择和拖拽上传
- 表单验证
- 上传进度显示

### 4. 数据管理
- 本地存储（localStorage）
- 数据持久化
- 多标签页同步

## 📝 技术栈

- **Next.js 14** - React 框架
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式框架
- **Lucide React** - 图标库
- **localStorage** - 数据存储

## 🚀 部署建议

### Vercel（推荐）
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm run build
# 将 .next 文件夹和 public 文件夹上传到 Netlify
```

### 自建服务器
```bash
npm run build
npm start
```

## 📚 相关文档

- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [React 文档](https://react.dev)
- [TypeScript 文档](https://www.typescriptlang.org/docs)

## 💡 提示

1. **首次启动可能需要几分钟** - 需要下载依赖和构建项目
2. **热重载** - 修改代码后页面会自动刷新
3. **开发工具** - 使用浏览器 DevTools 调试
4. **性能优化** - 生产环境使用 `npm run build` 构建

## 🎉 开始使用

现在你可以在浏览器中访问 iMusic，开始上传和分享你的家庭音乐演奏视频了！

有任何问题，请查看 `TEST_CHECKLIST.md` 中的详细测试步骤。
