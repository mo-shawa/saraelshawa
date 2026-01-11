import { Link } from '@tanstack/react-router'
import type { Post } from '../data/posts'
import { Calendar, ArrowRight } from 'lucide-react'

interface PostCardProps {
    post: Post
}

export default function PostCard({ post }: PostCardProps) {
    const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return (
        <Link to="/posts/$postId" params={{ postId: post.id }}>
            <article className="card group cursor-pointer h-full">
                {post.image && (
                    <div className="relative overflow-hidden rounded-lg mb-4 -mx-1 -mt-1">
                        <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </div>
                )}

                <div className="space-y-3">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                        {post.title}
                    </h3>

                    {/* Date */}
                    <div className="flex items-center gap-2 text-xs text-[var(--color-text-subtle)]">
                        <Calendar className="w-3.5 h-3.5" />
                        <time dateTime={post.date}>{formattedDate}</time>
                    </div>

                    {/* Excerpt */}
                    <p className="text-sm text-[var(--color-text-muted)] line-clamp-2">
                        {post.excerpt}
                    </p>

                    {/* Read more */}
                    <div className="flex items-center gap-2 text-cyan-400 font-medium text-sm pt-1 group-hover:gap-3 transition-all">
                        <span>Read more</span>
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </div>
            </article>
        </Link>
    )
}
