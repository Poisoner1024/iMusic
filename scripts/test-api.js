#!/usr/bin/env node

/**
 * 测试 /api/videos 端点
 */

const http = require('http');

const API_URL = 'http://localhost:3000/api/videos';

console.log(`🧪 测试 API: ${API_URL}\n`);

http.get(API_URL, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`✅ 响应状态码: ${res.statusCode}`);
    console.log(`📄 响应内容:\n${data}\n`);

    try {
      const jsonData = JSON.parse(data);
      if (Array.isArray(jsonData)) {
        console.log(`🎥 成功获取 ${jsonData.length} 个视频记录`);
        if (jsonData.length > 0) {
          console.log('\n前几条记录:');
          jsonData.slice(0, 3).forEach((video, idx) => {
            console.log(`  ${idx + 1}. ${video.title || 'N/A'} (状态: ${video.status})`);
          });
        } else {
          console.log('💡 videos表为空，这是正常的初始状态');
        }
      } else if (jsonData.error) {
        console.log(`❌ API 错误: ${jsonData.error}`);
      }
    } catch (e) {
      console.log('⚠️  响应不是有效的JSON格式');
    }
  });
}).on('error', (err) => {
  console.error(`❌ API 请求失败: ${err.message}`);
  console.error('\n💡 请确保:');
  console.error('  1. Next.js 开发服务器正在运行 (npm run dev)');
  console.error('  2. 服务器监听在 3000 端口');
  process.exit(1);
});
