"use strict";
/**
 * 腾讯云PostgreSQL数据库连接池
 * 使用pg库连接腾讯云PostgreSQL数据库
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConnection = getConnection;
exports.query = query;
exports.transaction = transaction;
exports.closePool = closePool;
const pg_1 = require("pg");
// 数据库配置
const DB_CONFIG = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20, // 连接池最大连接数
    idleTimeoutMillis: 30000, // 空闲连接超时
    connectionTimeoutMillis: 2000, // 连接超时
};
// 创建连接池
const pool = new pg_1.Pool(DB_CONFIG);
// 连接池事件监听
pool.on('error', (err) => {
    console.error('Database pool error:', err);
});
/**
 * 获取数据库连接
 */
async function getConnection() {
    try {
        const client = await pool.connect();
        return client;
    }
    catch (error) {
        console.error('Failed to get database connection:', error);
        throw error;
    }
}
/**
 * 执行查询（自动释放连接）
 */
async function query(sql, params) {
    const client = await getConnection();
    try {
        const result = await client.query(sql, params);
        return result;
    }
    finally {
        client.release();
    }
}
/**
 * 执行事务
 * @param callback 事务回调函数
 */
async function transaction(callback) {
    const client = await getConnection();
    try {
        await client.query('BEGIN');
        const result = await callback(client);
        await client.query('COMMIT');
        return result;
    }
    catch (error) {
        await client.query('ROLLBACK');
        console.error('Transaction failed:', error);
        throw error;
    }
    finally {
        client.release();
    }
}
/**
 * 关闭连接池
 */
async function closePool() {
    await pool.end();
}
