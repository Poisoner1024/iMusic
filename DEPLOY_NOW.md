# 🚀 iMusic 立即部署到 EdgeOne Pages

## ✅ 部署准备完成

项目已成功构建，部署包已创建完成。

### 📦 部署包信息
- **文件**: `imusic-deployment.zip`
- **位置**: `/workspace/iMusic/imusic-deployment.zip`
- **内容**: 包含构建后的 Next.js 应用、依赖配置和静态资源

### 🔑 环境变量清单

以下环境变量需要在 EdgeOne Pages 控制台配置：

| 变量名 | 值 | 类型 |
|--------|-----|------|
| DATABASE_URL | postgresql://imusic_user:********@sh-postgres-6bpqmb8q.sql.tencentcdb.com:21079/imusic_db | 普通变量 |
| COS_SECRET_ID | ******** | **敏感变量** |
| COS_SECRET_KEY | ******** | **敏感变量** |
| COS_BUCKET | imusic-videos-iris-1390612299 | 普通变量 |
| COS_REGION | ap-shanghai | 普通变量 |
| VIDEO_PROCESS_NAME | iMusic-processing | 普通变量 |
| NEXT_PUBLIC_APP_URL | https://your-domain.pages.edgeone.site | 普通变量 |
| MAX_FILE_SIZE | 104857600 | 普通变量 |

⚠️ **重要**：`COS_SECRET_ID` 和 `COS_SECRET_KEY` 必须设置为**敏感变量**

---

## 🎯 立即开始部署

### 方式一：通过腾讯云控制台部署（推荐）

#### 步骤 1: 访问 EdgeOne Pages

1. 打开浏览器访问：https://console.cloud.tencent.com/edgeone/pages
2. 使用腾讯云账号登录

#### 步骤 2: 创建项目

1. 点击「**新建项目**」按钮
2. 选择「**本地上传 ZIP 包**」
3. 上传文件：`/workspace/iMusic/imusic-deployment.zip`
4. 填写项目信息：
   - **项目名称**: `imusic`
   - **框架预设**: `Next.js`

#### 步骤 3: 配置构建设置

在「构建设置」页面填写：

```
构建命令: npm run build
输出目录: .next
安装命令: npm install
Node.js 版本: 18.x
```

#### 步骤 4: 添加环境变量

在「环境变量」部分，点击「添加变量」，逐个添加上述 8 个环境变量。

**关键设置**：
- `COS_SECRET_ID` → 勾选「敏感变量」
- `COS_SECRET_KEY` → 勾选「敏感变量」

#### 步骤 5: 配置数据库白名单（重要）

在部署之前，必须配置 PostgreSQL 数据库白名单：

1. 访问腾讯云 PostgreSQL 控制台
2. 找到实例：`sh-postgres-6bpqmb8q.sql.tencentcdb.com`
3. 进入「安全组」或「白名单」设置
4. 添加 EdgeOne Pages 的 IP 段：
   - 临时方案（测试用）：`0.0.0.0/0`
   - 生产方案：咨询腾讯云获取 EdgeOne Pages 的具体 IP 段

#### 步骤 6: 配置 COS CORS（重要）

确保 COS 存储桶允许 EdgeOne Pages 访问：

1. 访问腾讯云 COS 控制台
2. 选择存储桶：`imusic-videos-iris-1390612299`
3. 进入「安全管理」→「跨域访问 CORS 设置」
4. 添加规则：
   - **来源 Origin**: `https://*.pages.edgeone.site`
   - **操作 Methods**: 勾选全部（GET, PUT, POST, DELETE, HEAD）
   - **Allow-Headers**: `*`
   - **Expose-Headers**: `ETag, x-cos-request-id`

#### 步骤 7: 部署应用

1. 点击「**部署**」按钮
2. 等待构建和部署完成（通常 3-8 分钟）
3. 查看构建日志，确保没有错误

#### 步骤 8: 更新环境变量并重新部署

1. 部署成功后，获取分配的域名（格式：`xxxxx.pages.edgeone.site`）
2. 进入「项目设置」→「环境变量」
3. 修改 `NEXT_PUBLIC_APP_URL` 为实际域名
4. 点击「重新部署」

---

### 方式二：通过 Git 仓库自动部署

#### 步骤 1: 推送代码到 Git 仓库

