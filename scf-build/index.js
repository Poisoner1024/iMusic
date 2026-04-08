/**
 * 腾讯云SCF云函数 - 视频处理
 * 功能：视频元数据提取、缩略图生成
 */

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3')
const { Client } = require('pg')
const { execSync } = require('child_process')
const { writeFileSync, unlinkSync, existsSync } = require('fs')
const path = require('path')

// 从环境变量获取配置
const DB_URL = process.env.DATABASE_URL
const COS_SECRET_ID = process.env.COS_SECRET_ID
const COS_SECRET_KEY = process.env.COS_SECRET_KEY
const COS_BUCKET = process.env.COS_BUCKET
const COS_REGION = process.env.COS_REGION || 'ap-shanghai'

// 创建COS客户端（兼容AWS SDK）
const s3Client = new S3Client({
  region: COS_REGION,
  endpoint: `https://cos.${COS_REGION}.myqcloud.com`,
  credentials: {
    accessKeyId: COS_SECRET_ID,
    secretAccessKey: COS_SECRET_KEY
  }
  // 移除 forcePathStyle，使用默认的虚拟托管样式
})

/**
 * 主处理函数（SCF入口）
 */
exports.main_handler = async (event, context) => {
  console.log('开始处理视频，事件:', JSON.stringify(event, null, 2))
  
  // 验证环境变量
  const requiredEnvVars = ['DATABASE_URL', 'COS_SECRET_ID', 'COS_SECRET_KEY', 'COS_BUCKET']
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    const errorMsg = `缺少必需的环境变量: ${missingVars.join(', ')}`
    console.error(errorMsg)
    return {
      success: false,
      error: errorMsg
    }
  }
  
  const startTime = Date.now()
  let key = ''  // 移到外部作用域
  
  try {
    // 解析COS事件
    const cosEvent = event.Records[0].cos
    const bucketFromEvent = cosEvent.cosBucket.name
    const appId = cosEvent.cosBucket.appid
    const rawKey = decodeURIComponent(cosEvent.cosObject.key.replace(/^\//, ''))
    const region = cosEvent.cosBucket.cosRegion
    
    // 使用环境变量中的存储桶名称（完整名称），或从事件构造
    const bucket = COS_BUCKET || `${bucketFromEvent}-${appId}`
    
    // 从key中移除前缀（COS事件格式：{appid}/{bucket}/{object-key}）
    const prefixPattern = new RegExp(`^${appId}/${bucketFromEvent}/`)
    key = rawKey.replace(prefixPattern, '')
    
    console.log(`处理视频文件: ${key}`)
    console.log(`存储桶: ${bucket} (事件: ${bucketFromEvent}, appid: ${appId})`)
    console.log(`地域: ${region}`)
    console.log(`原始key: ${rawKey}`)
    
    // 提取videoId（从文件名）
    const videoId = extractVideoId(key)
    if (!videoId) {
      throw new Error('无法从文件路径提取videoId')
    }
    
    console.log(`Video ID: ${videoId}`)
    
    // 1. 下载视频文件到临时目录
    const tempVideoPath = `/tmp/video-${Date.now()}.mp4`
    await downloadVideo(bucket, key, tempVideoPath)
    
    // 检查文件是否成功下载
    if (!existsSync(tempVideoPath)) {
      throw new Error(`视频文件下载失败: ${tempVideoPath}`)
    }
    
    const fileStats = require('fs').statSync(tempVideoPath)
    console.log(`视频已下载到: ${tempVideoPath} (${fileStats.size} bytes)`)
    
    // 2. 提取视频元数据
    const metadata = await extractMetadata(tempVideoPath)
    console.log('视频元数据:', metadata)
    
    // 3. 生成缩略图（第5秒的帧）
    const thumbnailPath = `/tmp/thumbnail-${Date.now()}.jpg`
    await generateThumbnail(tempVideoPath, thumbnailPath, 5)
    console.log('缩略图已生成:', thumbnailPath)
    
    // 4. 上传缩略图到COS
    const thumbnailKey = `thumbnails/${new Date().getFullYear()}/${new Date().getMonth() + 1}/${Date.now()}-${Math.random().toString(36).substring(2, 15)}.jpg`
    const thumbnailUrl = await uploadFile(bucket, thumbnailKey, thumbnailPath, 'image/jpeg')
    console.log('缩略图已上传:', thumbnailUrl)
    
    // 5. 更新数据库
    await updateVideoRecord(videoId, {
      thumbnail_url: thumbnailUrl,
      thumbnail_key: thumbnailKey,
      duration: metadata.duration,
      file_size: metadata.size,
      status: 'published'
      // processed_at 由数据库触发器自动设置
    })
    console.log('数据库已更新')
    
    // 6. 清理临时文件
    cleanupFiles([tempVideoPath, thumbnailPath])
    
    const duration = Date.now() - startTime
    console.log(`视频处理完成，耗时: ${duration}ms`)
    
    return {
      success: true,
      videoId,
      duration: duration,
      metadata
    }
    
  } catch (error) {
    console.error('视频处理失败:', error)
    
    // 尝试更新数据库状态为failed
    try {
      const videoId = extractVideoId(key || '')
      if (videoId) {
        await updateVideoRecord(videoId, {
          status: 'failed',
          error_message: error.message
          // processed_at 由数据库触发器自动设置
        })
      }
    } catch (dbError) {
      console.error('更新数据库状态失败:', dbError)
    }
    
    return {
      success: false,
      error: error.message
    }
  }
}

/**
 * 从文件路径提取videoId
 */
function extractVideoId(key) {
  if (!key) return null
  
  console.log('尝试从路径提取videoId:', key)
  
  // 方法1：尝试从文件名提取UUID（标准格式）
  const uuidMatch = key.match(/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i)
  if (uuidMatch) {
    console.log('✓ 提取到UUID:', uuidMatch[1])
    return uuidMatch[1]
  }
  
  // 方法2：尝试从路径的最后一部分提取文件名作为ID
  // 例如: videos/original/iM_test-001.mp4 -> iM_test-001
  const pathParts = key.split('/')
  const filename = pathParts[pathParts.length - 1]
  if (filename) {
    // 移除文件扩展名
    const fileId = filename.replace(/\.[^/.]+$/, '')
    console.log('✓ 提取到文件ID:', fileId)
    return fileId
  }
  
  console.log('✗ 无法从路径提取videoId')
  return null
}

/**
 * 从COS下载视频文件
 */
async function downloadVideo(bucket, key, localPath) {
  try {
    console.log(`下载视频: s3://${bucket}/${key}`)
    
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key
    })
    
    const response = await s3Client.send(command)
    
    // 将流写入文件
    return new Promise((resolve, reject) => {
      const chunks = []
      response.Body.on('data', chunk => chunks.push(chunk))
      response.Body.on('end', () => {
        const buffer = Buffer.concat(chunks)
        writeFileSync(localPath, buffer)
        console.log(`视频下载完成: ${localPath} (${buffer.length} bytes)`)
        resolve()
      })
      response.Body.on('error', reject)
    })
  } catch (error) {
    console.error('下载视频失败:', error)
    throw error
  }
}

