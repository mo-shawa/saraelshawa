// Content service - fetches from Sanity CMS with fallback to static data
// This allows the site to work locally without Sanity configured

import type {
  Post,
  NewsItem,
  HeroSettings,
  AboutSettings,
  SiteSettings,
  Affiliation,
  HomePageData,
  PostsPageData,
  NewsPageData,
} from './content-types'

import { sanityFetch } from './sanity'
import { posts as staticPosts } from '../data/posts'
import { newsItems as staticNewsItems } from '../data/news'

// Check if Sanity is configured
const isSanityConfigured = () => {
  const projectId = process.env.SANITY_PROJECT_ID
  return projectId && projectId !== '7lwqqklw'
}

// ============================================================================
// Default/Fallback Data (used when Sanity isn't configured)
// ============================================================================

const defaultHeroSettings: HeroSettings = {
  name: 'Sara El-Shawa',
  label: 'Computer Science & Biology',
  subtitle: 'Researcher at the Vector Institute, applying machine learning to decode biological systems.',
  highlightedText: 'Vector Institute',
  tags: ['Genomics', 'Neural Data', 'Probabilistic Models', 'Representation Learning'],
  ctaResearchLabel: 'Research',
  ctaCvLabel: 'CV',
}

const defaultAboutSettings: AboutSettings = {
  sectionLabel: 'Background',
  headline: 'Bridging Computer Science & Biology',
  description: 'My research focuses on applying machine learning and computational methods to understand complex biological systems. From evolutionary genomics to cognitive neuroscience, I explore the intersection of computation and life sciences.',
  researchAreas: [
    { label: 'Representation learning', description: 'Discovering meaningful structure in high-dimensional biological data' },
    { label: 'Causal inference', description: 'Identifying causal relationships in complex systems' },
    { label: 'Neuro-symbolic systems', description: 'Bridging neural networks with symbolic reasoning' },
    { label: 'Evolutionary modeling', description: 'Computational approaches to understanding evolution' },
  ],
  approachTitle: 'Interpretable ML',
  approachDescription: 'Building models that are rigorous, transparent, and aligned with biological mechanisms.',
}

const defaultSiteSettings: SiteSettings = {
  email: 'hello@saraelshawa.com',
  location: 'Toronto, Ontario, Canada',
  linkedInUrl: 'https://linkedin.com/in/saraelshawa',
  githubUrl: 'https://github.com/saraelshawa',
}

const defaultAffiliations: Affiliation[] = [
  { id: 'harvard', name: 'Harvard University', logoUrl: '/old-images/harvard-logo-transparent.png' },
  { id: 'stanford', name: 'Stanford University', logoUrl: '/old-images/stanford_logo.png' },
  { id: 'uoft', name: 'University of Toronto', logoUrl: '/old-images/1200px-Utoronto_coa.svg_.png' },
  { id: 'tokyo', name: 'University of Tokyo', logoUrl: '/old-images/Tokyo-Universitys-logo..png' },
]

// Convert static posts to unified format
function convertStaticPosts(): Post[] {
  return staticPosts.map((post) => ({
    id: post.id,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    date: post.date,
    image: post.image,
    tags: post.tags,
    links: post.links,
  }))
}

// Convert static news items to unified format
function convertStaticNewsItems(): NewsItem[] {
  return staticNewsItems.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.description,
    date: item.date,
    links: item.links,
  }))
}

// ============================================================================
// Sanity Data Fetching
// ============================================================================

async function fetchHomePageDataFromSanity(): Promise<HomePageData | null> {
  try {
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
        "_id": _id,
        name,
        "logoUrl": logo.asset->url,
        url,
        order
      },
      "recentNews": *[_type == "newsItem"] | order(date desc)[0...5] {
        "_id": _id,
        title,
        "slug": slug.current,
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
    
    const data = await sanityFetch<any>(query)
    
    // Transform Sanity data to unified format
    return {
      hero: data.hero ? {
        ...defaultHeroSettings,
        ...data.hero,
        tags: data.hero.tags || defaultHeroSettings.tags,
      } : defaultHeroSettings,
      about: data.about ? {
        ...defaultAboutSettings,
        ...data.about,
        researchAreas: data.about.researchAreas || defaultAboutSettings.researchAreas,
      } : defaultAboutSettings,
      affiliations: data.affiliations?.length > 0 
        ? data.affiliations.map((a: any) => ({
            id: a._id,
            name: a.name,
            logoUrl: a.logoUrl,
            url: a.url,
          }))
        : defaultAffiliations,
      recentNews: data.recentNews?.map((item: any) => ({
        id: item._id,
        title: item.title,
        description: item.description,
        date: item.date,
        links: item.links,
      })) || [],
      siteSettings: data.siteSettings ? {
        ...defaultSiteSettings,
        ...data.siteSettings,
      } : defaultSiteSettings,
    }
  } catch (error) {
    console.error('Error fetching from Sanity:', error)
    return null
  }
}

