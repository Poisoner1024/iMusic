#!/usr/bin/env node

/**
 * IM公益声传社团 - 数据库迁移脚本
 * 执行数据库初始化
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function main() {
  log('\n========================================', 'bright')
  log('  数据库初始化', 'bright')
  log('========================================\n', 'bright')
  
  // 检查环境变量
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) {
    log('❌ DATABASE_URL 环境变量未设置', 'red')
    log('   请在 .env.local 文件中配置数据库连接字符串\n', 'yellow')
    process.exit(1)
  }
  
  log(`数据库地址: ${databaseUrl.split('@')[1]?.split('/')[0] || 'localhost'}`, 'blue')
  
  try {
    // 检查psql命令是否存在
    execSync('which psql', { stdio: 'ignore' })
  } catch (error) {
    log('❌ 未找到 psql 命令', 'red')
    log('   请确保 PostgreSQL 客户端已安装\n', 'yellow')
    log('   Mac: brew install postgresql', 'yellow')
    log('   Ubuntu: apt-get install postgresql-client', 'yellow')
    process.exit(1)
  }
  
  // 检查SQL文件
  const sqlFile = path.join(__dirname, '../lib/db/init.sql')
  if (!fs.existsSync(sqlFile)) {
    log('❌ 初始化脚本不存在', 'red')
    log(`   ${sqlFile}\n`, 'yellow')
    process.exit(1)
  }
  
  log('正在执行数据库初始化...', 'blue')
  
  try {
    // 执行SQL脚本
    execSync(`psql "${databaseUrl}" -f "${sqlFile}"`, {
      stdio: 'inherit',
    })
    
    log('\n✅ 数据库初始化成功！', 'green')
    log('\n已创建的数据表：', 'blue')
    log('   - members (会员表)', 'yellow')
    log('   - videos (视频表)', 'yellow')
    log('   - activities (活动表)', 'yellow')
    log('   - activity_photos (活动照片表)', 'yellow')
    log('   - member_stories (会员故事表)', 'yellow')
    log('   - teachers (师资表)', 'yellow')
    log('   - contact_forms (联系表单表)', 'yellow')
    log('   - admins (管理员表)', 'yellow')
    log('\n已插入初始数据：', 'blue')
    log('   - Founder会员: IRIS (#001), DIEGO (#019), MIYA (#024)', 'yellow')
    log('\n========================================', 'bright')
    log('  数据库准备就绪！', 'green')
    log('========================================\n', 'bright')
    
  } catch (error) {
    log('\n❌ 数据库初始化失败', 'red')
    log(`   错误: ${error.message}\n`, 'yellow')
    process.exit(1)
  }
}

if (require.main === module) {
  // 加载环境变量
  const envPath = path.join(process.cwd(), '.env.local')
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8')
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^#=]+)=(.*)$/)
      if (match) {
        process.env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '')
      }
    })
  }
  
  main()
}

module.exports = { main }