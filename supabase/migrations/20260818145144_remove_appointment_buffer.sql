ALTER TABLE public.appointments
  DROP CONSTRAINT IF EXISTS appointments_no_active_overlap;

UPDATE public.appointments SET buffer_ends_at = ends_at;

CREATE OR REPLACE FUNCTION public.salon_set_appointment_buffer_end()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.buffer_ends_at := NEW.ends_at;
  RETURN NEW;
END; $$;

ALTER TABLE public.appointments
  ADD CONSTRAINT appointments_no_active_overlap
  EXCLUDE USING gist (
    tstzrange(starts_at, buffer_ends_at, '[)') WITH &&
  )
  WHERE (status <> 'cancelled');

CREATE OR REPLACE FUNCTION public.create_salon_appointment(
  p_service_id bigint, p_user_id uuid, p_customer_name text, p_customer_phone text,
  p_customer_email text, p_starts_at timestamptz, p_customer_notes text DEFAULT null
) RETURNS public.appointments
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE selected_service public.services; created public.appointments; calculated_end timestamptz;
BEGIN
  SELECT * INTO selected_service FROM public.services WHERE id=p_service_id AND enabled=true AND published=true;
  IF NOT FOUND THEN RAISE EXCEPTION 'service_not_available'; END IF;
  calculated_end := p_starts_at + make_interval(mins => selected_service.duration_minutes);
  PERFORM pg_advisory_xact_lock(hashtextextended((p_starts_at AT TIME ZONE 'Europe/London')::date::text, 0));
  IF EXISTS (
    SELECT 1 FROM public.appointments
    WHERE status <> 'cancelled'
      AND starts_at < calculated_end
      AND ends_at > p_starts_at
  ) THEN
    RAISE EXCEPTION 'appointment_slot_unavailable';
  END IF;
  INSERT INTO public.appointments(user_id,service_id,customer_name,customer_phone,customer_email,starts_at,ends_at,customer_notes)
  VALUES(p_user_id,p_service_id,trim(p_customer_name),trim(p_customer_phone),nullif(trim(p_customer_email),''),p_starts_at,calculated_end,nullif(trim(p_customer_notes),'')) RETURNING * INTO created;
  RETURN created;
END; $$;

REVOKE ALL ON FUNCTION public.create_salon_appointment(bigint,uuid,text,text,text,timestamptz,text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_salon_appointment(bigint,uuid,text,text,text,timestamptz,text) TO service_role;

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
      AND starts_at < next_end
      AND ends_at > next_start
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
