-- BTR Features Migration v2 — newsletter, partners, activity_log
-- Run this in the Supabase SQL editor or via the CLI.

-- ── Newsletter subscribers ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       text        UNIQUE NOT NULL,
  name        text,
  source      text        DEFAULT 'website',
  confirmed   boolean     DEFAULT false,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Public insert (signup form)
CREATE POLICY "newsletter_public_insert"
  ON newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Admin read/delete
CREATE POLICY "newsletter_admin_read"
  ON newsletter_subscribers FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "newsletter_admin_delete"
  ON newsletter_subscribers FOR DELETE
  USING (auth.role() = 'service_role');

-- ── Partners ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS partners (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  name        text        NOT NULL,
  description text,
  logo_url    text,
  website_url text,
  category    text,        -- 'School', 'NGO', 'Corporate', 'Media', etc.
  featured    boolean     DEFAULT false,
  order_index integer     DEFAULT 0,
  created_at  timestamptz DEFAULT now()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "partners_public_read"
  ON partners FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "partners_admin_write"
  ON partners FOR ALL
  USING (auth.role() = 'service_role');

-- ── Activity log ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activity_log (
  id           uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      uuid,
  user_email   text,
  action       text        NOT NULL,   -- 'created', 'updated', 'deleted', 'published'
  entity_type  text,                   -- 'story', 'blog_post', 'dialogue', etc.
  entity_id    text,
  entity_title text,
  metadata     jsonb,
  created_at   timestamptz DEFAULT now()
);

ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_admin_read"
  ON activity_log FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "activity_admin_insert"
  ON activity_log FOR INSERT
  USING (auth.role() = 'service_role');
