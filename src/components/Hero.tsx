import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { HeroSettings } from '../lib/content-types'

// Individual wave component with smooth CSS-based opacity
function Wave({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute top-0 bottom-0 right-[15%] w-[900px]"
      style={{}}
      initial={{ 
        x: 0, 
        opacity: 0,
        background: 'linear-gradient(to left, rgba(34, 211, 238, 0.04) 0%, transparent 100%)',
      }}
      animate={{ 
        x: -700,
        opacity: [0, 1, 1, 0],
        background: [
          'linear-gradient(to left, rgba(34, 211, 238, 0.04) 0%, transparent 100%)',
          'linear-gradient(to left, rgba(56, 189, 248, 0.035) 0%, transparent 100%)',
          'linear-gradient(to left, rgba(99, 102, 241, 0.025) 0%, transparent 100%)',
          'linear-gradient(to left, rgba(139, 92, 246, 0.01) 0%, transparent 100%)',
        ],
      }}
      transition={{
        x: {
          duration: 16,
          repeat: Infinity,
          ease: 'linear',
          delay,
        },
        opacity: {
          duration: 16,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
          times: [0, 0.1, 0.7, 1], // Slow fade in, hold, slow fade out
        },
        background: {
          duration: 16,
          repeat: Infinity,
          ease: 'linear',
          delay,
        },
      }}
    />
  )
}

interface HeroProps {
  settings: HeroSettings
}

export default function Hero({ settings }: HeroProps) {
  // Parse subtitle to inject highlighted text
  const renderSubtitle = () => {
    if (settings.highlightedText && settings.subtitle.includes(settings.highlightedText)) {
      const parts = settings.subtitle.split(settings.highlightedText)
      return (
        <>
          {parts[0]}
          <span className="text-[var(--color-primary)]">{settings.highlightedText}</span>
          {parts[1]}
        </>
      )
    }
    return settings.subtitle
  }

  return (
    <section className="relative min-h-[90vh] w-full bg-[var(--color-bg)] pt-20 overflow-hidden">
      {/* Radiating pulse effect - extremely subtle, very slow waves from right */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Wave delay={0} />
        <Wave delay={5.3} />
        <Wave delay={10.6} />
      </div>

      {/* Vertical accent line - the source of the waves */}
      <div className="absolute right-[15%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--color-primary)] to-transparent opacity-20 hidden lg:block" />
      
      {/* Subtle corner accent */}
      <div className="absolute top-20 right-0 w-32 h-32 border-t border-r border-[var(--color-border)] opacity-30 hidden lg:block" />

      <div className="container relative z-10 h-full min-h-[calc(90vh-5rem)] flex flex-col justify-center py-16 lg:py-24">
        <div className="max-w-3xl space-y-6">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="uppercase-label flex items-center gap-3"
          >
            <span className="w-6 h-px bg-[var(--color-border-strong)]" />
            <span>{settings.label}</span>
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-display"
          >
            {settings.name}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-[var(--color-text-muted)] max-w-xl leading-relaxed"
          >
            {renderSubtitle()}
          </motion.p>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap gap-2 pt-2"
          >
            {settings.tags.map((tag) => (
              <span key={tag} className="tag">
                <span className="tag-prefix">[+]</span>
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap items-center gap-6 pt-4"
          >
            <Link
              to="/posts"
              className="btn btn-outline group"
            >
              <span className="w-4 h-px bg-current group-hover:w-6 transition-all" />
              {settings.ctaResearchLabel}
            </Link>

            <a
              href={settings.cvFile || '/resume.pdf'}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              <span className="w-3 h-px bg-current" />
              {settings.ctaCvLabel}
            </a>
          </motion.div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--color-border)]" />

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="uppercase-label text-[10px]">Scroll</span>
        <div className="w-px h-6 bg-gradient-to-b from-[var(--color-text-subtle)] to-transparent" />
      </motion.div>
    </section>
  )
}
