# Behind the Reels Sanity Studio

This is the content admin for Behind the Reels.

## Setup

1. Create a Sanity project at https://www.sanity.io/manage.
2. Copy `.env.example` to `.env`.
3. Set `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`.
4. Run `npm install` inside this `studio` folder.
5. Run `npm run dev`.

Use the same project ID in the frontend Vercel environment variable:

```txt
NEXT_PUBLIC_SANITY_PROJECT_ID=<same project id>
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-05-21
```
