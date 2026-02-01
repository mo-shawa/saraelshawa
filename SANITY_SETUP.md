# Sanity CMS Setup Guide

This guide walks you through setting up Sanity CMS for the Sara El-Shawa portfolio site.

## Prerequisites

- A Sanity.io account (free at [sanity.io](https://www.sanity.io/))
- Access to Cloudflare dashboard (for deploy hooks)
- Access to DNS settings for custom domain

## Step 1: Create Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and sign in with Google
2. Click **"Create new project"**
3. Enter project details:
   - **Project name:** `Sara El-Shawa`
   - **Create initial dataset:** Yes, named `production`
4. Copy the **Project ID** (you'll need this)

## Step 2: Configure Environment Variables

### Local Development

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
SANITY_PROJECT_ID=your-project-id
SANITY_DATASET=production
SANITY_API_TOKEN=your-token-here

SANITY_STUDIO_PROJECT_ID=your-project-id
SANITY_STUDIO_DATASET=production
```

### Generate API Token

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Click **Add API token**
5. Settings:
   - **Name:** `Website Build`
   - **Permissions:** `Editor` (for migration) or `Viewer` (for read-only)
6. Copy the token to your `.env` file

### Cloudflare Pages Environment Variables

Add these variables in Cloudflare Pages dashboard:

1. Go to your Pages project → **Settings** → **Environment variables**
2. Add:
   - `SANITY_PROJECT_ID` = your project ID
   - `SANITY_DATASET` = `production`
   - `SANITY_API_TOKEN` = your viewer token (read-only is fine for builds)

## Step 3: Update Sanity Config

Update the project ID in `sanity/sanity.config.ts`:

```typescript
projectId: 'your-project-id', // Replace with your actual project ID
```

And in `sanity/sanity.cli.ts`:

```typescript
projectId: 'your-project-id',
```

## Step 4: Deploy Sanity Studio

The Sanity Studio is deployed separately and hosted by Sanity:

```bash
cd sanity
npx sanity deploy
```

When prompted, choose a studio hostname (e.g., `saraelshawa`).

Your studio will be available at: `https://saraelshawa.sanity.studio`

## Step 5: Add Sara as Team Member

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **Team** → **Members**
4. Click **"Invite member"**
5. Enter Sara's email and select **Admin** or **Editor** role
6. She'll receive an email to join with Google SSO

## Step 6: Configure Custom Domain for Studio

To use `admin.saraelshawa.com` instead of `saraelshawa.sanity.studio`:

### In Sanity Dashboard:

1. Go to project settings → **Hosting** → **Hostnames**
2. Click **"Add hostname"**
3. Enter: `admin.saraelshawa.com`
4. Copy the verification TXT record

### In DNS (Cloudflare or registrar):

1. Add a TXT record for verification (if required)
2. Add a CNAME record:
   - **Name:** `admin`
   - **Target:** `saraelshawa.sanity.studio` (or the provided target)
   - **Proxy status:** DNS only (gray cloud)

## Step 7: Set Up Deploy Hook (Auto-rebuild on publish)

### Create Cloudflare Deploy Hook:

1. Go to Cloudflare dashboard → **Workers & Pages**
2. Select your project
3. Go to **Settings** → **Builds & deployments**
4. Under **Deploy hooks**, click **"Add deploy hook"**
5. Name it `Sanity CMS` and copy the URL

### Create Sanity Webhook:

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Webhooks**
4. Click **"Create webhook"**
5. Configure:
   - **Name:** `Cloudflare Deploy`
   - **URL:** Paste the Cloudflare deploy hook URL
   - **Trigger on:** `Create`, `Update`, `Delete`
   - **Filter:** Leave empty to trigger on all document types
   - **Projection:** `{}`
   - **HTTP method:** `POST`
6. Click **"Create"**

Now, whenever content is published in Sanity, it will automatically trigger a rebuild of the website.

## Step 8: Migrate Existing Content

Run the migration script to populate Sanity with existing content:

```bash
# Make sure environment variables are set
export SANITY_PROJECT_ID=your-project-id
export SANITY_DATASET=production
export SANITY_API_TOKEN=your-editor-token

# Run migration
npm run migrate
```

The script will:
- Create Hero Settings, About Settings, and Site Settings
- Migrate all posts from `src/data/posts.ts`
- Migrate all news items from `src/data/news.ts`
- Create placeholder affiliations (upload logos manually)

## Step 9: Upload Images

After migration, you'll need to manually upload images through Sanity Studio:

1. Go to your Sanity Studio
2. Navigate to each **Post** and upload featured images
3. Navigate to **Affiliations** and upload logos
4. Optionally upload a CV file in **Hero Settings**

## Testing the Setup

### Local Development (without Sanity):

```bash
npm run dev
```

The site will use fallback static data from `src/data/` files.

### Local Development (with Sanity):

```bash
# Ensure .env is configured
npm run dev
```

The site will fetch content from Sanity CMS.

### Production Build:

```bash
npm run build
npm run preview
```

## Troubleshooting

### Content not updating after publish

1. Check that the webhook was triggered (Sanity dashboard → API → Webhooks → Deliveries)
2. Verify the Cloudflare deploy hook URL is correct
3. Check Cloudflare Pages deployments for build logs

### Images not loading

1. Ensure images are uploaded via Sanity Studio (not URL references)
2. Check that the image URL builder is working correctly

### Studio not accessible

1. Verify DNS propagation (can take up to 24 hours)
2. Check the hostname is correctly configured in Sanity
3. Try accessing the `.sanity.studio` URL directly

## Content Types Reference

| Content Type | Description | Location in Studio |
|-------------|-------------|-------------------|
| **Hero Settings** | Hero section text, tags, CTA buttons | Settings → Hero Settings |
| **About Section** | About section content, research areas | Settings → About Section |
| **Site Settings** | Contact info, social links | Settings → Site Settings |
| **Posts** | Research articles and announcements | Content → Posts |
| **News / Milestones** | Timeline events | Content → News / Milestones |
| **Affiliations** | University/institution logos | Content → Affiliations |

## Commands Reference

```bash
# Run website locally
npm run dev

# Run Sanity Studio locally
npm run sanity:dev

# Deploy Sanity Studio
npm run sanity:deploy

# Migrate content to Sanity
npm run migrate

# Build and deploy website
npm run deploy
```
