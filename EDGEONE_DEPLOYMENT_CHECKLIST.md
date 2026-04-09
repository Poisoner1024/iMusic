# iMusic EdgeOne Pages 部署清单

## ✅ 部署前准备

### 1. 项目构建验证
```bash
cd /workspace/iMusic
npm install  # 确保依赖已安装
npm run build  # 确保构建成功
```

**状态**: ✅ 已通过验证

### 2. 环境变量准备

以下是需要在 EdgeOne Pages 控制台配置的所有环境变量：

```bash
# PostgreSQL 数据库连接
DATABASE_URL=postgresql://imusic_user:********@sh-postgres-6bpqmb8q.sql.tencentcdb.com:21079/imusic_db

# 腾讯云 COS 配置
COS_SECRET_ID=********
COS_SECRET_KEY=********
COS_BUCKET=imusic-videos-iris-1390612299
COS_REGION=ap-shanghai
VIDEO_PROCESS_NAME=iMusic-processing

# 应用配置（部署后需要更新为实际域名）
NEXT_PUBLIC_APP_URL=https://your-domain.pages.edgeone.site
MAX_FILE_SIZE=104857600
```

⚠️ **重要提醒**：部署成功后，需要将 `NEXT_PUBLIC_APP_URL` 更新为实际的 EdgeOne Pages 域名。

---

## 🚀 EdgeOne Pages 部署步骤

### 步骤 1: 登录腾讯云控制台

1. 打开浏览器访问：https://console.cloud.tencent.com/edgeone/pages
2. 使用腾讯云账号登录
3. 确保账号已实名认证

### 步骤 2: 创建新项目

1. 点击「新建项目」按钮
2. 选择「从代码仓库导入」或「本地上传zip包」
   - **推荐**：使用 Git 仓库（GitHub/GitLab/Coding）
   - **备选**：本地打包上传

3. 填写项目信息：
   - **项目名称**：imusic
   - **框架预设**：Next.js
   - **根目录**：/workspace/iMusic

### 步骤 3: 配置构建设置

在「构建设置」页面配置：

```
构建命令：npm run build
输出目录：.next
安装命令：npm install
Node.js 版本：18.x 或 20.x
```

### 步骤 4: 配置环境变量

在「环境变量」部分，点击「添加变量」，逐个添加以下变量：

| 变量名 | 值 | 类型 |
|--------|-----|------|
| DATABASE_URL | postgresql://imusic_user:********@sh-postgres-6bpqmb8q.sql.tencentcdb.com:21079/imusic_db | 普通变量 |
| COS_SECRET_ID | ******** | 敏感变量 |
| COS_SECRET_KEY | ******** | 敏感变量 |
| COS_BUCKET | imusic-videos-iris-1390612299 | 普通变量 |
| COS_REGION | ap-shanghai | 普通变量 |
| VIDEO_PROCESS_NAME | iMusic-processing | 普通变量 |
| NEXT_PUBLIC_APP_URL | https://your-domain.pages.edgeone.site | 普通变量 |
| MAX_FILE_SIZE | 104857600 | 普通变量 |

⚠️ **注意**：将 `COS_SECRET_ID` 和 `COS_SECRET_KEY` 标记为「敏感变量」

### 步骤 5: 配置数据库访问

**重要**：需要配置 PostgreSQL 数据库白名单

1. 登录腾讯云 PostgreSQL 控制台
2. 找到数据库实例：`sh-postgres-6bpqmb8q.sql.tencentcdb.com`
3. 进入「安全组/白名单」设置
4. 添加 EdgeOne Pages 的 IP 段：
   ```
   0.0.0.0/0  # 仅用于测试，生产环境请咨询腾讯云获取具体 IP 段
   ```
   
   **更安全的做法**：联系腾讯云技术支持获取 EdgeOne Pages 的具体出口 IP 段

### 步骤 6: 配置 COS CORS

确保 COS 存储桶已配置 CORS，允许 EdgeOne Pages 域名访问：

1. 登录腾讯云 COS 控制台
2. 选择存储桶：`imusic-videos-iris-1390612299`
3. 进入「安全管理」→「跨域访问 CORS 设置」
4. 添加规则：
   - **来源 Origin**：`https://*.pages.edgeone.site`
   - **操作 Methods**：GET, PUT, POST, DELETE, HEAD
   - **Allow-Headers**：`*`
   - **Expose-Headers**：ETag, x-cos-request-id

### 步骤 7: 启动部署

