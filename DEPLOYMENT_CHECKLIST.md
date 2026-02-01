# Cloudflare Pages Deployment Checklist

Use this checklist to ensure everything is properly configured for production deployment.

## ✅ Pre-Deployment Checklist

### 1. Environment Variables in Cloudflare Pages

Go to your Cloudflare Pages project → **Settings** → **Environment variables**

Add the following for **Production** environment:

- [ ] `SANITY_PROJECT_ID` = `7lwqqklw`
- [ ] `SANITY_DATASET` = `production`
- [ ] `SANITY_API_TOKEN` = (from `.env` file - starts with `skKFXlRxphZNk...`)

**Note:** After adding/updating environment variables, you must trigger a new deployment.

### 2. Build Configuration

Verify these settings in **Settings** → **Builds & deployments**:

- [ ] **Build command:** `npm run build` (or your specific build command)
- [ ] **Build output directory:** `.cloudflare` (or your output directory)
- [ ] **Root directory:** `/` (default)
- [ ] **Node version:** 18.x or later (set in environment variable `NODE_VERSION=18`)

### 3. Deploy Hook for Sanity Webhook

- [ ] Create deploy hook in Cloudflare (name: `Sanity CMS`)
- [ ] Copy the webhook URL
- [ ] Add webhook to Sanity project (see `WEBHOOK_SETUP_GUIDE.md`)
- [ ] Test webhook by publishing content in Sanity Studio

### 4. Sanity Configuration

Verify in https://www.sanity.io/manage/project/7lwqqklw:

- [ ] **Studio is deployed** at https://saraelshawa.sanity.studio
- [ ] **CORS origins include** your production domain (e.g., `https://saraelshawa.com`)
- [ ] **API settings** allow read access for production dataset
- [ ] **Webhook is configured** and pointing to Cloudflare deploy hook

### 5. Domain Configuration (if using custom domain)

If using a custom domain for the website:

- [ ] Domain is added in Cloudflare Pages → **Custom domains**
- [ ] DNS records are properly configured
- [ ] SSL/TLS certificate is active

If using a custom domain for Sanity Studio:

- [ ] CNAME record: `admin.saraelshawa.com` → `saraelshawa.sanity.studio`
- [ ] Custom domain configured in Sanity dashboard

## 🧪 Testing Checklist

### Test Build Locally

Before deploying, test the production build locally:

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Build for production
npm run build

# Check for errors
# Review build output for warnings
```

- [ ] Build completes without errors
- [ ] No critical warnings in build output
- [ ] Content is correctly fetched from Sanity during build

### Test Production Deployment

After deploying to Cloudflare:

- [ ] Visit production URL and verify site loads
- [ ] Check all pages load correctly (Home, Posts, News, individual post pages)
- [ ] Verify content matches what's in Sanity Studio
- [ ] Test responsiveness on mobile/tablet
- [ ] Check browser console for errors (F12 → Console)

### Test Webhook Integration

- [ ] Make a small change in Sanity Studio
- [ ] Publish the change
- [ ] Verify webhook triggered in Sanity dashboard (API → Webhooks → Logs)
- [ ] Verify deployment started in Cloudflare (Deployments tab)
- [ ] Wait for deployment to complete (1-2 minutes)
- [ ] Visit production site and verify changes appear

## 🔍 Common Deployment Issues

### Build Fails with "Module not found"

**Cause:** Missing dependencies in production

**Fix:**
```bash
# Ensure all dependencies are in dependencies, not devDependencies
npm install --save-prod <missing-package>
```

Check `package.json` - Sanity packages should be in `dependencies`:
```json
{
  "dependencies": {
    "sanity": "^3.x.x",
    "@sanity/client": "^6.x.x",
    "@sanity/image-url": "^1.x.x",
    "@portabletext/react": "^3.x.x"
  }
}
```

### Content Not Loading (Shows Fallback Data)

**Cause:** Environment variables not set or incorrect

**Fix:**
1. Verify environment variables in Cloudflare Pages
2. Check `.env.production` file (if exists) has correct values
3. Trigger new deployment after updating env vars

### Webhook Not Triggering Deployments

**Cause:** Webhook misconfigured

**Fix:**
1. Check Sanity webhook logs for errors
2. Verify Cloudflare webhook URL is correct
3. Test webhook manually with curl
4. See `WEBHOOK_SETUP_GUIDE.md` for detailed troubleshooting

### Images Not Loading from Sanity

**Cause:** CORS not configured or image URLs incorrect

**Fix:**
1. Add production domain to CORS origins in Sanity
2. Verify image URLs use CDN domain (cdn.sanity.io)
3. Check image builder configuration in `src/lib/sanity.ts`

### Deployment Takes Too Long

**Normal:** Builds typically take 1-2 minutes
**Slow:** 3-5 minutes might indicate:
- Large dependency installation
- Slow network
- Complex build process

**If consistently slow:**
- Review build logs for bottlenecks
- Consider optimizing build process
- Check Cloudflare status page for issues

## 📊 Post-Deployment Monitoring

### First Week After Launch

- [ ] Monitor Cloudflare Analytics for traffic patterns
- [ ] Check error rates in Cloudflare dashboard
- [ ] Review Sanity API usage (ensure within free tier limits)
- [ ] Test content publishing workflow with Sara
- [ ] Verify webhook reliably triggers rebuilds

### Ongoing Maintenance

- [ ] Review Cloudflare build logs monthly
- [ ] Check Sanity webhook delivery success rate
- [ ] Update dependencies quarterly (security patches)
- [ ] Monitor Sanity asset usage (images/videos)

## 🚀 Deployment Commands

```bash
# Test production build locally
npm run build

# Deploy to Cloudflare Pages (if using Wrangler)
npm run deploy

# Or deploy via Git (automatic)
git push origin main  # Cloudflare auto-deploys from main branch
```

## 📞 Support Resources

- **Cloudflare Pages Docs:** https://developers.cloudflare.com/pages/
- **Sanity Docs:** https://www.sanity.io/docs
- **TanStack Start Docs:** https://tanstack.com/start/latest

## ✅ Final Verification

Once everything is deployed and tested:

- [ ] Production site is live and accessible
- [ ] Content matches Sanity Studio
- [ ] Webhook automatically triggers rebuilds
- [ ] Sara can successfully log in to Sanity Studio
- [ ] Sara can publish content changes without developer help
- [ ] Changes appear on production site after 1-2 minutes
- [ ] No errors in browser console
- [ ] No errors in build logs
- [ ] All documentation is up to date

---

**Deployment Status:** 
- [ ] Not yet deployed
- [ ] Deployed, testing in progress
- [ ] Fully deployed and verified ✅

**Deployed By:** ________________  
**Deployment Date:** ________________  
**Production URL:** ________________
