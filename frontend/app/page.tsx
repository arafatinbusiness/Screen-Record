import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Share2, BarChart3, Lock } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">ScreenRecord</div>
          <div className="flex gap-4">
            <Link href="/admin">
              <Button variant="ghost">Admin Dashboard</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
          Share Your Screen Recordings
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Premium video sharing for your YouTube unlisted videos. Get detailed analytics and share with anyone using secure links.
        </p>
        <Link href="/admin">
          <Button size="lg" className="gap-2">
            Start Sharing <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="grid md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Share2 className="w-8 h-8 mb-4" />
              <CardTitle>Easy Sharing</CardTitle>
              <CardDescription>
                Generate unique share links for each video
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Share your recordings with anyone using secure, public links. No registration required for viewers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <BarChart3 className="w-8 h-8 mb-4" />
              <CardTitle>Analytics</CardTitle>
              <CardDescription>
                Track who watched and for how long
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Get detailed insights into viewer engagement with view counts and watch duration metrics.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Lock className="w-8 h-8 mb-4" />
              <CardTitle>Secure</CardTitle>
              <CardDescription>
                Only publish what you want
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Keep videos in draft mode until you&apos;re ready. Full control over what gets shared.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-20 text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Ready to Share?</CardTitle>
            <CardDescription>
              Create your admin account and start uploading videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/admin">
              <Button size="lg">Go to Admin Dashboard</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>&copy; 2024 ScreenRecord. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
