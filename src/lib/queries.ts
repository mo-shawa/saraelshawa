import { sanityFetch } from './sanity'
import type {
  SanityPost,
  SanityNewsItem,
  SanityHeroSettings,
  SanityAboutSettings,
  SanitySiteSettings,
  SanityAffiliation,
} from './sanity'

// ============================================================================
// Posts
// ============================================================================

const postFields = `
  _id,
  title,
  slug,
  excerpt,
  content,
  date,
  image {
    asset->,
    alt
  },
  tags,
  links
`

export async function getAllPosts(): Promise<SanityPost[]> {
  const query = `*[_type == "post"] | order(date desc) { ${postFields} }`
  return sanityFetch<SanityPost[]>(query)
}

export async function getPostBySlug(slug: string): Promise<SanityPost | null> {
  const query = `*[_type == "post" && slug.current == $slug][0] { ${postFields} }`
  return sanityFetch<SanityPost | null>(query, { slug })
}

export async function getPostsByTag(tag: string): Promise<SanityPost[]> {
  const query = `*[_type == "post" && $tag in tags] | order(date desc) { ${postFields} }`
  return sanityFetch<SanityPost[]>(query, { tag })
}

// ============================================================================
// News / Milestones
// ============================================================================

const newsFields = `
  _id,
  title,
  slug,
  description,
  date,
  links
`

export async function getAllNewsItems(): Promise<SanityNewsItem[]> {
  const query = `*[_type == "newsItem"] | order(date desc) { ${newsFields} }`
  return sanityFetch<SanityNewsItem[]>(query)
}

export async function getNewsItemBySlug(slug: string): Promise<SanityNewsItem | null> {
  const query = `*[_type == "newsItem" && slug.current == $slug][0] { ${newsFields} }`
  return sanityFetch<SanityNewsItem | null>(query, { slug })
}

// ============================================================================
// Singleton Settings
// ============================================================================

export async function getHeroSettings(): Promise<SanityHeroSettings | null> {
  const query = `*[_type == "heroSettings"][0] {
    name,
    label,
    subtitle,
    highlightedText,
    tags,
    ctaResearchLabel,
    ctaCvLabel,
    "cvFile": cvFile.asset->url
  }`
  return sanityFetch<SanityHeroSettings | null>(query)
}

export async function getAboutSettings(): Promise<SanityAboutSettings | null> {
  const query = `*[_type == "aboutSettings"][0] {
    sectionLabel,
    headline,
    description,
    researchAreas,
    approachTitle,
    approachDescription
  }`
  return sanityFetch<SanityAboutSettings | null>(query)
}

export async function getSiteSettings(): Promise<SanitySiteSettings | null> {
  const query = `*[_type == "siteSettings"][0] {
    email,
    location,
    linkedInUrl,
    githubUrl,
    twitterUrl,
    googleScholarUrl
  }`
  return sanityFetch<SanitySiteSettings | null>(query)
}

// ============================================================================
// Affiliations
// ============================================================================

export async function getAllAffiliations(): Promise<SanityAffiliation[]> {
  const query = `*[_type == "affiliation"] | order(order asc) {
    _id,
    name,
    logo {
      asset->
    },
    url,
    order
  }`
  return sanityFetch<SanityAffiliation[]>(query)
}

// ============================================================================
// Combined queries for pages (reduces API calls)
// ============================================================================

export interface HomePageData {
  hero: SanityHeroSettings | null
  about: SanityAboutSettings | null
  affiliations: Array<{
    _id: string
    name: string
    logoUrl: string
    url?: string
    order?: number
  }>
  recentNews: SanityNewsItem[]
  siteSettings: SanitySiteSettings | null
}

export async function getHomePageData(): Promise<HomePageData> {
  const query = `{
    "hero": *[_type == "heroSettings"][0] {
      name,
      label,
      subtitle,
      highlightedText,
      tags,
      ctaResearchLabel,
      ctaCvLabel,
      "cvFile": cvFile.asset->url
    },
    "about": *[_type == "aboutSettings"][0] {
      sectionLabel,
      headline,
      description,
      researchAreas,
      approachTitle,
      approachDescription
    },
    "affiliations": *[_type == "affiliation"] | order(order asc) {
      _id,
      name,
      "logoUrl": logo.asset->url,
      url,
      order
    },
    "recentNews": *[_type == "newsItem"] | order(date desc)[0...5] {
      _id,
      title,
      slug,
      description,
      date,
      links
    },
    "siteSettings": *[_type == "siteSettings"][0] {
      email,
      location,
      linkedInUrl,
      githubUrl,
      twitterUrl,
      googleScholarUrl
    }
  }`
  return sanityFetch<HomePageData>(query)
}

export interface PostsPageData {
  posts: Array<{
    _id: string
    title: string
    slug: { current: string }
    excerpt: string
    date: string
    imageUrl?: string
    imageAlt?: string
    tags?: string[]
  }>
}

export async function getPostsPageData(): Promise<PostsPageData> {
  const query = `{
    "posts": *[_type == "post"] | order(date desc) {
      _id,
      title,
      slug,
      excerpt,
      date,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt,
      tags
    }
  }`
  return sanityFetch<PostsPageData>(query)
}

export interface NewsPageData {
  newsItems: SanityNewsItem[]
}

export async function getNewsPageData(): Promise<NewsPageData> {
  const query = `{
    "newsItems": *[_type == "newsItem"] | order(date desc) {
      _id,
      title,
      slug,
      description,
      date,
      links
    }
  }`
  return sanityFetch<NewsPageData>(query)
}
