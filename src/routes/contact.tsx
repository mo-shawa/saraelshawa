import { createFileRoute } from '@tanstack/react-router'
import ContactForm from '../components/ContactForm'
import { Mail, MapPin, Linkedin, Github } from 'lucide-react'

export const Route = createFileRoute('/contact')({
    component: ContactPage,
})

function ContactPage() {
    return (
        <main className="min-h-screen bg-[var(--color-bg)]">
            <section className="section">
                <div className="container">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-cyan-400 font-semibold tracking-wider uppercase text-sm mb-2">
                            Get in Touch
                        </p>
                        <h1 className="text-headline">Contact</h1>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start max-w-4xl mx-auto">
                        {/* Contact form */}
                        <div className="card p-6 sm:p-8">
                            <div className="space-y-2 mb-6">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 mb-2">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <h2 className="text-title">Send a Message</h2>
                                <p className="text-[var(--color-text-muted)] text-sm">
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
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] flex items-center justify-center shrink-0">
                                        <MapPin className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white text-sm">Location</h3>
                                        <p className="text-[var(--color-text-muted)] text-sm">Toronto, Ontario, Canada</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] flex items-center justify-center shrink-0">
                                        <Mail className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-white text-sm">Email</h3>
                                        <a
                                            href="mailto:hello@saraelshawa.com"
                                            className="text-cyan-400 hover:text-cyan-300 text-sm"
                                        >
                                            hello@saraelshawa.com
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Social links */}
                            <div className="flex gap-3 pt-2">
                                <a
                                    href="https://linkedin.com/in/saraelshawa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] flex items-center justify-center text-white hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-colors"
                                    aria-label="LinkedIn"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a
                                    href="https://github.com/saraelshawa"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-lg bg-[var(--color-surface-light)] flex items-center justify-center text-white hover:bg-[var(--color-primary)] hover:text-[var(--color-bg)] transition-colors"
                                    aria-label="GitHub"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
}
