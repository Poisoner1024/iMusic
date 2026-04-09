# EdgeOne Pages 部署前终极检查清单

## 借鉴历史错误的深度检查

### ❌ 错误 1：部署包缺少 app 目录
**错误信息**: `Couldn't find any pages or app directory`

**根本原因**: 首次打包未包含源代码目录

**预防措施**: ✅ 已验证部署包包含完整的 app 目录

**检查命令**:
```bash
cd /workspace/iMusic
unzip -l imusic-deployment.zip | grep "app/" | wc -l
# 预期结果: > 40 个文件
```

**检查清单**:
- [ ] `app/layout.tsx` - 根布局文件
- [ ] `app/page.tsx` - 首页
- [ ] `app/upload/page.tsx` - 上传页面
- [ ] `app/video/[id]/page.tsx` - 视频详情页
- [ ] `app/api/videos/route.ts` - 视频列表 API
- [ ] `app/api/videos/upload-url/route.ts` - 上传凭证 API
- [ ] `app/members/page.tsx` - 会员页
- [ ] 其他所有页面文件

---

### ❌ 错误 2：TypeScript 类型不匹配
**错误信息**: `Property 'category' does not exist on type 'Video'`

**根本原因**: Video 接口使用 `instrument`，但代码使用 `category`

**预防措施**: ✅ 已统一使用 `instrument` 字段

**检查命令**:
```bash
grep -r "video\.category" /workspace/iMusic/app --include="*.tsx"
# 预期结果: 无输出（0个匹配）

grep -r "video\.instrument" /workspace/iMusic/app --include="*.tsx" | wc -l
# 预期结果: > 0 个匹配
```

**检查清单**:
- [ ] `app/page.tsx` - 使用 `video.instrument`
- [ ] `app/members/page.tsx` - 使用 `video.instrument`
- [ ] `types/index.ts` - Video 接口定义 `instrument: string`
- [ ] `app/api/videos/route.ts` - 返回 `instrument` 字段
- [ ] `app/api/videos/[id]/route.ts` - 返回 `instrument` 字段

---

### ❌ 错误 3：环境变量名称冲突
**错误信息**: 系统保留变量名冲突

**根本原因**: 使用 `SCF_FUNCTION_NAME` 作为自定义变量

**预防措施**: ✅ 已重命名为 `VIDEO_PROCESS_NAME`

**检查命令**:
```bash
grep -r "SCF_FUNCTION_NAME" /workspace/iMusic --include="*.env" --include="*.md" --include="*.json" --exclude-dir=scf-build --exclude-dir=scripts
# 预期结果: 仅出现在文档中，不在配置文件中

grep -r "VIDEO_PROCESS_NAME=iMusic-processing" /workspace/iMusic --include="*.env" --include="*.md" --include="*.json"
# 预期结果: 出现在所有配置文件中
```

**检查清单**:
- [ ] `.env.local` - 包含 `VIDEO_PROCESS_NAME=iMusic-processing`
- [ ] `DEPLOY_NOW.md` - 环境变量清单已更新
- [ ] `EDGEONE_DEPLOYMENT_CHECKLIST.md` - 清单已更新
- [ ] `edgeone-env-config.json` - JSON 配置已更新
- [ ] `deploy-to-edgeone.sh` - 脚本已更新

---

### ❌ 错误 4：文件扩展名不匹配
**错误信息**: tailwind.config.js 不存在

**根本原因**: 实际文件为 tailwind.config.ts，但脚本引用 .js

**预防措施**: ✅ 已修正脚本

**检查命令**:
```bash
test -f /workspace/iMusic/tailwind.config.ts && echo "✅ tailwind.config.ts 存在"
```

**检查清单**:
- [ ] `tailwind.config.ts` - 文件存在
- [ ] `deploy-to-edgeone.sh` - 脚本引用正确的文件名

---

## 构建验证

### 本地构建检查

```bash
cd /workspace/iMusic

# 清理旧的构建产物
rm -rf .next

# 执行构建
npm run build

# 预期结果:
# ✓ Compiled successfully
# ✓ Linting and checking validity of types
```

**检查清单**:
- [ ] 无 TypeScript 错误
- [ ] 无 ESLint 错误
- [ ] 构建成功完成
- [ ] 生成 `.next` 目录

### 构建产物验证

```bash
# 检查服务器端构建
test -d /workspace/iMusic/.next/server/app && echo "✅ .next/server/app 存在"

# 检查客户端构建
test -d /workspace/iMusic/.next/static && echo "✅ .next/static 存在"

# 检查路由清单
test -f /workspace/iMusic/.next/routes-manifest.json && echo "✅ routes-manifest.json 存在"
```

