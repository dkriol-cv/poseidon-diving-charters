# Security Checklist & Best Practices

## 1. Input Validation
- **Client-Side:** Immediate feedback using Regex for email/phone.
- **Server-Side:** Strict type checking and Regex validation in Edge Functions (`validate-booking`).
- **Constraints:** Max character limits enforced (e.g., 500 chars for notes) to prevent payload attacks.

## 2. Data Sanitization
- **Library:** `isomorphic-dompurify` used in all Edge Functions handling text.
- **Strategy:** HTML tags are stripped from all user inputs (names, messages, notes) before database insertion to prevent XSS (Cross-Site Scripting).

## 3. Database Security (RLS)
- **Principle:** Deny all by default.
- **Policies:** 
  - `public` can read config/slots.
  - `authenticated` users can read their own data.
  - `service_role` (Edge Functions) has full access where needed.
  - `admin` role has management access.

## 4. Payment Security
- **Stripe:** All calculations (totals, deposits) happen on the **Server** (`stripe-checkout`). Client only sends IDs.
- **Webhooks:** Signature verification (`stripe-signature`) ensures events come from Stripe.
- **Idempotency:** Payment Intents use `bookingId` as idempotency keys to prevent double charges.

## 5. Reservation Logic
- **Concurrency:** `slot_reservations` table prevents overbooking by locking spots for 15 minutes.
- **Cleanup:** Cron job automatically releases unpaid spots.

## 6. Spam Protection
- **Honeypot:** Hidden fields in forms to trap bots.
- **Rate Limiting:** (Recommended future step) via Supabase generic rate limits.