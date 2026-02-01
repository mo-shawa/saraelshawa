# Cloudflare Workers Deploy Webhook Setup Guide

This guide walks you through setting up automatic deployments when content is published in Sanity CMS.

## Overview

When Sara publishes content changes in Sanity Studio, a webhook triggers a GitHub Actions workflow that rebuilds and deploys the site to Cloudflare Workers. This ensures the live site stays in sync with the CMS without manual deployments.

**Flow:**
```
Sanity Publish → GitHub webhook → GitHub Actions → Cloudflare Workers
```

## Prerequisites

Before starting, you need:
1. Access to the GitHub repository
2. Access to the Sanity project (https://www.sanity.io/manage/project/7lwqqklw)
3. Cloudflare account credentials

## Step 1: Set Up GitHub Secrets

1. **Go to GitHub Repository Settings**
   - Navigate to your repository: https://github.com/mo-shawa/saraelshawa
   - Click **Settings** → **Secrets and variables** → **Actions**

2. **Add Cloudflare Secrets**
   
   Click **"New repository secret"** and add these:

   | Secret Name | Description | How to Get |
   |-------------|-------------|------------|
   | `CLOUDFLARE_API_TOKEN` | API token for deployments | See "Getting Cloudflare API Token" below |
   | `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID | Found in Cloudflare dashboard URL or API settings |

3. **Getting Cloudflare API Token**
   - Go to https://dash.cloudflare.com/profile/api-tokens
   - Click **"Create Token"**
   - Use the **"Edit Cloudflare Workers"** template
   - Or create custom token with these permissions:
     - Account: Workers Scripts: Edit
     - Zone: Workers Routes: Edit (if using custom domain)
   - Copy the token immediately (it's only shown once)

4. **Getting Account ID**
   - Go to https://dash.cloudflare.com
   - Click on your account
   - The Account ID is in the right sidebar under "API" section
   - Or find it in the URL: `https://dash.cloudflare.com/ACCOUNT_ID_HERE`

## Step 2: Create GitHub Personal Access Token for Sanity

1. **Go to GitHub Settings**
   - Navigate to https://github.com/settings/tokens
   - Click **"Generate new token (classic)"**

2. **Configure the Token**
   | Field | Value |
   |-------|-------|
   | **Note** | `Sanity CMS Deploy Webhook` |
   | **Expiration** | Set a reasonable expiration (e.g., 1 year) |
   | **Scopes** | Select only `repo` (Full control of private repositories) |

3. **Generate and Copy the Token**
   - Click **"Generate token"**
   - **Copy the token immediately** - you won't see it again!
   - Save it somewhere secure for the next step

## Step 3: Add Webhook to Sanity

1. **Open Sanity Project Dashboard**
   - Go to https://www.sanity.io/manage/project/7lwqqklw
   - Click **"API"** in the left sidebar
   - Click **"Webhooks"** tab

2. **Create New Webhook**
   - Click **"Create webhook"** or **"+ Add webhook"**

3. **Configure the Webhook**

   | Field | Value |
   |-------|-------|
   | **Name** | `GitHub Deploy` |
   | **URL** | `https://api.github.com/repos/mo-shawa/saraelshawa/dispatches` |
   | **Dataset** | `production` |
   | **Trigger on** | Select: `Create`, `Update`, `Delete` |
   | **Filter** | Leave empty (or use filter below) |
   | **Projection** | `{"event_type": "sanity-content-update"}` |
   | **HTTP method** | `POST` |
   | **HTTP Headers** | See below |
   | **Secret** | Leave empty |
   | **Include drafts** | ❌ Unchecked |

   ⚠️ **CRITICAL: Projection Format**
   
   The projection field uses GROQ syntax and defines the JSON payload sent to GitHub. You MUST enter it as:
   ```
   {"event_type": "sanity-content-update"}
   ```
   
   **If projection is empty or invalid, Sanity sends the full document data**, which causes GitHub to return a 422 error because it only accepts `event_type` and optional `client_payload` keys.
   
   **Test your projection:** After saving, publish any document and check the webhook logs. If you see errors about fields like `_id`, `_type`, `email`, etc. being "not permitted keys", the projection is not working correctly.

4. **Add HTTP Headers**
   
   Click **"Add header"** and add these two headers:

   | Header | Value |
   |--------|-------|
   | `Authorization` | `Bearer YOUR_GITHUB_TOKEN` (from Step 2) |
   | `Accept` | `application/vnd.github.v3+json` |
   | `Content-Type` | `application/json` |

5. **Save the Webhook**
   - Click **"Save"**

## Step 4: Test the Webhook

1. **Make a Small Change in Sanity Studio**
   - Go to https://saraelshawa.sanity.studio
   - Edit any content (e.g., change a news item title)
   - Click **"Publish"**

2. **Verify Webhook Triggered**
   - In Sanity dashboard → Webhooks → Your webhook → **"Logs"**
   - You should see a successful POST request (status 204)

3. **Verify GitHub Actions Started**
   - Go to https://github.com/mo-shawa/saraelshawa/actions
   - You should see a new workflow run in progress
   - The trigger should show "repository_dispatch"

4. **Verify Deployment Completed**
   - Wait for the workflow to complete (usually 1-2 minutes)
   - Check the workflow logs for success
   - Visit https://saraelshawa.icy-heart-96a5.workers.dev to verify changes

## Optional: Filter Webhook by Document Type

To only trigger rebuilds for specific document types, add this filter:

```groq
_type in ["post", "newsItem", "heroSettings", "aboutSettings", "siteSettings", "affiliation"]
```

This prevents rebuilds when non-critical documents are changed.

## Troubleshooting

### Webhook Not Triggering

**Check Sanity Webhook Logs:**
1. Go to https://www.sanity.io/manage/project/7lwqqklw/api
2. Click on your webhook → **"Logs"**
3. Look for error messages

**Common Issues:**
| Error | Solution |
|-------|----------|
| 401 Unauthorized | Check GitHub token is correct in Authorization header |
| 404 Not Found | Verify repository URL is correct |
| 422 Unprocessable | See detailed fix below |

### Fix for 422 Error: "X are not permitted keys"

If you see an error like:
```json
{
  "message": "Invalid request.\n\n\"_createdAt\", \"_id\", \"_rev\"... are not permitted keys.\n\"event_type\" wasn't supplied.",
  "status": "422"
}
```

**This means the projection is not working correctly.** Sanity is sending document data instead of just the `event_type`.

**Solutions:**

1. **Double-check the projection field**
   - Go back to the webhook settings
   - In the **Projection** field, enter EXACTLY:
     ```
     {"event_type": "sanity-content-update"}
     ```
   - No extra spaces, no quotes around the whole thing, no line breaks
   - It must be valid GROQ projection syntax

2. **Test with webhook.site first**
   - Go to https://webhook.site
   - Copy the unique URL they give you
   - Create a test webhook in Sanity with that URL
   - Publish a document
   - Check what payload was received on webhook.site
   - You should see ONLY:
     ```json
     {"event_type": "sanity-content-update"}
     ```
   - If you see document fields, the projection is wrong

3. **Alternative: Use a serverless function as middleware**
   If you can't get the projection to work, create a simple Cloudflare Worker that:
   - Receives the Sanity webhook with full document data
   - Ignores the body
   - Calls GitHub's repository dispatch with just `event_type`
   
   This bypasses the projection issue entirely.

### GitHub Actions Not Running

**Check:**
1. Go to GitHub → Actions tab
2. Verify the workflow file exists at `.github/workflows/deploy.yml`
3. Make sure actions are enabled for the repository

**Test with Manual Trigger:**
1. Go to Actions → "Deploy to Cloudflare Workers"
2. Click **"Run workflow"**
3. Select branch and click **"Run workflow"**

### Deployment Failing

**Check Build Logs:**
1. Go to GitHub → Actions
2. Click on the failed run
3. Check the logs for each step

**Common Issues:**
| Error | Solution |
|-------|----------|
| `CLOUDFLARE_API_TOKEN` not found | Add secret in repository settings |
| Build errors | Check npm ci and build steps |
| Wrangler errors | Verify Cloudflare credentials |

## Manual Deployment

If webhook fails, you can always deploy manually:

**Option 1: GitHub Actions UI**
1. Go to Actions tab
2. Select "Deploy to Cloudflare Workers"
3. Click "Run workflow"

**Option 2: Command Line**
```bash
npm run deploy
```

## Security Notes

1. **Keep tokens secure** - Never commit tokens to the repository
2. **Use minimal permissions** - GitHub token only needs `repo` scope
3. **Rotate tokens periodically** - Set reminders to regenerate tokens before expiration
4. **Monitor webhook logs** - Check Sanity logs for unauthorized attempts

## Summary

Once setup is complete:
- ✅ Content changes in Sanity automatically trigger deployments
- ✅ GitHub Actions handles the build and deploy process
- ✅ Site updates within 1-2 minutes of publishing
- ✅ No manual intervention needed for content updates

## Support

If you encounter issues:
1. Check Sanity webhook logs
2. Check GitHub Actions logs
3. Review this guide's troubleshooting section
4. Contact the developer if issues persist
