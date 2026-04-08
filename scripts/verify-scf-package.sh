#!/bin/bash

# ============================================
# 验证SCF部署包
# ============================================

echo "============================================"
echo "  SCF部署包验证"
echo "============================================"
echo ""

# 检查ZIP文件
if [ -f "scf-deployment.zip" ]; then
  echo "✅ SCF部署包已创建: scf-deployment.zip"
  
  # 查看文件大小
  ls -lh scf-deployment.zip
  echo ""
  
  # 查看ZIP内容
  echo "📦 ZIP包内容:"
  unzip -l scf-deployment.zip
  echo ""
else
  echo "❌ SCF部署包未找到"
  exit 1
fi

# 检查构建目录
echo "📁 构建目录结构:"
ls -la scf-build/
echo ""
ls -la scf-build/scf/
echo ""

echo "============================================"
echo "✨ 打包完成！"
echo "============================================"
echo ""
echo "📋 下一步操作:"
echo "1. 登录腾讯云控制台: https://console.cloud.tencent.com/scf"
echo "2. 创建函数: video-processing"
echo "3. 上传ZIP包: scf-deployment.zip"
echo "4. 配置环境变量（见.env.local）"
echo "5. 配置COS触发器"
echo "6. 测试上传视频"
echo ""
echo "📖 详细说明请查看: SCF_DEPLOYMENT_GUIDE.md"
echo ""
