# Stripe & Supabase Setup Guide

Complete setup guide for Stripe integration and Supabase database configuration for HotendWeekly subscription management.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Database Setup](#database-setup)
4. [Stripe Configuration](#stripe-configuration)
5. [Testing](#testing)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- Node.js 20.x or higher
- Supabase account and project
- Stripe account
- HotendWeekly repository cloned locally

---

## Environment Variables

### Required Environment Variables

Add these to your `.env.local` file (create if it doesn't exist):

```bash
# Supabase Configuration (already configured)
NEXT_PUBLIC_SUPABASE_URL=https://dsocdvkphraiyxoryaka.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx

# Stripe Price IDs (create these in Stripe Dashboard)
# Tinkerer Tier (Free)
NEXT_PUBLIC_STRIPE_TINKERER_PRODUCT_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_TINKERER_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_TINKERER_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx

# Creator Tier
NEXT_PUBLIC_STRIPE_CREATOR_PRODUCT_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_CREATOR_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx

# Professional Tier
NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRODUCT_ID=prod_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=price_xxxxxxxxxxxxx
NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=price_xxxxxxxxxxxxx

# Application URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Where to Find These Keys

#### Supabase Keys

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - `URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

#### Stripe Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** → **API keys**
3. Copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY` (keep this secret!)

---

## Database Setup

### Step 1: Run Database Migration

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **SQL Editor** in the sidebar
4. Click **New query**
5. Copy the entire contents of `supabase-migrations.sql`
6. Paste into the SQL editor
7. Click **Run** (bottom right)

This will create:
- `subscription_tiers` table
- `user_profiles` table
- `tool_usage` table
- `usage_quotas` table
- `subscription_history` table
- All necessary indexes, triggers, and RLS policies
- Initial subscription tier data

### Step 2: Verify Database Setup

Run this query in the SQL Editor to verify:

```sql
-- Check if tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'subscription_tiers',
  'user_profiles',
  'tool_usage',
  'usage_quotas',
  'subscription_history'
);

-- Check subscription tiers
SELECT * FROM subscription_tiers ORDER BY display_order;
```

You should see all 5 tables and 3 subscription tiers (Tinkerer, Creator, Professional).

---

## Stripe Configuration

### Step 1: Create Products in Stripe

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Products** → **Add product**

Create three products:

#### Tinkerer (Free Tier)

- **Name**: Tinkerer
- **Description**: Perfect for getting started with AI-powered fashion tools
- **Pricing**:
  - Monthly: $0.00
  - Yearly: $0.00
- **Features**: Basic AI Tools, 3 uses per day, 5MB image limit
- Copy the **Product ID** and **Price IDs**

#### Creator

- **Name**: Creator
- **Description**: For fashion enthusiasts and content creators
- **Pricing**:
  - Monthly: $19.99/month (recurring)
  - Yearly: $199.00/year (recurring)
- **Features**: All AI Tools, 20 uses per day, 10MB image limit, Priority Processing
- Copy the **Product ID** and **Price IDs**

#### Professional

- **Name**: Professional
- **Description**: For businesses and professional designers
- **Pricing**:
  - Monthly: $49.99/month (recurring)
  - Yearly: $499.00/year (recurring)
- **Features**: All AI Tools, Unlimited daily use, 25MB image limit, API Access
- Copy the **Product ID** and **Price IDs**

### Step 2: Configure Webhook Endpoint

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. **Endpoint URL**: `https://your-domain.com/api/webhooks/stripe`
   - For local testing: Use [Stripe CLI](https://stripe.com/docs/stripe-cli)
4. **Events to send**: Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### Step 3: Update Environment Variables

Add all the Product IDs and Price IDs you copied to your `.env.local` file.

### Step 4: Update Database with Stripe IDs

Run this SQL in Supabase to link Stripe products to database tiers:

```sql
-- Update Tinkerer tier
UPDATE subscription_tiers
SET
  stripe_product_id = 'prod_xxxxxxxxxxxxx',
  stripe_price_id_monthly = 'price_xxxxxxxxxxxxx',
  stripe_price_id_yearly = 'price_xxxxxxxxxxxxx'
WHERE slug = 'tinkerer';

-- Update Creator tier
UPDATE subscription_tiers
SET
  stripe_product_id = 'prod_xxxxxxxxxxxxx',
  stripe_price_id_monthly = 'price_xxxxxxxxxxxxx',
  stripe_price_id_yearly = 'price_xxxxxxxxxxxxx'
WHERE slug = 'creator';

-- Update Professional tier
UPDATE subscription_tiers
SET
  stripe_product_id = 'prod_xxxxxxxxxxxxx',
  stripe_price_id_monthly = 'price_xxxxxxxxxxxxx',
  stripe_price_id_yearly = 'price_xxxxxxxxxxxxx'
WHERE slug = 'professional';
```

---

## Testing

### Local Development Testing

#### Step 1: Install Stripe CLI

```bash
brew install stripe/stripe-cli/stripe
```

#### Step 2: Login to Stripe

```bash
stripe login
```

#### Step 3: Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output a webhook signing secret. Update `STRIPE_WEBHOOK_SECRET` in `.env.local`.

#### Step 4: Start Development Server

```bash
npm run dev
```

#### Step 5: Test Checkout Flow

1. Navigate to `http://localhost:3000/pricing`
2. Click **Start Creating** for Creator tier
3. Use Stripe test card: `4242 4242 4242 4242`
4. Expiry: Any future date
5. CVC: Any 3 digits
6. Complete checkout
7. Verify webhook events in Stripe CLI output
8. Check database for updated user profile

### Test Cards

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

---

## Production Deployment

### Step 1: Update Environment Variables

In your production environment (Vercel, Netlify, etc.):

1. Use production Stripe keys (not test keys)
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain
3. Configure all other environment variables

### Step 2: Update Stripe Webhook

1. Go to Stripe Dashboard → **Webhooks**
2. Add production endpoint: `https://your-production-domain.com/api/webhooks/stripe`
3. Select the same events as in testing
4. Copy the new **Signing secret** and update production env vars

### Step 3: Enable Billing Portal

1. Go to **Settings** → **Billing**
2. Enable **Customer portal**
3. Configure portal settings:
   - Allow customers to update payment methods
   - Allow customers to cancel subscriptions
   - Set cancellation policy

---

## API Usage Examples

### Check Usage Limits

```typescript
import { checkUsageLimit } from '@/lib/usage-tracker';

const limit = await checkUsageLimit(userId, 'virtual-tryon');

if (!limit.allowed) {
  return { error: `Usage limit exceeded: ${limit.reason}` };
}
```

### Track Tool Usage

```typescript
import { incrementUsage } from '@/lib/usage-tracker';

await incrementUsage(userId, {
  toolName: 'virtual-tryon',
  toolCategory: 'ai_tools',
  processingTimeMs: 1250,
  status: 'success',
});
```

### Create Checkout Session (Client-Side)

```typescript
const response = await fetch('/api/create-checkout-session', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    tier: 'creator',
    interval: 'monthly',
  }),
});

const { url } = await response.json();
window.location.href = url;
```

---

## Database Schema Overview

### Tables

1. **subscription_tiers**: Available subscription plans
2. **user_profiles**: Extended user information + subscription details
3. **tool_usage**: Individual tool usage tracking
4. **usage_quotas**: Current usage counters (daily/monthly)
5. **subscription_history**: Audit log of subscription changes

### Key Functions

- `check_usage_limit(user_id, tool_name)`: Check if user can use a tool
- `increment_usage(user_id, tool_name, credits)`: Record tool usage
- `handle_new_user()`: Auto-trigger on user signup

### Views

- `user_subscription_details`: Convenient view of user subscription + usage

---

## Troubleshooting

### Issue: Webhook Events Not Received

**Solution**:
- Verify webhook endpoint is publicly accessible
- Check webhook signing secret is correct
- Review webhook logs in Stripe Dashboard
- For local testing, ensure Stripe CLI is running

### Issue: User Profile Not Created

**Solution**:
- Check if `handle_new_user()` trigger exists
- Verify RLS policies are configured correctly
- Check Supabase logs for errors

### Issue: Usage Limits Not Working

**Solution**:
- Verify `check_usage_limit()` function exists
- Check if usage_quotas table has entry for user
- Review function permissions in Supabase

### Issue: Stripe Customer ID Not Saving

**Solution**:
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set
- Check RLS policies allow updates
- Review API route logs for errors

---

## Security Checklist

- [ ] Never commit `.env.local` to version control
- [ ] Use service role key only in server-side code
- [ ] Verify webhook signatures on all webhook events
- [ ] Enable RLS on all Supabase tables
- [ ] Use HTTPS in production
- [ ] Regularly rotate API keys
- [ ] Monitor webhook event logs
- [ ] Set up error tracking (Sentry, LogRocket, etc.)

---

## Support & Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)

---

## Next Steps

1. ✅ Complete environment variable configuration
2. ✅ Run database migration
3. ✅ Create Stripe products and prices
4. ✅ Configure webhooks
5. ✅ Test checkout flow locally
6. ⬜ Integrate usage tracking into existing tools
7. ⬜ Create dashboard for users to view usage
8. ⬜ Set up scheduled jobs for quota resets
9. ⬜ Deploy to production
10. ⬜ Monitor webhook events and usage patterns

---

**Last Updated**: 2025-11-21
**Version**: 1.0.0
