import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowRight } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog'],
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border py-12">
        <div className="container px-4 max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">LabourConnect Blog</h1>
          <p className="text-muted-foreground">Tips, news, and guides for skilled technicians</p>
        </div>
      </div>

      <div className="container px-4 py-12 max-w-6xl mx-auto">
        {isLoading ? (
          <p className="text-center text-muted-foreground">Loading articles...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No articles yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.id} href={`/blog/${post.slug}`}>
                <Card className="h-full flex flex-col hover-elevate cursor-pointer">
                  {post.image && (
                    <div className="w-full h-48 bg-muted overflow-hidden">
                      <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-primary/20 text-primary w-fit">
                      {post.category}
                    </span>
                    <CardTitle className="text-lg line-clamp-2 mt-2">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="mt-auto text-xs text-muted-foreground flex gap-4">
                      <span>{post.author}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
