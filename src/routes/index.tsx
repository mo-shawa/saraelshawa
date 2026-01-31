import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { motion, useScroll, useAnimationFrame } from 'framer-motion'
import Hero from '../components/Hero'
import { newsItems } from '../data/news'
import NewsCard from '../components/NewsCard'

const affiliationLogos = [
  { src: '/old-images/harvard-logo-transparent.png', alt: 'Harvard University' },
  { src: '/old-images/stanford_logo.png', alt: 'Stanford University' },
  { src: '/old-images/1200px-Utoronto_coa.svg_.png', alt: 'University of Toronto' },
  { src: '/old-images/Tokyo-Universitys-logo..png', alt: 'University of Tokyo' },
]

const researchAreas = [
  { label: 'Representation learning', description: 'Discovering meaningful structure in high-dimensional biological data' },
  { label: 'Causal inference', description: 'Identifying causal relationships in complex systems' },
  { label: 'Neuro-symbolic systems', description: 'Bridging neural networks with symbolic reasoning' },
  { label: 'Evolutionary modeling', description: 'Computational approaches to understanding evolution' },
]

function LogoMarquee() {
  const [x, setX] = useState(0)
  const speed = 0.3
  const logoWidth = 80
  const gap = 48
  const setWidth = affiliationLogos.length * (logoWidth + gap)

  useAnimationFrame(() => {
    setX((prev) => {
      const next = prev - speed
      return next <= -setWidth ? 0 : next
    })
  })

  const logos = [...affiliationLogos, ...affiliationLogos, ...affiliationLogos]

  return (
    <div className="marquee">
      <motion.div
        className="marquee-track"
        style={{ x }}
      >
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="marquee-logo"
          />
        ))}
      </motion.div>
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  const recentNews = newsItems.slice(0, 5)
  const timelineRef = useRef<HTMLDivElement>(null)
  
  // Scroll tracking for the timeline section
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 70%', 'end 50%'],
  })

  return (
    <main>
      <Hero />

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
                  Background
                </span>
                <h2 className="text-headline">
                  Bridging Computer Science & Biology
                </h2>
              </div>

              {/* Description */}
              <p className="text-body-lg border-l border-[var(--color-border)] pl-6">
                My research focuses on applying machine learning and computational
                methods to understand complex biological systems. From evolutionary
                genomics to cognitive neuroscience, I explore the intersection of
                computation and life sciences.
              </p>

              {/* Research areas */}
              <div className="space-y-3">
                {researchAreas.map((area) => (
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
                <LogoMarquee />
              </div>

              {/* Approach card */}
              <div className="card p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className="uppercase-label">Approach</span>
                  <span className="w-2 h-2 bg-[var(--color-primary)] rounded-full" />
                </div>
                <h3 className="text-title mb-2">Interpretable ML</h3>
                <p className="text-body">
                  Building models that are rigorous, transparent, and aligned with
                  biological mechanisms.
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
