// Sanity schema exports
import post from './post'
import newsItem from './newsItem'
import heroSettings from './heroSettings'
import aboutSettings from './aboutSettings'
import siteSettings from './siteSettings'
import affiliation from './affiliation'
import link from './objects/link'
import researchArea from './objects/researchArea'

export const schemaTypes = [
  // Documents
  post,
  newsItem,
  heroSettings,
  aboutSettings,
  siteSettings,
  affiliation,
  // Objects
  link,
  researchArea,
]
