#!/usr/bin/env node

/**
 * 验证数据库表是否存在
 */

const { Pool } = require('pg');
const path = require('path');

// 加载环境变量
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error('❌ 错误: 未找到 DATABASE_URL 环境变量');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DB_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

async function verifyTables() {
  console.log('🔍 验证数据库表...\n');

  try {
    const client = await pool.connect();

    try {
      // 查询所有表
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
      `);

      const tables = result.rows.map(row => row.table_name);

      console.log('📊 数据库中存在的表:');
      tables.forEach(table => {
        console.log(`  ✅ ${table}`);
      });

      // 检查关键表是否存在
      const requiredTables = ['members', 'videos', 'activities', 'activity_photos', 'member_stories', 'teachers', 'contact_forms', 'admins'];
      const missingTables = requiredTables.filter(table => !tables.includes(table));

      if (missingTables.length === 0) {
        console.log('\n✨ 所有必要的表都已创建！');
      } else {
        console.log('\n❌ 缺少以下表:');
        missingTables.forEach(table => console.log(`  - ${table}`));
      }

      // 检查videos表结构
      if (tables.includes('videos')) {
        console.log('\n📹 videos表结构:');
        const columnsResult = await client.query(`
          SELECT column_name, data_type, is_nullable
          FROM information_schema.columns
          WHERE table_name = 'videos'
          ORDER BY ordinal_position
        `);

        columnsResult.rows.forEach(col => {
          console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
        });
      }

      // 检查members表结构
      if (tables.includes('members')) {
        const countResult = await client.query('SELECT COUNT(*) as count FROM members');
        console.log(`\n👥 members表记录数: ${countResult.rows[0].count}`);
        
        if (countResult.rows[0].count > 0) {
          const membersResult = await client.query('SELECT member_no, name, nickname FROM members ORDER BY member_no');
          console.log('  初始会员数据:');
          membersResult.rows.forEach(member => {
            console.log(`    - ${member.member_no}: ${member.name} (${member.nickname})`);
          });
        }
      }

    } finally {
      client.release();
    }

  } catch (error) {
    console.error('❌ 验证失败:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

verifyTables().catch(err => {
  console.error('脚本执行错误:', err);
  process.exit(1);
});
