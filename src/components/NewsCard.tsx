import type { NewsItem } from '../data/news'
import { ExternalLink } from 'lucide-react'

interface NewsCardProps {
    item: NewsItem
    isLast?: boolean
}

export default function NewsCard({ item, isLast = false }: NewsCardProps) {
    const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
    })

    return (
        <div className="relative pl-8 pb-6 group">
            {/* Timeline line */}
            {!isLast && (
                <div className="absolute left-[11px] top-6 bottom-0 w-px bg-cyan-500/30" />
            )}

            {/* Timeline dot */}
            <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[var(--color-bg)] border-2 border-cyan-500 flex items-center justify-center group-hover:border-cyan-400 transition-colors">
                <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:bg-cyan-300 transition-colors" />
            </div>

            {/* Content */}
            <div className="space-y-1">
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
        </div>
    )
}
