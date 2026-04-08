#!/usr/bin/env node

/**
 * 数据库初始化脚本
 * 执行 lib/db/init.sql 文件到云端 PostgreSQL 数据库
 */

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ 错误: 未找到 DATABASE_URL 环境变量');
  console.error('请确保 .env.local 文件中包含 DATABASE_URL');
  process.exit(1);
}

// 创建连接池
const pool = new Pool({
  connectionString: DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// 读取 SQL 文件
const sqlFilePath = path.join(__dirname, '../lib/db/init.sql');

async function initDatabase() {
  console.log('🚀 开始初始化数据库...');
  console.log(`📄 读取 SQL 文件: ${sqlFilePath}`);

  try {
    // 读取 SQL 文件内容
    const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
    
    // 将 SQL 按分号分割成多个语句（排除注释）
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt && !stmt.startsWith('--') && stmt.length > 0)
      .map(stmt => stmt + ';');

    console.log(`🔍 解析到 ${statements.length} 条 SQL 语句`);

    // 获取数据库连接
    const client = await pool.connect();
    
    try {
      // 开始事务
      await client.query('BEGIN');
      
      // 逐条执行 SQL 语句
      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        const stmtPreview = statement.substring(0, 50).replace(/\n/g, ' ') + '...';
        
        try {
          await client.query(statement);
          console.log(`✅ [${i + 1}/${statements.length}] 执行成功: ${stmtPreview}`);
        } catch (err) {
          // 如果是 "already exists" 错误，则忽略
          if (err.code === '42P07' || err.message.includes('already exists')) {
            console.log(`⚠️  [${i + 1}/${statements.length}] 已存在，跳过: ${stmtPreview}`);
          } else {
            throw err;
          }
        }
      }
      
      // 提交事务
      await client.query('COMMIT');
      
      console.log('\n✨ 数据库初始化成功！');
      console.log('\n📊 已创建的表:');
      console.log('  - members (会员表)');
      console.log('  - videos (演出视频表)');
      console.log('  - activities (活动表)');
      console.log('  - activity_photos (活动照片表)');
      console.log('  - member_stories (会员心路分享表)');
      console.log('  - teachers (师资表)');
      console.log('  - contact_forms (联系表单表)');
      console.log('  - admins (管理员表)');
      console.log('  - video_stats (视频统计物化视图)');
      
    } catch (error) {
      // 回滚事务
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('\n❌ 数据库初始化失败:');
    console.error('错误信息:', error.message);
    console.error('错误代码:', error.code);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 运行脚本
initDatabase().catch(err => {
  console.error('脚本执行错误:', err);
  process.exit(1);
});
