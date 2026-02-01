// Server-side content fetching - runs only on the server
// This prevents CORS issues from client-side navigation

import { createServerFn } from '@tanstack/react-start'
import { sanityClient } from './sanity'
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
import { posts as staticPosts } from '../data/posts'
import { newsItems as staticNewsItems } from '../data/news'

// ============================================================================
// Default/Fallback Data
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
// Server Functions - These ALWAYS run on the server
// ============================================================================

export const getHomePageData = createServerFn({ method: 'GET' })
  .handler(async (): Promise<HomePageData> => {
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

      const data = await sanityClient.fetch(query)

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
              logoUrl: a.logoUrl || null,
              url: a.url || null,
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
      console.error('Error fetching home page data from Sanity:', error)
      // Return fallback data
      const staticNews = convertStaticNewsItems()
      return {
        hero: defaultHeroSettings,
        about: defaultAboutSettings,
        affiliations: defaultAffiliations,
        recentNews: staticNews.slice(0, 5),
        siteSettings: defaultSiteSettings,
      }
    }
  })

export const getPostsPageData = createServerFn({ method: 'GET' })
  .handler(async (): Promise<PostsPageData> => {
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

      const data = await sanityClient.fetch(query)

      if (data && data.length > 0) {
        return {
          posts: data.map((post: any) => ({
            id: post.slug || post._id,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content,
            date: post.date,
            image: post.image || null,
            imageAlt: post.imageAlt || null,
            tags: post.tags || [],
            links: post.links || [],
          })),
        }
      }
    } catch (error) {
      console.error('Error fetching posts from Sanity:', error)
    }

    // Fallback to static data
    return { posts: convertStaticPosts() }
  })

export const getPostById = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }): Promise<Post | null> => {
    const postId = data
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

      const postData = await sanityClient.fetch(query, { id: postId })

      if (postData) {
        return {
          id: postData.slug || postData._id,
          title: postData.title,
          excerpt: postData.excerpt,
          content: postData.content,
          date: postData.date,
          image: postData.image || null,
          imageAlt: postData.imageAlt || null,
          tags: postData.tags || [],
          links: postData.links || [],
        }
      }
    } catch (error) {
      console.error('Error fetching post from Sanity:', error)
    }

    // Fallback to static data
    const staticPost = staticPosts.find((p) => p.id === postId)
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
  })

export const getNewsPageData = createServerFn({ method: 'GET' })
  .handler(async (): Promise<NewsPageData> => {
    try {
      const query = `*[_type == "newsItem"] | order(date desc) {
        "_id": _id,
        title,
        "slug": slug.current,
        description,
        date,
        links
      }`

      const data = await sanityClient.fetch(query)

      if (data && data.length > 0) {
        return {
          newsItems: data.map((item: any) => ({
            id: item.slug || item._id,
            title: item.title,
            description: item.description,
            date: item.date,
            links: item.links,
          })),
        }
      }
    } catch (error) {
      console.error('Error fetching news from Sanity:', error)
    }

    // Fallback to static data
    return { newsItems: convertStaticNewsItems() }
  })
