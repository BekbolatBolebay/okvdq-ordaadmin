-- Fix RLS policies to allow authenticated users to insert news
-- This replaces the old policy that requires admin_users entry

DROP POLICY "Authenticated users can insert news" ON news;
DROP POLICY "Authenticated users can update news" ON news;
DROP POLICY "Authenticated users can delete news" ON news;
DROP POLICY "Authenticated users can view news" ON news;

-- Create new policies that allow all authenticated users
CREATE POLICY "Authenticated users can insert news"
  ON news FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update news"
  ON news FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete news"
  ON news FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view news"
  ON news FOR SELECT
  TO authenticated
  USING (true);
