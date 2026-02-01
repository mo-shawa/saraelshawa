# AGENTS.md - AI Assistant Context

This file contains project-specific patterns, conventions, and gotchas to help AI assistants work effectively on this codebase.

## Project Overview

- **Framework:** TanStack Start (React meta-framework) - NOT Next.js, Remix, or plain React
- **Deployment:** Cloudflare Workers (NOT Cloudflare Pages)
- **CMS:** Sanity CMS with build-time data fetching
- **Styling:** Tailwind CSS v4

## Critical: TanStack Start Server Functions

### The Problem We Solved

TanStack Start loaders run **both server-side AND client-side**:
- **Initial page load:** Loader runs on the server ✅
- **Client-side navigation:** Loader runs in the browser ❌

This caused 403 CORS errors when the Sanity client tried to make API calls from the browser.

### Solution: Use `createServerFn`

Server functions created with `createServerFn` ALWAYS run on the server, even during client-side navigation.

### Correct Patterns

#### Server function WITHOUT input:
```typescript
import { createServerFn } from '@tanstack/react-start'

export const getHomePageData = createServerFn({ method: 'GET' })
  .handler(async () => {
    // This always runs on the server
    return await sanityClient.fetch(query)
  })

// Usage in route:
loader: async () => {
  return await getHomePageData()
}
```

#### Server function WITH input:
```typescript
// ✅ CORRECT: Use .inputValidator() before .handler()
export const getPostById = createServerFn({ method: 'GET' })
  .inputValidator((d: string) => d)
  .handler(async ({ data }) => {
    const postId = data
    return await sanityClient.fetch(query, { id: postId })
  })

// Usage in route - MUST pass { data: value }
loader: async ({ params }) => {
  return await getPostById({ data: params.postId })
}
```

### Common Mistakes to Avoid

#### ❌ WRONG: Using `.validator()` instead of `.inputValidator()`
```typescript
// This does NOT exist - will cause TypeScript error
export const getPostById = createServerFn({ method: 'GET' })
  .validator((d: string) => d)  // ❌ Property 'validator' does not exist
```

#### ❌ WRONG: Trying to type the handler parameter directly
```typescript
// This causes "Type 'undefined' is not assignable to type 'string'"
export const getPostById = createServerFn({ method: 'GET' })
  .handler(async ({ data }: { data: string }) => { ... })  // ❌
```

#### ❌ WRONG: Passing value directly instead of { data: value }
```typescript
// Route loader - WRONG
loader: async ({ params }) => {
  return await getPostById(params.postId)  // ❌ Type error
}

// Route loader - CORRECT
loader: async ({ params }) => {
  return await getPostById({ data: params.postId })  // ✅
}
```

#### ❌ WRONG: Variable shadowing in handler
```typescript
// The parameter is named `data`, don't reuse for fetch result
.handler(async ({ data }) => {
  const data = await sanityClient.fetch(query)  // ❌ Shadows parameter
  if (data) { ... }  // Which `data` is this?
})

// CORRECT: Use different variable name
.handler(async ({ data }) => {
  const postId = data
  const result = await sanityClient.fetch(query, { id: postId })  // ✅
  if (result) { ... }
})
```

## File Organization

### Content Fetching
- `src/lib/content.server.ts` - Server functions for Sanity (USE THIS)
- `src/lib/content.ts` - Original content service (DO NOT USE for routes)
- `src/lib/sanity.ts` - Sanity client configuration
- `src/lib/content-types.ts` - TypeScript types

### Routes
Routes are in `src/routes/` using file-based routing:
- `index.tsx` → `/`
- `posts/index.tsx` → `/posts`
- `posts/$postId.tsx` → `/posts/:postId`
- `news.tsx` → `/news`

## Sanity Configuration

### Hardcoded Values (Environment Variables Don't Work in Workers)
```typescript
// In src/lib/sanity.ts
const SANITY_PROJECT_ID = '7lwqqklw'
const SANITY_DATASET = 'production'
```

### Why Environment Variables Don't Work
Cloudflare Workers have a different environment variable system. The `process.env` pattern doesn't work reliably. We hardcode these non-sensitive values.

## Deployment

### Commands
```bash
npm run dev      # Local development (port 3000)
npm run build    # Build for production
npm run deploy   # Build and deploy to Cloudflare Workers
```

### URLs
- **Production:** https://saraelshawa.icy-heart-96a5.workers.dev
- **Sanity Studio:** https://saraelshawa.sanity.studio
- **Sanity Dashboard:** https://www.sanity.io/manage/project/7lwqqklw

## GitHub Actions

The workflow at `.github/workflows/deploy.yml` triggers on:
1. Push to `main` branch
2. Manual trigger via GitHub UI
3. Sanity webhook via `repository_dispatch` with type `sanity-content-update`

### Required Secrets
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## TypeScript Notes

### Known Errors in Demo Files
These errors exist in demo files and can be ignored:
- `src/routes/demo/start.server-funcs.tsx` - Parameter 't' implicitly has 'any' type
- `src/routes/demo/start.ssr.spa-mode.tsx` - Type assignment issues

### Sanity Studio Errors
The Sanity studio has its own TypeScript config. These errors don't affect the main build:
- `sanity/sanity.config.ts` - Missing @sanity/vision types

## Common Tasks

### Adding a New Server Function with Parameters
1. Create function in `src/lib/content.server.ts`:
   ```typescript
   export const getItemById = createServerFn({ method: 'GET' })
     .inputValidator((id: string) => id)
     .handler(async ({ data }) => {
       return await sanityClient.fetch(query, { id: data })
     })
   ```

2. Use in route:
   ```typescript
   import { getItemById } from '../lib/content.server'
   
   export const Route = createFileRoute('/items/$itemId')({
     loader: async ({ params }) => {
       return await getItemById({ data: params.itemId })
     },
   })
   ```

### Testing Sanity Connection
```bash
# Check if Sanity is returning data
npm run dev
# Visit http://localhost:3000 and check browser console for errors
```

### Debugging CORS Issues
If you see 403 errors to `*.api.sanity.io` in the browser Network tab:
1. The Sanity call is running client-side (wrong)
2. Check that the route imports from `content.server.ts`
3. Verify the function uses `createServerFn`

## Package Versions (for reference)
- `@tanstack/react-start`: ^1.132.0
- `@tanstack/react-router`: ^1.132.0
- `@sanity/client`: ^7.14.1
- `react`: ^19.2.0
