#!/bin/bash

# 简单的数据库连接测试

echo "=== 数据库连接测试 ==="
echo "连接字符串: postgresql://username:****@your-host:5432/imusic_db"
echo ""

# 测试连接
psql "postgresql://username:password@your-host:5432/imusic_db" <<EOF
SELECT version();
SELECT current_database();
SELECT COUNT(*) as video_count FROM videos;
\q
EOF

echo ""
echo "=== 测试完成 ==="
