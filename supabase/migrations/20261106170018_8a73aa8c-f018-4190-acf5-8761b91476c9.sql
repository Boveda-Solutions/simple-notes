REVOKE UPDATE, DELETE, TRUNCATE, REFERENCES, TRIGGER ON public.notes FROM anon;
REVOKE ALL ON public.notes FROM authenticated;
DELETE FROM public.notes WHERE body IN ('Verification note — first', 'Verification note — newest');