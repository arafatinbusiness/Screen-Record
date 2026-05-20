'use client';

import { useState } from 'react';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { VideoForm } from '@/components/admin/video-form';
import { VideoList } from '@/components/admin/video-list';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Video } from '@/lib/api';

export default function AdminPage() {
  const { isAuthenticated, loading } = useAdminAuth();
  const [editingVideo, setEditingVideo] = useState<Video | undefined>();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Admin access requires NEXT_PUBLIC_ADMIN_API_KEY environment variable
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">Manage your video library</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <VideoForm
              video={editingVideo}
              onSuccess={() => {
                setEditingVideo(undefined);
                setRefreshTrigger(prev => prev + 1);
              }}
            />
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Videos</CardTitle>
                <CardDescription>
                  {editingVideo ? 'Editing: ' + editingVideo.title : 'Manage your published videos'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <VideoList
                  refreshTrigger={refreshTrigger}
                  onEditClick={setEditingVideo}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
