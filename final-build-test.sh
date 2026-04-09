#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   iMusic 最终构建测试 - TypeScript 错误彻底修复               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

cd /workspace/iMusic

# 清理之前的构建
echo "🧹 清理构建缓存..."
rm -rf .next

echo ""
echo "🔨 开始构建项目..."
echo "================================================"

# 执行构建
npm run build 2>&1 | tee /tmp/build-log.txt

BUILD_EXIT_CODE=${PIPESTATUS[0]}

echo ""
echo "================================================"

# 检查构建结果
if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo "✅ 构建成功！"
    echo ""
    echo "📊 构建结果摘要:"
    grep -E "(✓ Compiled|Creating|Done)" /tmp/build-log.txt | tail -5
    echo ""
    
    echo "╔══════════════════════════════════════════════════════════════╗"
    echo "║   🎉 所有 TypeScript 错误已彻底修复！                        ║"
    echo "╚══════════════════════════════════════════════════════════════╝"
    echo ""
    echo "修复的文件:"
    echo "  ✓ types/index.ts - Video 接口"
    echo "  ✓ app/api/videos/route.ts - 查询映射"
    echo "  ✓ app/api/videos/[id]/route.ts - 查询映射"
    echo "  ✓ app/page.tsx - 筛选逻辑"
    echo "  ✓ app/members/page.tsx - 筛选逻辑"
    echo "  ✓ app/upload/page.tsx - 表单数据"
    echo "  ✓ app/video/[id]/page.tsx - 渲染展示"
    echo ""
    echo "下一步: 重新创建部署包"
    echo "  bash deploy-to-edgeone.sh"
    echo ""
    
    exit 0
else
    echo "❌ 构建失败！"
    echo ""
    echo "📋 错误摘要:"
    grep -E "(error|Error|Failed)" /tmp/build-log.txt | tail -20
    echo ""
    echo "🔍 请查看完整的错误日志:"
    echo "  cat /tmp/build-log.txt"
    echo ""
    
    exit 1
fi
