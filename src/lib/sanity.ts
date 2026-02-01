import { createClient } from '@sanity/client'
import imageUrlBuilder from '@sanity/image-url'

// Sanity client for fetching content at build time
// This client is used during SSG/SSR, NOT in the browser
export const sanityClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '7lwqqklw',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  // useCdn: false for build time to always get fresh content
  // The site is statically generated, so this only runs at build time
  useCdn: false,
  // Token is optional but recommended for drafts/preview
  token: process.env.SANITY_API_TOKEN,
})

// Helper function to fetch with proper typing
export async function sanityFetch<T>(
  query: string,
  params?: Record<string, unknown>
): Promise<T> {
  return sanityClient.fetch(query, params as any) as Promise<T>
}

// Image URL builder
const builder = imageUrlBuilder(sanityClient)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}

// Type definitions for Sanity content
export interface SanityLink {
  label: string
  url: string
}

export interface SanityResearchArea {
  label: string
  description: string
}

export interface SanityPost {
  _id: string
  title: string
  slug: { current: string }
  excerpt: string
  content: any[] // Portable Text blocks
  date: string
  image?: {
    asset: { _ref: string; url?: string }
    alt?: string
  }
  tags?: string[]
  links?: SanityLink[]
}

export interface SanityNewsItem {
  _id: string
  title: string
  slug: { current: string }
  description: string
  date: string
  links?: SanityLink[]
}

export interface SanityHeroSettings {
  name: string
  label: string
  subtitle: string
  highlightedText?: string
  tags?: string[]
  ctaResearchLabel?: string
  ctaCvLabel?: string
  cvFile?: string
}

export interface SanityAboutSettings {
  sectionLabel?: string
  headline: string
  description: string
  researchAreas?: SanityResearchArea[]
  approachTitle?: string
  approachDescription?: string
}

export interface SanitySiteSettings {
  email?: string
  location?: string
  linkedInUrl?: string
  githubUrl?: string
  twitterUrl?: string
  googleScholarUrl?: string
}

export interface SanityAffiliation {
  _id: string
  name: string
  logo: {
    asset: { _ref: string }
  }
  url?: string
  order?: number
}
