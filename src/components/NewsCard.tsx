import type { NewsItem } from '../data/news'
import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

interface NewsCardProps {
    item: NewsItem
    isLast?: boolean
    index?: number
}

export default function NewsCard({ item, isLast = false, index = 0 }: NewsCardProps) {
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    })

    return (
        <motion.div
            className="relative pl-10 pb-8 group"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-10% 0px -10% 0px' }}
        >
            {/* Timeline line */}
            {!isLast && (
                <div className="absolute left-[13px] top-7 bottom-0 w-px bg-cyan-500/25" />
            )}

            {/* Timeline dot */}
            <div className="absolute left-0 top-2 w-7 h-7 rounded-full bg-[var(--color-bg)] border-2 border-cyan-500 flex items-center justify-center group-hover:border-cyan-300 transition-colors">
                <div className="w-2.5 h-2.5 rounded-full bg-cyan-500 group-hover:bg-cyan-300 transition-colors" />
            </div>

            {/* Content */}
            <div className="glass-card rounded-2xl p-4 sm:p-5 space-y-1">
                {/* Date */}
                <time
                    dateTime={item.date}
                    className="text-sm font-semibold text-cyan-400"
                >
                    {formattedDate}
                </time>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-semibold text-white group-hover:text-cyan-100 transition-colors">
                    {item.title}
                </h3>

                {/* Description */}
                <p className="text-sm sm:text-base text-[var(--color-text-muted)]">
                    {item.description}
                </p>

                {/* Links */}
                {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-3 pt-1">
                        {item.links.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300"
                            >
                                {link.label}
                                <ExternalLink className="w-3 h-3" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </motion.div>
    )
}
