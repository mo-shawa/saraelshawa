# Image Upload Guide for Sanity CMS

This guide explains how to upload images to Sanity Studio to replace the placeholder image references.

## Overview

Currently, posts and affiliations reference images in the `public/old-images/` directory. These need to be uploaded to Sanity CMS so they're managed centrally and properly optimized.

## Images to Upload

### Post Featured Images

Each post needs its featured image uploaded. Here's the mapping:

| Post Title | Current Image Path | Location |
|------------|-------------------|----------|
| **Vector Scholarship in AI** | `/old-images/download.png` | `public/old-images/download.png` |
| **Stanford MetaLab Research** | `/old-images/stanford_logo.png` | `public/old-images/stanford_logo.png` |
| **Machine Learning Research Group** | `/old-images/ezgif-2-17e161419738.gif` | `public/old-images/ezgif-2-17e161419738.gif` |
| **Robot-Infant Interaction at IRCN** | `/old-images/Nao-Power-V6-1-darker-e1601415077176.png` | `public/old-images/Nao-Power-V6-1-darker-e1601415077176.png` |
| **Hensch Lab at Harvard & IRCN** | `/old-images/harvard-logo-transparent.png` | `public/old-images/harvard-logo-transparent.png` |
| **Best Undergraduate Poster at SMBE 2018** | `/old-images/thumbnail_Undergrad-poster-awards-2018-3.jpg` | `public/old-images/thumbnail_Undergrad-poster-awards-2018-3.jpg` |
| **Ness Lab Research at U of T** | `/old-images/chlamy-reinhardtii-vid-Trim-min.gif` | `public/old-images/chlamy-reinhardtii-vid-Trim-min.gif` |

### Affiliation Logos

Affiliation logos will need to be uploaded once the affiliation schema is actively used:

| Affiliation | Suggested Image | Location |
|-------------|-----------------|----------|
| **University of Toronto** | `1200px-Utoronto_coa.svg_.png` | `public/old-images/1200px-Utoronto_coa.svg_.png` |
| **Harvard University** | `harvard-logo-transparent.png` | `public/old-images/harvard-logo-transparent.png` |
| **IRCN Tokyo** | `ircn-logosquare.png` | `public/old-images/ircn-logosquare.png` |

## How to Upload Images to Sanity Studio

### Method 1: Via Sanity Studio UI (Recommended)

This is the easiest method for uploading images one at a time.

1. **Open Sanity Studio**
   - Go to https://saraelshawa.sanity.studio
   - Log in with your Google account

2. **Navigate to the Post**
   - Click **"Post"** in the left sidebar
   - Select the post you want to add an image to

3. **Upload the Image**
   - Find the **"Featured Image"** field
   - Click the **"Upload"** button or drag & drop the image
   - Select the image file from your computer (from `public/old-images/`)
   - Wait for upload to complete

4. **Add Alt Text (Important for Accessibility)**
   - After upload, click **"Edit details"** or the pencil icon
   - Add descriptive alt text (e.g., "Vector Institute logo" or "Chlamydomonas reinhardtii microscopy")
   - Click **"Save"**

5. **Publish the Post**
   - Click **"Publish"** in the top right
   - The webhook will trigger a rebuild (if configured)

6. **Repeat for Each Post**
   - Go through each post and upload its featured image

### Method 2: Bulk Upload via Sanity Assets API (Advanced)

For uploading multiple images at once, you can use a script.

#### Create Upload Script

Create a file `scripts/upload-images.ts`:

```typescript
import { createClient } from '@sanity/client'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
})

// Map of post IDs to image paths
const imageMap = {
  'vector-scholarship-ai': 'public/old-images/download.png',
  'stanford-metalab': 'public/old-images/stanford_logo.png',
  'machine-learning-research-group': 'public/old-images/ezgif-2-17e161419738.gif',
  'ircn-babylab': 'public/old-images/Nao-Power-V6-1-darker-e1601415077176.png',
  'hensch-lab-harvard': 'public/old-images/harvard-logo-transparent.png',
  'smbe-poster-award': 'public/old-images/thumbnail_Undergrad-poster-awards-2018-3.jpg',
  'ness-lab-uoft': 'public/old-images/chlamy-reinhardtii-vid-Trim-min.gif',
}

async function uploadImage(filePath: string) {
  const buffer = fs.readFileSync(filePath)
  const filename = path.basename(filePath)
  
  return client.assets.upload('image', buffer, {
    filename,
  })
}

async function attachImageToPost(postId: string, imageAssetId: string) {
  // Find the post by slug
  const posts = await client.fetch(`*[_type == "post" && slug.current == $postId]`, { postId })
  
  if (posts.length === 0) {
    console.log(`Post not found: ${postId}`)
    return
  }
  
  const post = posts[0]
  
  // Update the post with the image reference
  await client
    .patch(post._id)
    .set({
      featuredImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: imageAssetId,
        },
      },
    })
    .commit()
    
  console.log(`✅ Updated post: ${postId}`)
}

async function main() {
  console.log('Starting image upload...\n')
  
  for (const [postId, imagePath] of Object.entries(imageMap)) {
    console.log(`Processing: ${postId}`)
    
    try {
      // Upload image
      console.log(`  Uploading: ${imagePath}`)
      const imageAsset = await uploadImage(imagePath)
      console.log(`  Image uploaded: ${imageAsset._id}`)
      
      // Attach to post
      console.log(`  Attaching to post...`)
      await attachImageToPost(postId, imageAsset._id)
      
      console.log(`✅ Completed: ${postId}\n`)
    } catch (error) {
      console.error(`❌ Error processing ${postId}:`, error)
    }
  }
  
  console.log('Done!')
}

main()
```

