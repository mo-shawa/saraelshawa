type VisualGridProps = {
  className?: string
}

export function VisualGrid({ className = '' }: VisualGridProps) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`.trim()}
      aria-hidden
    >
      <div className="container h-full mx-auto relative">
        <div className="h-full grid grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="h-full border-l border-white/[0.02] last:border-r"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
