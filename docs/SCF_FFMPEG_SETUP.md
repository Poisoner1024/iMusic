# SCF FFmpeg 配置指南

## 问题说明

在 SCF（Serverless Cloud Function）环境中，默认不包含 FFmpeg。这会导致视频元数据提取和缩略图生成功能受限。

## 解决方案

### 方案 1：使用 SCF 层（Layer）安装 FFmpeg（推荐）

腾讯云 SCF 支持通过层来共享依赖和库文件。可以使用社区提供的 FFmpeg 层。

#### 步骤：

1. **创建 FFmpeg 层**

   方法一：使用预编译的 FFmpeg 层
   
   在 SCF 控制台：
   - 进入「层管理」
   - 点击「新建」
   - 选择「使用标准 Runtime 依赖层」
   - 搜索并选择 `ffmpeg`

   方法二：手动创建层
   
   ```bash
   # 在本地创建一个包含 ffmpeg 的目录结构
   mkdir -p ffmpeg-layer/bin
   
   # 下载静态编译的 ffmpeg（Linux x64）
   cd ffmpeg-layer/bin
   wget https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz
   tar -xf ffmpeg-release-amd64-static.tar.xz
   cp ffmpeg-*/ffmpeg .
   cp ffmpeg-*/ffprobe .
   
   # 打包层
   cd ..
   zip -r ffmpeg-layer.zip .
   ```

2. **上传层到 SCF**

   在 SCF 控制台：
   - 进入「层管理」
   - 点击「新建」
   - 上传 `ffmpeg-layer.zip`
   - 设置运行环境：Node.js 8.9、Node.js 12.16、Node.js 16.13 等
   - 完成创建

3. **为函数绑定层**

   在函数配置页面：
   - 进入「层管理」标签页
   - 点击「绑定层」
   - 选择刚才创建的 FFmpeg 层
   - 设置层的顺序（如果有多个层）
   - 保存配置

4. **更新 SCF 函数代码**

   FFmpeg 层通常会将二进制文件放在 `/opt/bin` 或 `/opt` 目录下。需要在代码中指定路径：

   ```javascript
   // 在 scf-build/index.js 中修改检查 ffmpeg 的代码
   
   // 检查ffmpeg是否可用（包括层中的ffmpeg）
   function checkFfmpegAvailable() {
     try {
       // 尝试系统默认路径
       execSync('ffmpeg -version', { stdio: 'pipe' })
       return 'ffmpeg'
     } catch (error) {
       try {
         // 尝试层中的路径
         execSync('/opt/bin/ffmpeg -version', { stdio: 'pipe' })
         return '/opt/bin/ffmpeg'
       } catch (error2) {
         return null
       }
     }
   }
   
   // 在 extractMetadata 和 generateThumbnail 函数中使用
   const ffmpegPath = checkFfmpegAvailable()
   if (!ffmpegPath) {
     console.warn('FFmpeg 未安装，使用降级方案')
     // ... 降级处理
   }
   ```

#### 使用层后的代码示例

```javascript
// 获取 FFmpeg 路径
function getFfmpegPath() {
  const paths = ['ffmpeg', '/opt/bin/ffmpeg', '/opt/ffmpeg']
  for (const p of paths) {
    try {
      execSync(`${p} -version`, { stdio: 'pipe' })
      return p
    } catch (e) {
      // 继续尝试下一个路径
    }
  }
  return null
}

// 在函数中使用
async function extractMetadata(videoPath) {
  const ffmpegPath = getFfmpegPath()
  if (!ffmpegPath) {
    console.warn('FFmpeg 未安装，使用估算数据')
    // ... 降级处理
  } else {
    // 使用 FFmpeg
    const ffprobeCommand = `${ffmpegPath.replace('ffmpeg', 'ffprobe')} -v quiet -print_format json -show_format -show_streams "${videoPath}"`
    // ...
  }
}
```

### 方案 2：使用腾讯云 VOD（云点播）服务（企业级方案）

如果视频处理是核心功能，建议使用腾讯云 VOD 服务：

#### 优势：
- 专业的视频处理能力
- 自动转码、截图、水印
- 无需管理 FFmpeg
- 更高的可靠性和性能

#### 集成步骤：

1. **开通 VOD 服务**

   在腾讯云控制台：
   - 搜索「云点播 VOD」
   - 开通服务
   - 获取 `SecretId` 和 `SecretKey`

