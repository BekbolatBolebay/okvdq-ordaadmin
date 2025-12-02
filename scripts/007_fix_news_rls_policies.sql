-- Fix RLS policies to allow all authenticated users full access
-- This replaces the old admin-only policies

-- NEWS TABLE POLICIES
DROP POLICY "Authenticated users can insert news" ON news;
DROP POLICY "Authenticated users can update news" ON news;
DROP POLICY "Authenticated users can delete news" ON news;
DROP POLICY "Authenticated users can view news" ON news;

CREATE POLICY "Authenticated users can view news"
  ON news FOR SELECT
  TO authenticated
  USING (true);

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

-- SERVICES TABLE POLICIES
DROP POLICY "Authenticated users can view services" ON services;
DROP POLICY "Authenticated users can insert services" ON services;
DROP POLICY "Authenticated users can update services" ON services;
DROP POLICY "Authenticated users can delete services" ON services;

CREATE POLICY "Authenticated users can view services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  TO authenticated
  USING (true);

-- DOCTORS TABLE POLICIES
DROP POLICY "Authenticated users can view doctors" ON doctors;
DROP POLICY "Authenticated users can insert doctors" ON doctors;
DROP POLICY "Authenticated users can update doctors" ON doctors;
DROP POLICY "Authenticated users can delete doctors" ON doctors;

CREATE POLICY "Authenticated users can view doctors"
  ON doctors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert doctors"
  ON doctors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update doctors"
  ON doctors FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete doctors"
  ON doctors FOR DELETE
  TO authenticated
  USING (true);
