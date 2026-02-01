import { Link } from '@tanstack/react-router'
import type { Post } from '../lib/content-types'
import { ArrowRight } from 'lucide-react'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })

  return (
    <Link to="/posts/$postId" params={{ postId: post.id }}>
      <article className="card p-5 group cursor-pointer h-full flex flex-col">
        {post.image && (
          <div className="relative overflow-hidden mb-4 -mx-5 -mt-5">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-40 object-cover"
            />
          </div>
        )}

        <div className="space-y-3 flex-1 flex flex-col">
          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)]"
                >
                  [{tag}]
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="font-mono text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-primary)] transition-colors leading-snug">
            {post.title}
          </h3>

          {/* Date */}
          <div className="font-mono text-xs text-[var(--color-text-subtle)]">
            <time dateTime={post.date}>{formattedDate}</time>
          </div>

          {/* Excerpt */}
          <p className="text-sm text-[var(--color-text-muted)] line-clamp-2 flex-1">
            {post.excerpt}
          </p>

          {/* Read more */}
          <div className="flex items-center gap-2 text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] font-mono text-xs pt-2 transition-colors">
            <span className="w-4 h-px bg-current" />
            <span>Read more</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>
      </article>
    </Link>
  )
}