/**
 * 使用ffmpeg提取视频元数据
 */
async function extractMetadata(videoPath) {
  try {
    console.log('提取视频元数据...')
    
    const fs = require('fs')
    const stats = fs.statSync(videoPath)
    const fileSizeMB = stats.size / (1024 * 1024)
    
    // 检查ffmpeg是否可用
    try {
      execSync('ffmpeg -version', { stdio: 'pipe' })
    } catch (error) {
      console.warn('ffmpeg未安装，使用估算数据')
      
      // 基于文件大小估算视频时长（假设平均比特率 2Mbps）
      // 时长(秒) = (文件大小 * 8) / (比特率 * 1024 * 1024)
      const estimatedBitrate = 2 // Mbps
      const estimatedDuration = Math.floor((stats.size * 8) / (estimatedBitrate * 1024 * 1024))
      
      // 根据文件大小推断分辨率（假设合理范围）
      let estimatedWidth = 1920
      let estimatedHeight = 1080
      
      if (fileSizeMB < 10) {
        // 小文件可能是较低分辨率
        estimatedWidth = 1280
        estimatedHeight = 720
      } else if (fileSizeMB > 500) {
        // 大文件可能是高分辨率
        estimatedWidth = 3840
        estimatedHeight = 2160
      }
      
      // 从文件扩展名推断格式
      const ext = path.extname(videoPath).toLowerCase()
      const formatMap = {
        '.mp4': 'mp4',
        '.mov': 'mov',
        '.avi': 'avi',
        '.mkv': 'matroska',
        '.webm': 'webm'
      }
      const format = formatMap[ext] || 'mp4'
      
      console.log(`估算视频元数据: ${format}, ${estimatedDuration}s, ${estimatedWidth}x${estimatedHeight}`)
      
      return {
        duration: estimatedDuration || 180, // 默认3分钟
        width: estimatedWidth,
        height: estimatedHeight,
        size: stats.size,
        format: format
      }
    }
    
    // 使用ffprobe获取元数据
    const ffprobeCommand = `ffprobe -v quiet -print_format json -show_format -show_streams "${videoPath}"`
    const output = execSync(ffprobeCommand, { encoding: 'utf8' })
    const data = JSON.parse(output)
    
    const videoStream = data.streams.find(s => s.codec_type === 'video')
    const duration = Math.floor(parseFloat(data.format.duration || '0'))
    
    return {
      duration,
      width: (videoStream && videoStream.width) || 1920,
      height: (videoStream && videoStream.height) || 1080,
      size: parseInt(data.format.size || '0'),
      format: data.format.format_name || 'mp4'
    }
  } catch (error) {
    console.error('提取元数据失败:', error)
    throw error
  }
}

