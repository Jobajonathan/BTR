# Behind the Reels

React/Next.js website for Behind the Reels, a mental health storytelling and community platform for young Africans.

## Stack

- Next.js App Router
- React
- TypeScript
- Sanity CMS
- Vercel-ready deployment

## Getting Started

1. Copy `.env.example` to `.env.local`.
2. Add the Sanity project ID and dataset.
3. Install dependencies with `npm install`.
4. Run the site with `npm run dev`.

The production frontend can deploy before Sanity is connected. It uses fallback
content when `NEXT_PUBLIC_SANITY_PROJECT_ID` is not set.

## Sanity Studio

The CMS admin lives in `studio/` so the Vercel frontend build stays lean.

```bash
cd studio
copy .env.example .env
npm install
npm run dev
```

Set these values in `studio/.env`:

```txt
SANITY_STUDIO_PROJECT_ID=<your Sanity project id>
SANITY_STUDIO_DATASET=production
```

Set these values in Vercel for the frontend:

```txt
NEXT_PUBLIC_SANITY_PROJECT_ID=<same Sanity project id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-21
```

`SANITY_API_READ_TOKEN` is only needed if the dataset is private.

## Core Content Types

- Stories
- Authors
- Categories
- Dialogues
- Outreach reports
- Resource guides
- Team members
- Site settings

## Routes

- `/`
- `/stories`
- `/dialogues`
- `/outreach`
- `/resources`
- `/about`
- `/join`
- `/submit`
- `/partner`
- `/newsletter`
