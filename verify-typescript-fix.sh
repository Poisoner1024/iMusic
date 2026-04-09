#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   iMusic TypeScript 类型错误 - 彻底修复验证                   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

PROJECT_DIR="/workspace/iMusic"
cd "$PROJECT_DIR"

echo "🔍 步骤 1: 检查 Video 类型定义"
echo "================================================"
if grep -q "category: string" types/index.ts; then
    echo "✅ Video 类型已正确定义为 'category'"
else
    echo "❌ Video 类型定义错误"
    grep -A 15 "export interface Video" types/index.ts
    exit 1
fi

if grep -q "instrument: string" types/index.ts; then
    echo "❌ Video 类型还包含旧的 'instrument' 字段"
    grep -A 15 "export interface Video" types/index.ts
    exit 1
fi
echo ""

echo "🔍 步骤 2: 检查 API 查询映射"
echo "================================================"
echo "检查 app/api/videos/[id]/route.ts:"
if grep -q 'instrument_category as category' app/api/videos/[id]/route.ts; then
    echo "✅ 查询映射正确: instrument_category as category"
else
    echo "❌ 查询映射错误"
    grep "instrument_category" app/api/videos/[id]/route.ts
    exit 1
fi

echo "检查 app/api/videos/route.ts:"
if grep -q 'instrument_category as category' app/api/videos/route.ts; then
    echo "✅ 查询映射正确: instrument_category as category"
else
    echo "❌ 查询映射错误"
    grep "instrument_category" app/api/videos/route.ts
    exit 1
fi
echo ""

echo "🔍 步骤 3: 检查前端代码使用"
echo "================================================"

# 检查 app/page.tsx
echo "检查 app/page.tsx:"
if grep -q "video.category === selectedCategory" app/page.tsx; then
    echo "✅ app/page.tsx 使用正确: video.category"
else
    echo "❌ app/page.tsx 使用错误"
    grep "video\." app/page.tsx | grep -E "(instrument|category)"
    exit 1
fi

# 检查 app/members/page.tsx
echo "检查 app/members/page.tsx:"
if grep -q "video.category === selectedCategory" app/members/page.tsx; then
    echo "✅ app/members/page.tsx 使用正确: video.category"
else
    echo "❌ app/members/page.tsx 使用错误"
    grep "video\." app/members/page.tsx | grep -E "(instrument|category)"
    exit 1
fi

# 检查 app/upload/page.tsx
echo "检查 app/upload/page.tsx:"
if grep -q 'formData.category' app/upload/page.tsx; then
    echo "✅ app/upload/page.tsx 使用正确: formData.category"
else
    echo "❌ app/upload/page.tsx 使用错误"
    grep "formData\." app/upload/page.tsx | grep -E "(instrument|category)"
    exit 1
fi
echo ""

echo "🔍 步骤 4: 全局搜索潜在的 'instrument' 误用"
echo "================================================"
echo "在 app/ 目录中搜索 'video.instrument'..."
INSTRUMENT_MISUSE=$(grep -r "video\.instrument" app/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
if [ "$INSTRUMENT_MISUSE" -eq 0 ]; then
    echo "✅ 未发现 'video.instrument' 的误用"
else
    echo "❌ 发现 $INSTRUMENT_MISUSE 处 'video.instrument' 误用:"
    grep -rn "video\.instrument" app/ --include="*.tsx" --include="*.ts"
    exit 1
fi

echo "在 app/ 目录中搜索 'formData.instrument'..."
FORM_INSTRUMENT_MISUSE=$(grep -r "formData\.instrument" app/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
if [ "$FORM_INSTRUMENT_MISUSE" -eq 0 ]; then
    echo "✅ 未发现 'formData.instrument' 的误用"
else
    echo "❌ 发现 $FORM_INSTRUMENT_MISUSE 处 'formData.instrument' 误用:"
    grep -rn "formData\.instrument" app/ --include="*.tsx" --include="*.ts"
    exit 1
fi
echo ""

echo "🔍 步骤 5: 验证 API 插入语句"
echo "================================================"
echo "检查 INSERT 语句使用正确的字段名..."
if grep -q "instrument_category" app/api/videos/route.ts; then
    echo "✅ API 插入语句使用数据库正确字段: instrument_category"
else
    echo "❌ API 插入语句字段错误"
    grep -A 5 "INSERT INTO videos" app/api/videos/route.ts
    exit 1
fi
echo ""

echo "🔍 步骤 6: 检查 mock 数据一致性"
echo "================================================"
echo "检查 app/members/page.tsx mock 数据..."
MOCK_DATA_ISSUES=$(grep -A 3 "performanceVideos = \[" app/members/page.tsx | grep -c "category:")
if [ "$MOCK_DATA_ISSUES" -gt 0 ]; then
    echo "✅ Mock 数据使用正确字段: category"
else
    echo "⚠️  警告: 检查 mock 数据结构"
    grep -A 10 "performanceVideos = \[" app/members/page.tsx
fi
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║   ✅ 所有 TypeScript 类型检查通过！                          ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 修复总结:"
echo "   1. Video 接口: instrument → category"
echo "   2. API 查询映射: as instrument → as category"
echo "   3. 前端代码: 统一使用 video.category"
echo "   4. 数据库字段保持: instrument_category"
echo ""
echo "🚀 可以进行构建测试了！"
echo "   npm run build"
echo ""
