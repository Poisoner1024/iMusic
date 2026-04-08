-- =============================================
-- 修复 video_stats 物化视图
-- 添加必要的唯一索引以支持 CONCURRENTLY 刷新
-- =============================================

-- 删除旧的触发器
DROP TRIGGER IF EXISTS trigger_refresh_video_stats ON videos;

-- 删除旧的刷新函数
DROP FUNCTION IF EXISTS refresh_video_stats();

-- 在物化视图上创建唯一索引（CONCURRENTLY 刷新所需）
CREATE UNIQUE INDEX IF NOT EXISTS idx_video_stats_instrument ON video_stats(instrument_category);

-- 重新创建刷新函数（非CONCURRENTLY，因为数据量小）
CREATE OR REPLACE FUNCTION refresh_video_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- 使用普通刷新（非CONCURRENTLY），因为视频数据量不大
    REFRESH MATERIALIZED VIEW video_stats;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 重新创建触发器
CREATE TRIGGER trigger_refresh_video_stats
AFTER INSERT OR UPDATE OR DELETE ON videos
FOR EACH STATEMENT EXECUTE FUNCTION refresh_video_stats();

-- =============================================
-- 验证修复
-- =============================================

-- 检查索引是否存在
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'video_stats'
AND indexname = 'idx_video_stats_instrument';

-- 手动刷新测试
REFRESH MATERIALIZED VIEW video_stats;

-- 查看统计结果
SELECT * FROM video_stats;

-- =============================================
-- 完成
-- =============================================
-- 如果以上执行成功，说明物化视图已修复
