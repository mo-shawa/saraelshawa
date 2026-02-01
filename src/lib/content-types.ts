// Unified content types used throughout the app
// These are framework-agnostic and work with both static data and Sanity CMS

export interface ContentLink {
  label: string
  url: string
}

export interface ResearchArea {
  label: string
  description: string
}

export interface Post {
  id: string
  title: string
  excerpt: string
  content: string | any[] // HTML string (static) or Portable Text blocks (Sanity)
  date: string
  image?: string
  imageAlt?: string
  tags?: string[]
  links?: ContentLink[]
}

export interface NewsItem {
  id: string
  title: string
  description: string
  date: string
  links?: ContentLink[]
}

export interface HeroSettings {
  name: string
  label: string
  subtitle: string
  highlightedText?: string
  tags: string[]
  ctaResearchLabel: string
  ctaCvLabel: string
  cvFile?: string
}

export interface AboutSettings {
  sectionLabel: string
  headline: string
  description: string
  researchAreas: ResearchArea[]
  approachTitle: string
  approachDescription: string
}

export interface SiteSettings {
  email: string
  location: string
  linkedInUrl?: string
  githubUrl?: string
  twitterUrl?: string
  googleScholarUrl?: string
}

export interface Affiliation {
  id: string
  name: string
  logoUrl: string
  url?: string
}

export interface HomePageData {
  hero: HeroSettings
  about: AboutSettings
  affiliations: Affiliation[]
  recentNews: NewsItem[]
  siteSettings: SiteSettings
}

export interface PostsPageData {
  posts: Post[]
}

export interface NewsPageData {
  newsItems: NewsItem[]
}
