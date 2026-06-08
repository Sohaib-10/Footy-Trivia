-- ============================================================================
-- SUPABASE STORAGE RLS POLICIES (Run in Supabase SQL Editor)
-- ============================================================================

-- 1. AVATARS: Anyone can view, only owner can upload/update/delete
CREATE POLICY "Public read avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Owner can upload avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owner can update avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Owner can delete avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. TEAM LOGOS: Public read, admin-only write (via service key)
CREATE POLICY "Public read team-logos"
ON storage.objects FOR SELECT
USING (bucket_id = 'team-logos');

-- 3. COUNTRY FLAGS: Public read, admin-only write (via service key)
CREATE POLICY "Public read country-flags"
ON storage.objects FOR SELECT
USING (bucket_id = 'country-flags');

-- 4. ACHIEVEMENTS: Public read, admin-only write (via service key)
CREATE POLICY "Public read achievements"
ON storage.objects FOR SELECT
USING (bucket_id = 'achievements');


-- ============================================================================
-- BACKFILL SQL: Update existing seed data to point to Supabase CDN placeholders
-- REPLACE 'placeholder-project-ref' with your actual Supabase Project Reference
-- ============================================================================

-- Backfill countries flag URLs
UPDATE countries SET flag_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/country-flags/ENG.svg' WHERE code = 'ENG';
UPDATE countries SET flag_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/country-flags/ESP.svg' WHERE code = 'ESP';
UPDATE countries SET flag_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/country-flags/GER.svg' WHERE code = 'GER';
UPDATE countries SET flag_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/country-flags/FRA.svg' WHERE code = 'FRA';
UPDATE countries SET flag_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/country-flags/BRA.svg' WHERE code = 'BRA';
UPDATE countries SET flag_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/country-flags/ARG.svg' WHERE code = 'ARG';
UPDATE countries SET flag_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/country-flags/ITA.svg' WHERE code = 'ITA';

-- Backfill teams logo URLs
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/1/manchester-united.png' WHERE id = 1;
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/2/real-madrid-cf.png' WHERE id = 2;
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/3/fc-barcelona.png' WHERE id = 3;
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/4/atletico-madrid.png' WHERE id = 4;
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/5/manchester-city.png' WHERE id = 5;
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/6/chelsea-fc.png' WHERE id = 6;
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/7/arsenal-fc.png' WHERE id = 7;
UPDATE teams SET logo_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/team-logos/8/liverpool-fc.png' WHERE id = 8;

-- Backfill achievements icon URLs
UPDATE achievements SET icon_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/achievements/1/first-kick.png' WHERE id = 1;
UPDATE achievements SET icon_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/achievements/2/hat-trick-hero.png' WHERE id = 2;
UPDATE achievements SET icon_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/achievements/3/clean-sheet.png' WHERE id = 3;
UPDATE achievements SET icon_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/achievements/4/trivia-master.png' WHERE id = 4;
UPDATE achievements SET icon_url = 'https://placeholder-project-ref.supabase.co/storage/v1/object/public/achievements/5/la-liga-scholar.png' WHERE id = 5;
