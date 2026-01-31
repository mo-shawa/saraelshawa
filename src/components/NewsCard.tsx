import type { NewsItem } from '../data/news'
import { ExternalLink } from 'lucide-react'
import { motion, type MotionValue, useTransform } from 'framer-motion'

interface NewsCardProps {
  item: NewsItem
  isLast?: boolean
  index?: number
  totalItems?: number
  scrollProgress?: MotionValue<number>
}

export default function NewsCard({ 
  item, 
  isLast = false, 
  index = 0,
  totalItems = 1,
  scrollProgress,
}: NewsCardProps) {
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })

  // Calculate the threshold for when this item should be "lit"
  // Each item lights up when scroll progress passes its position
  const itemThreshold = totalItems > 1 ? index / (totalItems - 1) : 0
  
  // Transform scroll progress to opacity for this specific dot
  // The dot lights up when scroll progress passes its threshold
  const dotOpacity = scrollProgress 
    ? useTransform(scrollProgress, [Math.max(0, itemThreshold - 0.1), itemThreshold], [0, 1])
    : undefined

  return (
    <motion.div
      className={`relative pl-8 group ${isLast ? 'pb-0' : 'pb-6'}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
    >
      {/* Timeline dot - base (always visible, subtle) */}
      <div className="absolute left-0 top-1.5 w-4 h-4 flex items-center justify-center z-10">
        {/* Base dot */}
        <div className="absolute w-2 h-2 bg-[var(--color-text-subtle)] group-hover:bg-[var(--color-primary)] transition-colors" />
        {/* Lit dot (animated based on scroll) */}
        {scrollProgress && (
          <motion.div 
            className="absolute w-2 h-2 bg-[var(--color-primary)]"
            style={{ opacity: dotOpacity }}
          />
        )}
      </div>

      {/* Content */}
      <div className="space-y-1.5">
        {/* Date */}
        <time
          dateTime={item.date}
          className="font-mono text-xs text-[var(--color-text-subtle)] group-hover:text-[var(--color-primary)] transition-colors"
        >
          {formattedDate}
        </time>

        {/* Title */}
        <h3 className="font-mono text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-text)] transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-text-muted)]">
          {item.description}
        </p>

        {/* Links */}
        {item.links && item.links.length > 0 && (
          <div className="flex flex-wrap gap-4 pt-1">
            {item.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-[var(--color-primary)] hover:opacity-80 transition-opacity"
              >
                {link.label}
                <ExternalLink className="w-3 h-3" />
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Divider line (not on last item) */}
      {!isLast && (
        <div className="absolute left-8 right-0 bottom-0 h-px bg-[var(--color-border)]" />
      )}
    </motion.div>
  )
}
