-- BTR: new-features migration
-- Run this in Supabase SQL Editor (safe to re-run)

-- ────────────────────────────────────────────
-- 1. Admin roles
-- ────────────────────────────────────────────
create table if not exists admin_roles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  email    text not null,
  role     text not null default 'editor', -- super_admin | editor | author | moderator
  created_at timestamptz default now()
);

alter table admin_roles enable row level security;
drop policy if exists "Auth read own role" on admin_roles;
create policy "Auth read own role" on admin_roles for select using (auth.uid() = user_id);
-- Service role bypasses RLS for all admin writes

-- ────────────────────────────────────────────
-- 2. Blog posts
-- ────────────────────────────────────────────
create table if not exists blog_posts (
  id              uuid default gen_random_uuid() primary key,
  title           text not null,
  slug            text unique not null,
  excerpt         text,
  cover_image_url text,
  author_id       uuid references authors(id) on delete set null,
  category_id     uuid references categories(id) on delete set null,
  body            jsonb,
  published_at    timestamptz,
  featured        boolean default false,
  seo_title       text,
  seo_description text,
  view_count      integer default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

alter table blog_posts enable row level security;
drop policy if exists "Public read blog_posts" on blog_posts;
drop policy if exists "Auth write blog_posts" on blog_posts;
create policy "Public read blog_posts" on blog_posts for select using (true);
create policy "Auth write blog_posts" on blog_posts for all using (auth.role() = 'authenticated');

-- ────────────────────────────────────────────
-- 3. View count on stories
-- ────────────────────────────────────────────
alter table stories add column if not exists view_count integer default 0;

-- RPC helpers (security definer so anon can call them)
create or replace function increment_story_views(p_id uuid)
returns void language sql security definer as $$
  update stories set view_count = coalesce(view_count, 0) + 1 where id = p_id;
$$;

create or replace function increment_blog_views(p_id uuid)
returns void language sql security definer as $$
  update blog_posts set view_count = coalesce(view_count, 0) + 1 where id = p_id;
$$;

-- ────────────────────────────────────────────
-- 4. Extend site_settings: social channels + homepage section order
-- ────────────────────────────────────────────
alter table site_settings
  add column if not exists whatsapp_url   text,
  add column if not exists telegram_url   text,
  add column if not exists tiktok_url     text,
  add column if not exists youtube_url    text,
  add column if not exists facebook_url   text,
  add column if not exists linkedin_url   text,
  add column if not exists homepage_sections jsonb default '[
    {"id":"stories",   "label":"Stories",   "visible":true,"order":1},
    {"id":"dialogues", "label":"Dialogues", "visible":true,"order":2},
    {"id":"outreach",  "label":"Outreach",  "visible":true,"order":3},
    {"id":"resources", "label":"Resources", "visible":true,"order":4}
  ]'::jsonb;