2. **配置事件通知**

   在 VOD 控制台：
   - 进入「事件通知」
   - 配置上传完成通知
   - 设置为推送到 SCF 函数或消息队列

3. **修改 SCF 函数代码**

   使用 VOD SDK 处理视频：

   ```javascript
   const tencentcloud = require("tencentcloud-sdk-nodejs-vod")
   
   // 初始化 VOD 客户端
   const VodClient = tencentcloud.vod.v20180717.Client
   const client = new VodClient({
     credential: {
       secretId: process.env.COS_SECRET_ID,
       secretKey: process.env.COS_SECRET_KEY
     },
     region: process.env.COS_REGION
   })
   
   // 发起视频处理任务
   async function processVideo(fileId) {
     const params = {
       FileId: fileId,
       MediaProcessTask: {
         SnapshotByTimeOffsetTaskSet: [
           {
             Definition: 10, // 截图模板
             TimeOffsetSet: [5], // 第5秒
           }
         ]
       }
     }
     
     const result = await client.ProcessMedia(params)
     return result
   }
   ```

### 方案 3：使用纯 JavaScript 方案（功能受限）

如果不需要精确的元数据，可以使用文件头分析：

```javascript
const fs = require('fs')

function extractBasicMetadata(videoPath) {
  const buffer = Buffer.alloc(4096)
  const fd = fs.openSync(videoPath, 'r')
  fs.readSync(fd, buffer, 0, 4096, 0)
  fs.closeSync(fd)
  
  // 简单的文件类型检测
  const header = buffer.toString('hex', 0, 8)
  let format = 'unknown'
  
  if (header.startsWith('00000020667479706973')) format = 'mp4'
  else if (header.startsWith('1a45dfa3')) format = 'webm'
  else if (header.startsWith('52494646')) format = 'avi'
  
  const stats = fs.statSync(videoPath)
  
  return {
    format,
    size: stats.size,
    duration: 0, // 无法获取
    width: 0,
    height: 0
  }
}
```

## 推荐的 SCF 层配置

### 创建 FFmpeg 层的完整脚本

```bash
#!/bin/bash

# 创建 FFmpeg 层
echo "Creating FFmpeg layer..."

# 创建目录结构
mkdir -p ffmpeg-layer/bin

# 下载静态编译的 ffmpeg（适用于 SCF 的运行环境）
cd ffmpeg-layer/bin

# 根据 SCF 的运行环境选择合适的版本
# SCF 运行环境基于 CentOS 7.5，glibc 2.17
wget -q https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz

if [ $? -ne 0 ]; then
  echo "Failed to download FFmpeg"
  exit 1
fi

tar -xf ffmpeg-release-amd64-static.tar.xz

# 找到 ffmpeg 和 ffprobe 并复制到 bin 目录
FFMPEG_DIR=$(find . -name "ffmpeg-*" -type d | head -1)
if [ -z "$FFMPEG_DIR" ]; then
  echo "Could not find FFmpeg directory"
  exit 1
fi

cp $FFMPEG_DIR/ffmpeg .
cp $FFMPEG_DIR/ffprobe .

# 验证文件
if [ ! -f ffmpeg ]; then
  echo "FFmpeg not found"
  exit 1
fi

if [ ! -f ffprobe ]; then
  echo "FFprobe not found"
  exit 1
fi

# 添加执行权限
chmod +x ffmpeg ffprobe

# 清理
rm -rf ffmpeg-release-amd64-static.tar.xz $FFMPEG_DIR

# 返回上级目录
cd ..

# 创建层压缩包
echo "Creating layer ZIP file..."
zip -r ffmpeg-layer.zip .

# 验证压缩包
if [ -f ffmpeg-layer.zip ]; then
  echo "Layer created successfully: ffmpeg-layer.zip"
  echo "File size: $(du -h ffmpeg-layer.zip | cut -f1)"
else
  echo "Failed to create layer ZIP"
  exit 1
fi

# 清理临时目录（可选）
# rm -rf ffmpeg-layer

echo "Done!"
echo ""
echo "Next steps:"
echo "1. Upload ffmpeg-layer.zip to SCF console"
echo "2. Bind the layer to your function"
echo "3. Update your function code to use /opt/bin/ffmpeg"
echo ""
echo "Example code:"
echo 'const ffmpegPath = getFfmpegPath() // 返回 "/opt/bin/ffmpeg"'
```

### 在 SCF 控制台创建层

