import { useQuery } from '@tanstack/react-query';
import { useRoute, Link } from 'wouter';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, ArrowLeft, Loader2 } from 'lucide-react';
import type { BlogPost } from '@shared/schema';

export default function BlogDetail() {
  const [match, params] = useRoute('/blog/:slug');
  const slug = params?.slug;

  const { data: post, isLoading } = useQuery<BlogPost>({
    queryKey: slug ? [`/api/blog/${slug}`] : ['/api/blog/none'],
    enabled: !!slug,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container px-4 py-12 max-w-4xl mx-auto text-center">
        <p className="text-muted-foreground mb-4">Article not found</p>
        <Link href="/blog"><Button>Back to Blog</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-card border-b border-border py-8">
        <div className="container px-4 max-w-4xl mx-auto">
          <Link href="/blog">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />Back
            </Button>
          </Link>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>{post.author}</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            <span className="px-2 py-1 rounded bg-primary/20 text-primary text-xs font-semibold">{post.category}</span>
          </div>
        </div>
      </div>

      <div className="container px-4 max-w-4xl mx-auto py-12">
        {post.image && (
          <div className="w-full h-96 bg-muted rounded-lg overflow-hidden mb-8">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <Card className="p-8">
          <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
        </Card>

        <div className="mt-8">
          <Link href="/blog"><Button>Back to Blog</Button></Link>
        </div>
      </div>
    </div>
  );
}
