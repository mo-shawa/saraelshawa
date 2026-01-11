import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/posts', label: 'Posts' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
] as const

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container">
        <div className="flex items-center justify-between h-14 sm:h-16 px-4">
          {/* Logo */}
          <Link to="/" className="text-lg sm:text-xl font-bold text-white hover:text-cyan-300 transition-colors">
            Sara El-Shawa
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-[var(--color-text-muted)] hover:text-white transition-colors relative py-1"
                activeProps={{
                  className: 'text-sm font-medium text-white transition-colors relative py-1',
                }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white hover:text-cyan-300 transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden absolute top-full left-0 right-0 glass border-t border-white/5 transition-all duration-200 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
      >
        <div className="container px-4 py-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block py-2 px-3 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-white/5 transition-colors text-sm"
              activeProps={{
                className: 'block py-2 px-3 rounded-lg text-white bg-cyan-500/20 transition-colors text-sm',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
