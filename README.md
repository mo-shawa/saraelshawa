# Sara El-Shawa - Portfolio Website

A modern, performant portfolio website built with TanStack Start and powered by Sanity CMS.

**Live Site:** https://saraelshawa.icy-heart-96a5.workers.dev  
**CMS:** https://saraelshawa.sanity.studio

## ✨ Features

- 🚀 Built with **TanStack Start** (React meta-framework)
- 📝 Content managed via **Sanity CMS**
- ⚡ Build-time data fetching (fully static)
- 🔄 Automatic deployments on content publish
- 🎨 Tailwind CSS styling
- 📱 Fully responsive design
- 🖼️ Optimized images via Sanity CDN

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Sanity account (for CMS access)

### Installation

```bash
# Clone the repository
git clone https://github.com/mo-shawa/saraelshawa.git
cd saraelshawa

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Edit .env with your Sanity credentials

# Run development server
npm run dev
```

Visit http://localhost:3000 to see the site.

## 📚 Documentation

Comprehensive guides are available in the project root:

| Guide | Description |
|-------|-------------|
| **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** | 📋 Complete project overview |
| **[SANITY_SETUP.md](SANITY_SETUP.md)** | 🔧 Initial Sanity configuration |
| **[DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md)** | 💻 Local development guide |
| **[WEBHOOK_SETUP_GUIDE.md](WEBHOOK_SETUP_GUIDE.md)** | 🔗 Auto-deploy webhook setup |
| **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** | ✅ Pre-deployment verification |
| **[IMAGE_UPLOAD_GUIDE.md](IMAGE_UPLOAD_GUIDE.md)** | 📸 Uploading images to Sanity |

**Start here:** 👉 [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)

## 🛠️ Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start)
- **CMS:** [Sanity](https://www.sanity.io)
- **Styling:** [Tailwind CSS](https://tailwindcss.com)
- **Deployment:** [Cloudflare Workers](https://workers.cloudflare.com)
- **Language:** TypeScript

## 📦 Available Commands

### Website

```bash
npm run dev          # Run dev server (http://localhost:3000)
npm run build        # Build for production
npm run deploy       # Build and deploy to Cloudflare
npm run preview      # Preview production build locally
```

### Sanity Studio

```bash
npm run sanity:dev   # Run Sanity Studio locally (http://localhost:3333)
npm run sanity:deploy # Deploy Sanity Studio
```

### Content Migration

```bash
npm run migrate      # Migrate static content to Sanity (one-time)
```

## 🎯 Key Concepts

### Build-time Data Fetching

Content is fetched from Sanity **at build time**, not runtime. This means:

- ✅ Fast page loads (no API calls)
- ✅ Fully static site (CDN-friendly)
- ✅ Works offline (static HTML)

**Trade-off:** Dev server must be restarted to see content changes.

```bash
# After publishing changes in Sanity:
Ctrl+C          # Stop dev server
npm run dev     # Restart to fetch new content
```

### Content Fallback

The site includes a fallback mechanism:

```
Sanity CMS (primary) ──> Static data (fallback)
```

If Sanity is unavailable, the site falls back to static data from `src/data/`. This ensures the site always works.

## 📝 Content Management

### For Content Editors

1. Go to https://saraelshawa.sanity.studio
2. Log in with Google
3. Edit content
4. Click **"Publish"**
5. Changes go live automatically (1-2 minutes)

### Content Types

**Documents:**
- `post` - Blog posts / updates
- `newsItem` - Timeline news entries
- `affiliation` - Academic institutions

**Singletons:**
- `heroSettings` - Homepage hero section
- `aboutSettings` - About section
- `siteSettings` - Site metadata

## 🚢 Deployment

### Production Build

```bash
npm run build
```

Outputs static files to `dist/` ready for deployment.

### Deploy to Cloudflare

```bash
npm run deploy
```

Or push to `main` branch (if auto-deploy is configured).

### Environment Variables

Required in Cloudflare Pages:

```bash
SANITY_PROJECT_ID=7lwqqklw
SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here
```

See [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) for details.

## 📁 Project Structure

```
saraelshawa/
├── src/
│   ├── lib/
│   │   ├── sanity.ts          # Sanity client config
│   │   ├── queries.ts         # GROQ queries
│   │   ├── content.ts         # Content service (primary API)
│   │   └── content-types.ts   # TypeScript types
│   ├── routes/                # File-based routing
│   │   ├── index.tsx          # Homepage
│   │   ├── posts/
│   │   │   ├── index.tsx      # Posts listing
│   │   │   └── $postId.tsx    # Individual post
│   │   ├── news.tsx           # News timeline
│   │   └── contact.tsx        # Contact page
│   ├── components/            # React components
│   └── data/                  # Fallback static data
├── sanity/                    # Sanity Studio (separate project)
│   ├── schemas/               # Content schemas
│   ├── sanity.config.ts       # Studio config
│   └── package.json           # Studio dependencies
├── public/                    # Static assets
└── dist/                      # Build output
```

## 🔧 Development Tips

### Working with Content

1. Make changes in Sanity Studio
2. Publish
3. Restart dev server to see changes

```bash
Ctrl+C          # Stop
npm run dev     # Restart
```

### Adding a New Content Type

1. Create schema in `sanity/schemas/`
2. Export from `sanity/schemas/index.ts`
3. Add query in `src/lib/queries.ts`
4. Add fetcher in `src/lib/content.ts`
5. Update types in `src/lib/content-types.ts`
6. Deploy Sanity Studio: `npm run sanity:deploy`

### Debugging

```bash
# Check if content is coming from Sanity or fallback
# Look for console logs in browser console

# Test Sanity connection
npm run sanity:dev  # Studio should load without errors

# Verify build
npm run build       # Should complete without errors
```

## 🤝 Contributing

This is a personal portfolio site. For content changes, use Sanity Studio. For code changes, contact the developer.

## 📄 License

Private project - All rights reserved.

## 💬 Support

For technical issues, refer to the comprehensive documentation in this repository or contact the developer.

---

**Built with ❤️ using TanStack Start and Sanity CMS**
