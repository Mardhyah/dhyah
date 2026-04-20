-- ============================
-- TABLES
-- ============================
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image text,
  link text,
  github text,
  features jsonb,
  tags text[] DEFAULT '{}',
  is_published boolean DEFAULT true,
  order_index int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text,
  provider text,
  image text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.portfolio_comments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  comment text NOT NULL,
  name text NOT NULL,
  profile_image text,
  is_pinned boolean DEFAULT false,
  is_approved boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'user')),
  created_at timestamptz DEFAULT now()
);

-- ============================
-- RLS
-- ============================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read projects"
ON public.projects FOR SELECT USING (true);

CREATE POLICY "public read certificates"
ON public.certificates FOR SELECT USING (true);

CREATE POLICY "public read comments"
ON public.portfolio_comments FOR SELECT USING (true);

-- Siapapun (viewer) bisa kasih komen, tapi tidak otomatis pinned
CREATE POLICY "public insert comment"
ON public.portfolio_comments FOR INSERT
WITH CHECK (is_pinned = false);

CREATE POLICY "admin manage projects"
ON public.projects FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin manage certificates"
ON public.certificates FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin update comments"
ON public.portfolio_comments FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "admin delete comments"
ON public.portfolio_comments FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- ============================
-- STORAGE
-- ============================
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "admin upload project images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'project-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "public read project images"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-images');

INSERT INTO storage.buckets (id, name, public)
VALUES ('certificate-images', 'certificate-images', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "admin upload certificate images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'certificate-images'
  AND EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "public read certificate images"
ON storage.objects FOR SELECT
USING (bucket_id = 'certificate-images');
