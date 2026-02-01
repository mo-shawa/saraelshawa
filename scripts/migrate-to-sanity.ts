#!/usr/bin/env npx tsx
/**
 * Migration script to move existing static content from TypeScript files to Sanity CMS
 * 
 * Usage:
 *   1. Set up your Sanity project first (see SANITY_SETUP.md)
 *   2. Set environment variables:
 *      - SANITY_PROJECT_ID
 *      - SANITY_DATASET (usually "production")
 *      - SANITY_API_TOKEN (needs write access)
 *   3. Run: npx tsx scripts/migrate-to-sanity.ts
 */

import 'dotenv/config'
import { createClient } from '@sanity/client'

// Import static data
import { posts } from '../src/data/posts'
import { newsItems } from '../src/data/news'

// Sanity client with write access
const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID || '',
  dataset: process.env.SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Needs write access
  useCdn: false,
})

// Convert HTML content to Portable Text blocks (basic conversion)
function htmlToPortableText(html: string): any[] {
  // This is a simplified conversion - for complex HTML, consider using a proper parser
  // For now, we'll store as a single block with the HTML
  // In production, you might want to use a library like @sanity/block-tools
  
  // Strip HTML tags for plain text (Sanity Studio can be used for proper formatting)
  const plainText = html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  return [
    {
      _type: 'block',
      _key: Math.random().toString(36).substring(7),
      style: 'normal',
      markDefs: [],
      children: [
        {
          _type: 'span',
          _key: Math.random().toString(36).substring(7),
          text: plainText,
          marks: [],
        },
      ],
    },
  ]
}

async function migratePosts() {
  console.log('📝 Migrating posts...')
  
  for (const post of posts) {
    const document = {
      _type: 'post',
      _id: `post-${post.id}`,
      title: post.title,
      slug: { current: post.id },
      excerpt: post.excerpt,
      content: htmlToPortableText(post.content),
      date: post.date,
      tags: post.tags || [],
      links: post.links?.map((link, index) => ({
        _type: 'link',
        _key: `link-${index}`,
        label: link.label,
        url: link.url,
      })) || [],
    }
    
    try {
      await client.createOrReplace(document)
      console.log(`  ✓ ${post.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to migrate post: ${post.title}`, error)
    }
  }
  
  console.log(`  Migrated ${posts.length} posts\n`)
}

async function migrateNewsItems() {
  console.log('📰 Migrating news items...')
  
  for (const item of newsItems) {
    const document = {
      _type: 'newsItem',
      _id: `news-${item.id}`,
      title: item.title,
      slug: { current: item.id },
      description: item.description,
      date: item.date,
      links: item.links?.map((link, index) => ({
        _type: 'link',
        _key: `link-${index}`,
        label: link.label,
        url: link.url,
      })) || [],
    }
    
    try {
      await client.createOrReplace(document)
      console.log(`  ✓ ${item.title}`)
    } catch (error) {
      console.error(`  ✗ Failed to migrate news item: ${item.title}`, error)
    }
  }
  
  console.log(`  Migrated ${newsItems.length} news items\n`)
}

