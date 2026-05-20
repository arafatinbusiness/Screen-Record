const express = require('express');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');
const { verifyApiKey } = require('../utils/auth');

const router = express.Router();

// Get all videos (admin only)
router.get('/admin/videos', verifyApiKey, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, title, description, youtube_url, share_token, created_at, is_published FROM videos ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get single video by share token (public)
router.get('/videos/:shareToken', async (req, res) => {
  try {
    const { shareToken } = req.params;
    const result = await pool.query(
      'SELECT id, title, description, youtube_url, share_token, created_at, is_published FROM videos WHERE share_token = $1 AND is_published = true',
      [shareToken]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ error: 'Failed to fetch video' });
  }
});

// Create video (admin only)
router.post('/admin/videos', verifyApiKey, async (req, res) => {
  try {
    const { title, description, youtubeUrl, isPublished = false } = req.body;
    
    if (!title || !youtubeUrl) {
      return res.status(400).json({ error: 'Title and YouTube URL are required' });
    }
    
    const shareToken = uuidv4();
    const result = await pool.query(
      'INSERT INTO videos (title, description, youtube_url, share_token, is_published) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, description, youtube_url, share_token, created_at, is_published',
      [title, description || null, youtubeUrl, shareToken, isPublished]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({ error: 'Failed to create video' });
  }
});

// Update video (admin only)
router.put('/admin/videos/:id', verifyApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, youtubeUrl, isPublished } = req.body;
    
    const result = await pool.query(
      'UPDATE videos SET title = COALESCE($1, title), description = COALESCE($2, description), youtube_url = COALESCE($3, youtube_url), is_published = COALESCE($4, is_published) WHERE id = $5 RETURNING id, title, description, youtube_url, share_token, created_at, is_published',
      [title, description, youtubeUrl, isPublished, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating video:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// Delete video (admin only)
router.delete('/admin/videos/:id', verifyApiKey, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM videos WHERE id = $1 RETURNING id',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Video not found' });
    }
    
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

module.exports = router;
