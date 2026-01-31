import { Link } from '@tanstack/react-router'
import { Github, Linkedin, Mail } from 'lucide-react'

const navLinks = [
  { to: '/posts', label: 'Posts' },
  { to: '/news', label: 'News' },
  { to: '/contact', label: 'Contact' },
] as const

const socialLinks = [
  { href: 'https://github.com/saraelshawa', icon: Github, label: 'GitHub' },
  { href: 'https://linkedin.com/in/saraelshawa', icon: Linkedin, label: 'LinkedIn' },
  { href: 'mailto:hello@saraelshawa.com', icon: Mail, label: 'Email' },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
          {/* Logo & Copyright */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="logo block">
              Sara El-Shawa
            </Link>
            <p className="text-sm text-[var(--color-text-subtle)]">
              Researcher applying machine learning<br />to biological systems.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-4">
            <span className="uppercase-label block mb-4">Navigation</span>
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="footer-link w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Social */}
          <div className="md:col-span-4">
            <span className="uppercase-label block mb-4">Connect</span>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link inline-flex items-center gap-2 w-fit"
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--color-border)] mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-mono text-xs text-[var(--color-text-subtle)]">
            &copy; {currentYear} Sara El-Shawa
          </p>
          <div className="flex items-center gap-4">
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
            >
              CV
            </a>
            <span className="text-[var(--color-text-subtle)]">/</span>
            <a
              href="#"
              className="font-mono text-xs text-[var(--color-text-subtle)] hover:text-[var(--color-text)] transition-colors"
            >
              Privacy
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
