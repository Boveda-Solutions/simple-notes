CREATE TABLE public.notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  body text NOT NULL,
  created_at timestamptz DEFAULT now()
);
GRANT SELECT, INSERT ON public.notes TO anon;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anonymous users can read notes" ON public.notes FOR SELECT TO anon USING (true);
CREATE POLICY "Anonymous users can add notes" ON public.notes FOR INSERT TO anon WITH CHECK (true);