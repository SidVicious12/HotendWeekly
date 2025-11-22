# Testing Guide - HotendWeekly

Complete guide for testing your application in development and production.

---

## 🧪 Development Testing (Local)

### **1. Start Dev Server**

```bash
npm run dev
# Server runs on http://localhost:3001
```

### **2. Create Test Accounts**

Sign up through your app with these test emails:

```
Test User 1 (Free Tier):
Email: test.tinkerer@hotendweekly.com
Password: TestPass123!

Test User 2 (Creator):
Email: test.creator@hotendweekly.com
Password: TestPass123!

Test User 3 (Professional):
Email: test.professional@hotendweekly.com
Password: TestPass123!
```

### **3. Test Usage Tracking**

After signing in, test each AI tool:

**Virtual Try-On:**
- Upload a garment image
- Upload a model image
- Submit and wait for result
- Check dashboard - usage should increment

**Remove Background:**
- Upload any image
- Process and download
- Verify usage counter updates

**Flux Generate:**
- Enter a product description
- Generate image
- Check usage stats

**Simplify Image:**
- Upload complex image
- Simplify and download
- Confirm usage recorded

### **4. Test Usage Limits**

**For Free Tier (Tinkerer):**
- Daily limit: 3 uses
- Monthly limit: 10 uses

**Test scenario:**
1. Use any tool 3 times in a row
2. On 4th attempt, should see "Usage limit exceeded" error
3. Check dashboard - should show 3/3 daily usage

**To reset limits for testing:**

Run in Supabase SQL Editor:
```sql
-- Reset daily usage
UPDATE usage_quotas 
SET daily_usage = 0, daily_reset_at = NOW() + INTERVAL '1 day'
WHERE user_id = 'YOUR_USER_ID';

-- Reset monthly usage
UPDATE usage_quotas 
SET monthly_usage = 0, monthly_reset_at = NOW() + INTERVAL '1 month'
WHERE user_id = 'YOUR_USER_ID';
```

---

## 💳 Stripe Testing (Test Mode)

### **Switch to Test Mode**

1. Go to Stripe Dashboard
2. Toggle to **Test Mode** (top right)
3. Use test API keys in `.env.local`

### **Test Cards**

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
```

**Requires 3D Secure:**
```
Card: 4000 0027 6000 3184
```

**Declined:**
```
Card: 4000 0000 0000 0002
```

**Insufficient Funds:**
```
Card: 4000 0000 0000 9995
```

### **Test Subscription Flow**

1. Sign in as test user
2. Go to `/pricing`
3. Click "Upgrade" on Creator plan
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify:
   - Redirected to dashboard
   - Tier updated to "Creator"
   - Usage limits increased
   - Stripe Dashboard shows subscription

### **Test Billing Portal**

1. Sign in as subscribed user
2. Go to dashboard
3. Click "Manage Billing"
4. Verify Stripe portal opens
5. Test:
   - Update payment method
   - View invoices
   - Cancel subscription

---

## 🎯 Production Testing

### **1. Test Signup Flow**

```
Production URL: https://hotend-weekly-ci0he9mh5-siddharth-bhagwats-projects.vercel.app

Test Account:
Email: your-real-email+test@gmail.com
Password: SecurePass123!
```

**Note:** Gmail ignores `+anything` so `email+test@gmail.com` goes to `email@gmail.com`

### **2. Test Subscription (Use Real Card)**

⚠️ **Warning:** Production uses real money!

**For testing, use:**
- Stripe test mode products (create separate test products)
- Or use a real card and immediately cancel

**Steps:**
1. Sign up with real email
2. Go to pricing page
3. Select plan
4. Use real card or test card (if test mode)
5. Complete payment
6. Verify subscription active
7. Test AI tools
8. Check usage tracking
9. Test billing portal
10. Cancel subscription (if testing)

### **3. Test Webhook Events**

After subscription:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click your production webhook
3. Check "Recent deliveries"
4. Verify events received:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `invoice.payment_succeeded`

**If webhook failing:**
- Check endpoint URL is correct
- Verify webhook secret in Vercel matches Stripe
- Check Vercel logs: `vercel logs --prod`

---

## 📊 Monitoring & Verification

### **Check Database (Supabase)**

```sql
-- View all users and their tiers
SELECT 
  up.email,
  st.name as tier,
  up.subscription_status,
  uq.daily_usage,
  uq.monthly_usage
