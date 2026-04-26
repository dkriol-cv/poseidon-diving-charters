# Database Migration Plan

This document outlines the steps to transition from the current denormalized schema to a robust, normalized relational structure.

## Phase 1: Customer Normalization

**Goal:** Extract customer data from `bookings` into a dedicated `customers` table to enable CRM features and history tracking.

1.  **Create Table:** Create `customers` table with `id`, `email`, `full_name`, `phone`, `country`, `created_at`.
2.  **Data Migration:**
    *   Select distinct `customer_email` from `bookings`.
    *   Insert these unique profiles into `customers`.
    *   Handle duplicates (e.g., same email, different phone) by prioritizing the most recent booking's data.
3.  **Schema Update:**
    *   Add `customer_id` FK to `bookings`.
4.  **Link Records:**
    *   Update `bookings.customer_id` by matching `bookings.customer_email` to `customers.email`.
5.  **Cleanup (Optional/Later):**
    *   Make `customer_email` in `bookings` nullable or remove it (keep for historical redundancy if desired).

## Phase 2: Payment Tracking

**Goal:** Enable detailed transaction history and integration with payment gateways.

1.  **Create Table:** `booking_payments`
    *   `id` (uuid)
    *   `booking_id` (fk -> bookings.id)
    *   `amount` (numeric)
    *   `currency` (text, default 'EUR')
    *   `payment_method` (text: 'stripe', 'cash', 'transfer')
    *   `transaction_id` (text: e.g., Stripe PI ID)
    *   `status` (text: 'succeeded', 'pending', 'refunded')
    *   `payment_date` (timestamptz)
2.  **Data Migration:**
    *   Create an initial "Deposit" payment record for every existing booking where `deposit_amount > 0`.
    *   Create a "Balance" payment record for fully paid bookings.

## Phase 3: External Bookings Unification

**Goal:** Prevent double bookings and simplify availability checks.

1.  **Schema Update:**
    *   Add `source` column to `bookings` (default 'website').
    *   Add `external_reference_id` to `bookings`.
2.  **Migration:**
    *   Move records from `external_bookings` to `bookings`, mapping the fields accordingly.
    *   Set `source` to 'viator', 'tripadvisor', etc.
3.  **Deprecation:**
    *   Drop `external_bookings` table after verification.

## Rollback Plan

*   Keep the original columns in `bookings` (`customer_email`, etc.) for at least 30 days after migration.
*   Ensure all new code writes to *both* the new tables and old columns (dual-write) during the transition period if doing a live migration, or use triggers to sync.