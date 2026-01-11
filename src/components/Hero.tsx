import { Link } from '@tanstack/react-router'
import { FileText, Briefcase, ChevronDown } from 'lucide-react'

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center gradient-bg overflow-hidden">
            {/* Subtle decorative elements */}
            <div className="absolute inset-0 opacity-40">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-500/15 rounded-full blur-3xl" />
            </div>

            {/* Main content */}
            <div className="container relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Text content */}
                    <div className="space-y-6 text-center lg:text-left">
                        <div className="space-y-3">
                            <p className="text-cyan-400 font-semibold tracking-wider uppercase text-sm">
                                Computer Scientist & Researcher
                            </p>
                            <h1 className="text-display">
                                Sara<br />
                                <span className="text-cyan-300">El-Shawa</span>
                            </h1>
                        </div>

                        <p className="text-body-lg max-w-lg mx-auto lg:mx-0">
                            I earned my Bachelor's degree in Computer Science and Biology from
                            The University of Toronto and pursue graduate research in machine
                            learning and artificial intelligence at the Vector Institute.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                            <a
                                href="/resume.pdf"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn btn-primary"
                            >
                                <FileText className="w-5 h-5" />
                                Resume
                            </a>
                            <Link
                                to="/posts"
                                className="btn btn-outline"
                            >
                                <Briefcase className="w-5 h-5" />
                                My Work
                            </Link>
                        </div>
                    </div>

                    {/* Profile image */}
                    <div className="flex justify-center lg:justify-end order-first lg:order-last">
                        <div className="relative w-64 sm:w-72 md:w-80 lg:w-96">
                            {/* Glow effect */}
                            <div className="absolute inset-0 bg-cyan-500/20 rounded-2xl blur-2xl scale-105" />

                            {/* Image container */}
                            <div className="relative glass rounded-2xl p-2">
                                <img
                                    src="/old-images/IMG-20200203-151633-2.jpg"
                                    alt="Sara El-Shawa"
                                    className="w-full rounded-xl object-cover aspect-square sm:aspect-4/5"
                                />
                            </div>

                            {/* Floating badge */}
                            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 lg:left-auto lg:translate-x-0 lg:-left-4 glass px-4 py-2 rounded-lg whitespace-nowrap">
                                <p className="text-sm font-medium text-white">
                                    🎓 MASc @ Vector Institute
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
                <ChevronDown className="w-6 h-6 text-white/60" />
            </div>
        </section>
    )
}
