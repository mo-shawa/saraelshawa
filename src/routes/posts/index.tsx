import { createFileRoute } from '@tanstack/react-router'
import PostCard from '../../components/PostCard'
import { getPostsPageData } from '../../lib/content'
import type { PostsPageData } from '../../lib/content-types'

export const Route = createFileRoute('/posts/')({
  component: PostsPage,
  loader: async () => {
    return await getPostsPageData()
  },
})

function PostsPage() {
  const { posts } = Route.useLoaderData() as PostsPageData

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-20">
      {/* Header */}
      <section className="section pb-8">
        <div className="container">
          <div className="max-w-2xl space-y-4">
            <span className="uppercase-label flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-border-strong)]" />
              Writing & Research
            </span>
            <h1 className="text-headline">Posts</h1>
            <p className="text-body-lg">
              Thoughts on research, machine learning, and the intersection of
              computer science and biology.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <hr className="section-divider" />
      </div>

      {/* Posts grid */}
      <section className="section pt-8">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)] font-mono text-sm">No posts yet. Check back soon.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