**检查清单**:
- [ ] `.next/server/app/` - 服务器端 App Router 构建产物
- [ ] `.next/server/pages/` - 服务器端 Pages Router 构建产物
- [ ] `.next/static/` - 客户端静态资源
- [ ] `.next/routes-manifest.json` - 路由清单
- [ ] `.next/prerender-manifest.js` - 预渲染清单
- [ ] `.next/package.json` - 包配置

---

## 部署包验证

### 文件完整性检查

```bash
cd /workspace/iMusic

# 检查部署包存在
test -f imusic-deployment.zip && echo "✅ 部署包存在"

# 检查部署包大小（应在 5-15MB 之间）
size=$(du -m imusic-deployment.zip | cut -f1)
if [ "$size" -ge 5 ] && [ "$size" -le 20 ]; then
  echo "✅ 部署包大小正常: ${size}MB"
else
  echo "⚠️  部署包大小异常: ${size}MB"
fi
```

**检查清单**:
- [ ] `imusic-deployment.zip` - 文件存在
- [ ] 文件大小在合理范围（5-20MB）
- [ ] 文件可读

### 部署包内容验证

```bash
# 检查 app 目录
unzip -l imusic-deployment.zip | grep -q "app/layout.tsx" && echo "✅ app/layout.tsx 在部署包中"

# 检查 .next 目录
unzip -l imusic-deployment.zip | grep -q "\.next/server/app" && echo "✅ .next/server/app 在部署包中"

# 检查 package.json
unzip -l imusic-deployment.zip | grep -q "package.json" && echo "✅ package.json 在部署包中"

# 检查 next.config.js
unzip -l imusic-deployment.zip | grep -q "next.config.js" && echo "✅ next.config.js 在部署包中"

# 检查环境变量文件
unzip -l imusic-deployment.zip | grep -q "\.env.local" && echo "✅ .env.local 在部署包中"
```

**检查清单**:
- [ ] `app/` 目录 - 包含所有源代码
- [ ] `.next/` 目录 - 包含构建产物
- [ ] `public/` 目录 - 包含静态资源
- [ ] `package.json` - 依赖配置
- [ ] `package-lock.json` - 依赖锁定
- [ ] `next.config.js` - Next.js 配置
- [ ] `tailwind.config.ts` - Tailwind 配置
- [ ] `postcss.config.js` - PostCSS 配置
- [ ] `.env.local` - 环境变量模板

---

## 环境变量最终验证

### 变量完整性检查

**必需的环境变量**（共8个）：

```bash
# 1. 数据库连接（1个）
DATABASE_URL=postgresql://imusic_user:********@sh-postgres-6bpqmb8q.sql.tencentcdb.com:21079/imusic_db

# 2. COS 配置（4个）
COS_SECRET_ID=********
COS_SECRET_KEY=********
COS_BUCKET=imusic-videos-iris-1390612299
COS_REGION=ap-shanghai

# 3. SCF 配置（1个）
VIDEO_PROCESS_NAME=iMusic-processing

# 4. 应用配置（2个）
NEXT_PUBLIC_APP_URL=https://your-domain.pages.edgeone.site
MAX_FILE_SIZE=104857600
```

**检查清单**:
- [ ] `DATABASE_URL` - 数据库连接字符串正确
- [ ] `COS_SECRET_ID` - SecretId 正确（标记为敏感）
- [ ] `COS_SECRET_KEY` - SecretKey 正确（标记为敏感）
- [ ] `COS_BUCKET` - 存储桶名称正确
- [ ] `COS_REGION` - 地域正确（ap-shanghai）
- [ ] `VIDEO_PROCESS_NAME` - 函数名正确（iMusic-processing）
- [ ] `NEXT_PUBLIC_APP_URL` - 占位符已设置
- [ ] `MAX_FILE_SIZE` - 文件大小限制已设置（100MB）

### 敏感变量标记

**必须标记为敏感的变量**：
- [ ] `COS_SECRET_ID` - 腾讯云 API 密钥
- [ ] `COS_SECRET_KEY` - 腾讯云 API 密钥

**不能标记为敏感的变量**：
- [ ] `NEXT_PUBLIC_APP_URL` - 需要在客户端访问

---

## 依赖和配置验证

### package.json 关键字段

```bash
grep -E '"(name|version|scripts|dependencies)"' /workspace/iMusic/package.json
```

