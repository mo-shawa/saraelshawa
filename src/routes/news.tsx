import { createFileRoute } from '@tanstack/react-router'
import { newsItems } from '../data/news'
import NewsCard from '../components/NewsCard'

export const Route = createFileRoute('/news')({
  component: NewsPage,
})

function NewsPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)]">
      {/* Header */}
      <section className="section pb-8">
        <div className="container">
          <div className="max-w-2xl space-y-3">
            <p className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
              Timeline
            </p>
            <h1 className="text-headline">News</h1>
            <p className="text-body-lg">
              A timeline of milestones, achievements, and key moments in my
              academic and research journey.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section pt-0">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            {newsItems.map((item, index) => (
              <NewsCard
                key={item.id}
                item={item}
                isLast={index === newsItems.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
