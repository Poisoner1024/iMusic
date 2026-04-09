#!/bin/bash

# iMusic 项目 EdgeOne Pages 部署辅助脚本
# 用于打包项目（本地上传方式）

set -e

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   iMusic 项目 EdgeOne Pages 部署辅助工具                ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# 颜色输出
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 项目路径
PROJECT_DIR="/workspace/iMusic"
DEPLOY_ZIP="imusic-deployment.zip"

echo -e "${YELLOW}步骤 1: 检查项目结构${NC}"
echo ""

# 检查必需的文件和目录
required_files=("package.json" "next.config.js" ".env.local")
required_dirs=("app" "components" "lib" "public" "types")

missing_items=()

for file in "${required_files[@]}"; do
    if [ ! -f "$PROJECT_DIR/$file" ]; then
        missing_items+=("$file")
    fi
done

for dir in "${required_dirs[@]}"; do
    if [ ! -d "$PROJECT_DIR/$dir" ]; then
        missing_items+=("$dir")
    fi
done

if [ ${#missing_items[@]} -ne 0 ]; then
    echo -e "${RED}❌ 缺少必需的文件或目录：${NC}"
    for item in "${missing_items[@]}"; do
        echo "   - $item"
    done
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ 项目结构检查通过${NC}"
echo ""

echo -e "${YELLOW}步骤 2: 安装依赖${NC}"
echo ""

cd "$PROJECT_DIR"

if [ ! -d "node_modules" ]; then
    echo "安装项目依赖..."
    npm install
    echo -e "${GREEN}✅ 依赖安装完成${NC}"
else
    echo -e "${GREEN}✅ node_modules 已存在，跳过安装${NC}"
fi
echo ""

echo -e "${YELLOW}步骤 3: 构建项目${NC}"
echo ""

echo "执行构建命令: npm run build"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 项目构建成功${NC}"
else
    echo -e "${RED}❌ 项目构建失败，请检查错误信息${NC}"
    exit 1
fi
echo ""

echo -e "${YELLOW}步骤 4: 创建部署包${NC}"
echo ""

# 删除旧的部署包
if [ -f "$DEPLOY_ZIP" ]; then
    rm -f "$DEPLOY_ZIP"
fi

# 创建部署包
echo "正在打包部署文件..."

cd "$PROJECT_DIR"
zip -r "$DEPLOY_ZIP" \
    .next \
    app \
    components \
    lib \
    types \
    public \
    package.json \
    package-lock.json \
    next.config.js \
    tsconfig.json \
    tailwind.config.ts \
    postcss.config.js \
    -x "*.log" -x "node_modules/*" -x ".git/*" -x "*.md" -x "scripts/*" -x "docs/*"

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ 部署包创建成功${NC}"
    echo ""
    echo -e "部署包信息："
    ls -lh "$DEPLOY_ZIP"
    echo ""
else
    echo -e "${RED}❌ 部署包创建失败${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}步骤 5: 生成环境变量清单${NC}"
echo ""

# 生成环境变量文件
cat > "edgeone-env.txt" << 'EOF'
EdgeOne Pages 环境变量配置清单
================================

以下环境变量需要在 EdgeOne Pages 控制台配置：

1. DATABASE_URL
   值: postgresql://imusic_user:********@sh-postgres-6bpqmb8q.sql.tencentcdb.com:21079/imusic_db
   类型: 普通变量

2. COS_SECRET_ID
   值: ********
   类型: 敏感变量

3. COS_SECRET_KEY
   值: ********
   类型: 敏感变量

4. COS_BUCKET
   值: imusic-videos-iris-1390612299
   类型: 普通变量

5. COS_REGION
   值: ap-shanghai
   类型: 普通变量

6. VIDEO_PROCESS_NAME
   值: iMusic-processing
   类型: 普通变量

7. NEXT_PUBLIC_APP_URL
   值: https://your-domain.pages.edgeone.site
   类型: 普通变量
   说明: 部署后需要更新为实际域名

8. MAX_FILE_SIZE
   值: 104857600
   类型: 普通变量

配置步骤：
1. 登录 EdgeOne Pages 控制台
2. 创建或选择项目
3. 进入「项目设置」→「环境变量」
4. 点击「添加变量」，逐一添加上述变量
5. 将 COS_SECRET_ID 和 COS_SECRET_KEY 标记为「敏感变量」
EOF

echo -e "${GREEN}✅ 环境变量清单已生成: edgeone-env.txt${NC}"
echo ""

echo -e "${YELLOW}步骤 6: 部署说明${NC}"
echo ""

echo "您可以通过以下两种方式部署："
echo ""
echo "方式一：本地上传 ZIP 包（推荐用于首次部署）"
echo "  1. 登录 EdgeOne Pages 控制台"
echo "  2. 创建新项目，选择「本地上传 ZIP 包」"
echo "  3. 上传文件: $DEPLOY_ZIP"
echo "  4. 配置框架预设为 Next.js"
echo "  5. 配置环境变量（见 edgeone-env.txt）"
echo "  6. 点击部署"
echo ""
echo "方式二：连接 Git 仓库（推荐用于持续部署）"
echo "  1. 将代码推送到 GitHub/GitLab"
echo "  2. 在 EdgeOne Pages 中选择「从代码仓库导入」"
echo "  3. 授权并选择仓库"
echo "  4. 配置构建设置:"
echo "     - 构建命令: npm run build"
echo "     - 输出目录: .next"
echo "     - 安装命令: npm install"
echo "  5. 配置环境变量"
echo "  6. 点击部署"
echo ""

echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   部署准备完成！                                        ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}重要提醒：${NC}"
echo "  1. 部署前请确保 PostgreSQL 数据库已配置白名单"
echo "  2. 确保 COS 存储桶已配置 CORS 规则"
echo "  3. 部署成功后，更新 NEXT_PUBLIC_APP_URL 为实际域名"
echo "  4. 详细部署步骤请查看: EDGEONE_DEPLOYMENT_CHECKLIST.md"
echo ""
echo "需要配置的数据库白名单 IP 段："
echo "  - EdgeOne Pages: 请咨询腾讯云获取具体 IP 段"
echo "  - 或临时使用 0.0.0.0/0（不推荐用于生产环境）"
echo ""
echo "需要配置的 COS CORS 规则："
echo "  - 来源: https://*.pages.edgeone.site"
echo "  - 方法: GET, PUT, POST, DELETE, HEAD"
echo "  - 头部: *"
echo ""
