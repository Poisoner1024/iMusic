#!/usr/bin/env node

/**
 * 验证 videos 表字段
 * 检查 error_message 和 processed_at 是否存在
 */

const { Client } = require('pg')

// 从环境变量获取数据库连接信息
const DB_URL = process.env.DATABASE_URL

if (!DB_URL) {
  console.error('❌ 错误: DATABASE_URL 环境变量未设置')
  process.exit(1)
}

async function verifyFields() {
  const client = new Client({
    connectionString: DB_URL,
    ssl: process.env.DB_SSL_DISABLED === 'true' ? false : { rejectUnauthorized: false }
  })

  try {
    await client.connect()
    console.log('✅ 数据库连接成功')

    // 检查 error_message 字段
    const errorMessageResult = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'videos' AND column_name = 'error_message'
      ) as exists
    `)
    
    const hasErrorMessage = errorMessageResult.rows[0].exists
    console.log(`${hasErrorMessage ? '✅' : '❌'} error_message 字段: ${hasErrorMessage ? '已存在' : '不存在'}`)

    // 检查 processed_at 字段
    const processedAtResult = await client.query(`
      SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'videos' AND column_name = 'processed_at'
      ) as exists
    `)
    
    const hasProcessedAt = processedAtResult.rows[0].exists
    console.log(`${hasProcessedAt ? '✅' : '❌'} processed_at 字段: ${hasProcessedAt ? '已存在' : '不存在'}`)

    // 显示完整的表结构
    if (hasErrorMessage && hasProcessedAt) {
      console.log('\n✅ 所有必需的字段都已存在！')
      
      // 显示新增字段的详细信息
      const fieldsInfo = await client.query(`
        SELECT 
          column_name, 
          data_type, 
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_name = 'videos' 
        AND column_name IN ('error_message', 'processed_at')
        ORDER BY ordinal_position
      `)
      
      console.log('\n新增字段详情:')
      fieldsInfo.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type} (可空: ${row.is_nullable})`)
      })
    } else {
      console.log('\n❌ 缺少必需的字段，请运行 scripts/add-video-fields.sql')
      process.exit(1)
    }

    // 检查是否有数据
    const countResult = await client.query('SELECT COUNT(*) as count FROM videos')
    const count = countResult.rows[0].count
    console.log(`\n📊 videos 表当前有 ${count} 条记录`)

    await client.end()
    
    if (hasErrorMessage && hasProcessedAt) {
      console.log('\n✅ 验证通过！')
      process.exit(0)
    } else {
      process.exit(1)
    }

  } catch (error) {
    console.error('❌ 数据库连接失败:', error.message)
    process.exit(1)
  }
}

verifyFields()
