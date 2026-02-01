import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import { PortableText } from '@portabletext/react'
import { getPostById } from '../../lib/content'
import type { Post } from '../../lib/content-types'

export const Route = createFileRoute('/posts/$postId')({
  component: PostDetailPage,
  loader: async ({ params }) => {
    return await getPostById(params.postId)
  },
})

// Custom components for PortableText rendering
const portableTextComponents = {
  marks: {
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          className="text-[var(--color-primary)] hover:opacity-80 transition-opacity"
        >
          {children}
        </a>
      )
    },
  },
}

function PostDetailPage() {
  const post = Route.useLoaderData() as Post | null

  if (!post) {
    return (
      <main className="min-h-screen bg-[var(--color-bg)] pt-20">
        <section className="section">
          <div className="container">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-headline mb-4">Post Not Found</h1>
              <p className="text-[var(--color-text-muted)] mb-6">
                The post you're looking for doesn't exist.
              </p>
              <Link to="/posts" className="btn btn-outline">
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
    month: 'short',
    day: 'numeric',
  })

  // Determine if content is Portable Text (array) or HTML (string)
  const isPortableText = Array.isArray(post.content)

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-20">
      <article className="section">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {/* Back link */}
            <Link
              to="/posts"
              className="inline-flex items-center gap-2 font-mono text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors mb-8"
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
                      className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-subtle)]"
                    >
                      [{tag}]
                    </span>
                  ))}
                </div>
              )}

              <h1 className="text-headline mb-4">{post.title}</h1>

              <div className="font-mono text-sm text-[var(--color-text-subtle)]">
                <time dateTime={post.date}>{formattedDate}</time>
              </div>
            </header>

            {/* Featured image */}
            {post.image && (
              <div className="mb-8 overflow-hidden border border-[var(--color-border)]">
                <img
                  src={post.image}
                  alt={post.imageAlt || post.title}
                  className="w-full object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div
              className="prose prose-invert prose-zinc max-w-none
                prose-headings:font-mono prose-headings:font-semibold
                prose-p:text-[var(--color-text-muted)] prose-p:leading-relaxed
                prose-a:text-[var(--color-primary)] prose-a:no-underline hover:prose-a:opacity-80
                prose-code:font-mono prose-code:text-sm
                prose-pre:bg-[var(--color-surface)] prose-pre:border prose-pre:border-[var(--color-border)]
              "
            >
              {isPortableText ? (
                <PortableText value={post.content} components={portableTextComponents} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: post.content as string }} />
              )}
            </div>

            {/* Links */}
            {post.links && post.links.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[var(--color-border)]">
                <h2 className="font-mono text-sm font-semibold mb-4">Related Links</h2>
                <div className="flex flex-wrap gap-4">
                  {post.links.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 font-mono text-sm text-[var(--color-primary)] hover:opacity-80 transition-opacity"
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
