import { useState, type FormEvent } from 'react'
import { Send, CheckCircle } from 'lucide-react'

export default function ContactForm() {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formState.name.trim()) {
      newErrors.name = 'Name is required'
    }

    if (!formState.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formState.message.trim()) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validate()) return

    setIsSubmitting(true)

    // Simulate form submission - replace with CMS/API integration
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitted(true)
    setIsSubmitting(false)
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-10 h-10 border border-[var(--color-border)] text-green-400 mb-3">
          <CheckCircle className="w-5 h-5" />
        </div>
        <h3 className="font-mono text-base font-semibold text-[var(--color-text)] mb-1">Message Sent</h3>
        <p className="text-sm text-[var(--color-text-muted)]">
          Thank you for reaching out. I'll get back to you soon.
        </p>
      </div>
    )
  }

  const inputClass = (hasError: boolean) => `
    input
    ${hasError ? 'border-red-500' : ''}
  `

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name field */}
      <div>
        <label htmlFor="name" className="label">
          Name
        </label>
        <input
          type="text"
          id="name"
          value={formState.name}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
          className={inputClass(!!errors.name)}
          placeholder="Your name"
        />
        {errors.name && (
          <p className="mt-1 font-mono text-xs text-red-400">{errors.name}</p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input
          type="email"
          id="email"
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
          className={inputClass(!!errors.email)}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p className="mt-1 font-mono text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="message" className="label">
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={formState.message}
          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
          className={`${inputClass(!!errors.message)} textarea`}
          placeholder="Your message..."
        />
        {errors.message && (
          <p className="mt-1 font-mono text-xs text-red-400">{errors.message}</p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Sending...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Send Message
          </span>
        )}
      </button>
    </form>
  )
}
