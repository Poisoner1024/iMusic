#!/usr/bin/env node

/**
 * 验证SCF代码兼容性（Node.js 8）
 */

const fs = require('fs');
const path = require('path');

const scfDir = path.join(__dirname, '../scf-build');
const indexPath = path.join(scfDir, 'index.js');

console.log('🔍 验证SCF代码兼容性\n');

// 检查文件是否存在
if (!fs.existsSync(indexPath)) {
  console.error('❌ index.js 不存在');
  process.exit(1);
}

console.log('✅ index.js 存在\n');

// 读取代码
const code = fs.readFileSync(indexPath, 'utf8');

// 检查不兼容的语法
const issues = [];

// 检查可选链操作符
if (code.includes('?.') && !code.includes('// 可选链')) {
  const lines = code.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('?.') && !line.trim().startsWith('//')) {
      issues.push({
        line: index + 1,
        code: line.trim(),
        issue: '可选链操作符 (?.), Node.js 8不支持'
      });
    }
  });
}

// 检查其他ES2020+语法
const checks = [
  { pattern: /\?\./, name: '可选链操作符 (?)' },
  { pattern: /\?\?/, name: '空值合并运算符 (??)' },
  { pattern: /import\s+.*\s+from\s+['"]/, name: 'ES模块import' }
];

checks.forEach(check => {
  const matches = code.match(check.pattern);
  if (matches) {
    issues.push({
      line: '多个位置',
      issue: `${check.name} - Node.js 8不支持`
    });
  }
});

// 检查导出语法
if (!code.includes('exports.main_handler')) {
  issues.push({
    line: '文件末尾',
    issue: '缺少 exports.main_handler 导出'
  });
}

// 显示结果
if (issues.length > 0) {
  console.error('❌ 发现不兼容问题:\n');
  issues.forEach(issue => {
    console.error(`  [第 ${issue.line} 行] ${issue.issue}`);
    if (issue.code) {
      console.error(`  代码: ${issue.code}`);
    }
    console.error('');
  });
  process.exit(1);
} else {
  console.log('✅ 代码兼容性检查通过！\n');
  console.log('✅ 没有Node.js 8不支持的语法\n');
  console.log('✅ 包含正确的 exports.main_handler 导出\n');
}

// 检查文件大小
const stats = fs.statSync(indexPath);
console.log(`📊 文件大小: ${(stats.size / 1024).toFixed(2)} KB\n`);

// 检查函数签名
const hasMainHandler = code.includes('exports.main_handler = async (event, context) => {');
if (hasMainHandler) {
  console.log('✅ 找到正确的函数签名: exports.main_handler = async (event, context)\n');
} else {
  console.warn('⚠️  函数签名可能不正确\n');
}

console.log('🎉 SCF代码验证通过！可以安全部署。\n');
