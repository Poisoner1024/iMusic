# iMusic 网站部署指南

## 📊 项目架构分析

### 技术栈
- **前端**: Next.js 14 (React 18, TypeScript, Tailwind CSS)
- **后端**: Next.js API Routes
- **数据库**: 腾讯云 PostgreSQL
- **存储**: 腾讯云 COS
- **视频处理**: 腾讯云 SCF

### 部署需求
- Node.js 运行环境
- 需要访问腾讯云 PostgreSQL 数据库
- 需要访问腾讯云 COS
- 静态资源优化
- 国内访问速度优化

---

## 🎯 推荐部署方案

### 方案一：腾讯云 EdgeOne Pages（⭐⭐⭐⭐⭐ 首选）

**推荐理由**：
- ✅ 国内访问速度快，CDN 加速
- ✅ 与腾讯云生态（COS、SCF、PostgreSQL）集成无缝
- ✅ 支持 Next.js 14 全栈部署
- ✅ 提供免费额度，成本可控
- ✅ 支持自定义域名和 HTTPS

**部署步骤**：

1. **准备代码**
```bash
cd /workspace/iMusic
npm install
npm run build
```

2. **登录腾讯云控制台**
   - 访问 [EdgeOne Pages](https://console.cloud.tencent.com/edgeone/pages)
   - 使用腾讯云账号登录

3. **创建项目**
   - 点击「新建项目」
   - 选择「从 Git 仓库导入」或「本地上传」
   - 框架预设选择「Next.js」

4. **配置构建设置**
```
构建命令: npm run build
输出目录: .next
安装命令: npm install
环境变量: 添加 .env.local 中的所有变量
```

5. **配置环境变量**
在 EdgeOne Pages 控制台添加：
```
DATABASE_URL=postgresql://imusic_user:PASSWORD@sh-postgres-6bpqmb8q.sql.tencentcdb.com:21079/imusic_db
COS_SECRET_ID=********
COS_SECRET_KEY=********
COS_BUCKET=imusic-videos-iris-1390612299
COS_REGION=ap-shanghai
NEXT_PUBLIC_APP_URL=https://your-domain.pages.edgeone.site
MAX_FILE_SIZE=104857600
```

6. **部署和访问**
   - 点击「部署」
   - 等待构建完成（约 2-5 分钟）
   - 访问分配的域名
   - 配置自定义域名（可选）

**预估费用**：
- 免费额度：100GB 流量/月，10 万次请求/月
- 超出部分：流量 ¥0.21/GB，请求 ¥0.05/万次

---

### 方案二：Vercel（⭐⭐⭐⭐ 推荐）

**推荐理由**：
- ✅ Next.js 官方原生支持
- ✅ 部署极其简单（一键部署）
- ✅ 全球 CDN 加速
- ✅ 自动 HTTPS 和预览环境

**缺点**：
- ⚠️ 国内访问速度不如腾讯云
- ⚠️ 需要确保腾讯云数据库允许公网访问

**部署步骤**：

1. **准备代码**
```bash
cd /workspace/iMusic
npm install
npm run build
```

2. **登录 Vercel**
   - 访问 [vercel.com](https://vercel.com)
   - 使用 GitHub 账号登录

3. **导入项目**
   - 点击「Add New...」→「Project」
   - 选择 iMusic 仓库
   - 配置 Framework Preset 为「Next.js」

4. **配置环境变量**
   - 在 Vercel 项目设置中添加所有环境变量

5. **部署**
   - 点击「Deploy」
   - 等待构建完成（约 3-5 分钟）

6. **配置数据库白名单**
   - 登录腾讯云 PostgreSQL 控制台
   - 将 Vercel IP 段加入白名单：
     ```
     76.76.21.0/24
     76.76.22.0/24
     76.76.23.0/24
     76.76.24.0/24
     76.76.25.0/24
     76.76.26.0/24
     76.76.27.0/24
     76.76.28.0/24
     76.76.29.0/24
     76.76.30.0/24
     76.76.31.0/24
     76.76.32.0/24
     76.76.33.0/24
     76.76.34.0/24
     76.76.35.0/24
     76.76.36.0/24
     ```

**预估费用**：
- Hobby 套餐：免费（个人项目足够）
- Pro 套餐：$20/月/成员

---

### 方案三：腾讯云 CloudBase（⭐⭐⭐⭐）

**推荐理由**：
- ✅ 腾讯云全栈解决方案
- ✅ 支持静态网站 + 云函数
- ✅ 与微信生态无缝集成
- ✅ 国内访问速度快

**部署步骤**：

1. **安装 CloudBase CLI**
```bash
npm install -g @cloudbase/cli
tcb login
```

2. **初始化项目**
```bash
cd /workspace/iMusic
tcb init
```

3. **配置 cloudbaserc.json**
```json
{
  "envId": "your-env-id",
  "framework": {
    "name": "imusic",
    "plugins": {
      "next": {
        "use": "@cloudbase/framework-plugin-next",
        "inputs": {
          "buildCommand": "npm run build",
          "installCommand": "npm install"
        }
      }
    }
  }
}
```

4. **配置环境变量**
```bash
tcb env:set DATABASE_URL="postgresql://..."
tcb env:set COS_SECRET_ID="AKID..."
tcb env:set COS_SECRET_KEY="..."
# ... 其他变量
```

5. **部署**
```bash
tcb deploy
```

**预估费用**：
- 免费额度：1000 小时/月资源使用量
- 超出部分：按实际使用量计费

---

### 方案四：Cloud Studio 快速部署（⭐⭐⭐ 快速预览）

**推荐理由**：
- ✅ 无需配置，一键部署
- ✅ 适合快速预览和测试
- ✅ 免费使用

**缺点**：
- ⚠️ 不适合生产环境
- ⚠️ 域名不固定
- ⚠️ 资源限制较多

**部署步骤**：

1. **使用集成菜单**
   - 在 Cloud Studio 中点击「部署」
   - 选择「EdgeOne Pages」
   - 按照提示完成部署

2. **访问应用**
   - 使用分配的临时域名访问
   - 有效期通常为 24 小时

---

## 📋 部署前检查清单

在部署前，请确保：

- [ ] 所有环境变量已正确配置
- [ ] 数据库白名单已配置（允许部署平台访问）
- [ ] COS 存储桶权限设置正确
- [ ] SCF 云函数已部署并运行正常
- [ ] 代码已通过 `npm run build` 测试
- [ ] 敏感信息已添加到 `.gitignore`
- [ ] 已备份 `.env.local` 文件

---

## 🔧 环境变量配置说明

### 必需的环境变量

```bash
# PostgreSQL 数据库连接
DATABASE_URL=postgresql://用户名:密码@地址:端口/数据库名

# 腾讯云 COS 配置
COS_SECRET_ID=你的SecretId
COS_SECRET_KEY=你的SecretKey
COS_BUCKET=存储桶名称
COS_REGION=地域（如：ap-shanghai）

# 应用配置
NEXT_PUBLIC_APP_URL=部署后的域名
MAX_FILE_SIZE=104857600  # 100MB
```

### 不同平台的配置方式

**EdgeOne Pages / CloudBase**：
- 在控制台「环境变量」中逐条添加

**Vercel**：
- 在 Project Settings → Environment Variables 中配置
- 区分 Production、Preview、Development 环境

---

## 🌐 数据库白名单配置

### 腾讯云平台白名单

1. **EdgeOne Pages / CloudBase**
```
0.0.0.0/0  # 不推荐，仅用于测试
# 或咨询腾讯云获取具体 IP 段
```

2. **Vercel**
```
76.76.21.0/24
76.76.22.0/24
76.76.23.0/24
76.76.24.0/24
76.76.25.0/24
76.76.26.0/24
76.76.27.0/24
76.76.28.0/24
76.76.29.0/24
76.76.30.0/24
76.76.31.0/24
76.76.32.0/24
76.76.33.0/24
76.76.34.0/24
76.76.35.0/24
76.76.36.0/24
```

**安全建议**：
- 生产环境不要使用 `0.0.0.0/0`
- 定期审查白名单
- 使用 SSL 连接

---

## 📊 方案对比

| 特性 | EdgeOne Pages | Vercel | CloudBase | Cloud Studio |
|------|--------------|--------|-----------|--------------|
| **国内速度** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Next.js 支持** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ |
| **部署难度** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐ | ⭐ |
| **成本** | 免费额度高 | 免费 | 免费额度高 | 免费 |
| **腾讯云集成** | ⭐⭐⭐⭐⭐ | ⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| **生产环境** | ✅ | ✅ | ✅ | ❌ |

---

## 🚀 推荐部署流程

### 对于国内用户

1. **首选**：腾讯云 EdgeOne Pages
   - 访问速度最快
   - 与腾讯云生态无缝集成
   - 适合国内用户访问

2. **备选**：腾讯云 CloudBase
   - 全栈解决方案
   - 支持更多腾讯云原生功能

### 对于国际用户

1. **首选**：Vercel
   - 全球 CDN 加速
   - Next.js 最佳实践

---

## 📞 部署后验证

部署完成后，请验证以下功能：

1. **主页访问**：`https://your-domain.com` ✓
2. **视频列表**：可以正常显示视频 ✓
3. **视频播放**：点击视频可以正常播放 ✓
4. **视频上传**：可以上传新视频 ✓
5. **数据库连接**：视频信息写入数据库 ✓
6. **COS 存储**：视频文件存储到 COS ✓
7. **SCF 处理**：视频上传后触发 SCF ✓

---

## 🔍 常见问题

### Q1: 部署后无法连接数据库？
**A**: 检查数据库白名单配置，确保已添加部署平台的 IP 段。

### Q2: 视频上传失败？
**A**: 检查 COS 配置和环境变量，确认 COS_SECRET_ID/KEY 有效且有写入权限。

### Q3: SCF 未触发？
**A**: 检查 SCF 触发器配置，确保 COS 存储桶的事件通知已正确设置。

### Q4: 访问速度慢？
**A**: 考虑使用 CDN 加速，或选择更靠近用户的服务节点。

---

## 📚 参考资料

- [EdgeOne Pages 官方文档](https://cloud.tencent.com/document/product/1552)
- [Vercel 官方文档](https://vercel.com/docs)
- [CloudBase 官方文档](https://cloud.tencent.com/document/product/876)
- [Next.js 部署指南](https://nextjs.org/docs/deployment)

---

**推荐方案总结**：对于 iMusic 项目，**腾讯云 EdgeOne Pages 是最佳选择**，因为它提供了最优的国内访问速度，与现有的腾讯云生态（PostgreSQL、COS、SCF）集成无缝，且成本可控。