async function fetchPostsFromSanity(): Promise<Post[]> {
  try {
    const query = `*[_type == "post"] | order(date desc) {
      "_id": _id,
      title,
      "slug": slug.current,
      excerpt,
      content,
      date,
      "image": image.asset->url,
      "imageAlt": image.alt,
      tags,
      links
    }`
    
    const data = await sanityFetch<any[]>(query)
    
    return data.map((post) => ({
      id: post.slug || post._id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      date: post.date,
      image: post.image,
      imageAlt: post.imageAlt,
      tags: post.tags,
      links: post.links,
    }))
  } catch (error) {
    console.error('Error fetching posts from Sanity:', error)
    return []
  }
}

async function fetchPostByIdFromSanity(id: string): Promise<Post | null> {
  try {
    const query = `*[_type == "post" && slug.current == $id][0] {
      "_id": _id,
      title,
      "slug": slug.current,
      excerpt,
      content,
      date,
      "image": image.asset->url,
      "imageAlt": image.alt,
      tags,
      links
    }`
    
    const data = await sanityFetch<any>(query, { id })
    
    if (!data) return null
    
    return {
      id: data.slug || data._id,
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      date: data.date,
      image: data.image,
      imageAlt: data.imageAlt,
      tags: data.tags,
      links: data.links,
    }
  } catch (error) {
    console.error('Error fetching post from Sanity:', error)
    return null
  }
}

async function fetchNewsItemsFromSanity(): Promise<NewsItem[]> {
  try {
    const query = `*[_type == "newsItem"] | order(date desc) {
      "_id": _id,
      title,
      "slug": slug.current,
      description,
      date,
      links
    }`
    
    const data = await sanityFetch<any[]>(query)
    
    return data.map((item) => ({
      id: item.slug || item._id,
      title: item.title,
      description: item.description,
      date: item.date,
      links: item.links,
    }))
  } catch (error) {
    console.error('Error fetching news from Sanity:', error)
    return []
  }
}

async function fetchSiteSettingsFromSanity(): Promise<SiteSettings | null> {
  try {
    const query = `*[_type == "siteSettings"][0] {
      email,
      location,
      linkedInUrl,
      githubUrl,
      twitterUrl,
      googleScholarUrl
    }`
    
    const data = await sanityFetch<any>(query)
    
    if (!data) return null
    
    return {
      ...defaultSiteSettings,
      ...data,
    }
  } catch (error) {
    console.error('Error fetching site settings from Sanity:', error)
    return null
  }
}

// ============================================================================
// Public API - Use these functions in routes
// ============================================================================

export async function getHomePageData(): Promise<HomePageData> {
  if (isSanityConfigured()) {
    const data = await fetchHomePageDataFromSanity()
    if (data) return data
  }
  
  // Fallback to static data
  const staticNews = convertStaticNewsItems()
  return {
    hero: defaultHeroSettings,
    about: defaultAboutSettings,
    affiliations: defaultAffiliations,
    recentNews: staticNews.slice(0, 5),
    siteSettings: defaultSiteSettings,
  }
}

export async function getPostsPageData(): Promise<PostsPageData> {
  if (isSanityConfigured()) {
    const posts = await fetchPostsFromSanity()
    if (posts.length > 0) return { posts }
  }
  
  // Fallback to static data
  return { posts: convertStaticPosts() }
}

export async function getPostById(id: string): Promise<Post | null> {
  if (isSanityConfigured()) {
    const post = await fetchPostByIdFromSanity(id)
    if (post) return post
  }
  
  // Fallback to static data
  const staticPost = staticPosts.find((p) => p.id === id)
  if (!staticPost) return null
  
  return {
    id: staticPost.id,
    title: staticPost.title,
    excerpt: staticPost.excerpt,
    content: staticPost.content,
    date: staticPost.date,
    image: staticPost.image,
    tags: staticPost.tags,
    links: staticPost.links,
  }
}

export async function getNewsPageData(): Promise<NewsPageData> {
  if (isSanityConfigured()) {
    const newsItems = await fetchNewsItemsFromSanity()
    if (newsItems.length > 0) return { newsItems }
  }
  
  // Fallback to static data
  return { newsItems: convertStaticNewsItems() }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  if (isSanityConfigured()) {
    const settings = await fetchSiteSettingsFromSanity()
    if (settings) return settings
  }
  
  return defaultSiteSettings
}
