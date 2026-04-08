-- =============================================
-- IM公益声传社团 - 数据库初始化脚本
-- 腾讯云 PostgreSQL
-- =============================================

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 全文搜索优化

-- =============================================
-- 1. 会员表 (members)
-- =============================================
CREATE TABLE IF NOT EXISTS members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_no INTEGER UNIQUE CHECK (member_no >= 1 AND member_no <= 100),
    name VARCHAR(100) NOT NULL,
    nickname VARCHAR(100),
    city VARCHAR(50),
    instruments TEXT[], -- 数组类型存储多个乐器
    member_type VARCHAR(20) CHECK (member_type IN ('family', 'musician')),
    join_reason TEXT,
    wechat VARCHAR(100),
    phone VARCHAR(20),
    is_public BOOLEAN DEFAULT false,
    avatar_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_members_member_no ON members(member_no);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_is_public ON members(is_public) WHERE is_public = true;
CREATE INDEX idx_members_created_at ON members(created_at DESC);

-- =============================================
-- 2. 演出视频表 (videos)
-- =============================================
CREATE TABLE IF NOT EXISTS videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    video_url VARCHAR(500) NOT NULL, -- COS对象URL
    thumbnail_url VARCHAR(500), -- 缩略图URL
    video_key VARCHAR(500) NOT NULL, -- COS存储Key（用于删除）
    thumbnail_key VARCHAR(500), -- 缩略图存储Key
    performer VARCHAR(100) NOT NULL,
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    instrument_category VARCHAR(50), -- 乐器分类
    duration INTEGER, -- 时长（秒）
    file_size INTEGER, -- 文件大小（字节）
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'processing' CHECK (status IN ('processing', 'published', 'failed')),
    error_message TEXT, -- 错误信息（处理失败时使用）
    tags TEXT[], -- 标签数组
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE,
    processed_at TIMESTAMP WITH TIME ZONE, -- 处理完成时间（SCF处理完成时设置）
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建触发器函数，在更新时自动设置 processed_at
create or replace function update_processed_at_column()
returns trigger as $$
begin
    if NEW.status = 'published' and OLD.processed_at is null then
        NEW.processed_at := NOW();
    end if;
    if NEW.status = 'failed' and OLD.processed_at is null then
        NEW.processed_at := NOW();
    end if;
    return NEW;
end;
$$ language 'plpgsql';

-- 创建触发器
create trigger update_videos_processed_at before update on videos
    for each row execute function update_processed_at_column();

-- 索引
CREATE INDEX idx_videos_performer ON videos(performer);
CREATE INDEX idx_videos_instrument ON videos(instrument_category);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_uploaded_at ON videos(uploaded_at DESC);
CREATE INDEX idx_videos_views ON videos(views DESC);
CREATE INDEX idx_videos_tags ON videos USING GIN(tags);
CREATE INDEX idx_videos_member_id ON videos(member_id);

-- =============================================
-- 3. 活动表 (activities)
-- =============================================
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) UNIQUE NOT NULL,
    category VARCHAR(50) CHECK (category IN ('performance', 'party', 'teaching', 'charity', 'family', 'international')),
    cover_url VARCHAR(500),
    cover_key VARCHAR(500),
    content TEXT, -- Markdown内容
    event_date TIMESTAMP WITH TIME ZONE,
    location VARCHAR(200),
    max_participants INTEGER,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_activities_slug ON activities(slug);
CREATE INDEX idx_activities_category ON activities(category);
CREATE INDEX idx_activities_status ON activities(status);
CREATE INDEX idx_activities_event_date ON activities(event_date DESC);

-- =============================================
-- 4. 活动照片表 (activity_photos)
-- =============================================
CREATE TABLE IF NOT EXISTS activity_photos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    key VARCHAR(500) NOT NULL,
    caption VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_activity_photos_activity_id ON activity_photos(activity_id);
CREATE INDEX idx_activity_photos_sort_order ON activity_photos(sort_order);