#### Run the Upload Script

```bash
# Install ts-node if not already installed
npm install -D ts-node

# Run the script
npx ts-node scripts/upload-images.ts
```

This will:
1. Upload each image to Sanity's asset library
2. Attach the uploaded image to the corresponding post
3. Publish the changes

### Method 3: Drag & Drop to Media Library

You can also upload images to the media library first, then reference them later:

1. **Open Media**
   - In Sanity Studio, click **"Media"** in the left sidebar (if you have the media plugin)
   - Or go to **Vision** → **Assets** → **Images**

2. **Upload Images**
   - Drag and drop multiple images at once
   - Or click **"Upload"** to select files

3. **Reference in Posts**
   - Edit each post
   - In the Featured Image field, click **"Select"**
   - Choose the uploaded image from the library

## Image Optimization Best Practices

### Before Uploading

Consider optimizing images before upload to reduce file size:

1. **Resize Large Images**
   - Recommended max width: 2000px
   - Recommended max height: 1500px
   
2. **Compress Images**
   - Use tools like TinyPNG, ImageOptim, or Squoosh
   - Target: < 500KB per image
   
3. **Convert to WebP (Optional)**
   - Sanity will handle format optimization automatically
   - But you can pre-convert for better control

### Sanity's Automatic Optimization

Sanity automatically:
- ✅ Generates multiple sizes for responsive images
- ✅ Converts to modern formats (WebP, AVIF)
- ✅ Serves via CDN (fast global delivery)
- ✅ Lazy loads images on the frontend

No additional work needed on your end!

## Image Display in Frontend

Images uploaded to Sanity are automatically handled by the frontend code:

```tsx
// In src/components/PostCard.tsx
{post.featuredImage && (
  <img
    src={urlFor(post.featuredImage).width(400).height(250).url()}
    alt={post.featuredImage.alt || post.title}
  />
)}
```

The `urlFor()` helper from `@sanity/image-url`:
- Generates optimized image URLs
- Supports dynamic sizing (width/height params)
- Handles CDN caching
- Automatic format selection (WebP/AVIF)

## Verifying Images After Upload

After uploading images, verify they appear correctly:

### 1. In Sanity Studio
- [ ] Image appears in post's Featured Image field
- [ ] Alt text is set
- [ ] Image preview loads

### 2. In Local Dev
```bash
# Restart dev server to fetch updated content
Ctrl+C
npm run dev
```

- [ ] Visit http://localhost:3000
- [ ] Check post cards show images
- [ ] Check individual post pages show images
- [ ] No broken image icons

### 3. In Production (After Deploy)
- [ ] Visit production URL
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Verify images load
- [ ] Check image URLs point to `cdn.sanity.io`

## Troubleshooting

### Image Not Showing After Upload

**Cause:** Dev server needs restart or cache issue

**Fix:**
```bash
# Stop dev server
Ctrl+C

# Clear cache (optional)
rm -rf .next

# Restart
npm run dev
```

### "Upload Failed" Error in Studio

**Cause:** File too large or unsupported format

**Fix:**
- Check file size (max: 100MB)
- Check format (supported: jpg, png, gif, webp, svg)
- Try compressing the image
- Check Sanity project quotas

### Image Appears Distorted

**Cause:** Aspect ratio mismatch

**Fix:**
- Update image sizing in `PostCard.tsx`:
```tsx
// Change from fixed dimensions
.width(400).height(250)

// To auto height
.width(400).auto('format')
```

### Images Load Slowly

**Cause:** Not using Sanity's CDN optimization

**Fix:**
- Ensure using `urlFor()` helper
- Add `auto('format')` for automatic WebP/AVIF
- Use appropriate width/height params
- Enable lazy loading on `<img>` tags

## Image Schema Reference

The post schema includes an image field defined as:

```typescript
{
  name: 'featuredImage',
  title: 'Featured Image',
  type: 'image',
  options: {
    hotspot: true, // Enables crop & hotspot
  },
  fields: [
    {
      name: 'alt',
      type: 'string',
      title: 'Alternative Text',
      description: 'Important for SEO and accessibility',
    },
  ],
}
```

**Hotspot:** Allows you to set a focus point for the image when it's cropped.

## Next Steps After Upload

Once all images are uploaded:

1. ✅ Verify images appear in Sanity Studio
2. ✅ Test locally with dev server
3. ✅ Publish changes
4. ✅ Deploy to production (or wait for webhook)
5. ✅ Verify images on live site

---

## Quick Checklist

- [ ] Vector Scholarship image uploaded
- [ ] Stanford MetaLab image uploaded
- [ ] Machine Learning Research Group image uploaded
- [ ] Robot-Infant Interaction image uploaded
- [ ] Hensch Lab image uploaded
- [ ] SMBE Poster Award image uploaded
- [ ] Ness Lab image uploaded
- [ ] All images have alt text
- [ ] Tested locally
- [ ] Published to production
- [ ] Verified on live site

**Status:** 📋 Ready to upload  
**Method:** Choose Method 1 (UI) or Method 2 (Script)  
**Time Estimate:** ~15-30 minutes via UI, ~5 minutes via script
