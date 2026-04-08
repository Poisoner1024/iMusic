#!/bin/bash

# iMusic 数据库连接测试脚本

echo "╔════════════════════════════════════╗"
echo "║   iMusic 数据库连接测试           ║"
echo "╚════════════════════════════════════╝"
echo ""

# 检查 psql 是否已安装
if ! command -v psql &> /dev/null; then
    echo "❌ psql 命令未找到"
    echo ""
    echo "请先安装 PostgreSQL 客户端:"
    echo ""
    
    # 检测操作系统
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        OS=$NAME
    elif [ -f /etc/redhat-release ]; then
        OS=$(cat /etc/redhat-release)
    else
        OS=$(uname -s)
    fi
    
    echo "检测到系统: $OS"
    echo ""
    
    if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
        echo "安装命令:"
        echo "  sudo apt-get update"
        echo "  sudo apt-get install -y postgresql-client"
    elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
        echo "安装命令:"
        echo "  sudo yum install -y postgresql"
    elif [[ "$OS" == *"Fedora"* ]]; then
        echo "安装命令:"
        echo "  sudo dnf install -y postgresql"
    elif [[ "$OS" == *"Alpine"* ]]; then
        echo "安装命令:"
        echo "  sudo apk add --no-cache postgresql-client"
    else
        echo "请手动安装 PostgreSQL 客户端"
        echo "访问: https://www.postgresql.org/download/"
    fi
    
    echo ""
    echo "或使用 Docker:"
    echo "  docker run -it --rm postgres:13 psql \"postgresql://username:password@your-host:5432/imusic_db\""
    
    exit 1
fi

echo "✅ psql 已安装"
echo ""

# 显示版本
psql --version
echo ""

# 测试数据库连接
echo "🧪 测试数据库连接..."
echo ""

# 获取环境变量
if [ -f .env.local ]; then
    echo "加载环境变量..."
    export $(cat .env.local | grep -v '^#' | xargs)
fi

if [ -z "$DATABASE_URL" ]; then
    DATABASE_URL="postgresql://username:password@your-host:5432/imusic_db"
    echo "使用默认数据库连接"
fi

echo "数据库: ${DATABASE_URL//:*/://****@}"
echo ""

# 执行连接测试
psql "$DATABASE_URL" -c "SELECT version();" -c "SELECT current_database();" -c "SELECT COUNT(*) as video_count FROM videos;"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 数据库连接成功！"
    echo ""
    echo "查看videos表结构:"
    echo "  psql \"$DATABASE_URL\" -c \"\\d videos\""
    echo ""
    echo "查看视频数据:"
    echo "  psql \"$DATABASE_URL\" -c \"SELECT id, title, performer, status FROM videos LIMIT 5;\""
else
    echo ""
    echo "❌ 数据库连接失败"
    echo ""
    echo "请检查:"
    echo "1. 数据库地址是否正确 (your-host:5432)"
    echo "2. 用户名密码是否正确 (username/password)"
    echo "3. 数据库是否已启动"
    echo "4. 网络连接是否正常"
    echo "5. 防火墙设置是否允许连接"
fi