-- =============================================
-- 5. 会员心路分享表 (member_stories)
-- =============================================
CREATE TABLE IF NOT EXISTS member_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID REFERENCES members(id) ON DELETE SET NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL, -- Markdown内容
    cover_url VARCHAR(500),
    cover_key VARCHAR(500),
    likes_count INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_member_stories_member_id ON member_stories(member_id);
CREATE INDEX idx_member_stories_is_published ON member_stories(is_published) WHERE is_published = true;
CREATE INDEX idx_member_stories_published_at ON member_stories(published_at DESC);

-- =============================================
-- 6. 师资表 (teachers)
-- =============================================
CREATE TABLE IF NOT EXISTS teachers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    instruments TEXT[],
    bio TEXT,
    avatar_url VARCHAR(500),
    avatar_key VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_teachers_is_active ON teachers(is_active) WHERE is_active = true;
CREATE INDEX idx_teachers_sort_order ON teachers(sort_order);

-- =============================================
-- 7. 联系表单表 (contact_forms)
-- =============================================
CREATE TABLE IF NOT EXISTS contact_forms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    form_type VARCHAR(20) CHECK (form_type IN ('contact', 'cooperation')),
    org_name VARCHAR(200),
    contact_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(200),
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_contact_forms_form_type ON contact_forms(form_type);
CREATE INDEX idx_contact_forms_created_at ON contact_forms(created_at DESC);

-- =============================================
-- 8. 管理员表 (admins)
-- =============================================
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(200) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- bcrypt加密
    name VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 索引
CREATE INDEX idx_admins_email ON admins(email);
CREATE INDEX idx_admins_is_active ON admins(is_active) WHERE is_active = true;

-- =============================================
-- 触发器：自动更新 updated_at
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有需要更新updated_at的表创建触发器
CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON members FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_member_stories_updated_at BEFORE UPDATE ON member_stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_teachers_updated_at BEFORE UPDATE ON teachers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_admins_updated_at BEFORE UPDATE ON admins FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 物化视图：视频统计
-- =============================================
CREATE MATERIALIZED VIEW IF NOT EXISTS video_stats AS
SELECT 
    instrument_category,
    COUNT(*) as total_videos,
    SUM(views) as total_views,
    AVG(views) as avg_views,
    MAX(uploaded_at) as latest_upload
FROM videos
WHERE status = 'published'
GROUP BY instrument_category;

-- 物化视图刷新函数
CREATE OR REPLACE FUNCTION refresh_video_stats()
RETURNS TRIGGER AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY video_stats;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 创建触发器自动刷新统计
CREATE TRIGGER trigger_refresh_video_stats
AFTER INSERT OR UPDATE OR DELETE ON videos
FOR EACH STATEMENT EXECUTE FUNCTION refresh_video_stats();

-- =============================================
-- 初始数据：创始人会员
-- =============================================
INSERT INTO members (member_no, name, nickname, city, instruments, member_type, is_public, status) VALUES
(1, 'IRIS', 'IRIS', '北京', ARRAY['吉他', '声乐'], 'musician', true, 'approved'),
(19, 'DIEGO', 'DIEGO', '中国香港', ARRAY['发起人'], 'musician', true, 'approved'),
(24, 'MIYA', 'MIYA', '北京', ARRAY['吉他', '钢琴'], 'musician', true, 'approved')
ON CONFLICT (member_no) DO NOTHING;

-- =============================================
-- 权限配置（生产环境建议更严格的权限控制）
-- =============================================
-- 创建只读用户（用于前端查询）
-- CREATE USER im_frontend WITH PASSWORD 'your_password';
-- GRANT CONNECT ON DATABASE your_db TO im_frontend;
-- GRANT USAGE ON SCHEMA public TO im_frontend;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO im_frontend;
-- GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO im_frontend;

-- =============================================
-- 完成
-- =============================================
-- 执行完此脚本后，请运行：
-- SELECT * FROM video_stats; -- 查看视频统计
-- SELECT COUNT(*) FROM members WHERE status = 'approved'; -- 查看已审核会员数
