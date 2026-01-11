import { createFileRoute } from '@tanstack/react-router'
import { posts } from '../../data/posts'
import PostCard from '../../components/PostCard'

export const Route = createFileRoute('/posts/')({
  component: PostsPage,
})

function PostsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <section className="section pb-8">
        <div className="container">
          <div className="max-w-2xl space-y-3">
            <p className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
              Writing & Research
            </p>
            <h1 className="text-headline">Posts</h1>
            <p className="text-body-lg">
              Thoughts on research, machine learning, and the intersection of
              computer science and biology.
            </p>
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="section pt-0">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[var(--color-text-muted)]">No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
