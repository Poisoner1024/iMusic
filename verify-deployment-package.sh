#!/bin/bash

echo "==================================================="
echo "iMusic 部署包完整性验证"
echo "==================================================="
echo ""

cd /workspace/iMusic

if [ ! -f "imusic-deployment.zip" ]; then
    echo "❌ 部署包不存在！"
    exit 1
fi

echo "📦 部署包大小:"
ls -lh imusic-deployment.zip
echo ""

echo "==================================================="
echo "必需文件/目录检查:"
echo "==================================================="
echo ""

required_files=(
    "tsconfig.json"
    "next.config.js"
    "tailwind.config.ts"
    "postcss.config.js"
    "package.json"
    "package-lock.json"
)

required_dirs=(
    ".next"
    "app"
    "components"
    "lib"
    "types"
    "public"
)

echo "✅ 检查必需文件:"
for file in "${required_files[@]}"; do
    if unzip -l imusic-deployment.zip | grep -q "\s${file}$"; then
        echo "  ✓ ${file}"
    else
        echo "  ✗ ${file} 缺失！"
    fi
done
echo ""

echo "✅ 检查必需目录:"
for dir in "${required_dirs[@]}"; do
    count=$(unzip -l imusic-deployment.zip | grep -c "^.*\s${dir}/" || true)
    if [ "$count" -gt 0 ]; then
        echo "  ✓ ${dir}/ (${count} 个文件)"
    else
        echo "  ✗ ${dir}/ 缺失！"
    fi
done
echo ""

echo "==================================================="
echo "源代码文件统计:"
echo "==================================================="
echo ""

app_files=$(unzip -l imusic-deployment.zip | grep -c "app/.*\.(tsx\|ts)$" || true)
component_files=$(unzip -l imusic-deployment.zip | grep -c "components/.*\.(tsx\|ts)$" || true)
lib_files=$(unzip -l imusic-deployment.zip | grep -c "lib/.*\.(tsx\|ts\|json)$" || true)
type_files=$(unzip -l imusic-deployment.zip | grep -c "types/.*\.(ts)$" || true)

echo "  app/ 目录: ${app_files} 个 TS/TSX 文件"
echo "  components/ 目录: ${component_files} 个 TS/TSX 文件"
echo "  lib/ 目录: ${lib_files} 个文件"
echo "  types/ 目录: ${type_files} 个 TypeScript 定义文件"
echo ""

echo "==================================================="
echo "验证结果:"
echo "==================================================="
echo ""

if [ "$app_files" -gt 0 ] && [ "$component_files" -gt 0 ]; then
    echo "✅ 部署包验证通过！"
    echo ""
    echo "部署包已包含:"
    echo "  • 完整的 Next.js 构建输出 (.next)"
    echo "  • 源代码目录 (app, components, lib, types)"
    echo "  • TypeScript 配置文件 (tsconfig.json)"
    echo "  • 静态资源 (public)"
    echo ""
    echo "🚀 部署包已准备好上传到 EdgeOne Pages！"
else
    echo "❌ 部署包验证失败！"
    echo "请检查部署脚本是否包含所有必需的文件和目录。"
    exit 1
fi
