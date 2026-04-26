# Stripe Integration & Reservation System Guide

## Overview
This document details the payment integration using Supabase Edge Functions, Stripe Checkout, and Webhooks. The system handles secure price calculation on the server, concurrency management via slot reservations, and asynchronous payment confirmation. The model is now set to **100% full payment** at booking time.

## 1. Architecture Flow

1.  **Client (BookingPage)**: 
    - Collects user choices (Date, Slot, Guests, Extras).
    - Creates a `pending` booking record in Supabase (to get an ID).
    - Calls `stripe-checkout` Edge Function with IDs only (no prices).

2.  **Edge Function (`stripe-checkout`)**:
    - **Fetches** official prices from `time_slots` and `extras` tables.
    - **Checks Availability**: `Capacity - Reserved Count`.
    - **Reserves Slot**: Inserts into `slot_reservations` with a 15-minute expiry.
    - **Calculates Totals**: `Total = Slot + Extras`. **Charges 100%**.
    - **Creates PaymentIntent**: Using `bookingId` as idempotency key.
    - **Creates Checkout Session**: Returns `sessionId` to client.

3.  **Client Redirect**:
    - Redirects user to Stripe hosted checkout page using `sessionId`.

4.  **Stripe**:
    - User pays the full amount. Stripe sends webhook events (`checkout.session.completed`).

5.  **Edge Function (`stripe-webhook`)**:
    - Verifies signature.
    - Updates `external_bookings` (status: `confirmed`).
    - Updates `slot_reservations` (status: `confirmed`).
    - Updates `booking_payments` (status: `paid`).

6.  **Cron Job (`cleanup-expired-reservations`)**:
    - Runs every 5 mins.
    - Deletes `reserved` slots that have passed `expires_at` without payment.

## 2. Database Schema

### `slot_reservations`
Manages concurrency.
- `id`: UUID
- `slot_id`: FK to `time_slots`
- `status`: 'reserved' | 'confirmed'
- `expires_at`: Timestamp (auto-deleted if expired)

### `booking_payments`
Records financial transaction state.
- `stripe_payment_intent_id`: Unique key from Stripe.
- `amount`: Full amount paid.
- `status`: 'pending' | 'paid'

## 3. Environment Variables
Required in Supabase Dashboard (Edge Functions):
- `STRIPE_SECRET_KEY`: `sk_...` (From Stripe Dashboard)
- `STRIPE_WEBHOOK_SECRET`: `whsec_...` (From Stripe Webhooks section)
- `SUPABASE_URL`: Auto-injected or manually set.
- `SUPABASE_SERVICE_ROLE_KEY`: Auto-injected or manually set.

## 4. RLS Policies
- **Public**: Can read `slot_reservations` (for availability check) and `time_slots`.
- **Service Role**: Full access to all tables (required for Edge Functions to write).
- **Users**: Can read their own booking data.

## 5. Error Handling
- **Availability**: If slot fills up while user is booking, Edge Function throws `400` with "Slot sem capacidade".
- **Payment Failure**: Stripe handles retries on the checkout page.
- **Webhook Failures**: Stripe retries webhooks for up to 3 days. Our logic is idempotent.

## 6. Testing
1.  **Local**: Use `supabase functions serve`.
2.  **Stripe CLI**: `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`.
3.  **Production**: Deploy functions with `supabase functions deploy`.