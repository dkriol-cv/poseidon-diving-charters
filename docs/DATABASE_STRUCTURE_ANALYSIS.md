# Database Structure Analysis & Report

## 1. Current Table Structure Analysis

### Core Booking Tables

**1. `bookings`**
The central table for reservation management. Currently acts as a monolithic table storing booking details, customer information, and payment status.
*   **Primary Key:** `id` (uuid)
*   **Service Details:** `service_type` (text), `service_option` (text), `booking_date` (date), `departure_time` (time), `return_time` (time), `num_guests` (integer), `special_requests` (text), `extras` (jsonb).
*   **Customer Data (Denormalized):** `customer_name` (text), `customer_email` (text), `customer_phone` (text), `customer_country` (text).
*   **Financials:** `service_price` (numeric), `extras_total` (numeric), `total_price` (numeric), `deposit_amount` (numeric), `remaining_amount` (numeric).
*   **Status/Meta:** `status` (text), `internal_notes` (text), `created_at` (timestamptz), `updated_at` (timestamptz).
*   **Foreign Keys:** None.

**2. `external_bookings`**
Stores bookings imported from external platforms (TripAdvisor, Viator, etc.).
*   **Primary Key:** `id` (uuid)
*   **Columns:** `source` (text), `external_id` (text), `service_type` (text), `booking_date` (date), `departure_time` (time), `num_guests` (integer), `status` (text), `synced_at` (timestamptz).
*   **Foreign Keys:** None. *Critical missing link to main `bookings` table or a unified calendar.*

**3. `time_slots`**
Defines available inventory/products.
*   **Columns:** `service_type`, `service_option`, `departure_time`, `base_price`, `max_capacity`, `days_of_week`.

### Missing Tables (Gaps Identified)
*   **`customers`**: Does not exist. Customer data is repeated in every booking row.
*   **`payments` / `transactions`**: Does not exist. Payments are tracked only as snapshot totals (`deposit_amount`, `remaining_amount`) in the `bookings` table. No history of partial payments or refunds.
*   **`booking_details`**: Not strictly necessary if `extras` JSONB is sufficient, but normalized lines items are often better for reporting.

---

## 2. Customer Data Storage Investigation

*   **Location:** `public.bookings` table.
*   **Fields:** `customer_name`, `customer_email`, `customer_phone`, `customer_country`.
*   **Issue:** No unique Customer ID. If "John Doe" books twice, he appears as two completely unrelated records. We cannot easily see "Customer Lifetime Value" or "Past Bookings".
*   **Relationship:** 1:1 (Embedded). A booking implies a customer, but a customer does not exist independently of a booking.

---

## 3. Payment Data Investigation

*   **Location:** `public.bookings` table.
*   **Fields:**
    *   `service_price` (Base cost)
    *   `extras_total` (Add-ons cost)
    *   `total_price` (Sum)
    *   `deposit_amount` (Amount paid upfront)
    *   `remaining_amount` (Amount due)
*   **Payment Gateways:** No evidence of Stripe/PayPal transaction IDs stored in the schema.
*   **Risks:**
    *   Cannot track *when* the deposit was paid vs when the remainder was paid.
    *   Cannot store transaction references (e.g., `pi_12345`) for refunds.
    *   Cannot handle split payments (e.g., Guest 1 pays half, Guest 2 pays half).

---

## 4. External Bookings Structure

*   **Current Model:** Standalone table `external_bookings`.
*   **Isolation:** These records are not linked to the main availability logic or customer database.
*   **Columns:** Minimal data (Date, Time, Guests).
*   **Recommendations:** Should ideally be merged into the main `bookings` table with a `source` column (e.g., 'internal', 'viator', 'tripadvisor') or kept separate but synced to a common `availability` table.

---

## 5. Edge Functions

Based on the environment, the following functions exist.
*   **URLs:** `https://[project-ref].supabase.co/functions/v1/[function-name]`
*   **Identified Functions:**
    1.  `generate-ical`: Likely generates .ics files for calendar syncing.
    2.  `send-booking-confirmation`: Email trigger.
    3.  `send-cancellation-email`: Email trigger.
    4.  `contact-submit`: Handles contact form submissions.
    5.  `resend-notification`: Manual trigger for emails.

---

## 6. Recommendations

1.  **Normalize Customers:** Create a `customers` table.
    *   Migrate distinct email/phone pairs from `bookings`.
    *   Replace string fields in `bookings` with `customer_id`.
2.  **Normalize Payments:** Create `booking_payments` table.
    *   Columns: `booking_id`, `amount`, `currency`, `status` (pending, succeeded), `provider` (stripe, manual), `provider_transaction_id`, `created_at`.
3.  **Unified Booking Source:** Add `source` and `external_reference_id` columns to the main `bookings` table and migrate `external_bookings` into it, OR ensure the application layer checks both tables for availability.