1. 保存上面的脚本为 `create-ffmpeg-layer.sh`
2. 执行脚本：`bash create-ffmpeg-layer.sh`
3. 登录 [腾讯云 SCF 控制台](https://console.cloud.tencent.com/scf/layer)
4. 点击「新建」
5. 上传生成的 `ffmpeg-layer.zip`
6. 选择运行环境：Node.js 8.9、12.16、14.18、16.13
7. 点击「完成」

### 为函数绑定层

1. 进入函数详情页
2. 点击「层管理」标签页
3. 点击「绑定层」
4. 选择刚刚创建的 FFmpeg 层
5. 点击「保存」

## 修改后的函数代码

在 `scf-build/index.js` 中修改，支持 FFmpeg 层：

```javascript
/**
 * 获取 FFmpeg 可执行文件路径
 */
function getFfmpegPath() {
  const possiblePaths = [
    'ffmpeg',                           // 系统 PATH
    '/opt/bin/ffmpeg',                  // SCF 层标准路径
    '/opt/ffmpeg',                      // 自定义层路径
    './bin/ffmpeg'                      // 函数包内路径
  ]
  
  for (const path of possiblePaths) {
    try {
      execSync(`${path} -version`, { stdio: 'pipe' })
      return path
    } catch (e) {
      // 继续尝试下一个路径
    }
  }
  
  return null
}

/**
 * 获取 FFprobe 可执行文件路径
 */
function getFfprobePath(ffmpegPath) {
  if (!ffmpegPath) return null
  return ffmpegPath.replace('ffmpeg', 'ffprobe')
}

// 在函数开始时获取路径
const FFMPEG_PATH = getFfmpegPath()
const FFPROBE_PATH = getFfprobePath(FFMPEG_PATH)

if (FFMPEG_PATH) {
  console.log(`FFmpeg 可用: ${FFMPEG_PATH}`)
} else {
  console.warn('FFmpeg 不可用，将使用降级方案')
}

// 修改 extractMetadata 函数
async function extractMetadata(videoPath) {
  try {
    console.log('提取视频元数据...')
    
    const fs = require('fs')
    const stats = fs.statSync(videoPath)
    
    // 如果 FFmpeg 不可用，使用降级方案
    if (!FFMPEG_PATH) {
      console.warn('FFmpeg 未安装，使用估算数据')
      // ... 之前的估算逻辑
      return {
        duration: estimatedDuration || 180,
        width: estimatedWidth,
        height: estimatedHeight,
        size: stats.size,
        format: format
      }
    }
    
    // 使用 ffprobe 获取元数据
    const ffprobeCommand = `${FFPROBE_PATH} -v quiet -print_format json -show_format -show_streams "${videoPath}"`
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

// 修改 generateThumbnail 函数
async function generateThumbnail(videoPath, outputPath, time = 5) {
  try {
    console.log(`生成缩略图（第${time}秒）...`)
    
    // 如果 FFmpeg 不可用，创建信息性缩略图
    if (!FFMPEG_PATH) {
      console.warn('FFmpeg 未安装，创建信息性缩略图')
      // ... 之前的信息性缩略图逻辑
      return
    }
    
    // 使用 FFmpeg 生成缩略图
    const ffmpegCommand = `${FFMPEG_PATH} -i "${videoPath}" -ss ${time} -vframes 1 -f image2 "${outputPath}" -y`
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
```

## 层的大小限制

SCF 层的限制：
- 单个层最大 500 MB
- 单个函数最多绑定 5 个层
- 层总大小不超过 500 MB

FFmpeg 静态编译版本通常 80-100 MB，完全在限制范围内。

## 测试 FFmpeg 层

部署后测试函数：

```javascript
exports.main_handler = async (event, context) => {
  const ffmpegPath = getFfmpegPath()
  
  if (ffmpegPath) {
    const version = execSync(`${ffmpegPath} -version`).toString()
    console.log('FFmpeg version:', version)
    
    return {
      success: true,
      ffmpegPath,
      version
    }
  } else {
    return {
      success: false,
      message: 'FFmpeg not available'
    }
  }
}
```

## 总结

**推荐方案**：使用 SCF 层安装 FFmpeg
- 成本：免费
- 复杂度：中等
- 功能：完整
- 维护：低

**备选方案**：使用 VOD 云点播
- 成本：按量计费
- 复杂度：低
- 功能：专业级
- 维护：无

**降级方案**：纯 JavaScript
- 成本：免费
- 复杂度：低
- 功能：有限
- 维护：中

对于大多数项目，推荐使用 SCF 层方案，平衡了成本、功能和复杂度。
