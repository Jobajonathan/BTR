-- Behind the Reels — Supabase Schema
-- Run this in your Supabase project → SQL Editor

-- Branding (singleton)
create table if not exists branding (
  id uuid default gen_random_uuid() primary key,
  primary_color text not null default '#1f6b4a',
  accent_color text not null default '#f5c84b',
  background_color text not null default '#f7f1e7',
  text_color text not null default '#18211e',
  heading_font text not null default 'Inter',
  body_font text not null default 'Inter',
  logo_url text,
  favicon_url text,
  updated_at timestamptz default now()
);

-- Site settings (singleton)
create table if not exists site_settings (
  id uuid default gen_random_uuid() primary key,
  hero_headline text default 'Behind every reel is a real story.',
  hero_copy text default 'A fast-growing mental health community helping young Africans speak honestly about pressure, identity, family, anxiety, healing, and hope.',
  hero_primary_cta_label text default 'Read Stories',
  hero_primary_cta_url text default '/stories',
  hero_secondary_cta_label text default 'Submit Your Story',
  hero_secondary_cta_url text default '/submit',
  impact_stats jsonb default '[{"value":"1M+","label":"people reached through stories and conversations"},{"value":"3","label":"core pillars: storytelling, dialogues, outreaches"},{"value":"Africa","label":"centered voice, context, and community care"}]',
  instagram_url text,
  twitter_url text,
  footer_tagline text default 'Behind every reel is a real story.',
  updated_at timestamptz default now()
);

-- Authors
create table if not exists authors (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique not null,
  bio text,
  image_url text,
  created_at timestamptz default now()
);

-- Categories
create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  description text,
  created_at timestamptz default now()
);

-- Stories
create table if not exists stories (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_image_url text,
  author_id uuid references authors(id) on delete set null,
  category_id uuid references categories(id) on delete set null,
  body jsonb,
  published_at timestamptz,
  featured boolean default false,
  instagram_url text,
  seo_title text,
  seo_description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Dialogues
create table if not exists dialogues (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  date timestamptz,
  guest text,
  summary text,
  cover_image_url text,
  recording_url text,
  key_takeaways jsonb default '[]',
  meta text,
  created_at timestamptz default now()
);

-- Outreaches
create table if not exists outreaches (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  location text,
  date date,
  summary text,
  gallery jsonb default '[]',
  impact_stats jsonb default '[]',
  partners jsonb default '[]',
  testimonial text,
  testimonial_author text,
  created_at timestamptz default now()
);

-- Resources
create table if not exists resources (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text unique not null,
  excerpt text,
  cover_image_url text,
  body jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Story submissions (public can insert, auth can read/update)
create table if not exists story_submissions (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text,
  title text not null,
  category text,
  story text not null,
  consent boolean default false,
  status text not null default 'pending',
  created_at timestamptz default now()
);

-- Team members
create table if not exists team_members (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  role text,
  bio text,
  image_url text,
  order_index integer default 0,
  created_at timestamptz default now()
);

-- Seed singleton rows with fixed IDs
insert into branding (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;
insert into site_settings (id) values ('00000000-0000-0000-0000-000000000001') on conflict (id) do nothing;

-- Storage bucket for uploads
insert into storage.buckets (id, name, public)
values ('btr-media', 'btr-media', true)
on conflict (id) do nothing;

-- RLS
alter table branding enable row level security;
alter table site_settings enable row level security;
alter table stories enable row level security;
alter table authors enable row level security;
alter table categories enable row level security;
alter table dialogues enable row level security;
alter table outreaches enable row level security;
alter table resources enable row level security;
alter table team_members enable row level security;
alter table story_submissions enable row level security;

-- Drop policies if they exist (safe to re-run)
drop policy if exists "Public read branding" on branding;
drop policy if exists "Public read site_settings" on site_settings;
drop policy if exists "Public read stories" on stories;
drop policy if exists "Public read authors" on authors;
drop policy if exists "Public read categories" on categories;
drop policy if exists "Public read dialogues" on dialogues;
drop policy if exists "Public read outreaches" on outreaches;
drop policy if exists "Public read resources" on resources;
drop policy if exists "Public read team_members" on team_members;
drop policy if exists "Auth write branding" on branding;
drop policy if exists "Auth write site_settings" on site_settings;
drop policy if exists "Auth write stories" on stories;
drop policy if exists "Auth write authors" on authors;
drop policy if exists "Auth write categories" on categories;
drop policy if exists "Auth write dialogues" on dialogues;
drop policy if exists "Auth write outreaches" on outreaches;
drop policy if exists "Auth write resources" on resources;
drop policy if exists "Auth write team_members" on team_members;
drop policy if exists "Public read media" on storage.objects;
drop policy if exists "Auth upload media" on storage.objects;
drop policy if exists "Auth delete media" on storage.objects;
drop policy if exists "Public submit story" on story_submissions;
drop policy if exists "Auth read submissions" on story_submissions;
drop policy if exists "Auth update submissions" on story_submissions;

-- Public read
create policy "Public read branding" on branding for select using (true);
create policy "Public read site_settings" on site_settings for select using (true);
create policy "Public read stories" on stories for select using (true);
create policy "Public read authors" on authors for select using (true);
create policy "Public read categories" on categories for select using (true);
create policy "Public read dialogues" on dialogues for select using (true);
create policy "Public read outreaches" on outreaches for select using (true);
create policy "Public read resources" on resources for select using (true);
create policy "Public read team_members" on team_members for select using (true);

-- Auth write (service role bypasses RLS automatically)
create policy "Auth write branding" on branding for all using (auth.role() = 'authenticated');
create policy "Auth write site_settings" on site_settings for all using (auth.role() = 'authenticated');
create policy "Auth write stories" on stories for all using (auth.role() = 'authenticated');
create policy "Auth write authors" on authors for all using (auth.role() = 'authenticated');
create policy "Auth write categories" on categories for all using (auth.role() = 'authenticated');
create policy "Auth write dialogues" on dialogues for all using (auth.role() = 'authenticated');
create policy "Auth write outreaches" on outreaches for all using (auth.role() = 'authenticated');
create policy "Auth write resources" on resources for all using (auth.role() = 'authenticated');
create policy "Auth write team_members" on team_members for all using (auth.role() = 'authenticated');

-- Submission policies (public submit, auth read/update)
create policy "Public submit story" on story_submissions for insert with check (true);
create policy "Auth read submissions" on story_submissions for select using (auth.role() = 'authenticated');
create policy "Auth update submissions" on story_submissions for update using (auth.role() = 'authenticated');

-- Storage policies
create policy "Public read media" on storage.objects for select using (bucket_id = 'btr-media');
create policy "Auth upload media" on storage.objects for insert with check (bucket_id = 'btr-media' and auth.role() = 'authenticated');
create policy "Auth delete media" on storage.objects for delete using (bucket_id = 'btr-media' and auth.role() = 'authenticated');
