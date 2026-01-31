import { createFileRoute } from '@tanstack/react-router'
import ContactForm from '../components/ContactForm'
import { Mail, MapPin, Linkedin, Github } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  return (
    <main className="min-h-screen bg-[var(--color-bg)] pt-20">
      <section className="section">
        <div className="container">
          {/* Header */}
          <div className="mb-12 space-y-4">
            <span className="uppercase-label flex items-center gap-3">
              <span className="w-6 h-px bg-[var(--color-border-strong)]" />
              Get in Touch
            </span>
            <h1 className="text-headline">Contact</h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-4xl">
            {/* Contact form */}
            <div className="card p-6 sm:p-8">
              <div className="space-y-2 mb-6">
                <div className="inline-flex items-center justify-center w-10 h-10 border border-[var(--color-border)] text-[var(--color-primary)] mb-2">
                  <Mail className="w-5 h-5" />
                </div>
                <h2 className="text-title">Send a Message</h2>
                <p className="text-sm text-[var(--color-text-muted)]">
                  Have a question or want to collaborate? I'd love to hear from you.
                </p>
              </div>

              <ContactForm />
            </div>

            {/* Contact info */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-title">Let's Connect</h2>
                <p className="text-[var(--color-text-muted)]">
                  I'm always interested in discussing research collaborations,
                  speaking opportunities, or connecting with fellow researchers.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-[var(--color-text-subtle)]" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-medium text-[var(--color-text)]">Location</h3>
                    <p className="text-sm text-[var(--color-text-muted)]">Toronto, Ontario, Canada</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-[var(--color-text-subtle)]" />
                  </div>
                  <div>
                    <h3 className="font-mono text-sm font-medium text-[var(--color-text)]">Email</h3>
                    <a
                      href="mailto:hello@saraelshawa.com"
                      className="text-sm text-[var(--color-primary)] hover:opacity-80 transition-opacity"
                    >
                      hello@saraelshawa.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className="flex gap-2 pt-2">
                <a
                  href="https://linkedin.com/in/saraelshawa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)] transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://github.com/saraelshawa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-hover)] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
