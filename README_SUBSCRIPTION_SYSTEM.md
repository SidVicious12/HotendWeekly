# HotendWeekly Subscription System

Complete subscription management system with Stripe integration, usage tracking, and tiered pricing for HotendWeekly AI-powered fashion tools.

## Overview

This implementation provides a full-featured subscription system with:

- **3 Subscription Tiers**: Tinkerer (Free), Creator ($19.99/mo), Professional ($49.99/mo)
- **Usage Tracking**: Daily and monthly limits per tier
- **Stripe Integration**: Secure payment processing and subscription management
- **Database Schema**: Comprehensive Supabase schema for users, tiers, and usage
- **API Routes**: Checkout, webhooks, and usage tracking endpoints
- **Type-Safe**: Full TypeScript support throughout

## File Structure

```
HotendWeekly/
├── src/
│   ├── app/
│   │   └── api/
│   │       ├── create-checkout-session/
│   │       │   └── route.ts                 # Stripe checkout session creation
│   │       └── webhooks/
│   │           └── stripe/
│   │               └── route.ts             # Stripe webhook handler
│   └── lib/
│       ├── stripe.ts                        # Server-side Stripe configuration
│       ├── stripe-client.ts                 # Client-side Stripe configuration
│       └── usage-tracker.ts                 # Usage tracking utilities
├── supabase-migrations.sql                   # Complete database schema
├── SETUP_STRIPE.md                          # Detailed setup guide
├── INTEGRATION_GUIDE.md                     # Integration examples
├── .env.example                             # Environment variables template
└── README_SUBSCRIPTION_SYSTEM.md            # This file
```

## Quick Start

### 1. Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

### 3. Run Database Migration

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to SQL Editor
3. Copy contents of `supabase-migrations.sql`
4. Run the migration

### 4. Configure Stripe

