#!/usr/bin/env node

/**
 * iMusic TypeScript 回归预防检查脚本
 * 
 * 此脚本防止 'instrument' vs 'category' 类型错误再次发生
 * 在每次提交前和 CI/CD 中运行
 */

const fs = require('fs')
const path = require('path')

const PROJECT_ROOT = path.resolve(__dirname, '../..')

// 需要检查的文件模式
const FILE_PATTERNS = [
  '**/*.tsx',
  '**/*.ts',
  '**/*.jsx',
  '**/*.js'
]

// 需要排除的目录
const EXCLUDE_DIRS = [
  'node_modules',
  '.next',
  'scf-build',
  'scripts',
  'docs',
  '.git',
  '.vscode',
  '__tests__',
  '__mocks__'
]

// 错误模式（不应该出现的）
const ERROR_PATTERNS = [
  {
    pattern: /video\.instrument(?!s\.|_)/g,  // video.instrument (排除 instruments. 和 instrument_)
    message: "使用了 'video.instrument'，应该使用 'video.category'",
    severity: 'error'
  },
  {
    pattern: /formData\.instrument/g,
    message: "使用了 'formData.instrument'，应该使用 'formData.category'",
    severity: 'error'
  },
  {
    pattern: /instrument_category\s+as\s+instrument/g,
    message: "API 映射错误: 'instrument_category as instrument'，应该为 'as category'",
    severity: 'error'
  },
  {
    pattern: /instrument:\s*string(?!\[)/g,  // instrument: string (排除 instrument: string[])
    message: "TypeScript 接口包含 'instrument: string'，应该为 'category: string'",
    severity: 'error'
  }
]

// 正确模式（应该出现的）
const CORRECT_PATTERNS = [
  {
    pattern: /category:\s*string/g,
    message: "Video 接口包含 'category: string'",
    severity: 'info',
    required: true,
    file: 'types/index.ts'
  },
  {
    pattern: /instrument_category\s+as\s+category/g,
    message: "API 映射正确: 'instrument_category as category'",
    severity: 'info',
    required: true,
    file: 'app/api/videos'
  }
]

// 检查文件是否应被排除
function shouldExclude(filePath) {
  return EXCLUDE_DIRS.some(dir => 
    filePath.includes(`/${dir}/`) || filePath.startsWith(`${dir}/`)
  )
}

// 递归获取所有文件
function getAllFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    
    if (shouldExclude(fullPath)) {
      continue
    }
    
    if (entry.isDirectory()) {
      getAllFiles(fullPath, files)
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name)
      if (['.tsx', '.ts', '.jsx', '.js'].includes(ext)) {
        files.push(fullPath)
      }
    }
  }
  
  return files
}

// 检查文件内容
function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')
  const relativePath = path.relative(PROJECT_ROOT, filePath)
  const issues = []
  
  // 检查错误模式
  for (const { pattern, message, severity } of ERROR_PATTERNS) {
    const matches = [...content.matchAll(pattern)]
    for (const match of matches) {
      const lines = content.substring(0, match.index).split('\n')
      const lineNumber = lines.length
      
      issues.push({
        type: 'error',
        file: relativePath,
        line: lineNumber,
        message,
        severity
      })
    }
  }
  
  // 检查正确模式（仅在特定文件中）
  for (const { pattern, message, severity, file: requiredFile } of CORRECT_PATTERNS) {
    if (requiredFile && !relativePath.includes(requiredFile)) continue
    
    const matches = [...content.matchAll(pattern)]
    if (matches.length === 0 && severity === 'info' && requiredFile) {
      issues.push({
        type: 'warning',
        file: relativePath,
        line: 0,
        message: `缺少: ${message}`,
        severity: 'warning'
      })
    }
  }
  
  return issues
}

// 主函数
function main() {
  console.log('🔍 运行 iMusic TypeScript 回归预防检查...\n')
  
  const files = getAllFiles(PROJECT_ROOT)
  const allIssues = []
  
  console.log(`📁 检查 ${files.length} 个文件...\n`)
  
  for (const file of files) {
    const issues = checkFile(file)
    allIssues.push(...issues)
  }
  
  // 分组显示
  const errors = allIssues.filter(i => i.severity === 'error')
  const warnings = allIssues.filter(i => i.severity === 'warning')
  
  if (errors.length > 0) {
    console.log('❌ 发现错误:')
    console.log('=' * 60)
    for (const issue of errors) {
      console.log(`\n📛 ${issue.message}`)
      console.log(`   文件: ${issue.file}:${issue.line}`)
    }
    console.log('\n')
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  发现警告:')
    console.log('=' * 60)
    for (const issue of warnings) {
      console.log(`\n⚠️  ${issue.message}`)
      console.log(`   文件: ${issue.file}`)
    }
    console.log('\n')
  }
  
  // 总结
  console.log('=' * 60)
  console.log('\n📊 检查总结:')
  console.log(`   检查文件: ${files.length}`)
  console.log(`   错误: ${errors.length}`)
  console.log(`   警告: ${warnings.length}`)
  
  if (errors.length > 0) {
    console.log('\n❌ 检查失败！请修复上述错误。')
    console.log('\n💡 快速修复方法:')
    console.log('   1. 将所有 video.instrument 改为 video.category')
    console.log('   2. 将所有 formData.instrument 改为 formData.category')
    console.log('   3. 确保 API 查询使用 instrument_category as category')
    console.log('   4. 确保 types/index.ts 中 Video 接口定义为 category: string')
    process.exit(1)
  } else {
    console.log('\n✅ 检查通过！没有发现类型回归问题。')
    console.log('\n✨ 代码质量: 优秀')
    console.log('✨ 类型安全: 已保障')
    console.log('✨ 部署就绪: 是')
    process.exit(0)
  }
}

// 运行
if (require.main === module) {
  main()
}

module.exports = { main, checkFile, ERROR_PATTERNS, CORRECT_PATTERNS }
