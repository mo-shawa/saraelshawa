import { createFileRoute } from '@tanstack/react-router'
import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useAnimationFrame } from 'framer-motion'
import Hero from '../components/Hero'
import { VisualGrid } from '../components/VisualGrid'
import { newsItems } from '../data/news'
import NewsCard from '../components/NewsCard'

const affiliationLogos = [
  { src: '/old-images/harvard-logo-transparent.png', alt: 'Harvard University' },
  { src: '/old-images/stanford_logo.png', alt: 'Stanford University' },
  { src: '/old-images/1200px-Utoronto_coa.svg_.png', alt: 'University of Toronto' },
  { src: '/old-images/Tokyo-Universitys-logo..png', alt: 'University of Tokyo' },
]

function LogoMarquee() {
  const [x, setX] = useState(0)
  const speed = 0.4
  const logoWidth = 100
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
    <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)' }}>
      <motion.div
        className="flex items-center"
        style={{ x, gap: `${gap}px` }}
      >
        {logos.map((logo, i) => (
          <img
            key={i}
            src={logo.src}
            alt={logo.alt}
            className="h-14 w-auto flex-shrink-0 opacity-95 transition-opacity hover:opacity-100"
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
  // Show latest 5 milestones on homepage
  const recentNews = newsItems.slice(0, 5)
  const timelineRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ['start 80%', 'end 20%'],
  })
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <main>
      <Hero />

      {/* About section */}
      <section className="section relative overflow-hidden bg-[var(--color-surface)]">
        <VisualGrid className="z-0" />
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute -top-24 left-10 h-64 w-64 rounded-full bg-cyan-500/10 blur-[90px]" />
          <div className="absolute bottom-[-120px] right-[-40px] h-80 w-80 rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_30%,rgba(56,189,248,0.08),transparent_40%),radial-gradient(circle_at_85%_70%,rgba(34,211,238,0.06),transparent_45%)]" />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-12 gap-y-10 items-start">
            <div className="col-span-12 lg:col-span-7 lg:px-2 space-y-5">
              <p className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
                About
              </p>
              <h2 className="text-headline">
                Bridging Computer Science & Biology
              </h2>
              <p className="text-body-lg">
                My research focuses on applying machine learning and computational
                methods to understand complex biological systems. From evolutionary
                genomics to cognitive neuroscience, I explore the intersection of
                computation and life sciences.
              </p>
              <div className="flex flex-wrap gap-3">
                {['Representation learning', 'Causal inference', 'Neuro-symbolic systems', 'Evolutionary modeling'].map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="col-span-12 lg:col-start-8 lg:col-span-5 lg:px-2 grid gap-6 min-w-0 overflow-hidden">
              <div className="glass-card rounded-2xl p-6 overflow-hidden">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300 mb-5">Affiliations</p>
                <LogoMarquee />
              </div>
              <div className="glass-card rounded-2xl p-6">
                <p className="text-sm uppercase tracking-[0.18em] text-cyan-300">Research Focus</p>
                <h3 className="text-title mt-2">Interpretable ML for biology</h3>
                <p className="text-body mt-2">
                  Building models that are rigorous, transparent, and aligned with
                  biological mechanisms.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones section */}
      <section className="section relative overflow-hidden bg-[var(--color-bg)]">
        <VisualGrid className="z-0" />
        <div className="pointer-events-none absolute inset-0 z-[1]">
          <div className="absolute top-[-140px] left-1/2 h-72 w-[640px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[120px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(56,189,248,0.1),transparent_45%)]" />
        </div>
        <div className="container relative z-10">
          <div className="grid grid-cols-12">
          <div className="col-span-12 lg:col-start-2 lg:col-span-10 lg:px-2">
            <div className="text-center mb-12">
              <p className="text-cyan-400 font-semibold tracking-wider uppercase text-sm mb-2">
                Timeline
              </p>
              <h2 className="text-headline">Recent Milestones</h2>
              <p className="text-body-lg mt-3">
                A focused view of current projects, publications, and talks.
              </p>
            </div>

            <div className="glass-panel rounded-3xl p-6 sm:p-8 w-full" ref={timelineRef}>
              <div className="relative">
                <div className="absolute left-[13px] top-8 bottom-4 w-px bg-white/10" />
                <motion.div
                  className="absolute left-[13px] top-8 w-px bg-gradient-to-b from-cyan-400/80 to-transparent"
                  style={{ height: 'calc(100% - 2.5rem)', scaleY: lineScale, transformOrigin: 'top' }}
                />
                {recentNews.map((item, index) => (
                  <NewsCard
                    key={item.id}
                    item={item}
                    isLast={index === recentNews.length - 1}
                    index={index}
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
