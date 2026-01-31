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
    <header className="header">
      <div className="container">
        <div className="header-inner">
          {/* Logo */}
          <Link to="/" className="logo">
            Sara El-Shawa
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link, index) => (
              <span key={link.to} className="flex items-center">
                <Link
                  to={link.to}
                  className="nav-link"
                  activeProps={{
                    className: 'nav-link nav-link-active',
                  }}
                >
                  {link.label}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="text-[var(--color-text-subtle)] mx-1">/</span>
                )}
              </span>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <nav
        className={`md:hidden absolute top-full left-0 right-0 bg-[var(--color-bg)] border-b border-[var(--color-border)] transition-all duration-200 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className="container py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setIsOpen(false)}
              className="block py-2 px-3 font-mono text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors"
              activeProps={{
                className: 'block py-2 px-3 font-mono text-sm text-[var(--color-text)] transition-colors',
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
