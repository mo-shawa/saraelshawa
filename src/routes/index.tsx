import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { motion, useScroll, useAnimationFrame } from 'framer-motion'
import Hero from '../components/Hero'
import NewsCard from '../components/NewsCard'
import { getHomePageData } from '../lib/content.server'
import type { HomePageData, Affiliation, ResearchArea } from '../lib/content-types'

function LogoMarquee({ affiliations }: { affiliations: Affiliation[] }) {
  const [x, setX] = useState(0)
  const speed = 0.3
  const logoWidth = 80
  const gap = 48
  const setWidth = affiliations.length * (logoWidth + gap)

  useAnimationFrame(() => {
    setX((prev) => {
      const next = prev - speed
      return next <= -setWidth ? 0 : next
    })
  })

  const logos = [...affiliations, ...affiliations, ...affiliations]

  return (
    <div className="marquee">
      <motion.div
        className="marquee-track"
        style={{ x }}
      >
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo.logoUrl}
            alt={logo.name}
            className="marquee-logo"
          />
        ))}
      </motion.div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
  loader: async () => {
    return await getHomePageData()
  },
})

function Home() {
  const data = Route.useLoaderData() as HomePageData
  const { hero, about, affiliations, recentNews } = data
  
  const timelineRef = useRef<HTMLDivElement>(null)
  
  // Scroll tracking for the timeline section
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 50%'],
  })

  return (
    <main>
      <Hero settings={hero} />

      {/* About section */}
      <section className="section bg-[var(--color-surface)] border-b border-[var(--color-border)]">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8">
            {/* Left column - Main content */}
            <div className="lg:col-span-7 space-y-8">
              {/* Section header */}
              <div className="space-y-4">
                <span className="uppercase-label flex items-center gap-3">
                  <span className="w-6 h-px bg-[var(--color-border-strong)]" />
                  {about.sectionLabel}
                </span>
                <h2 className="text-headline">
                  {about.headline}
                </h2>
              </div>

              {/* Description */}
              <p className="text-body-lg border-l border-[var(--color-border)] pl-6">
                {about.description}
              </p>

              {/* Research areas */}
              <div className="space-y-3">
                {about.researchAreas.map((area: ResearchArea) => (
                  <div key={area.label} className="feature-item">
                    <span>
                      <span className="feature-label">{area.label}</span>
                      <span className="feature-description">{area.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column - Cards */}
            <div className="lg:col-span-5 space-y-4">
              {/* Affiliations card */}
              <div className="card p-6">
                <span className="uppercase-label mb-4 block">Affiliations</span>
                <LogoMarquee affiliations={affiliations} />
              </div>

              {/* Approach card */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="uppercase-label">Approach</span>
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                </div>
                <h3 className="text-title mb-2">{about.approachTitle}</h3>
                <p className="text-body">
                  {about.approachDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones section */}
      <section className="section bg-[var(--color-bg)]">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            {/* Section header */}
            <div className="text-center mb-12 space-y-4">
              <span className="uppercase-label inline-flex items-center gap-3">
                <span className="w-6 h-px bg-[var(--color-border-strong)]" />
                Timeline
                <span className="w-6 h-px bg-[var(--color-border-strong)]" />
              </span>
              <h2 className="text-headline">Recent Milestones</h2>
              <p className="text-body-lg max-w-xl mx-auto">
                A focused view of current projects, publications, and talks.
              </p>
            </div>

            {/* Timeline */}
            <div 
              ref={timelineRef}
              className="card p-6 sm:p-8 lg:p-10"
            >
              <div className="relative">
                {/* Static timeline line - from first dot to last dot */}
                <div 
                  className="absolute left-2 w-px bg-[var(--color-border)]"
                  style={{
                    top: '0.375rem',
                    // Calculate to stop exactly at last dot: total height minus the last item's content
                    // Last item has no pb-6, so we just need to reach its dot position
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

                {/* Timeline items */}
                <div className="space-y-0">
                  {recentNews.map((item, index) => (
                    <NewsCard
                      key={item.id}
                      item={item}
                      isLast={index === recentNews.length - 1}
                      index={index}
                      totalItems={recentNews.length}
                      scrollProgress={scrollYProgress}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
