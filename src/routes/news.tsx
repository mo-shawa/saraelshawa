import { createFileRoute } from '@tanstack/react-router'
import { useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import NewsCard from '../components/NewsCard'
import { getNewsPageData } from '../lib/content'
import type { NewsPageData } from '../lib/content-types'

export const Route = createFileRoute('/news')({
  component: NewsPage,
  loader: async () => {
    return await getNewsPageData()
  },
})

function NewsPage() {
  const { newsItems } = Route.useLoaderData() as NewsPageData
  const timelineRef = useRef<HTMLDivElement>(null)
  
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 50%'],
  })

  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-20">
      {/* Header */}
      <section className="section pb-8">
        <div className="container">
          <div className="max-w-2xl space-y-4">
            <span className="uppercase-label flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-border-strong)]" />
              Timeline
            </span>
            <h1 className="text-headline">News</h1>
            <p className="text-body-lg">
              A timeline of milestones, achievements, and key moments in my
              academic and research journey.
            </p>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container">
        <hr className="section-divider" />
      </div>

      {/* Timeline */}
      <section className="section pt-8">
        <div className="container">
          <div className="max-w-2xl">
            <div 
              ref={timelineRef}
              className="card p-6 sm:p-8"
            >
              <div className="relative">
                {/* Static timeline line */}
                <div 
                  className="absolute left-2 w-px bg-[var(--color-border)]"
                  style={{
                    top: '0.375rem',
                    bottom: '0.375rem',
                  }}
                />
                
                {/* Animated progress line */}
                <motion.div
                  className="absolute left-2 w-px bg-[var(--color-primary)] origin-top"
                  style={{ 
                    top: '0.375rem',
                    bottom: '0.375rem',
                    scaleY: scrollYProgress,
                  }}
                />
                
                {newsItems.map((item, index) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    isLast={index === newsItems.length - 1}
                    index={index}
                    totalItems={newsItems.length}
                    scrollProgress={scrollYProgress}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
