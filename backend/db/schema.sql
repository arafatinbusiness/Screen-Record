-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  youtube_url VARCHAR(255) NOT NULL,
  share_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_published BOOLEAN DEFAULT FALSE
);

-- Create video_analytics table to track views
CREATE TABLE IF NOT EXISTS video_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  viewer_ip VARCHAR(45),
  watch_duration_seconds INTEGER DEFAULT 0,
  watched_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_videos_share_token ON videos(share_token);
CREATE INDEX IF NOT EXISTS idx_analytics_video_id ON video_analytics(video_id);
CREATE INDEX IF NOT EXISTS idx_analytics_watched_at ON video_analytics(watched_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
