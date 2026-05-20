'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Copy, Trash2, Edit2 } from 'lucide-react';
import { getAdminVideos, deleteVideo, Video } from '@/lib/api';
import { toast } from 'sonner';

interface VideoListProps {
  onEditClick?: (video: Video) => void;
  refreshTrigger?: number;
}

export function VideoList({ onEditClick, refreshTrigger }: VideoListProps) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchVideos();
  }, [refreshTrigger]);

  async function fetchVideos() {
    try {
      setLoading(true);
      const data = await getAdminVideos();
      setVideos(data);
    } catch (error) {
      toast.error('Failed to load videos');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    
    try {
      await deleteVideo(deleteId);
      setVideos(videos.filter(v => v.id !== deleteId));
      toast.success('Video deleted');
      setDeleteId(null);
    } catch (error) {
      toast.error('Failed to delete video');
      console.error(error);
    }
  }

  function copyShareLink(shareToken: string) {
    const url = `${window.location.origin}/watch/${shareToken}`;
    navigator.clipboard.writeText(url);
    toast.success('Share link copied');
  }

  if (loading) {
    return <div className="text-center py-8">Loading videos...</div>;
  }

  if (videos.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No videos yet. Create your first one!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {videos.map((video) => (
          <Card key={video.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle>{video.title}</CardTitle>
                  <CardDescription>{video.description}</CardDescription>
                </div>
                <Badge variant={video.is_published ? 'default' : 'secondary'}>
                  {video.is_published ? 'Published' : 'Draft'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Created: {new Date(video.created_at).toLocaleDateString()}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyShareLink(video.share_token)}
                    className="gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onEditClick?.(video)}
                    className="gap-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => setDeleteId(video.id)}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Video</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this video? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
