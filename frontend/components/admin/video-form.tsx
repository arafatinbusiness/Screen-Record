'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createVideo, updateVideo, Video } from '@/lib/api';
import { toast } from 'sonner';

interface VideoFormProps {
  video?: Video;
  onSuccess?: () => void;
}

export function VideoForm({ video, onSuccess }: VideoFormProps) {
  const [title, setTitle] = useState(video?.title || '');
  const [description, setDescription] = useState(video?.description || '');
  const [youtubeUrl, setYoutubeUrl] = useState(video?.youtube_url || '');
  const [isPublished, setIsPublished] = useState(video?.is_published ?? true);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (!title || !youtubeUrl) {
      toast.error('Title and YouTube URL are required');
      return;
    }

    try {
      setLoading(true);
      
      if (video) {
        await updateVideo(video.id, {
          title,
          description,
          youtubeUrl,
          isPublished,
        });
        toast.success('Video updated');
      } else {
        await createVideo({
          title,
          description,
          youtubeUrl,
          isPublished,
        });
        toast.success('Video created');
        setTitle('');
        setDescription('');
        setYoutubeUrl('');
        setIsPublished(false);
      }
      
      onSuccess?.();
    } catch (error) {
      toast.error('Failed to save video');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{video ? 'Edit Video' : 'Add New Video'}</CardTitle>
        <CardDescription>
          {video ? 'Update video details' : 'Create a new video entry'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description (optional)"
              disabled={loading}
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtubeUrl">YouTube URL *</Label>
            <Input
              id="youtubeUrl"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/embed/..."
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Use the embed URL from YouTube (contains /embed/)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setIsPublished(checked as boolean)}
              disabled={loading}
            />
            <Label htmlFor="isPublished" className="font-normal cursor-pointer">
              Publish this video (visible to others)
            </Label>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Saving...' : video ? 'Update Video' : 'Create Video'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
