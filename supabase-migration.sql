-- ============================================================
-- 在 Supabase SQL Editor 中运行此脚本
-- 1. 创建 content / posts / pages 表（home 表已存在则跳过）
-- 2. 插入种子数据
-- 3. 添加 RLS 策略允许匿名读取
-- ============================================================

-- ---- 建表 ----

CREATE TABLE IF NOT EXISTS content (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  type        TEXT,
  cover_color TEXT,
  sort_order  INT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  img         TEXT,
  url         TEXT
);

CREATE INDEX IF NOT EXISTS idx_content_sort_order ON content USING btree (sort_order);

CREATE TABLE IF NOT EXISTS posts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  content     TEXT DEFAULT '',
  summary     TEXT DEFAULT '',
  tags        TEXT[] DEFAULT '{}',
  published   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pages (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id     TEXT UNIQUE NOT NULL CHECK (page_id IN ('about', 'more')),
  title       TEXT DEFAULT '',
  content     TEXT DEFAULT '',
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

-- ---- 种子数据 ----

INSERT INTO content (type, title, description, cover_color, sort_order, url) VALUES
  ('album',   'Travel Notes',   'Wanderlust stories from around the globe',     '#667eea', 1, NULL),
  ('album',   'Daily Life',     'Moments that matter in everyday',              '#764ba2', 2, NULL),
  ('project', 'Project Alpha',  'Full-stack social platform',                   '#f093fb', 3, NULL),
  ('album',   'Art Gallery',    'Visual creations and designs',                 '#4facfe', 4, NULL),
  ('album',   'Tech Stack',     'Code, architecture & tools',                   '#43e97b', 5, NULL),
  ('project', 'Project Beta',   'Component design system',                     '#fa709a', 6, NULL),
  ('album',   'Music Vibes',    'Sounds, rhythms & playlists',                  '#fee140', 7, NULL),
  ('project', 'Project Gamma',  'Mobile-first application',                     '#a18cd1', 8, NULL),
  ('album',   'Food Diary',     'Culinary adventures & recipes',                '#fbc2eb', 9, NULL),
  ('project', 'Project Delta',  'Real-time collaboration tool',                 '#84fab0', 10, NULL),
  ('album',   'Book Notes',     'Readings, ideas & reflections',                '#5ee7df', 11, NULL),
  ('project', 'Project Epsilon','AI-powered analytics',                         '#b6c3ff', 12, NULL),
  ('album',   'Film Journal',   'Movies, frames & reviews',                     '#f5576c', 13, NULL),
  ('project', 'Project Zeta',   'Cloud infrastructure',                         '#4facfe', 14, NULL)
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, content, summary, tags) VALUES
  ('Getting Started with Vue 3',   'Vue 3 introduces Composition API, which provides a more flexible way to organize component logic...', 'A beginner-friendly guide to Vue 3 Composition API.',                                    ARRAY['vue','frontend']),
  ('Building REST APIs with Fastify', 'Fastify is a high-performance Node.js framework. It is designed to be fast and low-overhead...',     'Learn how to build fast and scalable APIs with Fastify.',                                 ARRAY['nodejs','backend','fastify']),
  ('MongoDB Best Practices',       'Schema design is crucial for MongoDB performance. Here are some best practices to follow...',           'Essential MongoDB schema design and performance tips.',                                   ARRAY['mongodb','database'])
ON CONFLICT DO NOTHING;

INSERT INTO pages (page_id, title, content) VALUES
  ('about', 'About Me', 'Welcome to my blog. I write about tech, life, and everything in between.'),
  ('more',  'More',     'More content coming soon...')
ON CONFLICT (page_id) DO NOTHING;

-- ---- RLS 策略：匿名可读，已登录用户可增删改 ----

ALTER TABLE IF EXISTS content ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS posts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS pages   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS home    ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content' AND policyname = 'anon can read content') THEN
    CREATE POLICY "anon can read content" ON content FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'posts'   AND policyname = 'anon can read posts') THEN
    CREATE POLICY "anon can read posts"   ON posts   FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pages'   AND policyname = 'anon can read pages') THEN
    CREATE POLICY "anon can read pages"   ON pages   FOR SELECT TO anon USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'home'    AND policyname = 'anon can read home') THEN
    CREATE POLICY "anon can read home"    ON home    FOR SELECT TO anon USING (true);
  END IF;

  -- 已登录用户可对 content 表增删改
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content' AND policyname = 'auth insert content') THEN
    CREATE POLICY "auth insert content" ON content FOR INSERT TO authenticated WITH CHECK (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content' AND policyname = 'auth update content') THEN
    CREATE POLICY "auth update content" ON content FOR UPDATE TO authenticated USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'content' AND policyname = 'auth delete content') THEN
    CREATE POLICY "auth delete content" ON content FOR DELETE TO authenticated USING (true);
  END IF;
END $$;
