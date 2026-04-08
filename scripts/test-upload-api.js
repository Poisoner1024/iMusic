#!/usr/bin/env node

/**
 * 测试 /api/videos/upload-url 端点
 */

const http = require('http');

const API_URL = 'http://localhost:3000/api/videos/upload-url';

console.log(`🧪 测试上传凭证API: ${API_URL}\n`);

const postData = JSON.stringify({
  fileName: 'test-video.mp4',
  fileType: 'video/mp4',
  contentLength: 1024 * 1024, // 1MB
});

const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = http.request(API_URL, options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log(`✅ 响应状态码: ${res.statusCode}`);
    
    if (res.statusCode === 200) {
      try {
        const jsonData = JSON.parse(data);
        console.log('\n📄 响应内容:');
        console.log(JSON.stringify(jsonData, null, 2));
        
        if (jsonData.success) {
          console.log('\n✨ API 测试成功！');
          console.log(`   上传URL: ${jsonData.uploadUrl.substring(0, 80)}...`);
          console.log(`   VideoKey: ${jsonData.videoKey}`);
          console.log(`   VideoId: ${jsonData.videoId}`);
        } else {
          console.log(`\n❌ API 返回错误: ${jsonData.error}`);
        }
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
  console.error('\n💡 可能原因:');
  console.error('  1. Next.js 开发服务器未运行');
  console.error('  2. 服务器地址或端口错误');
  console.error('  3. 网络连接问题');
  process.exit(1);
});

req.on('timeout', () => {
  req.destroy();
  console.error('\n❌ 请求超时');
  process.exit(1);
});

req.setTimeout(5000);
req.write(postData);
req.end();