1. 点击「部署」或「保存并部署」按钮
2. 等待构建完成（通常 3-8 分钟）
3. 查看构建日志，确认无错误

### 步骤 8: 验证部署

1. **获取部署域名**：
   - 部署成功后，EdgeOne Pages 会分配一个域名
   - 格式：`https://xxxxx.pages.edgeone.site`

2. **更新环境变量**（重要）：
   - 进入项目设置 → 环境变量
   - 修改 `NEXT_PUBLIC_APP_URL` 为实际域名
   - 重新部署以应用更改

3. **访问网站**：
   - 打开分配的域名
   - 检查首页是否正常显示
   - 测试视频列表加载
   - 测试视频播放功能
   - 测试视频上传功能

---

## 🔍 部署后验证清单

### 基础功能验证
- [ ] 首页可以正常访问
- [ ] 视频列表能够加载并显示
- [ ] 视频缩略图正常显示
- [ ] 点击视频可以进入详情页
- [ ] 视频可以正常播放

### 核心功能验证
- [ ] 视频上传功能正常
- [ ] 上传后文件存储到 COS
- [ ] SCF 触发并处理视频
- [ ] 数据库记录更新成功
- [ ] 处理完成后显示缩略图和时长

### 性能验证
- [ ] 页面加载速度 < 3 秒
- [ ] 视频播放流畅无卡顿
- [ ] 移动端访问正常
- [ ] 响应式设计正常

---

## 🐛 常见问题排查

### 问题 1: 部署失败，提示 "Build failed"

**原因**：
- Node.js 版本不兼容
- 依赖安装失败
- 环境变量未配置

**解决**：
1. 检查 Node.js 版本（建议使用 18.x）
2. 检查构建日志中的具体错误
3. 确认所有环境变量已添加

### 问题 2: 网站可以访问，但无法连接数据库

**原因**：
- 数据库白名单未配置
- DATABASE_URL 格式错误
- 网络连接问题

**解决**：
1. 检查 PostgreSQL 白名单设置
2. 验证 DATABASE_URL 格式是否正确
3. 测试数据库连接：`psql "$DATABASE_URL" -c "SELECT 1;"`

### 问题 3: 视频上传失败

**原因**：
- COS 配置错误
- CORS 未配置
- 密钥权限不足

**解决**：
1. 检查 COS_SECRET_ID/KEY 是否正确
2. 确认 COS 存储桶存在
3. 检查 CORS 配置是否包含 pages.edgeone.site

### 问题 4: 上传后视频未处理

**原因**：
- SCF 未触发
- SCF 配置错误
- 触发器配置错误

**解决**：
1. 检查 SCF 函数是否正常运行
2. 确认 COS 触发器已配置
3. 查看 SCF 日志排查错误

---

## 📞 紧急联系方式

如遇到无法解决的问题：

1. **腾讯云工单**：https://console.cloud.tencent.com/workorder/category
2. **EdgeOne Pages 文档**：https://cloud.tencent.com/document/product/1552
3. **检查项目日志**：EdgeOne Pages 控制台 → 项目 → 部署记录 → 查看日志

---

## 🔄 持续部署配置

### 使用 Git 仓库（推荐）

如果使用 Git 仓库，可以配置自动部署：

1. 将代码推送到 GitHub/GitLab
2. 在 EdgeOne Pages 中连接仓库
3. 配置自动部署触发条件：
   - 推送到 main 分支自动部署
   - Pull Request 创建预览环境

### 手动部署

1. 本地构建：`npm run build`
2. 打包项目（包含 .next、public、package.json、.env.local）
3. 在 EdgeOne Pages 控制台上传 ZIP 包
4. 点击部署

---

## 📊 成本预估

### EdgeOne Pages 免费额度
- 构建时长：100 分钟/月
- 流量：100 GB/月
- 请求数：10 万次/月
- 对于 iMusic 项目：足够使用

### 可能产生的费用
- 超出流量：¥0.21/GB
- 超出请求：¥0.05/万次
- 自定义域名：¥0.5/个/天

**预计月度费用**：¥0-10（在免费额度内基本免费）

---

## 🎯 下一步计划

部署成功后，建议进行以下优化：

1. **配置自定义域名**：使用自己的域名访问
2. **启用 HTTPS**：确保数据传输安全
3. **配置 CDN 缓存**：优化静态资源加载速度
4. **设置监控告警**：监控网站运行状态
5. **定期备份**：备份数据库和重要数据

---

**部署完成时间预估**：30-60 分钟
