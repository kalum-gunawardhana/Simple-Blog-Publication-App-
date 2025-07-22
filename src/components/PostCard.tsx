import Link from 'next/link'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Clock, Crown, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  visibility: 'public' | 'private' | 'premium'
  created_at: string
  slug: string
  tags: string[]
}

interface PostCardProps {
  post: Post
  showVisibility?: boolean
}

export default function PostCard({ post, showVisibility = false }: PostCardProps) {
  const getVisibilityIcon = () => {
    switch (post.visibility) {
      case 'premium':
        return <Crown className="h-4 w-4" />
      case 'private':
        return <Lock className="h-4 w-4" />
      default:
        return null
    }
  }

  const getVisibilityColor = () => {
    switch (post.visibility) {
      case 'premium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'private':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-green-100 text-green-800 border-green-200'
    }
  }

  return (
    <Card className="group h-full transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/posts/${post.slug}`} className="flex-1">
            <h3 className="font-semibold leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {post.title}
            </h3>
          </Link>
          {showVisibility && (
            <Badge variant="outline" className={getVisibilityColor()}>
              {getVisibilityIcon()}
              <span className="ml-1 capitalize">{post.visibility}</span>
            </Badge>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <CalendarDays className="h-3 w-3" />
            {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {Math.ceil(post.content?.length / 1000) || 1} min read
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
          {post.excerpt}
        </p>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{post.tags.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}