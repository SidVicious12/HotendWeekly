# Production Deployment Guide

Complete guide to deploy HotendWeekly to production.

## Prerequisites

- [ ] Vercel account (free tier works)
- [ ] Production Supabase project
- [ ] Stripe account with live mode enabled
- [ ] All API keys ready (Replicate, OpenAI, Remove.bg)

---

## Step 1: Prepare Production Environment Variables

### 1.1 Supabase Production Setup

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or use existing production project
3. Go to **Settings** → **API**
4. Copy these values:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 1.2 Stripe Production Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. **Switch to Live Mode** (toggle in top-right)
3. Go to **Developers** → **API keys**
4. Copy:
   - `Publishable key` → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - `Secret key` → `STRIPE_SECRET_KEY`

### 1.3 Create Stripe Products & Prices

In Stripe Dashboard (Live Mode):

1. Go to **Products** → **Add product**
2. Create 3 products:

**Tinkerer (Free)**
- Name: Tinkerer
- Price: $0/month
- Copy Product ID → `NEXT_PUBLIC_STRIPE_TINKERER_PRODUCT_ID`

**Creator**
- Name: Creator
- Monthly Price: $19.99/month → Copy Price ID → `NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PRICE_ID`
- Yearly Price: $199/year → Copy Price ID → `NEXT_PUBLIC_STRIPE_CREATOR_YEARLY_PRICE_ID`
- Copy Product ID → `NEXT_PUBLIC_STRIPE_CREATOR_PRODUCT_ID`

**Professional**
- Name: Professional
- Monthly Price: $49.99/month → Copy Price ID → `NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID`
- Yearly Price: $499/year → Copy Price ID → `NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID`
- Copy Product ID → `NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRODUCT_ID`

### 1.4 Complete Environment Variables List

Create a `.env.production` file with these values:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe (Live Mode)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (will get this in Step 3)

# Stripe Product IDs
NEXT_PUBLIC_STRIPE_TINKERER_PRODUCT_ID=prod_...
NEXT_PUBLIC_STRIPE_CREATOR_PRODUCT_ID=prod_...
NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRODUCT_ID=prod_...

# Stripe Price IDs
NEXT_PUBLIC_STRIPE_TINKERER_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_TINKERER_YEARLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_CREATOR_YEARLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID=price_...

# API Keys
REPLICATE_API_TOKEN=r8_...
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_REMOVEBG_API_KEY=...

# Site URL (will be your Vercel URL)
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

---

## Step 2: Run Migration on Production Database

### 2.1 Open Supabase SQL Editor

1. Go to your **production** Supabase project
2. Click **SQL Editor** in left sidebar
3. Click **New query**

### 2.2 Execute Migration

1. Open `supabase-migrations.sql` in your local project
2. Copy the entire contents
3. Paste into Supabase SQL Editor
4. Click **Run**
5. Verify success (should see "Success. No rows returned")

### 2.3 Verify Tables Created

1. Go to **Table Editor** in Supabase
2. Confirm these tables exist:
   - `subscription_tiers`
   - `user_profiles`
   - `tool_usage`
   - `usage_quotas`
   - `subscription_history`

### 2.4 Seed Subscription Tiers

Run this SQL in Supabase SQL Editor:

```sql
-- Insert subscription tiers with your Stripe IDs
INSERT INTO subscription_tiers (name, slug, description, price_monthly, price_yearly, stripe_price_id_monthly, stripe_price_id_yearly, stripe_product_id, daily_tool_usage_limit, monthly_tool_usage_limit, max_image_size_mb, max_concurrent_jobs, is_active)
VALUES
  -- Tinkerer (Free)
  ('Tinkerer', 'tinkerer', 'Perfect for getting started', 0.00, 0.00, 'price_free_monthly', 'price_free_yearly', 'prod_tinkerer', 3, 10, 5, 1, true),
  
  -- Creator
  ('Creator', 'creator', 'For fashion enthusiasts', 19.99, 199.00, 'price_XXX', 'price_YYY', 'prod_creator', 20, 100, 10, 3, true),
  
  -- Professional
  ('Professional', 'professional', 'For businesses', 49.99, 499.00, 'price_XXX', 'price_YYY', 'prod_professional', 100, 500, 25, 10, true);
```

**Replace `price_XXX`, `price_YYY`, and `prod_XXX` with your actual Stripe IDs from Step 1.3**

