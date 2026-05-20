const express = require('express');
const pool = require('../db');
const { verifyApiKey } = require('../utils/auth');

const router = express.Router();

// Track video view
router.post('/analytics/track', async (req, res) => {
  try {
    const { videoId, watchDuration, userAgent } = req.body;
    const viewerIp = req.ip || req.connection.remoteAddress;
    
    if (!videoId) {
      return res.status(400).json({ error: 'Video ID is required' });
    }
    
    await pool.query(
      'INSERT INTO video_analytics (video_id, viewer_ip, watch_duration_seconds, user_agent) VALUES ($1, $2, $3, $4)',
      [videoId, viewerIp, watchDuration || 0, userAgent || null]
    );
    
    res.status(201).json({ message: 'View tracked' });
  } catch (error) {
    console.error('Error tracking view:', error);
    res.status(500).json({ error: 'Failed to track view' });
  }
});

// Get video analytics (admin only)
router.get('/admin/analytics/:videoId', verifyApiKey, async (req, res) => {
  try {
    const { videoId } = req.params;
    
    const viewsResult = await pool.query(
      'SELECT COUNT(*) as total_views, AVG(watch_duration_seconds) as avg_watch_duration FROM video_analytics WHERE video_id = $1',
      [videoId]
    );
    
    const recentViews = await pool.query(
      'SELECT viewer_ip, watch_duration_seconds, watched_at FROM video_analytics WHERE video_id = $1 ORDER BY watched_at DESC LIMIT 100',
      [videoId]
    );
    
    res.json({
      stats: viewsResult.rows[0],
      recentViews: recentViews.rows
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

module.exports = router;
