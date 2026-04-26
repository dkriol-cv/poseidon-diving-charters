-- Migration for Booking Robustness
-- 1. Add Columns to bookings
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS tentative_hold_until timestamptz,
ADD COLUMN IF NOT EXISTS paid_at timestamptz,
ADD COLUMN IF NOT EXISTS stripe_session_id text,
ADD COLUMN IF NOT EXISTS stripe_payment_intent_id text;

-- 2. Create stripe_events table
CREATE TABLE IF NOT EXISTS public.stripe_events (
  event_id text PRIMARY KEY,
  type text,
  created_at timestamptz DEFAULT now(),
  payload jsonb
);

-- 3. Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_session_id ON public.bookings(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_bookings_stripe_payment_intent_id ON public.bookings(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_date_status ON public.bookings(service_type, booking_date, status);
CREATE INDEX IF NOT EXISTS idx_stripe_events_created_at ON public.stripe_events(created_at);

-- 4. Remove Public Insert Policy (Security)
DROP POLICY IF EXISTS "public_insert_booking" ON public.bookings;