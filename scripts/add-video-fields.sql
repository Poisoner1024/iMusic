-- ========================================
-- 为 videos 表添加缺失字段
-- 用途：支持 SCF 视频处理功能
-- ========================================

-- 添加 error_message 字段（用于记录处理失败的错误信息）
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS error_message TEXT;

-- 添加 processed_at 字段（用于记录 SCF 处理完成时间）
ALTER TABLE videos
ADD COLUMN IF NOT EXISTS processed_at TIMESTAMP WITH TIME ZONE;

-- 创建触发器函数，在更新时自动设置 processed_at
CREATE OR REPLACE FUNCTION update_processed_at_column()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'published' AND OLD.processed_at IS NULL THEN
        NEW.processed_at := NOW();
    END IF;
    IF NEW.status = 'failed' AND OLD.processed_at IS NULL THEN
        NEW.processed_at := NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 创建触发器（如果不存在）
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'update_videos_processed_at' 
        AND tgrelid = 'videos'::regclass
    ) THEN
        CREATE TRIGGER update_videos_processed_at 
        BEFORE UPDATE ON videos
        FOR EACH ROW 
        EXECUTE FUNCTION update_processed_at_column();
        RAISE NOTICE '✅ 触发器已创建: update_videos_processed_at';
    ELSE
        RAISE NOTICE 'ℹ️  触发器已存在: update_videos_processed_at';
    END IF;
END $$;

-- 验证字段是否添加成功
DO $$
DECLARE
    has_error_message boolean;
    has_processed_at boolean;
BEGIN
    -- 检查 error_message 字段是否存在
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'videos' AND column_name = 'error_message'
    ) INTO has_error_message;

    -- 检查 processed_at 字段是否存在
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'videos' AND column_name = 'processed_at'
    ) INTO has_processed_at;

    -- 输出结果
    IF has_error_message AND has_processed_at THEN
        RAISE NOTICE '✅ 字段添加成功：error_message 和 processed_at 已存在';
        RAISE NOTICE '✅ 触发器已配置：自动设置 processed_at';
    ELSE
        IF NOT has_error_message THEN
            RAISE NOTICE '❌ 字段添加失败：error_message 不存在';
        END IF;
        IF NOT has_processed_at THEN
            RAISE NOTICE '❌ 字段添加失败：processed_at 不存在';
        END IF;
    END IF;
END $$;

-- 查看表结构
\echo ''
\echo '========================================'
\echo '当前 videos 表结构：'
\echo '========================================'
\d videos

-- 查看新增字段
\echo ''
\echo '========================================'
\echo '新增字段详情：'
\echo '========================================'
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'videos' 
AND column_name IN ('error_message', 'processed_at')
ORDER BY ordinal_position;
