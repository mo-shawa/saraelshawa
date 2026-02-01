# Development Workflow

## Local Development

### Working with Content

When you make changes in Sanity Studio locally or online:

1. **Make your changes** in Sanity Studio (http://localhost:3333 or https://saraelshawa.sanity.studio)
2. **Publish** the changes
3. **Restart the dev server** to see changes:
   ```bash
   # Stop with Ctrl+C, then:
   npm run dev
   ```

**Why restart?** The website fetches content from Sanity **at build time** (when the server starts), not at runtime. This ensures the site is fully static and fast.

### Quick Workflow

```bash
# Terminal 1: Run Sanity Studio (optional - can use deployed version)
npm run sanity:dev

# Terminal 2: Run website dev server
npm run dev

# After publishing changes in Sanity:
# - Stop dev server (Ctrl+C)
# - Restart: npm run dev
```

## Production Workflow

### How Content Updates Work in Production

1. Sara edits content at **https://saraelshawa.sanity.studio**
2. Publishes changes
3. **Webhook automatically triggers Cloudflare rebuild** (takes 1-2 minutes)
4. New static site is deployed with updated content

### Setting Up Auto-Deploy Webhook

**In Cloudflare:**
1. Go to Workers & Pages → Your project → Settings → Builds & deployments
2. Under "Deploy hooks", click "Add deploy hook"
3. Name: `Sanity CMS`
4. Copy the webhook URL

**In Sanity:**
1. Go to https://www.sanity.io/manage/project/7lwqqklw/api
2. Click "Webhooks" → "Create webhook"
3. Configure:
   - **Name:** Cloudflare Deploy
   - **URL:** [paste Cloudflare webhook URL]
   - **Trigger on:** Create, Update, Delete
   - **Filter:** (leave empty)
   - **Projection:** `{}`
   - **HTTP method:** POST
4. Save

Now content changes will automatically rebuild the site in production!

## Studio URLs

- **Local:** http://localhost:3333
- **Deployed:** https://saraelshawa.sanity.studio
- **Custom domain:** admin.saraelshawa.com (when DNS is configured)

## Useful Commands

```bash
# Website
npm run dev          # Run website locally
npm run build        # Build for production
npm run deploy       # Build and deploy to Cloudflare

# Sanity Studio
npm run sanity:dev   # Run studio locally
npm run sanity:deploy # Deploy studio

# Content
npm run migrate      # Migrate static content to Sanity (one-time)
```

## Troubleshooting

### Changes not showing locally
- Restart the dev server (`npm run dev`)
- Check you published (not just saved draft) in Sanity

### Changes not showing in production
- Check webhook was triggered in Sanity dashboard
- Check Cloudflare deployments for build status
- Wait 1-2 minutes for build to complete

### Studio not loading
- Check you're logged in with the correct Google account
- Clear browser cache
- Verify project ID in `sanity/sanity.config.ts` is `7lwqqklw`
