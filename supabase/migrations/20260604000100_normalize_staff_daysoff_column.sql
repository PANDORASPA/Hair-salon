ALTER TABLE public.staff
  ADD COLUMN IF NOT EXISTS daysoff JSONB DEFAULT '[]'::jsonb;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'staff'
      AND column_name = 'daysOff'
  ) THEN
    UPDATE public.staff
    SET daysoff = COALESCE(daysoff, "daysOff", '[]'::jsonb)
    WHERE daysoff IS NULL OR daysoff = '[]'::jsonb;
  END IF;
END $$;
