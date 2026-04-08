#!/bin/bash

# ============================================
# 上传功能诊断脚本
# ============================================

echo "============================================"
echo "  iMusic 上传功能诊断"
echo "============================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"
UPLOAD_URL_ENDPOINT="$API_URL/api/videos/upload-url"

echo "🌐 步骤1: 验证服务器状态..."
echo ""

# 检查服务器是否响应
if curl -s "$API_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 服务器正在运行 ($API_URL)${NC}"
else
    echo -e "${RED}❌ 服务器未响应 ($API_URL)${NC}"
    echo ""
    echo "💡 请运行: cd /workspace/iMusic && npm run dev"
    exit 1
fi

echo ""
echo "📤 步骤2: 测试上传凭证API..."
echo ""

# 调用上传凭证API
HTTP_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$UPLOAD_URL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.mp4","fileType":"video/mp4","contentLength":1048576}' 2>&1)

# 分离响应体和状态码
HTTP_BODY=$(echo "$HTTP_RESPONSE" | sed '$d')
HTTP_STATUS=$(echo "$HTTP_RESPONSE" | tail -n1)

echo "HTTP 状态码: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ API响应成功${NC}"
    
    # 解析响应
    echo ""
    echo "📄 响应内容:"
    echo "$HTTP_BODY" | python3 -m json.tool 2>/dev/null || echo "$HTTP_BODY"
    
    # 检查是否有错误
    if echo "$HTTP_BODY" | grep -q '"success":false'; then
        echo -e "${RED}❌ API返回失败${NC}"
        ERROR_MSG=$(echo "$HTTP_BODY" | grep -o '"error":"[^"]*"' | cut -d'"' -f4)
        echo "错误信息: $ERROR_MSG"
    else
        echo -e "${GREEN}✅ API返回成功${NC}"
        
        # 提取关键信息
        UPLOAD_URL=$(echo "$HTTP_BODY" | grep -o '"uploadUrl":"[^"]*"' | cut -d'"' -f4 | sed 's/\\//g')
        VIDEO_KEY=$(echo "$HTTP_BODY" | grep -o '"videoKey":"[^"]*"' | cut -d'"' -f4)
        VIDEO_ID=$(echo "$HTTP_BODY" | grep -o '"videoId":"[^"]*"' | cut -d'"' -f4)
        
        echo ""
        echo "🔑 凭证信息:"
        echo -e "   ${BLUE}Video ID:${NC} $VIDEO_ID"
        echo -e "   ${BLUE}Video Key:${NC} $VIDEO_KEY"
        echo ""
        echo -e "   ${BLUE}上传URL:${NC} ${UPLOAD_URL:0:80}..."
        
        # 验证URL格式
        if [[ "$UPLOAD_URL" == *"cos.ap-shanghai.myqcloud.com"* ]]; then
            echo -e "${GREEN}✅ URL格式正确 (腾讯云COS)${NC}"
        else
            echo -e "${RED}❌ URL格式异常${NC}"
        fi
        
        # 检查URL是否包含签名参数
        if [[ "$UPLOAD_URL" == *"X-Amz-Signature="* ]]; then
            echo -e "${GREEN}✅ URL包含签名参数${NC}"
        else
            echo -e "${RED}❌ URL缺少签名参数${NC}"
        fi
    fi
else
    echo -e "${RED}❌ API请求失败${NC}"
    echo ""
    echo "响应内容:"
    echo "$HTTP_BODY"
fi

echo ""
echo "🔍 步骤3: 检查环境变量配置..."
echo ""

# 检查.env.local文件
if [ -f "/workspace/iMusic/.env.local" ]; then
    echo -e "${GREEN}✅ .env.local 文件存在${NC}"
    
    # 检查关键变量
    if grep -q "TENCENTCLOUD_SECRET_ID" /workspace/iMusic/.env.local; then
        echo -e "${GREEN}✅ TENCENTCLOUD_SECRET_ID 已配置${NC}"
    else
        echo -e "${RED}❌ TENCENTCLOUD_SECRET_ID 未配置${NC}"
    fi
    
    if grep -q "TENCENTCLOUD_SECRET_KEY" /workspace/iMusic/.env.local; then
        echo -e "${GREEN}✅ TENCENTCLOUD_SECRET_KEY 已配置${NC}"
    else
        echo -e "${RED}❌ TENCENTCLOUD_SECRET_KEY 未配置${NC}"
    fi
    
    if grep -q "COS_BUCKET" /workspace/iMusic/.env.local; then
        echo -e "${GREEN}✅ COS_BUCKET 已配置${NC}"
    else
        echo -e "${RED}❌ COS_BUCKET 未配置${NC}"
    fi
else
    echo -e "${RED}❌ .env.local 文件不存在${NC}"
fi

echo ""
echo "📊 步骤4: 检查COS SDK配置..."
echo ""

# 检查cos.ts文件
COS_FILE="/workspace/iMusic/lib/tencentcloud/cos.ts"
if [ -f "$COS_FILE" ]; then
    echo -e "${GREEN}✅ COS SDK文件存在${NC}"
    
    # 检查使用的环境变量名
    if grep -q "TENCENTCLOUD_SECRET_ID" "$COS_FILE"; then
        echo -e "${GREEN}✅ SDK使用正确的变量名: TENCENTCLOUD_SECRET_ID${NC}"
    else
        echo -e "${RED}❌ SDK使用的变量名不正确${NC}"
    fi
else
    echo -e "${RED}❌ COS SDK文件不存在${NC}"
fi

echo ""
echo "============================================"
echo "  诊断完成"
echo "============================================"
echo ""

# 总结
if [ "$HTTP_STATUS" = "200" ] && echo "$HTTP_BODY" | grep -q '"success":true'; then
    echo -e "${GREEN}✨ 上传功能配置正常！${NC}"
    echo ""
    echo "💡 你可以在前端页面上传视频了:"
    echo "   访问 http://localhost:3000/upload"
else
    echo -e "${RED}❌ 发现问题，请根据以上信息排查${NC}"
    echo ""
    echo "常见问题:"
    echo "   1. 环境变量名称不匹配（检查TENCENTCLOUD_SECRET_ID）"
    echo "   2. 密钥无效或已过期"
    echo "   3. 存储桶不存在或无权限"
    echo "   4. 服务器未正确重启"
    echo ""
    echo "解决方案:"
    echo "   - 确保.env.local中的变量名与代码一致"
    echo "   - 重启Next.js服务器: cd /workspace/iMusic && npm run dev"
    echo "   - 检查腾讯云密钥是否有COS权限"
fi

echo ""
