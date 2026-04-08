#!/bin/bash

# iMusic psql 自动安装脚本

echo "╔════════════════════════════════════╗"
echo "║   PostgreSQL 客户端安装工具       ║"
echo "╚════════════════════════════════════╝"
echo ""

# 检测操作系统
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
elif [ -f /etc/redhat-release ]; then
    OS=$(cat /etc/redhat-release | awk '{print $1}')
    VER=$(cat /etc/redhat-release | grep -oE '[0-9]+\.[0-9]+' | head -1)
else
    OS=$(uname -s)
    VER=$(uname -r)
fi

echo "检测到系统: $OS"
echo "版本: $VER"
echo ""

echo "🚀 开始安装 PostgreSQL 客户端..."
echo ""

# 根据不同的操作系统安装
case "$OS" in
    *"Ubuntu"*)
        echo "📦 使用 apt-get 安装..."
        sudo apt-get update
        sudo apt-get install -y postgresql-client
        ;;
    *"Debian"*)
        echo "📦 使用 apt-get 安装..."
        sudo apt-get update
        sudo apt-get install -y postgresql-client
        ;;
    *"CentOS"*)
        echo "📦 使用 yum 安装..."
        sudo yum install -y postgresql
        ;;
    *"Red Hat"*)
        echo "📦 使用 yum 安装..."
        sudo yum install -y postgresql
        ;;
    *"Fedora"*)
        echo "📦 使用 dnf 安装..."
        sudo dnf install -y postgresql
        ;;
    *"Alpine"*)
        echo "📦 使用 apk 安装..."
        sudo apk add --no-cache postgresql-client
        ;;
    *"Arch Linux"*)
        echo "📦 使用 pacman 安装..."
        sudo pacman -S --noconfirm postgresql
        ;;
    *)
        echo "❌ 不支持的操作系统: $OS"
        echo ""
        echo "请手动安装 PostgreSQL 客户端:"
        echo "访问: https://www.postgresql.org/download/"
        echo ""
        echo "或使用 Docker:"
        echo "  docker run -it --rm postgres:13 psql --version"
        exit 1
        ;;
esac

# 检查安装结果
if command -v psql &> /dev/null; then
    echo ""
    echo "✅ PostgreSQL 客户端安装成功!"
    echo ""
    psql --version
    echo ""
    echo "🎉 现在可以测试数据库连接了:"
    echo ""
    echo "   ./scripts/test-db-connection.sh"
    echo ""
else
    echo ""
    echo "❌ 安装失败"
    echo ""
    echo "请检查错误信息并手动安装"
    exit 1
fi
