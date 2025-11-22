# Production Deployment Checklist

Quick reference for deploying HotendWeekly to production.

## Pre-Deployment (5 min)

- [ ] Production Supabase project created
- [ ] Stripe account in Live Mode
- [ ] All API keys ready (Replicate, OpenAI, Remove.bg)
- [ ] Vercel account ready

---

## Environment Variables (10 min)

### Supabase (3 vars)
- [ ] `NEXT_PUBLIC_SUPABASE_URL`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`

### Stripe (9 vars)
- [ ] `STRIPE_SECRET_KEY` (sk_live_...)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (pk_live_...)
- [ ] `STRIPE_WEBHOOK_SECRET` (get after webhook setup)
- [ ] `NEXT_PUBLIC_STRIPE_TINKERER_PRODUCT_ID`
- [ ] `NEXT_PUBLIC_STRIPE_CREATOR_PRODUCT_ID`
- [ ] `NEXT_PUBLIC_STRIPE_PROFESSIONAL_PRODUCT_ID`
- [ ] `NEXT_PUBLIC_STRIPE_CREATOR_MONTHLY_PRICE_ID`
- [ ] `NEXT_PUBLIC_STRIPE_CREATOR_YEARLY_PRICE_ID`
- [ ] `NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID`
- [ ] `NEXT_PUBLIC_STRIPE_PROFESSIONAL_YEARLY_PRICE_ID`

### API Keys (3 vars)
- [ ] `REPLICATE_API_TOKEN`
- [ ] `OPENAI_API_KEY`
- [ ] `NEXT_PUBLIC_REMOVEBG_API_KEY`

### Site Config (1 var)
- [ ] `NEXT_PUBLIC_SITE_URL` (your Vercel URL)

---

## Database Migration (5 min)

- [ ] Open production Supabase SQL Editor
- [ ] Copy `supabase-migrations.sql` contents
- [ ] Paste and execute
- [ ] Verify tables created in Table Editor
- [ ] Seed subscription tiers with Stripe IDs

---

## Vercel Deployment (5 min)

```bash
# Login
vercel login

# Deploy
vercel

# Add env vars in Vercel Dashboard
# Then deploy to production
vercel --prod
```

- [ ] Project deployed
- [ ] All environment variables added in Vercel
- [ ] Production URL copied

---

## Stripe Webhook (5 min)

- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://your-app.vercel.app/api/webhooks/stripe`
- [ ] Select events:
  - [ ] `checkout.session.completed`
  - [ ] `customer.subscription.updated`
  - [ ] `customer.subscription.deleted`
  - [ ] `invoice.payment_succeeded`
  - [ ] `invoice.payment_failed`
- [ ] Copy webhook secret
- [ ] Update `STRIPE_WEBHOOK_SECRET` in Vercel
- [ ] Redeploy: `vercel --prod`

---

## Testing (5 min)

- [ ] Test signup: `/auth/signup`
- [ ] Test login: `/auth/login`
- [ ] Test dashboard: `/dashboard`
- [ ] Test pricing page: `/pricing`
- [ ] Test subscription upgrade (use test card: 4242 4242 4242 4242)
- [ ] Test usage tracking (use any AI tool)
- [ ] Test billing portal (click "Manage Billing")

---

## Post-Deployment

- [ ] Monitor Vercel logs for errors
- [ ] Check Stripe webhook deliveries
- [ ] Verify database connections
- [ ] Test all AI tools
- [ ] Set up custom domain (optional)

---

## Quick Commands

```bash
# Deploy to production
vercel --prod

# View production logs
vercel logs --prod

# Check deployment status
vercel ls

# Remove deployment
vercel rm hotend-weekly
```

---

## Emergency Rollback

If something goes wrong:

```bash
# List deployments
vercel ls

# Promote previous deployment
vercel promote <deployment-url>
```

---

## Common Issues

**Build fails:**
- Run `npm run build` locally first
- Check TypeScript errors
- Verify all dependencies installed

**Webhook not working:**
- Check Stripe Dashboard → Webhooks → Recent deliveries
- Verify webhook secret matches
- Check Vercel logs: `vercel logs --prod`

**Database errors:**
- Verify Supabase credentials
- Check RLS policies
- Ensure service role key is set

---

**Total Time: ~30 minutes**

See `DEPLOYMENT_GUIDE.md` for detailed instructions.