async function createDefaultSettings() {
  console.log('⚙️ Creating default settings...')
  
  // Hero Settings
  const heroSettings = {
    _type: 'heroSettings',
    _id: 'heroSettings',
    name: 'Sara El-Shawa',
    label: 'Computer Science & Biology',
    subtitle: 'Researcher at the Vector Institute, applying machine learning to decode biological systems.',
    highlightedText: 'Vector Institute',
    tags: ['Genomics', 'Neural Data', 'Probabilistic Models', 'Representation Learning'],
    ctaResearchLabel: 'Research',
    ctaCvLabel: 'CV',
  }
  
  try {
    await client.createOrReplace(heroSettings)
    console.log('  ✓ Hero Settings')
  } catch (error) {
    console.error('  ✗ Failed to create Hero Settings', error)
  }
  
  // About Settings
  const aboutSettings = {
    _type: 'aboutSettings',
    _id: 'aboutSettings',
    sectionLabel: 'Background',
    headline: 'Bridging Computer Science & Biology',
    description: 'My research focuses on applying machine learning and computational methods to understand complex biological systems. From evolutionary genomics to cognitive neuroscience, I explore the intersection of computation and life sciences.',
    researchAreas: [
      { _type: 'researchArea', _key: 'ra1', label: 'Representation learning', description: 'Discovering meaningful structure in high-dimensional biological data' },
      { _type: 'researchArea', _key: 'ra2', label: 'Causal inference', description: 'Identifying causal relationships in complex systems' },
      { _type: 'researchArea', _key: 'ra3', label: 'Neuro-symbolic systems', description: 'Bridging neural networks with symbolic reasoning' },
      { _type: 'researchArea', _key: 'ra4', label: 'Evolutionary modeling', description: 'Computational approaches to understanding evolution' },
    ],
    approachTitle: 'Interpretable ML',
    approachDescription: 'Building models that are rigorous, transparent, and aligned with biological mechanisms.',
  }
  
  try {
    await client.createOrReplace(aboutSettings)
    console.log('  ✓ About Settings')
  } catch (error) {
    console.error('  ✗ Failed to create About Settings', error)
  }
  
  // Site Settings
  const siteSettings = {
    _type: 'siteSettings',
    _id: 'siteSettings',
    email: 'hello@saraelshawa.com',
    location: 'Toronto, Ontario, Canada',
    linkedInUrl: 'https://linkedin.com/in/saraelshawa',
    githubUrl: 'https://github.com/saraelshawa',
  }
  
  try {
    await client.createOrReplace(siteSettings)
    console.log('  ✓ Site Settings')
  } catch (error) {
    console.error('  ✗ Failed to create Site Settings', error)
  }
  
  console.log('')
}

async function createAffiliations() {
  console.log('🏛️ Creating affiliations...')
  
  const affiliations = [
    { id: 'harvard', name: 'Harvard University', order: 1 },
    { id: 'stanford', name: 'Stanford University', order: 2 },
    { id: 'uoft', name: 'University of Toronto', order: 3 },
    { id: 'tokyo', name: 'University of Tokyo', order: 4 },
  ]
  
  for (const affiliation of affiliations) {
    const document = {
      _type: 'affiliation',
      _id: `affiliation-${affiliation.id}`,
      name: affiliation.name,
      order: affiliation.order,
      // Note: Logos need to be uploaded manually through Sanity Studio
      // or via the asset upload API with the actual image files
    }
    
    try {
      await client.createOrReplace(document)
      console.log(`  ✓ ${affiliation.name}`)
    } catch (error) {
      console.error(`  ✗ Failed to create affiliation: ${affiliation.name}`, error)
    }
  }
  
  console.log('  Note: Upload logos via Sanity Studio\n')
}

async function main() {
  console.log('\n🚀 Starting Sanity Migration\n')
  console.log('Project ID:', process.env.SANITY_PROJECT_ID)
  console.log('Dataset:', process.env.SANITY_DATASET || 'production')
  console.log('')
  
  if (!process.env.SANITY_PROJECT_ID) {
    console.error('❌ Error: SANITY_PROJECT_ID environment variable is required')
    console.log('\nSet up your environment variables:')
    console.log('  export SANITY_PROJECT_ID=7lwqqklw')
    console.log('  export SANITY_DATASET=production')
    console.log('  export SANITY_API_TOKEN=your-write-token')
    process.exit(1)
  }
  
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Error: SANITY_API_TOKEN environment variable is required')
    console.log('\nGenerate a token in Sanity dashboard:')
    console.log('  https://www.sanity.io/manage/project/<7lwqqklw>/api')
    process.exit(1)
  }
  
  try {
    await createDefaultSettings()
    await migratePosts()
    await migrateNewsItems()
    await createAffiliations()
    
    console.log('✅ Migration complete!\n')
    console.log('Next steps:')
    console.log('  1. Open Sanity Studio to review migrated content')
    console.log('  2. Upload affiliation logos via Sanity Studio')
    console.log('  3. Review and format post content (HTML was converted to plain text)')
    console.log('  4. Upload featured images for posts via Sanity Studio')
    console.log('')
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  }
}

main()