/**
 * 生成视频缩略图
 */
async function generateThumbnail(videoPath, outputPath, time = 5) {
  try {
    console.log(`生成缩略图（第${time}秒）...`)
    
    // 检查ffmpeg是否可用
    try {
      execSync('ffmpeg -version', { stdio: 'pipe' })
    } catch (error) {
      console.warn('ffmpeg未安装，创建信息性缩略图')
      
      // 获取视频文件信息用于生成缩略图
      const fs = require('fs')
      const path = require('path')
      const stats = fs.statSync(videoPath)
      const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(1)
      const filename = path.basename(videoPath)
      const fileExt = path.extname(videoPath).toUpperCase().replace('.', '')
      
      // 创建一个带有视频信息的缩略图
      const sharp = require('sharp')
      const width = 1280
      const height = 720
      
      // 创建渐变背景
      const svgBuffer = Buffer.from(`
        <svg width="${width}" height="${height}">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#4f46e5;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="${width}" height="${height}" fill="url(#grad)" />
          <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="48" fill="white" text-anchor="middle" font-weight="bold">iMusic 视频</text>
          <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle">${filename}</text>
          <text x="50%" y="65%" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle">${fileExt} • ${fileSizeMB} MB</text>
          <text x="50%" y="90%" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" opacity="0.7">缩略图由 iMusic 自动生成</text>
        </svg>
      `)
      
      await sharp(svgBuffer).jpeg({ quality: 85 }).toFile(outputPath)
      console.log('信息性缩略图生成完成:', outputPath)
      return
    }
    
    // 使用ffmpeg生成缩略图
    const ffmpegCommand = `ffmpeg -i "${videoPath}" -ss ${time} -vframes 1 -f image2 "${outputPath}" -y`
    execSync(ffmpegCommand, { stdio: 'pipe' })
    
    if (!existsSync(outputPath)) {
      throw new Error('缩略图生成失败：文件未创建')
    }
    
    console.log('缩略图生成完成:', outputPath)
  } catch (error) {
    console.error('生成缩略图失败:', error)
    throw error
  }
}

/**
 * 上传文件到COS
 */
async function uploadFile(bucket, key, localPath, contentType = 'application/octet-stream') {
  try {
    console.log(`上传文件到COS: s3://${bucket}/${key}`)
    
    const fileBuffer = require('fs').readFileSync(localPath)
    
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'public-read'
    })
    
    await s3Client.send(command)
    
    const url = `https://${bucket}.cos.${COS_REGION}.myqcloud.com/${key}`
    console.log('文件上传完成:', url)
    
    return url
  } catch (error) {
    console.error('上传文件失败:', error)
    throw error
  }
}

/**
 * 更新数据库视频记录
 */
async function updateVideoRecord(videoId, updates) {
  if (!DB_URL) {
    console.warn('DATABASE_URL未配置，跳过数据库更新')
    return
  }
  
  // 检查是否强制禁用SSL（某些腾讯云数据库不支持SSL）
  const sslDisabled = process.env.DB_SSL_DISABLED === 'true'
  
  // 根据数据库URL自动配置SSL
  const needsSsl = !sslDisabled && (DB_URL.includes('.tencentcdb.com') || DB_URL.includes('amazonaws.com'))
  
  const client = new Client({
    connectionString: DB_URL,
    ssl: needsSsl ? { rejectUnauthorized: false } : false
  })
  
  console.log(`数据库SSL配置: ${needsSsl ? '启用' : '禁用'} (sslDisabled: ${sslDisabled})`)
  
  try {
    await client.connect()
    
    // 查找数据库记录ID（支持UUID和文件名）
    let recordId = videoId
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(videoId)
    
    if (!isUuid) {
      // 如果不是UUID，尝试通过video_key查找
      console.log(`通过video_key查找记录: ${videoId}`)
      const findQuery = `SELECT id FROM videos WHERE video_key LIKE $1 LIMIT 1`
      const findResult = await client.query(findQuery, [`%${videoId}%`])
      
      if (findResult.rows.length > 0) {
        recordId = findResult.rows[0].id
        console.log(`找到记录ID: ${recordId}`)
      } else {
        throw new Error(`未找到视频记录: ${videoId}`)
      }
    }
    
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 1}`)
      .join(', ')
    
    const values = Object.values(updates)
    const query = `UPDATE videos SET ${setClause}, updated_at = NOW() WHERE id = $${values.length + 1}`
    
    await client.query(query, [...values, recordId])
    console.log('数据库更新成功:', recordId)
  } catch (error) {
    console.error('数据库更新失败:', error)
    throw error
  } finally {
    await client.end()
  }
}

/**
 * 清理临时文件
 */
function cleanupFiles(filePaths) {
  try {
    filePaths.forEach(filePath => {
      if (existsSync(filePath)) {
        unlinkSync(filePath)
        console.log('清理临时文件:', filePath)
      }
    })
  } catch (error) {
    console.error('清理文件失败:', error)
  }
}
