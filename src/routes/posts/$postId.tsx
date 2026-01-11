import { createFileRoute } from '@tanstack/react-router'
import { getPostById } from '../../data/posts'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-react'

export const Route = createFileRoute('/posts/$postId')({
  component: PostDetailPage,
})

function PostDetailPage() {
  const { postId } = Route.useParams()
  const post = getPostById(postId)

  if (!post) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)]">
        <section className="section">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-headline mb-4">Post Not Found</h1>
              <p className="text-[var(--color-text-muted)] mb-6">
                The post you're looking for doesn't exist.
              </p>
              <Link to="/posts" className="btn btn-primary">
                <ArrowLeft className="w-4 h-4" />
                Back to Posts
              </Link>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      <article className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Back link */}
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 text-sm text-[var(--color-text-muted)] hover:text-white mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Posts
            </Link>

            {/* Header */}
            <header className="mb-8">
              {/* Tags */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-headline mb-4">{post.title}</h1>

              <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                <Calendar className="w-4 h-4" />
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
            </header>

            {/* Featured image */}
            {post.image && (
              <div className="mb-8 rounded-xl overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert prose-cyan max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Links */}
            {post.links && post.links.length > 0 && (
              <div className="mt-8 pt-6 border-t border-white/10">
                <h2 className="text-lg font-semibold mb-4">Related Links</h2>
                <div className="flex flex-wrap gap-3">
                  {post.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </main>
  )
}