FROM user_profiles up
LEFT JOIN subscription_tiers st ON st.id = up.subscription_tier_id
LEFT JOIN usage_quotas uq ON uq.user_id = up.id;

-- View recent tool usage
SELECT 
  up.email,
  tu.tool_name,
  tu.status,
  tu.created_at
FROM tool_usage tu
JOIN user_profiles up ON up.id = tu.user_id
ORDER BY tu.created_at DESC
LIMIT 20;

-- View subscription history
SELECT 
  up.email,
  sh.action,
  sh.previous_tier,
  sh.new_tier,
  sh.created_at
FROM subscription_history sh
JOIN user_profiles up ON up.id = sh.user_id
ORDER BY sh.created_at DESC;
```

### **Check Stripe Dashboard**

- **Payments:** View all transactions
- **Subscriptions:** Active/canceled subscriptions
- **Customers:** User details and payment methods
- **Webhooks:** Event delivery status

### **Check Vercel Logs**

```bash
# View production logs
vercel logs --prod

# Follow logs in real-time
vercel logs --prod --follow

# Filter by function
vercel logs --prod --function api/webhooks/stripe
```

---

## 🐛 Common Issues & Fixes

### **Issue: Usage not incrementing**

**Check:**
1. User is authenticated
2. API route has `incrementUsage()` call
3. Database connection working
4. Check browser console for errors

**Fix:**
```sql
-- Manually verify usage_quotas exists
SELECT * FROM usage_quotas WHERE user_id = 'YOUR_USER_ID';

-- If missing, create it
INSERT INTO usage_quotas (user_id) VALUES ('YOUR_USER_ID');
```

### **Issue: Subscription not updating after payment**

**Check:**
1. Webhook is receiving events (Stripe Dashboard)
2. Webhook secret is correct
3. Check Vercel logs for errors

**Fix:**
```bash
# Update webhook secret
vercel env rm STRIPE_WEBHOOK_SECRET production
echo "whsec_NEW_SECRET" | vercel env add STRIPE_WEBHOOK_SECRET production
vercel --prod
```

### **Issue: Rate limit not working**

**Check:**
1. `checkUsageLimit()` called before tool execution
2. Limits set correctly in subscription_tiers
3. Usage quotas initialized for user

**Fix:**
```sql
-- Check user's limits
SELECT 
  uq.daily_usage,
  st.daily_tool_usage_limit,
  uq.monthly_usage,
  st.monthly_tool_usage_limit
FROM usage_quotas uq
JOIN user_profiles up ON up.id = uq.user_id
JOIN subscription_tiers st ON st.id = up.subscription_tier_id
WHERE up.id = 'YOUR_USER_ID';
```

---

## 📝 Test Checklist

### **Before Launch**

- [ ] Database migration completed
- [ ] Subscription tiers seeded with correct Stripe IDs
- [ ] All environment variables set in Vercel
- [ ] Stripe webhook configured and verified
- [ ] Test signup/login works
- [ ] Test all AI tools work
- [ ] Test usage tracking increments correctly
- [ ] Test usage limits enforce properly
- [ ] Test subscription upgrade flow
- [ ] Test billing portal access
- [ ] Test webhook events received
- [ ] Verify Stripe payments recorded
- [ ] Check Vercel logs for errors
- [ ] Test on mobile devices
- [ ] Test with different browsers

### **Post-Launch Monitoring**

- [ ] Monitor Vercel analytics
- [ ] Check Stripe payment success rate
- [ ] Monitor webhook delivery rate
- [ ] Check database growth
- [ ] Monitor API usage/costs
- [ ] Review user feedback
- [ ] Check error rates in logs

---

## 🚀 Quick Test Commands

```bash
# Start dev server
npm run dev

# Build production locally
npm run build

# Deploy to production
vercel --prod

# View production logs
vercel logs --prod

# Check environment variables
vercel env ls

# Pull environment variables
vercel env pull
```

---

## 📞 Support Resources

- **Vercel Docs:** https://vercel.com/docs
- **Stripe Testing:** https://stripe.com/docs/testing
- **Supabase Docs:** https://supabase.com/docs
- **Next.js Docs:** https://nextjs.org/docs

---

**Happy Testing! 🎉**
