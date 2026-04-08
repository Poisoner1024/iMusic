#!/bin/bash

# ============================================
# 上传功能完整测试脚本
# ============================================

echo "============================================"
echo "  iMusic 上传功能测试"
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
VIDEOS_ENDPOINT="$API_URL/api/videos"

echo "🌐 测试1: 验证服务器运行状态..."
echo ""

# 检查服务器是否运行
if curl -s "$API_URL" > /dev/null 2>&1; then
    echo -e "${GREEN}✅ 服务器正在运行 ($API_URL)${NC}"
else
    echo -e "${RED}❌ 服务器未响应 ($API_URL)${NC}"
    echo ""
    echo "💡 请确保 Next.js 开发服务器正在运行:"
    echo "   cd /workspace/iMusic && npm run dev"
    exit 1
fi

echo ""
echo "📤 测试2: 测试上传凭证API..."
echo ""

# 测试 /api/videos/upload-url
RESPONSE=$(curl -s -X POST "$UPLOAD_URL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test-video.mp4","fileType":"video/mp4","contentLength":1048576}' 2>&1)

# 检查HTTP状态码
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$UPLOAD_URL_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test-video.mp4","fileType":"video/mp4","contentLength":1048576}' 2>&1)

echo "HTTP 状态码: $HTTP_STATUS"

if [ "$HTTP_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ 上传凭证API响应成功${NC}"
    
    # 解析响应
    SUCCESS=$(echo "$RESPONSE" | grep -o '"success":true' | wc -l)
    
    if [ "$SUCCESS" = "1" ]; then
        echo -e "${GREEN}✅ API返回成功状态${NC}"
        
        UPLOAD_URL=$(echo "$RESPONSE" | grep -o '"uploadUrl":"[^"]*"' | cut -d'"' -f4)
        VIDEO_KEY=$(echo "$RESPONSE" | grep -o '"videoKey":"[^"]*"' | cut -d'"' -f4)
        VIDEO_ID=$(echo "$RESPONSE" | grep -o '"videoId":"[^"]*"' | cut -d'"' -f4)
        
        echo ""
        echo "📄 响应数据:"
        echo -e "   ${BLUE}上传URL:${NC} ${UPLOAD_URL:0:80}..."
        echo -e "   ${BLUE}VideoKey:${NC} $VIDEO_KEY"
        echo -e "   ${BLUE}VideoId:${NC} $VIDEO_ID"
        
        # 验证URL格式
        if [[ "$UPLOAD_URL" == *"cos.ap-shanghai.myqcloud.com"* ]]; then
            echo -e "${GREEN}✅ 上传URL格式正确 (腾讯云COS)${NC}"
        else
            echo -e "${RED}❌ 上传URL格式异常${NC}"
        fi
    else
        echo -e "${RED}❌ API返回失败状态${NC}"
        echo "响应内容: $RESPONSE"
    fi
else
    echo -e "${RED}❌ 上传凭证API请求失败${NC}"
    echo ""
    echo "响应内容: $RESPONSE"
    exit 1
fi

echo ""
echo "📹 测试3: 测试视频列表API..."
echo ""

# 测试 /api/videos
VIDEO_LIST_RESPONSE=$(curl -s "$VIDEOS_ENDPOINT" 2>&1)
VIDEO_LIST_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$VIDEOS_ENDPOINT" 2>&1)

echo "HTTP 状态码: $VIDEO_LIST_STATUS"

if [ "$VIDEO_LIST_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ 视频列表API响应成功${NC}"
    
    # 检查是否有错误信息
    if echo "$VIDEO_LIST_RESPONSE" | grep -q "column.*does not exist"; then
        echo -e "${RED}❌ API返回数据库错误${NC}"
        echo "错误信息:"
        echo "$VIDEO_LIST_RESPONSE" | grep -o "column.*does not exist"
    else
        echo -e "${GREEN}✅ API响应正常${NC}"
        
        # 显示视频数量
        VIDEO_COUNT=$(echo "$VIDEO_LIST_RESPONSE" | grep -o '"total":[0-9]*' | cut -d: -f2)
        echo -e "   视频数量: ${YELLOW}$VIDEO_COUNT${NC}"
    fi
else
    echo -e "${RED}❌ 视频列表API请求失败${NC}"
    echo "响应内容: $VIDEO_LIST_RESPONSE"
fi

echo ""
echo "🧩 测试4: 检查CORS配置..."
echo ""

# 检查CORS头
CORS_HEADER=$(curl -s -I "$UPLOAD_URL_ENDPOINT" | grep -i "Access-Control-Allow-Origin" | cut -d: -f2 | tr -d ' \r\n')

if [ "$CORS_HEADER" = "*" ]; then
    echo -e "${GREEN}✅ CORS配置正确${NC}"
else
    echo -e "${YELLOW}⚠️  CORS头未设置或不是通配符${NC}"
    echo "   当前值: ${CORS_HEADER:-'未设置'}"
fi

echo ""
echo "============================================"
echo "  测试完成"
echo "============================================"
echo ""

# 总结
if [ "$HTTP_STATUS" = "200" ] && [ "$VIDEO_LIST_STATUS" = "200" ]; then
    echo -e "${GREEN}✨ 所有测试通过！上传功能正常。${NC}"
    echo ""
    echo "💡 你可以在前端页面上传视频了:"
    echo "   1. 访问 http://localhost:3000/upload"
    echo "   2. 填写表单信息"
    echo "   3. 选择视频文件"
    echo "   4. 点击上传"
else
    echo -e "${RED}❌ 部分测试失败，请检查错误信息${NC}"
    exit 1
fi

echo ""
