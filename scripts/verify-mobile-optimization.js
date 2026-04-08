#!/usr/bin/env node

/**
 * 验证移动端优化
 * 检查移动端适配的关键点
 */

const fs = require('fs')
const path = require('path')

function checkFile(filePath, checks) {
  const content = fs.readFileSync(filePath, 'utf8')
  const results = []
  
  checks.forEach(check => {
    const regex = new RegExp(check.pattern, check.flags || '')
    const match = regex.test(content)
    results.push({
      name: check.name,
      pattern: check.pattern,
      passed: match,
      description: check.description
    })
  })
  
  return results
}

function main() {
  console.log('🔍 移动端优化验证\n')
  console.log('=' .repeat(50))
  console.log()
  
  const checks = [
    // 检查 app/page.tsx
    {
      file: '/workspace/iMusic/app/page.tsx',
      checks: [
        {
          name: 'Hero 字体响应式',
          pattern: 'text-3xl md:text-6xl lg:text-7xl',
          description: 'Hero 标题使用响应式字体大小'
        },
        {
          name: 'Hero 内边距响应式',
          pattern: 'pt-24 md:pt-32 pb-16 md:pb-20',
          description: 'Hero 内边距使用响应式间距'
        },
        {
          name: '按钮触摸区域增大',
          pattern: 'px-6 py-3 md:px-8 md:py-4',
          description: '按钮在移动端有更大的触摸区域'
        },
        {
          name: '统计栏移动端 2 列',
          pattern: 'grid-cols-2 md:grid-cols-4',
          description: '统计栏在移动端显示 2 列'
        }
      ]
    },
    // 检查 VideoCategoryFilter
    {
      file: '/workspace/iMusic/components/VideoCategoryFilter.tsx',
      checks: [
        {
          name: '筛选器可滚动',
          pattern: 'overflow-x-auto',
          description: '筛选器支持横向滚动'
        },
        {
          name: '移动端网格优化',
          pattern: 'grid-cols-4 sm:grid-cols-6',
          description: '移动端显示 4 列筛选按钮'
        },
        {
          name: '最小宽度设置',
          pattern: 'min-w-max',
          description: '确保内容不会挤压'
        },
        {
          name: '负边距处理',
          pattern: '-mx-4 px-4',
          description: '处理容器边距，确保滚动区域'
        }
      ]
    },
    // 检查 VideoCard
    {
      file: '/workspace/iMusic/components/VideoCard.tsx',
      checks: [
        {
          name: '卡片响应式圆角',
          pattern: 'rounded-2xl md:rounded-3xl',
          description: '卡片圆角大小响应式'
        },
        {
          name: '卡片移动端阴影减小',
          pattern: 'shadow-lg md:shadow-xl',
          description: '移动端使用较小的阴影'
        },
        {
          name: '内容内边距响应式',
          pattern: 'p-4 md:p-6',
          description: '内容内边距响应式调整'
        },
        {
          name: '标题字体响应式',
          pattern: 'text-base md:text-xl',
          description: '标题字体大小响应式'
        },
        {
          name: '描述字体响应式',
          pattern: 'text-sm md:text-base',
          description: '描述字体大小响应式'
        },
        {
          name: '标签移动端简化',
          pattern: 'hidden sm:flex',
          description: '标签在移动端隐藏'
        }
      ]
    }
  ]
  
  let totalChecks = 0
  let passedChecks = 0
  
  checks.forEach(({ file, checks }) => {
    const fileName = path.basename(file)
    console.log(`📄 检查文件: ${fileName}\n`)
    
    const results = checkFile(file, checks)
    results.forEach(result => {
      totalChecks++
      if (result.passed) {
        passedChecks++
        console.log(`  ✅ ${result.name}`)
      } else {
        console.log(`  ❌ ${result.name}`)
        console.log(`     ${result.description}`)
      }
    })
    
    console.log()
  })
  
  console.log('='.repeat(50))
  console.log()
  console.log(`📊 验证结果: ${passedChecks}/${totalChecks} 项通过`)
  console.log()
  
  const percentage = (passedChecks / totalChecks * 100).toFixed(1)
  if (percentage >= 90) {
    console.log('🎉 优秀！移动端优化基本完成')
  } else if (percentage >= 70) {
    console.log('👍 良好！大部分移动端优化已完成')
  } else if (percentage >= 50) {
    console.log('⚠️  一般！需要继续优化移动端体验')
  } else {
    console.log('❌ 需要大量移动端优化工作')
  }
  
  console.log()
  console.log('🔧 建议手动测试:')
  console.log('   1. 使用浏览器开发者工具的移动端模式')
  console.log('   2. 测试不同屏幕尺寸 (iPhone SE, iPhone 12, iPad)')  
  console.log('   3. 检查触摸区域是否足够大 (至少 44x44px)')
  console.log('   4. 验证文字是否清晰可读')
  console.log('   5. 确保横向滚动区域工作正常')
}

console.log('🔍 移动端优化验证\n')
main()
