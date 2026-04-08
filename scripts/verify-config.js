#!/usr/bin/env node

/**
 * 配置验证脚本
 * 检查所有必需的环境变量是否已正确配置
 */

console.log('╔════════════════════════════════════╗')
console.log('║   iMusic 配置验证                 ║')
console.log('╚════════════════════════════════════╝\n')

const requiredEnvVars = [
  'DATABASE_URL',
  'COS_SECRET_ID',
  'COS_SECRET_KEY',
  'COS_BUCKET',
  'COS_REGION',
  'TENCENTCLOUD_REGION'
]

let allValid = true

console.log('📋 检查环境变量:\n')

requiredEnvVars.forEach((varName) => {
  const value = process.env[varName]
  if (value && value !== 'your_' + varName.toLowerCase() + '_here') {
    console.log(`✅ ${varName}: 已设置`)
    if (varName.includes('SECRET')) {
      console.log(`   值: ${value.substring(0, 10)}...`)
    } else {
      console.log(`   值: ${value}`)
    }
  } else {
    console.log(`❌ ${varName}: 未设置或无效`)
    allValid = false
  }
})

console.log('\n🔍 详细验证:\n')

// 验证数据库URL格式
const dbUrl = process.env.DATABASE_URL
if (dbUrl) {
  const dbPattern = /^postgresql:\/\/[^:]+:[^@]+@[^:]+:\d+\/\w+$/
  if (dbPattern.test(dbUrl)) {
    console.log('✅ 数据库URL格式正确')
  } else {
    console.log('❌ 数据库URL格式不正确')
    allValid = false
  }
}

// 验证COS配置
const cosBucket = process.env.COS_BUCKET
if (cosBucket && cosBucket.includes('-') && cosBucket.length > 10) {
  console.log('✅ COS存储桶名称格式正确')
} else {
  console.log('⚠️  COS存储桶名称可能无效')
}

const cosRegion = process.env.COS_REGION
if (cosRegion && cosRegion.startsWith('ap-')) {
  console.log('✅ COS地域格式正确')
} else {
  console.log('❌ COS地域格式不正确')
  allValid = false
}

console.log('\n╔════════════════════════════════════╗')
console.log('║   验证结果                        ║')
console.log('╚════════════════════════════════════╝')

if (allValid) {
  console.log('\n🎉 所有配置验证通过！\n')
  console.log('下一步:')
  console.log('1. 运行 npm run test:backend 测试后端连接')
  console.log('2. 运行 npm run dev 启动应用\n')
  process.exit(0)
} else {
  console.log('\n⚠️  部分配置验证失败\n')
  console.log('请检查:')
  console.log('- .env.local 文件是否存在')
  console.log('- 环境变量是否正确设置')
  console.log('- 配置值格式是否正确\n')
  process.exit(1)
}
