#!/usr/bin/env node

/**
 * 测试 /api/videos 端点
 */

const http = require('http');

const API_URL = 'http://localhost:3000/api/videos';

console.log(`🧪 测试 API: ${API_URL}\n`);

const req = http.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`✅ 响应状态码: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      try {
        const jsonData = JSON.parse(data);
        console.log(`📊 视频总数: ${jsonData.total || 0}`);
        
        if (jsonData.videos && jsonData.videos.length > 0) {
          console.log('\n🎬 前几个视频:');
          jsonData.videos.slice(0, 3).forEach((video, idx) => {
            console.log(`  ${idx + 1}. ${video.title}`);
            console.log(`     表演者: ${video.performer}`);
            console.log(`     分类: ${video.category}`);
          });
        } else {
          console.log('\n💡 videos表为空，这是正常的初始状态');
        }
        
        console.log('\n✨ API 测试成功！数据库错误已修复。');
      } catch (e) {
        console.log('\n❌ 响应解析失败:', e.message);
        console.log('原始响应:', data.substring(0, 200));
      }
    } else {
      console.log('\n❌ API 返回错误状态码');
      console.log('响应内容:', data.substring(0, 500));
    }
  });
});

req.on('error', (err) => {
  console.error(`\n❌ API 请求失败: ${err.message}`);
  console.error('\n💡 请确保:');
  console.error('  1. Next.js 开发服务器正在运行 (npm run dev)');
  console.error('  2. 服务器监听在 3000 端口');
  process.exit(1);
});

req.setTimeout(5000, () => {
  req.destroy();
  console.error('\n❌ 请求超时');
  process.exit(1);
});