**检查清单**:
- [ ] `name` - 项目名称（imusic）
- [ ] `version` - 版本号
- [ ] `scripts.build` - 构建命令（next build）
- [ ] `dependencies.next` - Next.js 依赖存在
- [ ] `dependencies.react` - React 依赖存在
- [ ] `dependencies.@aws-sdk/client-s3` - AWS SDK 依赖存在
- [ ] `dependencies.pg` - PostgreSQL 客户端存在

### Next.js 配置验证

```bash
grep -E "(images|experimental|headers)" /workspace/iMusic/next.config.js
```

**检查清单**:
- [ ] `images.remotePatterns` - 允许远程图片加载
- [ ] `experimental` - 实验功能配置（如有）
- [ ] `headers` - API 路由 CORS 配置
- [ ] `poweredByHeader: false` - 安全增强

---

## 外部服务配置

### 数据库配置

**白名单设置**:

```bash
# 需要在腾讯云 PostgreSQL 控制台配置
# 测试环境：
0.0.0.0/0

# 生产环境（推荐）：
# 咨询腾讯云获取 EdgeOne Pages 的 IP 段
```

**检查清单**:
- [ ] 数据库实例运行正常
- [ ] 白名单已配置（或准备配置）
- [ ] SSL 连接已启用（如需要）
- [ ] 连接测试：`psql "$DATABASE_URL" -c "SELECT 1;"`

### COS 配置

**CORS 规则**:

```json
{
  "origin": "https://*.pages.edgeone.site",
  "methods": ["GET", "PUT", "POST", "DELETE", "HEAD"],
  "allowHeaders": ["*"],
  "exposeHeaders": ["ETag", "x-cos-request-id"]
}
```

**检查清单**:
- [ ] 存储桶存在：`imusic-videos-iris-1390612299`
- [ ] 地域正确：`ap-shanghai`
- [ ] CORS 规则已配置（或准备配置）
- [ ] 密钥有读写权限

### SCF 配置

**函数信息**:
- 函数名称: `iMusic-processing`
- 运行环境: Node.js 16.13
- 内存: 1024MB
- 超时: 300秒

**触发器**:
- COS 触发
- 前缀: `videos/original/`
- 后缀: `.mp4,.mov,.avi,.mkv`

**检查清单**:
- [ ] SCF 函数已部署
- [ ] 环境变量已配置
- [ ] COS 触发器已配置
- [ ] 函数状态正常

---

## 功能完整性验证

### API 路由检查

**必需的 API 端点**:

```
GET  /api/videos              # 获取视频列表
GET  /api/videos/[id]         # 获取视频详情
POST /api/videos              # 创建视频记录
POST /api/videos/upload-url   # 获取上传凭证
POST /api/videos/[id]/likes   # 点赞
POST /api/videos/[id]/views   # 观看统计
GET  /api/health              # 健康检查
```

**检查清单**:
- [ ] `/api/videos/route.ts` - 存在
- [ ] `/api/videos/[id]/route.ts` - 存在
- [ ] `/api/videos/upload-url/route.ts` - 存在
- [ ] `/api/videos/[id]/likes/route.ts` - 存在
- [ ] `/api/videos/[id]/views/route.ts` - 存在
- [ ] `/api/health/route.ts` - 存在

### 页面路由检查

**必需的页面**:

```
/                  # 首页
/upload            # 上传页面
/video/[id]        # 视频详情页
/members           # 会员页面
/gallery           # 相册页面
/about             # 关于页面
/contact           # 联系页面
/classes           # 课程页面
/activities        # 活动页面
/vision            # 愿景页面
/join              # 加入页面
```

**检查清单**:
- [ ] `app/page.tsx` - 首页
- [ ] `app/upload/page.tsx` - 上传页
- [ ] `app/video/[id]/page.tsx` - 视频详情页
- [ ] `app/members/page.tsx` - 会员页
- [ ] `app/gallery/page.tsx` - 相册页
- [ ] `app/about/page.tsx` - 关于页
- [ ] `app/contact/page.tsx` - 联系页
- [ ] `app/classes/page.tsx` - 课程页
- [ ] `app/activities/page.tsx` - 活动页
- [ ] `app/vision/page.tsx` - 愿景页
- [ ] `app/join/page.tsx` - 加入页

---

## 部署配置检查

### EdgeOne Pages 配置

**构建设置**:
```
构建命令: npm run build
输出目录: .next
安装命令: npm install
Node.js 版本: 18.x
```

