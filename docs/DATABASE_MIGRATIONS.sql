-- Database Migration Script for Stripe Integration & Reservations
-- Run this in the Supabase SQL Editor

-- 1. Create Customers Table
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id), -- Optional link to auth users
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Extras Table (if not exists, or ensure columns)
CREATE TABLE IF NOT EXISTS public.extras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10,2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Slot Reservations Table (Concurrency & Availability)
CREATE TABLE IF NOT EXISTS public.slot_reservations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slot_id UUID REFERENCES public.time_slots(id) ON DELETE CASCADE,
    booking_id UUID, -- Can be null initially if reserving before booking record creation, but usually linked
    status TEXT DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'cancelled', 'expired')),
    reserved_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- Auto-expiry logic
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Booking Extras Junction Table
CREATE TABLE IF NOT EXISTS public.booking_extras (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE,
    extra_id UUID REFERENCES public.extras(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    price_at_booking NUMERIC(10,2) NOT NULL, -- Snapshot of price
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create Booking Payments Table (Stripe Integration)
CREATE TABLE IF NOT EXISTS public.booking_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID REFERENCES public.bookings(id) ON DELETE CASCADE UNIQUE, -- One active payment record per booking usually
    customer_id UUID REFERENCES public.customers(id),
    amount NUMERIC(10,2) NOT NULL, -- Amount paid/to be paid
    deposit_amount NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'eur',
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    stripe_payment_intent_id TEXT UNIQUE,
    stripe_session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Alter External Bookings (Sync status & links)
ALTER TABLE public.external_bookings 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id),
ADD COLUMN IF NOT EXISTS slot_id UUID REFERENCES public.time_slots(id),
ADD COLUMN IF NOT EXISTS status_reserva TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS status_pagamento TEXT DEFAULT 'pending';

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_slot_reservations_slot_id_status ON public.slot_reservations(slot_id, status);
CREATE INDEX IF NOT EXISTS idx_slot_reservations_expires_at ON public.slot_reservations(expires_at);
CREATE INDEX IF NOT EXISTS idx_booking_payments_booking_id ON public.booking_payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_payments_stripe_pi ON public.booking_payments(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_customers_email ON public.customers(email);

-- 8. Row Level Security (RLS)
ALTER TABLE public.slot_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_extras ENABLE ROW LEVEL SECURITY;

-- Policies for Slot Reservations
-- Public can read reservations (to calculate availability)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'slot_reservations'
        AND policyname = 'Public read slot reservations'
    ) THEN
        CREATE POLICY "Public read slot reservations" ON public.slot_reservations FOR SELECT USING (true);
    END IF;
END
$$;

-- Only service role (Edge Functions) can insert/update for strict control
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'slot_reservations'
        AND policyname = 'Service role manages reservations'
    ) THEN
        CREATE POLICY "Service role manages reservations" ON public.slot_reservations FOR ALL USING (true);
    END IF;
END
$$;

-- Policies for Booking Payments
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'booking_payments'
        AND policyname = 'Users view own payments'
    ) THEN
        CREATE POLICY "Users view own payments" ON public.booking_payments FOR SELECT USING (true); -- Simplified for public booking flow; refine for auth users
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'booking_payments'
        AND policyname = 'Service role manages payments'
    ) THEN
        CREATE POLICY "Service role manages payments" ON public.booking_payments FOR ALL USING (true);
    END IF;
END
$$;

-- Policies for Customers
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'customers'
        AND policyname = 'Service role manages customers'
    ) THEN
        CREATE POLICY "Service role manages customers" ON public.customers FOR ALL USING (true);
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_policies
        WHERE tablename = 'customers'
        AND policyname = 'Users read own customer'
    ) THEN
        CREATE POLICY "Users read own customer" ON public.customers FOR SELECT USING (true);
    END IF;
END
$$;

-- 9. Trigger for Updated At
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_slot_reservations_modtime ON public.slot_reservations;
CREATE TRIGGER update_slot_reservations_modtime BEFORE UPDATE ON public.slot_reservations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_booking_payments_modtime ON public.booking_payments;
CREATE TRIGGER update_booking_payments_modtime BEFORE UPDATE ON public.booking_payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

DROP TRIGGER IF EXISTS update_customers_modtime ON public.customers;
CREATE TRIGGER update_customers_modtime BEFORE UPDATE ON public.customers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();