```bash
cd /workspace/iMusic

# 初始化 Git（如果还没初始化）
git init

# 添加文件（确保 .env.local 在 .gitignore 中）
git add .

# 提交代码
git commit -m "Initial commit: iMusic project"

# 推送到 GitHub/GitLab/Coding
# 需要先创建远程仓库

git remote add origin https://github.com/your-username/imusic.git
git push -u origin main
```

#### 步骤 2: 在 EdgeOne Pages 中连接仓库

1. 访问 EdgeOne Pages 控制台
2. 点击「**新建项目**」
3. 选择「**从代码仓库导入**」
4. 授权并选择你的 Git 仓库
5. 配置构建设置（同方式一）
6. 配置环境变量（同方式一）
7. 点击「部署」

---

## 🔍 部署后验证

### 基础功能验证
- [ ] 访问首页：`https://xxxxx.pages.edgeone.site`
- [ ] 视频列表正常显示
- [ ] 缩略图加载正常
- [ ] 点击视频进入详情页
- [ ] 视频播放正常

### 核心功能验证
- [ ] 视频上传功能正常
- [ ] 上传后文件出现在 COS
- [ ] SCF 触发处理视频
- [ ] 数据库记录更新
- [ ] 处理完成后显示缩略图和时长

### 性能验证
- [ ] 首页加载 < 3 秒
- [ ] 视频播放流畅
- [ ] 移动端访问正常

---

## 🐛 常见问题快速解决

### 问题 1: 部署失败，提示 "Build failed"

**解决步骤**：
1. 检查 Node.js 版本是否设置为 18.x
2. 查看构建日志中的具体错误信息
3. 确认所有环境变量已正确添加

### 问题 2: 网站无法连接数据库

**错误信息**：`Connection refused` 或 `Timeout`

**解决步骤**：
1. 检查 PostgreSQL 白名单是否配置
2. 确认 DATABASE_URL 格式正确
3. 测试本地连接：`psql "$DATABASE_URL" -c "SELECT 1;"`

### 问题 3: 视频上传失败

**错误信息**：`403 Forbidden` 或 `AccessDenied`

**解决步骤**：
1. 检查 COS_SECRET_ID/KEY 是否正确
2. 确认 COS 存储桶存在
3. 检查 CORS 配置是否包含 pages.edgeone.site

### 问题 4: SCF 未触发

**症状**：视频上传成功，但未处理

**解决步骤**：
1. 检查 SCF 触发器配置
2. 查看 SCF 日志排查错误
3. 确认上传路径为 `videos/original/`

---

## 📞 需要技术支持？

### 腾讯云支持
- **工单支持**：https://console.cloud.tencent.com/workorder/category
- **EdgeOne Pages 文档**：https://cloud.tencent.com/document/product/1552
- **社区论坛**：https://cloud.tencent.com/developer/forums

### 自助排查
```bash
# 测试数据库连接
cd /workspace/iMusic
psql "$DATABASE_URL" -c "SELECT version();"

# 测试 COS 连接
npm run verify:config

# 查看构建日志
# 在 EdgeOne Pages 控制台查看
```

---

## 🎯 下一步行动

### 立即执行（按顺序）

1. **现在** → 访问 EdgeOne Pages 控制台
2. **5 分钟** → 创建项目并上传部署包
3. **10 分钟** → 配置环境变量（8 个变量）
4. **15 分钟** → 配置数据库白名单和 COS CORS
5. **20 分钟** → 部署应用
6. **30 分钟** → 验证所有功能

### 预计时间
- **首次部署**：30-60 分钟
- **后续更新**：5-10 分钟（通过 Git 自动部署）

---

## 📚 相关文档

- **详细部署指南**：`/workspace/iMusic/DEPLOYMENT_GUIDE.md`
- **部署清单**：`/workspace/iMusic/EDGEONE_DEPLOYMENT_CHECKLIST.md`
- **环境变量配置**：`/workspace/iMusic/edgeone-env-config.json`

---

## ✅ 部署前最终检查

在开始部署前，请确认：

- [ ] 已访问 EdgeOne Pages 控制台
- [ ] 已准备好部署包 `imusic-deployment.zip`
- [ ] 已准备好 8 个环境变量
- [ ] 已配置数据库白名单（或准备配置）
- [ ] 已配置 COS CORS（或准备配置）
- [ ] SCF 云函数已部署

**一切准备就绪！开始部署吧 🚀**