---

## Step 3: Deploy to Vercel

### 3.1 Install Vercel CLI (if not installed)

```bash
npm install -g vercel
```

### 3.2 Login to Vercel

```bash
vercel login
```

### 3.3 Deploy

```bash
# From project root
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? hotend-weekly
# - Directory? ./
# - Override settings? No
```

### 3.4 Add Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add ALL variables from your `.env.production` file
5. Set environment to: **Production**

### 3.5 Deploy to Production

```bash
vercel --prod
```

Copy your production URL (e.g., `https://hotend-weekly.vercel.app`)

---

## Step 4: Configure Stripe Production Webhook

### 4.1 Create Webhook Endpoint

1. Go to [Stripe Dashboard](https://dashboard.stripe.com) (Live Mode)
2. Go to **Developers** → **Webhooks**
3. Click **Add endpoint**
4. Enter URL: `https://your-app.vercel.app/api/webhooks/stripe`
5. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
6. Click **Add endpoint**

### 4.2 Get Webhook Secret

1. Click on your newly created webhook
2. Click **Reveal** under "Signing secret"
3. Copy the secret (starts with `whsec_`)

### 4.3 Update Vercel Environment Variable

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Find `STRIPE_WEBHOOK_SECRET`
3. Update with the new webhook secret
4. Redeploy:
   ```bash
   vercel --prod
   ```

---

## Step 5: Test Production Deployment

### 5.1 Test Authentication

1. Go to `https://your-app.vercel.app/auth/signup`
2. Create a test account
3. Verify email confirmation (if enabled)
4. Check Supabase → Authentication → Users

### 5.2 Test Subscription Flow

1. Sign in to your app
2. Go to `/pricing`
3. Click "Upgrade" on Creator plan
4. Complete test payment with Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
5. Verify redirect to dashboard
6. Check Stripe Dashboard → Payments

### 5.3 Test Usage Tracking

1. Go to dashboard
2. Use any AI tool (e.g., Remove Background)
3. Check usage stats update
4. Verify in Supabase → `tool_usage` table

### 5.4 Test Billing Portal

1. From dashboard, click "Manage Billing"
2. Verify Stripe Customer Portal opens
3. Test updating payment method
4. Test canceling subscription

---

## Step 6: Post-Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Database migration completed successfully
- [ ] Subscription tiers seeded with correct Stripe IDs
- [ ] Stripe webhook configured and verified
- [ ] Test user signup works
- [ ] Test subscription upgrade works
- [ ] Test usage tracking works
- [ ] Test billing portal works
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Vercel)

---

## Troubleshooting

### Webhook Not Receiving Events

1. Check Stripe Dashboard → Webhooks → Your endpoint → Recent deliveries
2. Verify URL is correct: `https://your-app.vercel.app/api/webhooks/stripe`
3. Check Vercel logs: `vercel logs --prod`
4. Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard

### Database Connection Issues

1. Verify Supabase URL and keys are correct
2. Check Supabase → Settings → API
3. Ensure service role key is set (not just anon key)
4. Check RLS policies are not blocking operations

### Build Failures

1. Check Vercel build logs
2. Verify all dependencies in `package.json`
3. Run `npm run build` locally first
4. Check for TypeScript errors

### API Rate Limits

- Replicate: ~$0.024 per 50 predictions
- OpenAI: Check usage in OpenAI Dashboard
- Remove.bg: 50 calls/month on free tier

---

## Monitoring & Maintenance

### Vercel Analytics

- Enable in Vercel Dashboard → Analytics
- Monitor traffic, performance, errors

### Supabase Monitoring

- Dashboard → Database → Usage
- Monitor active connections, storage

### Stripe Monitoring

- Dashboard → Payments
- Set up email notifications for failed payments

---

## Next Steps

1. **Custom Domain**: Add your domain in Vercel → Settings → Domains
2. **Email Templates**: Customize Supabase auth emails
3. **Error Tracking**: Add Sentry or similar
4. **Analytics**: Add Google Analytics or Plausible
5. **Backup Strategy**: Set up automated database backups

---

## Support

- Vercel Docs: https://vercel.com/docs
- Supabase Docs: https://supabase.com/docs
- Stripe Docs: https://stripe.com/docs
- Next.js Docs: https://nextjs.org/docs

---

**Deployment Complete! 🚀**

Your app is now live at: `https://your-app.vercel.app`
