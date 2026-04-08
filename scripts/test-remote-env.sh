#!/bin/bash

echo "╔════════════════════════════════════╗"
echo "║   腾讯云远程环境测试              ║"
echo "╚════════════════════════════════════╝"
echo ""

# 加载环境变量
echo "🔄 加载环境变量..."
export $(cat /workspace/iMusic/.env.local | grep -v '^#' | xargs)
echo "✅ 环境变量已加载"
echo ""

# 测试1: 数据库连接
echo "🧪 测试1: PostgreSQL 数据库连接..."
echo "   数据库主机: ${DATABASE_URL##*@}"
echo ""

psql "$DATABASE_URL" -c "SELECT version();" <<EOF
SELECT version();
SELECT current_database();
SELECT COUNT(*) as video_count FROM videos;
\q
EOF

if [ $? -eq 0 ]; then
    echo "✅ 数据库连接成功！"
else
    echo "❌ 数据库连接失败！"
fi
echo ""

# 测试2: 检查环境变量
echo "🧪 测试2: 环境变量检查..."
echo ""

if [ -n "$COS_SECRET_ID" ] && [[ "$COS_SECRET_ID" != "YOUR_*" ]]; then
    echo "✅ COS_SECRET_ID: 已设置 (${COS_SECRET_ID:0:20}...)"
else
    echo "❌ COS_SECRET_ID: 未设置或无效"
fi

if [ -n "$COS_BUCKET" ] && [[ "$COS_BUCKET" != "your-*" ]]; then
    echo "✅ COS_BUCKET: 已设置 ($COS_BUCKET)"
else
    echo "❌ COS_BUCKET: 未设置或无效"
fi

if [ -n "$COS_REGION" ]; then
    echo "✅ COS_REGION: 已设置 ($COS_REGION)"
else
    echo "❌ COS_REGION: 未设置"
fi
echo ""

# 测试3: 测试COS连接（如果安装了AWS CLI）
echo "🧪 测试3: COS连接（Node.js测试）..."
node -e "
const { S3Client, ListObjectsCommand } = require('@aws-sdk/client-s3');

const s3 = new S3Client({
  region: process.env.COS_REGION || 'ap-shanghai',
  endpoint: \`https://cos.\${process.env.COS_REGION || 'ap-shanghai'}.myqcloud.com\`,
  credentials: {
    accessKeyId: process.env.COS_SECRET_ID,
    secretAccessKey: process.env.COS_SECRET_KEY
  },
  forcePathStyle: true
});

(async () => {
  try {
    await s3.send(new ListObjectsCommand({ Bucket: process.env.COS_BUCKET, MaxKeys: 1 }));
    console.log('✅ COS连接成功！');
  } catch (err) {
    console.log('❌ COS连接失败:', err.message);
  }
})();
"
echo ""

echo "╔════════════════════════════════════╗"
echo "║   测试完成                        ║"
echo "╚════════════════════════════════════╝"
