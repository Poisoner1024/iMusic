#!/usr/bin/env node

/**
 * 后端功能测试脚本
 * 用于验证API接口和数据库连接是否正常
 */

const { query } = require('../lib/tencentcloud/db.ts')

async function testDatabaseConnection() {
  console.log('🧪 测试数据库连接...')
  try {
    const result = await query('SELECT version()')
    console.log('✅ 数据库连接成功:', result.rows[0].version)
    return true
  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    return false
  }
}

async function testVideosTable() {
  console.log('\n🧪 测试 videos 表...')
  try {
    const result = await query('SELECT COUNT(*) as count FROM videos')
    console.log('✅ videos 表查询成功, 当前记录数:', result.rows[0].count)
    return true
  } catch (error) {
    console.error('❌ videos 表查询失败:', error.message)
    return false
  }
}

async function testMockData() {
  console.log('\n🧪 插入测试数据...')
  try {
    const result = await query(`
      INSERT INTO videos (
        id, title, description, video_url, video_key, performer,
        instrument_category, status, tags, views, likes
      ) VALUES (
        'test-' || gen_random_uuid(),
        '测试视频',
        '这是一个测试视频',
        'https://example.com/video.mp4',
        'videos/test.mp4',
        '测试用户',
        'piano',
        'published',
        ARRAY['测试', '演示'],
        10,
        5
      ) RETURNING id
    `)
    console.log('✅ 测试数据插入成功, ID:', result.rows[0].id)
    return result.rows[0].id
  } catch (error) {
    console.error('❌ 测试数据插入失败:', error.message)
    return null
  }
}

async function testCOSConnection() {
  console.log('\n🧪 测试腾讯云COS连接...')
  try {
    const { generateUploadUrl } = await import('../lib/tencentcloud/cos.ts')
    const uploadInfo = await generateUploadUrl('test-video.mp4', 'video/mp4', 1024 * 1024)
    console.log('✅ COS连接成功, 上传URL已生成')
    console.log('   视频ID:', uploadInfo.videoId)
    console.log('   视频Key:', uploadInfo.videoKey)
    return true
  } catch (error) {
    console.error('❌ COS连接失败:', error.message)
    return false
  }
}

async function runAllTests() {
  console.log('╔════════════════════════════════════╗')
  console.log('║   iMusic 后端功能测试             ║')
  console.log('╚════════════════════════════════════╝\n')

  const results = []

  // 测试1: 数据库连接
  results.push(await testDatabaseConnection())

  // 测试2: Videos表
  results.push(await testVideosTable())

  // 测试3: COS连接
  results.push(await testCOSConnection())

  // 测试4: 插入测试数据（可选）
  // const testId = await testMockData()
  // if (testId) {
  //   console.log('\n🧪 清理测试数据...')
  //   await query('DELETE FROM videos WHERE id = $1', [testId])
  //   console.log('✅ 测试数据已清理')
  // }

  console.log('\n╔════════════════════════════════════╗')
  console.log('║   测试结果总结                    ║')
  console.log('╚════════════════════════════════════╝')
  console.log(`\n总测试项: ${results.length}`)
  console.log(`通过: ${results.filter(r => r).length}`)
  console.log(`失败: ${results.filter(r => !r).length}`)

  if (results.every(r => r)) {
    console.log('\n🎉 所有测试通过！后端功能正常。')
    process.exit(0)
  } else {
    console.log('\n⚠️  部分测试失败，请检查配置。')
    process.exit(1)
  }
}

// 运行测试
runAllTests().catch(console.error)
