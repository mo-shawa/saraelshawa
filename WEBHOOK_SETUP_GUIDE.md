# Cloudflare Deploy Webhook Setup Guide

This guide walks you through setting up automatic deployments when content is published in Sanity CMS.

## Overview

When Sara publishes content changes in Sanity Studio, a webhook will automatically trigger a rebuild of the site on Cloudflare Pages. This ensures the live site stays in sync with the CMS without manual deployments.

## Step 1: Create Deploy Hook in Cloudflare

1. **Log in to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com

2. **Navigate to Your Pages Project**
   - Click on "Workers & Pages" in the left sidebar
   - Find and click on your project (likely named `saraelshawa`)

3. **Create Deploy Hook**
   - Go to **Settings** → **Builds & deployments**
   - Scroll down to the **Deploy hooks** section
   - Click **"Add deploy hook"**

4. **Configure the Hook**
   - **Name:** `Sanity CMS`
   - **Branch:** `main` (or your production branch)
   - Click **"Save"**

5. **Copy the Webhook URL**
   - You'll receive a webhook URL that looks like:
     ```
     https://api.cloudflare.com/client/v4/pages/webhooks/deploy_hooks/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
     ```
   - **Copy this URL** - you'll need it in Step 2

## Step 2: Add Webhook to Sanity

1. **Open Sanity Project Dashboard**
   - Go to https://www.sanity.io/manage/project/7lwqqklw/api
   - Log in with the Google account that has access to the Sanity project

2. **Create New Webhook**
   - Click on the **"Webhooks"** tab in the left sidebar
   - Click **"Create webhook"** (or **"+ Add webhook"**)

3. **Configure the Webhook**
   Fill in the following settings:

   | Field | Value |
   |-------|-------|
   | **Name** | `Cloudflare Deploy` |
   | **URL** | Paste the Cloudflare webhook URL from Step 1 |
   | **Dataset** | `production` |
   | **Trigger on** | Select all: `Create`, `Update`, `Delete` |
   | **Filter** | Leave empty (triggers on all document types) |
   | **Projection** | `{}` |
   | **HTTP method** | `POST` |
   | **HTTP Headers** | Leave empty (Cloudflare doesn't require auth) |
   | **API version** | Use latest (default) |
   | **Include drafts** | Unchecked (only trigger on published documents) |

4. **Save the Webhook**
   - Click **"Save"**
   - You should see the webhook appear in the list

## Step 3: Test the Webhook

1. **Make a Small Change in Sanity Studio**
   - Go to https://saraelshawa.sanity.studio
   - Edit any content (e.g., change a news item title)
   - Click **"Publish"**

2. **Verify Webhook Triggered**
   - In Sanity dashboard (https://www.sanity.io/manage/project/7lwqqklw/api)
   - Click on your webhook → **"Logs"** or **"Recent deliveries"**
   - You should see a successful POST request (status 200)

3. **Verify Cloudflare Deployment**
   - Go to your Cloudflare Pages project
   - Check **"Deployments"** tab
   - You should see a new deployment in progress or completed
   - Wait 1-2 minutes for the build to complete

4. **Verify Changes on Live Site**
   - Visit your production site
   - The changes you made should appear after the deployment completes

## Troubleshooting

### Webhook Not Triggering

**Check Sanity Webhook Logs:**
1. Go to https://www.sanity.io/manage/project/7lwqqklw/api
2. Click on your webhook
3. Check the "Logs" or "Recent deliveries" tab
4. Look for error messages

**Common Issues:**
- **URL is incorrect:** Double-check the Cloudflare webhook URL
- **"Include drafts" is checked:** Only published documents should trigger rebuilds
- **Webhook is disabled:** Make sure the webhook is enabled in Sanity

### Deployment Not Starting

**Check Cloudflare Deploy Hooks:**
1. Go to Cloudflare Pages → Settings → Builds & deployments
2. Verify the deploy hook exists and is active
3. Check that the branch name matches your production branch

**Test Manually:**
```bash
# Test the webhook with curl
curl -X POST "YOUR_CLOUDFLARE_WEBHOOK_URL"
```

If the manual curl triggers a deployment but Sanity doesn't, the issue is with the Sanity webhook configuration.

### Deployment Failing

**Check Build Logs:**
1. Go to Cloudflare Pages → Deployments
2. Click on the failed deployment
3. Review the build logs for errors

**Common Build Issues:**
- **Missing environment variables:** Make sure `SANITY_PROJECT_ID`, `SANITY_DATASET`, and `SANITY_API_TOKEN` are set in Cloudflare Pages
- **Build command issues:** Verify the build command is correct (usually `npm run build` or `npm run pages:deploy`)

## Environment Variables in Cloudflare

Make sure these environment variables are set in your Cloudflare Pages project:

1. Go to **Settings** → **Environment variables**
2. Add the following variables (for **Production** environment):

| Variable | Value |
|----------|-------|
| `SANITY_PROJECT_ID` | `7lwqqklw` |
| `SANITY_DATASET` | `production` |
| `SANITY_API_TOKEN` | `skKFXlRxphZNk...` (get from `.env` file) |

**Note:** After adding environment variables, you need to trigger a new deployment for them to take effect.

## Advanced Configuration

### Debouncing (Prevent Rapid Rebuilds)

If you're making multiple quick edits, you might want to debounce the webhook to prevent excessive rebuilds:

**Option 1: Manual Trigger**
- Remove the automatic webhook
- Use Cloudflare's deploy hook URL manually when ready to publish
- Access from: Settings → Builds & deployments → Deploy hooks

**Option 2: Sanity Webhook Filtering**
- Add a filter to only trigger on specific document types:
  ```groq
  _type in ["post", "newsItem", "heroSettings", "aboutSettings"]
  ```

**Option 3: Third-party Service**
- Use a service like Zapier or Pipedream to debounce webhook calls
- Delay rebuilds by 5-10 minutes after the last edit

## Next Steps

Once the webhook is set up and tested:

1. ✅ Sara can now edit content directly in Sanity Studio
2. ✅ Changes automatically deploy to production
3. ✅ No developer intervention needed for content updates

## Support

If you encounter issues:
- Check webhook logs in Sanity dashboard
- Check deployment logs in Cloudflare dashboard
- Review this guide's troubleshooting section
- Contact the developer if issues persist