1. Create products in [Stripe Dashboard](https://dashboard.stripe.com/products)
2. Copy product and price IDs to `.env.local`
3. Set up webhook endpoint
4. Update Stripe IDs in database (see `SETUP_STRIPE.md`)

### 5. Test Locally

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Start dev server
npm run dev
```

## Database Schema

### Tables

#### `subscription_tiers`
Defines available subscription plans with features and limits.

**Key Fields**:
- `name`, `slug`, `description`
- `price_monthly`, `price_yearly`
- `monthly_tool_usage_limit`, `daily_tool_usage_limit`
- `max_image_size_mb`, `max_concurrent_jobs`
- `stripe_product_id`, `stripe_price_id_monthly`, `stripe_price_id_yearly`

#### `user_profiles`
Extended user information linked to Supabase Auth.

**Key Fields**:
- `id` (references `auth.users`)
- `subscription_tier_id`
- `stripe_customer_id`, `stripe_subscription_id`
- `subscription_status`, `subscription_start_date`, `subscription_end_date`

#### `tool_usage`
Individual tool usage tracking for analytics and limits.

**Key Fields**:
- `user_id`, `tool_name`, `tool_category`
- `usage_count`, `credits_used`
- `request_metadata`, `response_metadata`
- `status`, `processing_time_ms`

#### `usage_quotas`
Current usage counters reset daily/monthly.

**Key Fields**:
- `user_id`
- `daily_usage`, `monthly_usage`
- `daily_reset_at`, `monthly_reset_at`

#### `subscription_history`
Audit log of subscription changes.

**Key Fields**:
- `user_id`, `subscription_tier_id`
- `action` (created, upgraded, downgraded, canceled, etc.)
- `amount_paid`, `currency`
- `stripe_event_id`

### Functions

#### `check_usage_limit(user_id, tool_name)`
Checks if user has exceeded daily or monthly limits.

**Returns**:
```json
{
  "allowed": true,
  "daily_remaining": 2,
  "monthly_remaining": 8
}
```

#### `increment_usage(user_id, tool_name, credits)`
Increments usage counters and records usage.

#### `handle_new_user()`
Auto-trigger that creates user profile and assigns free tier on signup.

## Subscription Tiers

### Tinkerer (Free)
- **Price**: $0/month
- **Limits**: 3 uses/day, 10 uses/month
- **Image Size**: 5MB max
- **Features**: Basic AI Tools, Community Support

### Creator
- **Price**: $19.99/month or $199/year
- **Limits**: 20 uses/day, 100 uses/month
- **Image Size**: 10MB max
- **Features**: All AI Tools, Priority Processing, Email Support

### Professional
- **Price**: $49.99/month or $499/year
- **Limits**: 100 uses/day, 500 uses/month
- **Image Size**: 25MB max
- **Features**: All AI Tools, API Access, Priority Support

## API Endpoints

### POST `/api/create-checkout-session`

Creates a Stripe checkout session for subscription.

**Request**:
```json
{
  "tier": "creator",
  "interval": "monthly"
}
```

**Response**:
```json
{
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/..."
}
```

### POST `/api/webhooks/stripe`

Handles Stripe webhook events:
- `checkout.session.completed` - New subscription
- `customer.subscription.updated` - Subscription changed
- `customer.subscription.deleted` - Subscription canceled
- `invoice.payment_succeeded` - Payment successful
- `invoice.payment_failed` - Payment failed

## Usage Tracking

### Check Limits

```typescript
import { checkUsageLimit } from '@/lib/usage-tracker';

const limit = await checkUsageLimit(userId, 'virtual-tryon');

if (!limit.allowed) {
  return { error: 'Usage limit exceeded' };
}
```

### Track Usage

```typescript
import { incrementUsage } from '@/lib/usage-tracker';

await incrementUsage(userId, {
  toolName: 'virtual-tryon',
  toolCategory: 'ai_tools',
  processingTimeMs: 1250,
  status: 'success',
});
```

### Helper Function

```typescript
import { withUsageTracking } from '@/lib/usage-tracker';

const result = await withUsageTracking(userId, 'virtual-tryon', async () => {
  return await processVirtualTryon(data);
});

if (!result.success) {
  return { error: result.error };
}
```

## Integration Examples

See `INTEGRATION_GUIDE.md` for detailed examples of:
- Adding usage tracking to existing API routes
- Creating usage stats components
- Displaying usage limits to users
- Handling rate limiting errors
- Testing usage limits

## Security

### Best Practices

✅ **Implemented**:
- Row Level Security (RLS) on all tables
- Webhook signature verification
- Server-side only API keys
- Type-safe Stripe integration
- Secure customer creation

⚠️ **Important**:
- Never commit `.env.local`
- Use `SUPABASE_SERVICE_ROLE_KEY` only server-side
- Verify webhook signatures
- Enable HTTPS in production
- Rotate API keys regularly

### RLS Policies

- Users can only view/update their own profiles
- Users can only view their own usage and quotas
- Anyone can view active subscription tiers
- Server-side operations use service role key to bypass RLS

## Monitoring & Analytics

### Stripe Dashboard

Monitor:
- Subscription growth
- Churn rate
- Revenue metrics
- Failed payments
- Webhook events

### Supabase Analytics

Track:
- User signups
- Tool usage patterns
- Popular features
- Conversion rates
- Upgrade/downgrade trends

### Database Queries

```sql
-- Monthly revenue
SELECT
  DATE_TRUNC('month', created_at) as month,
  SUM(amount_paid) as revenue,
  COUNT(*) as transactions
FROM subscription_history
WHERE action IN ('created', 'renewed')
GROUP BY month
ORDER BY month DESC;

-- Tool usage by tier
SELECT
  st.name as tier,
  tu.tool_name,
  COUNT(*) as usage_count
FROM tool_usage tu
JOIN user_profiles up ON up.id = tu.user_id
JOIN subscription_tiers st ON st.id = up.subscription_tier_id
GROUP BY st.name, tu.tool_name
ORDER BY usage_count DESC;

-- Daily active users
SELECT
  DATE(created_at) as date,
  COUNT(DISTINCT user_id) as active_users
FROM tool_usage
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY date
ORDER BY date DESC;
```

## Testing

### Test Cards (Stripe)

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires Auth**: `4000 0025 0000 3155`

### Local Testing

```bash
# Start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Test checkout flow
# 1. Go to http://localhost:3000/pricing
# 2. Click upgrade button
# 3. Use test card: 4242 4242 4242 4242
# 4. Complete checkout
# 5. Verify webhook in Stripe CLI output
# 6. Check database for updated subscription
```

### Reset Quotas (Testing)

```sql
-- Reset user's daily usage
UPDATE usage_quotas SET daily_usage = 0 WHERE user_id = 'uuid';

-- Reset user's monthly usage
UPDATE usage_quotas SET monthly_usage = 0 WHERE user_id = 'uuid';
```

## Deployment Checklist

- [ ] Set all environment variables in production
- [ ] Use production Stripe keys (not test keys)
- [ ] Configure production webhook endpoint
- [ ] Enable Stripe Customer Portal
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure scheduled jobs for quota resets
- [ ] Test payment flow end-to-end
- [ ] Monitor webhook events
- [ ] Set up backup/recovery procedures
- [ ] Document customer support procedures

## Documentation

- **`SETUP_STRIPE.md`**: Complete setup instructions
- **`INTEGRATION_GUIDE.md`**: Code integration examples
- **`.env.example`**: Environment variables template
- **`supabase-migrations.sql`**: Database schema with comments

## Next Steps

1. ✅ Database schema created
2. ✅ Stripe integration implemented
3. ✅ API routes created
4. ✅ Usage tracking utilities built
5. ⬜ Integrate usage tracking into existing tools
6. ⬜ Create user dashboard with usage stats
7. ⬜ Set up scheduled jobs for quota resets
8. ⬜ Add upgrade prompts in UI
9. ⬜ Test payment flow thoroughly
10. ⬜ Deploy to production

## Support Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Stripe Testing Guide](https://stripe.com/docs/testing)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)

## Troubleshooting

### Common Issues

**Webhook not received**:
- Check webhook endpoint is publicly accessible
- Verify signing secret is correct
- Review Stripe Dashboard → Webhooks → Event logs

**User profile not created**:
- Check `handle_new_user()` trigger exists
- Verify RLS policies allow inserts
- Review Supabase logs

**Usage limits not working**:
- Verify functions exist in Supabase
- Check if usage_quotas has user entry
- Review function permissions

See `SETUP_STRIPE.md` for detailed troubleshooting.

---

**Version**: 1.0.0
**Last Updated**: 2025-11-21
**Author**: HotendWeekly Development Team
