#!/usr/bin/env node

/**
 * 验证腾讯云COS凭证
 */

require('dotenv').config({ path: '/workspace/iMusic/.env.local' });

const { S3Client, PutObjectCommand, ListBucketsCommand } = require('@aws-sdk/client-s3');

const SECRET_ID = process.env.TENCENTCLOUD_SECRET_ID;
const SECRET_KEY = process.env.TENCENTCLOUD_SECRET_KEY;
const REGION = process.env.COS_REGION || 'ap-shanghai';
const BUCKET = process.env.COS_BUCKET;

console.log('🔍 验证腾讯云COS凭证\n');
console.log('配置信息:');
console.log(`  Secret ID: ${SECRET_ID ? SECRET_ID.substring(0, 10) + '...' : '未设置'}`);
console.log(`  Secret Key: ${SECRET_KEY ? '已设置 (' + SECRET_KEY.length + '字符)' : '未设置'}`);
console.log(`  Region: ${REGION}`);
console.log(`  Bucket: ${BUCKET}`);
console.log('');

if (!SECRET_ID || !SECRET_KEY) {
  console.error('❌ 错误: Secret ID 或 Secret Key 未配置');
  process.exit(1);
}

// 创建S3客户端
const s3Client = new S3Client({
  region: REGION,
  credentials: {
    accessKeyId: SECRET_ID,
    secretAccessKey: SECRET_KEY,
  },
  endpoint: `https://cos.${REGION}.myqcloud.com`,
});

async function verifyCredentials() {
  try {
    console.log('📡 测试1: 验证密钥有效性...');
    
    // 尝试列出存储桶（需要权限）
    const listBucketsCommand = new ListBucketsCommand({});
    const bucketsResult = await s3Client.send(listBucketsCommand);
    
    console.log('✅ 密钥验证成功！');
    console.log('可访问的存储桶:');
    bucketsResult.Buckets?.forEach(bucket => {
      console.log(`  - ${bucket.Name} (创建于 ${bucket.CreationDate})`);
    });
    
  } catch (error) {
    console.error('❌ 密钥验证失败！');
    console.error('');
    console.error('错误信息:', error.message);
    console.error('');
    
    if (error.message?.includes('InvalidAccessKeyId')) {
      console.error('🔍 可能原因:');
      console.error('   - Secret ID 不正确');
      console.error('   - 密钥已被删除或禁用');
      console.error('');
      console.error('💡 解决方案:');
      console.error('   1. 登录腾讯云控制台');
      console.error('   2. 访问管理 > 访问密钥');
      console.error('   3. 确认密钥状态为"启用"');
      console.error('   4. 如有需要，创建新的密钥');
    } else if (error.message?.includes('SignatureDoesNotMatch')) {
      console.error('🔍 可能原因:');
      console.error('   - Secret Key 不正确');
      console.error('   - Secret Key 有特殊字符未正确编码');
      console.error('   - 密钥对不匹配');
      console.error('');
      console.error('💡 解决方案:');
      console.error('   1. 检查 .env.local 中的密钥');
      console.error('   2. 确认 Secret Key 完整且正确');
      console.error('   3. 重新生成密钥对');
    } else if (error.message?.includes('AccessDenied')) {
      console.error('🔍 可能原因:');
      console.error('   - 密钥没有COS访问权限');
      console.error('   - 存储桶策略限制');
      console.error('');
      console.error('💡 解决方案:');
      console.error('   1. 检查密钥的CAM策略');
      console.error('   2. 确保有 QcloudCOSFullAccess 或 QcloudCOSDataWriteOnly 权限');
    } else {
      console.error('🔍 其他错误:', error.name);
    }
    
    process.exit(1);
  }
  
  // 测试上传权限
  try {
    console.log('');
    console.log('📡 测试2: 验证存储桶上传权限...');
    
    if (!BUCKET) {
      console.log('⚠️  未配置存储桶名称，跳过上传测试');
      return;
    }
    
    const testKey = `test/verify-${Date.now()}.txt`;
    const testContent = `验证测试 - ${new Date().toISOString()}`;
    
    const putCommand = new PutObjectCommand({
      Bucket: BUCKET,
      Key: testKey,
      Body: testContent,
      ContentType: 'text/plain',
    });
    
    await s3Client.send(putCommand);
    
    console.log(`✅ 上传权限验证成功！`);
    console.log(`   测试文件: s3://${BUCKET}/${testKey}`);
    
  } catch (error) {
    console.error('❌ 上传权限验证失败！');
    console.error('错误信息:', error.message);
    
    if (error.message?.includes('NoSuchBucket')) {
      console.error('');
      console.error('🔍 存储桶不存在:', BUCKET);
      console.error('💡 请确认存储桶名称正确且已创建');
    }
    
    process.exit(1);
  }
  
  console.log('');
  console.log('🎉 所有验证通过！COS凭证配置正确。');
}

// 运行验证
verifyCredentials().catch(err => {
  console.error('验证过程出错:', err);
  process.exit(1);
});
