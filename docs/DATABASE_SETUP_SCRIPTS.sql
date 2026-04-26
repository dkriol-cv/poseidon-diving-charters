-- =================================================================
-- 1. Create Customers Table
-- =================================================================
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    country TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage customers" ON public.customers
    FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view their own customer profile" ON public.customers
    FOR SELECT USING (auth.email() = email);

-- =================================================================
-- 2. Create Payments Table
-- =================================================================
CREATE TABLE IF NOT EXISTS public.booking_payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    booking_id UUID NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'EUR',
    payment_method TEXT CHECK (payment_method IN ('stripe', 'cash', 'bank_transfer', 'other')),
    transaction_ref TEXT, -- Stripe ID or Bank Ref
    status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS
ALTER TABLE public.booking_payments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Admins can manage payments" ON public.booking_payments
    FOR ALL USING (public.is_admin());

CREATE POLICY "Users can view payments for their bookings" ON public.booking_payments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.bookings b 
            WHERE b.id = booking_payments.booking_id 
            -- Assuming we link bookings to auth.users eventually, or matching email
            AND b.customer_email = auth.email()
        )
    );

-- =================================================================
-- 3. Modify Bookings Table (Add Foreign Keys)
-- =================================================================
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES public.customers(id);

ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'direct',
ADD COLUMN IF NOT EXISTS external_reference_id TEXT;

-- Create Index for performance
CREATE INDEX IF NOT EXISTS idx_bookings_customer_id ON public.bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_booking_date ON public.bookings(booking_date);

-- =================================================================
-- 4. Data Migration Scripts (Run these manually)
-- =================================================================

-- A. Migrate Customers
INSERT INTO public.customers (email, full_name, phone, country, created_at)
SELECT DISTINCT 
    customer_email,
    customer_name,
    customer_phone,
    customer_country,
    MIN(created_at) -- Take the date of their first booking
FROM public.bookings
WHERE customer_email IS NOT NULL
ON CONFLICT (email) DO NOTHING;

-- B. Link Bookings to Customers
UPDATE public.bookings b
SET customer_id = c.id
FROM public.customers c
WHERE b.customer_email = c.email;

-- C. Create Initial Payments from existing Deposit data
INSERT INTO public.booking_payments (booking_id, amount, status, payment_method, notes, created_at)
SELECT 
    id,
    deposit_amount,
    'completed',
    'stripe', -- Assumption for historical data
    'Migrated from deposit_amount',
    created_at
FROM public.bookings
WHERE deposit_amount > 0;