**检查清单**:
- [ ] 构建命令正确
- [ ] 输出目录正确（.next）
- [ ] Node.js 版本 >= 18.0
- [ ] 环境变量已添加（8个）
- [ ] 敏感变量已标记（2个）

### 环境特定配置

**开发环境**:
- [ ] `NEXT_PUBLIC_APP_URL=http://localhost:3000`

**生产环境**（部署后更新）:
- [ ] `NEXT_PUBLIC_APP_URL=https://xxxxx.pages.edgeone.site`

---

## 部署后验证清单

### 基础功能验证

**访问测试**:
- [ ] 网站可以访问
- [ ] 首页加载 < 3秒
- [ ] 无 500 错误
- [ ] 无 404 错误（对有效路由）

**视频列表**:
- [ ] 视频列表正常显示
- [ ] 缩略图正常加载
- [ ] 分类过滤器工作正常
- [ ] 搜索功能正常（如有）

**视频播放**:
- [ ] 点击视频进入详情页
- [ ] 视频可以正常播放
- [ ] 播放控制正常
- [ ] 全屏功能正常

### 核心功能验证

**视频上传**:
- [ ] 访问上传页面
- [ ] 可以选择视频文件
- [ ] 可以填写表单信息
- [ ] 上传进度显示正常
- [ ] 上传完成无错误

**视频处理**:
- [ ] 上传后文件出现在 COS
- [ ] SCF 函数被触发
- [ ] SCF 处理日志无错误
- [ ] 数据库记录更新（状态、时长、缩略图）
- [ ] 处理完成后在前端显示

**数据一致性**:
- [ ] 数据库有视频记录
- [ ] COS 有视频文件
- [ ] COS 有缩略图文件（或默认图）
- [ ] 视频元数据正确（时长、大小）

---

## 性能和安全检查

### 性能优化

**检查清单**:
- [ ] 图片使用 Next.js Image 组件
- [ ] 静态资源有缓存头
- [ ] API 响应时间 < 500ms
- [ ] 页面加载时间 < 3秒

### 安全加固

**检查清单**:
- [ ] `.env.local` 在 `.gitignore` 中
- [ ] API 路由有错误处理
- [ ] 文件上传有大小限制
- [ ] 数据库连接使用 SSL（生产环境）
- [ ] COS 存储桶权限正确（私有读写）

---

## 回滚计划

### 部署失败回滚

如果部署失败：

1. **查看构建日志** - 定位具体错误
2. **检查环境变量** - 确认所有变量已添加
3. **检查数据库白名单** - 确认 IP 已放行
4. **检查 COS CORS** - 确认跨域配置
5. **本地重新构建** - `npm run build`
6. **重新打包** - 更新部署包
7. **重新部署** - 上传新的 ZIP 包

---

## 部署成功标准

### 必须满足的条件

- [ ] 网站可访问
- [ ] 首页加载正常
- [ ] 视频列表显示
- [ ] 视频可以播放
- [ ] 可以上传视频
- [ ] 上传后视频可处理
- [ ] 处理完成后显示缩略图

### 可选优化

- [ ] 加载速度 < 2秒
- [ ] 视频播放无卡顿
- [ ] 移动端体验良好
- [ ] SEO 优化（标题、描述）

---

## 部署执行确认

### 我已确认以下内容：

- [ ] 所有历史错误已修复并验证
- [ ] 部署包包含所有必需文件
- [ ] 构建在本地成功
- [ ] 环境变量配置正确
- [ ] 数据库访问已配置或准备配置
- [ ] COS CORS 已配置或准备配置
- [ ] SCF 函数已部署
- [ ] 了解部署步骤和验证方法
- [ ] 准备好处理部署中可能出现的问题

---

## 🚀 最终确认

**在点击部署按钮前，请再次确认**:

1. ✅ 部署包 `imusic-deployment.zip` 是最新版本（8.8MB）
2. ✅ 所有 8 个环境变量已添加到 EdgeOne Pages
3. ✅ 敏感变量 `COS_SECRET_ID` 和 `COS_SECRET_KEY` 已标记
4. ✅ 数据库白名单已配置（或已准备好配置）
5. ✅ COS CORS 规则已配置（或已准备好配置）
6. ✅ SCF 函数 `iMusic-processing` 运行正常

**如果以上全部确认，可以开始部署！**

---

**文档版本**: 3.0
**最后更新**: 2026-04-08
**借鉴的错误**: 4 个历史错误已全部修复并验证
