#!/usr/bin/env node

/**
 * 测试视频 API 的实际响应
 * 检查字段类型和值
 */

async function testApi() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  console.log('🧪 测试视频 API 响应...\n')
  
  try {
    // 测试列表 API
    console.log('1. 测试 /api/videos (列表)')
    const listResponse = await fetch(`${baseUrl}/api/videos`)
    const listData = await listResponse.json()
    
    if (!listData.videos || listData.videos.length === 0) {
      console.log('   ⚠️  没有视频数据\n')
    } else {
      const video = listData.videos[0]
      console.log('   ✅ 获取到视频数据')
      console.log(`   - videoUrl 类型: ${typeof video.videoUrl}, 值: ${video.videoUrl}`)
      console.log(`   - thumbnail 类型: ${typeof video.thumbnail}, 值: ${video.thumbnail}`)
      console.log(`   - duration 类型: ${typeof video.duration}, 值: ${video.duration}`)
      console.log(`   - duration (原始): ${JSON.stringify(video.duration)}`)
      
      // 检查 duration 格式
      if (typeof video.duration === 'number') {
        console.log(`   ⚠️  duration 是数字，需要转换为字符串`)
        const minutes = Math.floor(video.duration / 60)
        const seconds = video.duration % 60
        console.log(`   💡 建议格式: "${minutes}:${seconds.toString().padStart(2, '0')}"`)
      } else if (typeof video.duration === 'string') {
        console.log(`   ✅ duration 是字符串`)
      } else {
        console.log(`   ❌ duration 类型异常: ${typeof video.duration}`)
      }
      console.log('')
    }
    
    // 如果列表有数据，测试详情 API
    if (listData.videos && listData.videos.length > 0) {
      const videoId = listData.videos[0].id
      console.log(`2. 测试 /api/videos/${videoId} (详情)`)
      
      const detailResponse = await fetch(`${baseUrl}/api/videos/${videoId}`)
      const detailData = await detailResponse.json()
      
      if (detailData.success && detailData.video) {
        const video = detailData.video
        console.log('   ✅ 获取到视频详情')
        console.log(`   - videoUrl 类型: ${typeof video.videoUrl}, 值: ${video.videoUrl}`)
        console.log(`   - thumbnail 类型: ${typeof video.thumbnail}, 值: ${video.thumbnail}`)
        console.log(`   - duration 类型: ${typeof video.duration}, 值: ${video.duration}`)
        console.log('')
        
        // 总结
        console.log('📊 字段类型总结:')
        console.log(`   videoUrl: ${typeof video.videoUrl}`)
        console.log(`   thumbnail: ${typeof video.thumbnail}`)
        console.log(`   duration: ${typeof video.duration} (${JSON.stringify(video.duration)})`)
        console.log('')
        
        // 检查视频 URL 是否可访问
        if (video.videoUrl) {
          console.log('🔍 检查视频 URL 可访问性:')
          console.log(`   URL: ${video.videoUrl}`)
          console.log('   建议: 复制 URL 到浏览器或 curl 测试')
        }
      } else {
        console.log('   ❌ 无法获取视频详情')
        console.log(`   错误: ${detailData.error || '未知错误'}`)
      }
    }
    
  } catch (error) {
    console.error('❌ API 测试失败:', error.message)
    console.log('\n💡 请确保:')
    console.log('   1. 开发服务器正在运行 (npm run dev)')
    console.log('   2. 数据库连接正常')
  }
}

testApi()
