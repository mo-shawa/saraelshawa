import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/Hero'
import { newsItems } from '../data/news'
import NewsCard from '../components/NewsCard'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  // Show latest 5 milestones on homepage
  const recentNews = newsItems.slice(0, 5)

  return (
    <main>
      <Hero />

      {/* About section */}
      <section className="section bg-[var(--color-surface)]">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <h2 className="text-headline">
              Bridging Computer Science & Biology
            </h2>
            <p className="text-body-lg">
              My research focuses on applying machine learning and computational
              methods to understand complex biological systems. From evolutionary
              genomics to cognitive neuroscience, I explore the intersection of
              computation and life sciences.
            </p>
          </div>
        </div>
      </section>

      {/* Milestones section */}
      <section className="section bg-[var(--color-bg)]">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-cyan-400 font-semibold tracking-wider uppercase text-sm mb-2">
                Timeline
              </p>
              <h2 className="text-headline">Recent Milestones</h2>
            </div>

            {recentNews.map((item, index) => (
              <NewsCard
                key={item.id}
                item={item}
                isLast={index === recentNews.length - 1}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
