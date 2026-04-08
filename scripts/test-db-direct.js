#!/usr/bin/env node

/**
 * 直接测试数据库连接
 */

const { Pool } = require('pg')

async function testConnection() {
  console.log('╔════════════════════════════════════╗')
  console.log('║   数据库连接测试                   ║')
  console.log('╚════════════════════════════════════╝\n')

  // 使用环境变量中的 DATABASE_URL
  const databaseUrl = process.env.DATABASE_URL || 'postgresql://username:password@your-host:5432/imusic_db'

  console.log('连接地址:', databaseUrl.replace(/:([^:@]+)@/, ':****@'))
  console.log('')

  const pool = new Pool({
    connectionString: databaseUrl,
    ssl: false
  })

  try {
    console.log('🔄 正在连接数据库...')
    const client = await pool.connect()
    console.log('✅ 连接成功！')
    console.log('')

    // 测试查询
    console.log('🧪 执行测试查询...')
    const result = await client.query('SELECT version()')
    console.log('📊 PostgreSQL 版本:', result.rows[0].version)
    console.log('')

    const dbResult = await client.query('SELECT current_database()')
    console.log('📂 当前数据库:', dbResult.rows[0].current_database)
    console.log('')

    const countResult = await client.query('SELECT COUNT(*) as count FROM videos')
    console.log('🎬 videos 表记录数:', countResult.rows[0].count)
    console.log('')

    client.release()
    console.log('🎉 所有测试通过！')
    process.exit(0)
  } catch (error) {
    console.error('❌ 连接失败:', error.message)
    console.error('')
    console.error('错误详情:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

testConnection()
