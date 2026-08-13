DO $$
DECLARE conflicting_references text;
BEGIN
  SELECT string_agg(left_side.reference || ' / ' || right_side.reference, ', ' ORDER BY left_side.reference, right_side.reference)
  INTO conflicting_references
  FROM public.appointments left_side
  JOIN public.appointments right_side ON left_side.id < right_side.id
  WHERE left_side.status <> 'cancelled'
    AND right_side.status <> 'cancelled'
    AND tstzrange(left_side.starts_at, left_side.ends_at + interval '15 minutes', '[)')
        && tstzrange(right_side.starts_at, right_side.ends_at + interval '15 minutes', '[)');

  IF conflicting_references IS NOT NULL THEN
    RAISE EXCEPTION 'Conflicting appointment references: %', conflicting_references;
  END IF;
END $$;

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS buffer_ends_at timestamptz;
UPDATE public.appointments SET buffer_ends_at = ends_at + interval '15 minutes' WHERE buffer_ends_at IS NULL;
ALTER TABLE public.appointments ALTER COLUMN buffer_ends_at SET NOT NULL;

CREATE OR REPLACE FUNCTION public.salon_set_appointment_buffer_end()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.buffer_ends_at := NEW.ends_at + interval '15 minutes';
  RETURN NEW;
END; $$;

DROP TRIGGER IF EXISTS salon_appointment_buffer_end ON public.appointments;
CREATE TRIGGER salon_appointment_buffer_end
BEFORE INSERT OR UPDATE OF ends_at ON public.appointments
FOR EACH ROW EXECUTE FUNCTION public.salon_set_appointment_buffer_end();

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'appointments_no_active_overlap') THEN
    ALTER TABLE public.appointments
      ADD CONSTRAINT appointments_no_active_overlap
      EXCLUDE USING gist (
        tstzrange(starts_at, buffer_ends_at, '[)') WITH &&
      )
      WHERE (status <> 'cancelled');
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.update_salon_appointment(
  p_appointment_id bigint,
  p_status text,
  p_admin_notes text DEFAULT null,
  p_starts_at timestamptz DEFAULT null
) RETURNS public.appointments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  current_appointment public.appointments;
  selected_service public.services;
  updated_appointment public.appointments;
  next_start timestamptz;
  next_end timestamptz;
BEGIN
  IF p_status NOT IN ('pending','confirmed','completed','cancelled','no_show') THEN
    RAISE EXCEPTION 'invalid_appointment_status';
  END IF;

  SELECT * INTO current_appointment FROM public.appointments WHERE id = p_appointment_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'appointment_not_found'; END IF;
  SELECT * INTO selected_service FROM public.services WHERE id = current_appointment.service_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'service_not_found'; END IF;

  next_start := COALESCE(p_starts_at, current_appointment.starts_at);
  next_end := next_start + make_interval(mins => selected_service.duration_minutes);
  PERFORM pg_advisory_xact_lock(hashtextextended((next_start AT TIME ZONE 'Europe/London')::date::text, 0));

  IF p_status <> 'cancelled' AND EXISTS (
    SELECT 1 FROM public.appointments
    WHERE id <> p_appointment_id
      AND status <> 'cancelled'
      AND starts_at < next_end + interval '15 minutes'
      AND ends_at + interval '15 minutes' > next_start
  ) THEN
    RAISE EXCEPTION 'appointment_slot_unavailable';
  END IF;

  UPDATE public.appointments
  SET status = p_status,
      admin_notes = nullif(trim(p_admin_notes), ''),
      starts_at = next_start,
      ends_at = next_end
  WHERE id = p_appointment_id
  RETURNING * INTO updated_appointment;
  RETURN updated_appointment;
END; $$;

REVOKE ALL ON FUNCTION public.update_salon_appointment(bigint,text,text,timestamptz) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.update_salon_appointment(bigint,text,text,timestamptz) TO service_role;
