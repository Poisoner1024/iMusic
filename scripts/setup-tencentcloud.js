#!/usr/bin/env node

/**
 * IM公益声传社团 - 腾讯云配置检查脚本
 * 检查必要的环境变量和配置文件
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

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

function checkEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local')
  
  if (!fs.existsSync(envPath)) {
    log('❌ .env.local 文件不存在', 'red')
    log('   请执行: cp .env.example .env.local', 'yellow')
    return false
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8')
  const requiredVars = [
    'TENCENTCLOUD_SECRET_ID',
    'TENCENTCLOUD_SECRET_KEY',
    'COS_BUCKET',
    'DATABASE_URL',
  ]
  
  const missingVars = requiredVars.filter(varName => {
    const regex = new RegExp(`^${varName}=`, 'm')
    return !regex.test(envContent) || envContent.match(regex)?.[0]?.includes('your_')
  })
  
  if (missingVars.length > 0) {
    log(`❌ 环境变量缺失: ${missingVars.join(', ')}`, 'red')
    log('   请在 .env.local 中配置正确的值', 'yellow')
    return false
  }
  
  log('✅ 环境变量配置正确', 'green')
  return true
}

function checkDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json')
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  
  const requiredDeps = [
    '@aws-sdk/client-s3',
    '@aws-sdk/s3-request-presigner',
    'pg',
    'uuid',
  ]
  
  const missingDeps = requiredDeps.filter(dep => 
    !packageJson.dependencies[dep] && !packageJson.devDependencies[dep]
  )
  
  if (missingDeps.length > 0) {
    log(`❌ 依赖包缺失: ${missingDeps.join(', ')}`, 'red')
    log('   请执行: npm install', 'yellow')
    return false
  }
  
  log('✅ 依赖包已安装', 'green')
  return true
}

function checkDatabaseConnection() {
  try {
    const dbModule = require('../lib/tencentcloud/db')
    log('✅ 数据库模块加载成功', 'green')
    return true
  } catch (error) {
    log('❌ 数据库模块加载失败', 'red')
    log(`   错误: ${error.message}`, 'yellow')
    return false
  }
}

function checkCosModule() {
  try {
    const cosModule = require('../lib/tencentcloud/cos')
    log('✅ COS模块加载成功', 'green')
    return true
  } catch (error) {
    log('❌ COS模块加载失败', 'red')
    log(`   错误: ${error.message}`, 'yellow')
    return false
  }
}

function checkInitScript() {
  const initScriptPath = path.join(process.cwd(), 'lib/db/init.sql')
  
  if (!fs.existsSync(initScriptPath)) {
    log('❌ 数据库初始化脚本不存在', 'red')
    return false
  }
  
  log('✅ 数据库初始化脚本存在', 'green')
  return true
}

function showNextSteps() {
  log('\n📋 下一步操作：', 'blue')
  log('   1. 配置 .env.local 文件中的腾讯云凭证', 'yellow')
  log('   2. 运行: npm install', 'yellow')
  log('   3. 初始化数据库: npm run db:init', 'yellow')
  log('   4. 启动开发服务器: npm run dev', 'yellow')
  log('   5. 访问: http://localhost:3000/upload 测试上传', 'yellow')
  log('\n📚 详细配置说明请查看:', 'blue')
  log('   docs/TENCENTCLOUD_SETUP.md', 'yellow')
}

function main() {
  log('\n========================================', 'bright')
  log('  腾讯云配置检查', 'bright')
  log('========================================\n', 'bright')
  
  const checks = [
    { name: '环境变量', fn: checkEnvFile },
    { name: '依赖包', fn: checkDependencies },
    { name: '数据库模块', fn: checkDatabaseConnection },
    { name: 'COS模块', fn: checkCosModule },
    { name: '初始化脚本', fn: checkInitScript },
  ]
  
  const results = checks.map(check => {
    log(`\n[${check.name}]`, 'blue')
    return check.fn()
  })
  
  const allPassed = results.every(result => result === true)
  
  log('\n========================================', 'bright')
  if (allPassed) {
    log('✅ 所有检查通过！', 'green')
    log('========================================\n', 'bright')
    showNextSteps()
  } else {
    log('❌ 部分检查未通过，请修复后重试', 'red')
    log('========================================\n', 'bright')
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

module.exports = { main }