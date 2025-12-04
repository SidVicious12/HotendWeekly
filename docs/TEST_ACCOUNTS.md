# Test Accounts & Data

Quick reference for testing HotendWeekly.

---

## 🧪 Test User Accounts

Create these accounts through your signup page:

### **Free Tier User**
```
Email: test.free@hotendweekly.com
Password: TestPass123!
Expected Tier: Tinkerer
Daily Limit: 3 uses
Monthly Limit: 10 uses
```

### **Creator Tier User**
```
Email: test.creator@hotendweekly.com
Password: TestPass123!
Expected Tier: Creator (after upgrade)
Daily Limit: 20 uses
Monthly Limit: 100 uses
```

### **Professional Tier User**
```
Email: test.pro@hotendweekly.com
Password: TestPass123!
Expected Tier: Professional (after upgrade)
Daily Limit: 100 uses
Monthly Limit: 500 uses
```

---

## 💳 Stripe Test Cards

### **Successful Payment**
```
Card Number: 4242 4242 4242 4242
Expiry: 12/34
CVC: 123
ZIP: 12345
Name: Test User
```

### **3D Secure Authentication Required**
```
Card Number: 4000 0027 6000 3184
Expiry: 12/34
CVC: 123
```

### **Payment Declined**
```
Card Number: 4000 0000 0000 0002
Expiry: 12/34
CVC: 123
```

### **Insufficient Funds**
```
Card Number: 4000 0000 0000 9995
Expiry: 12/34
CVC: 123
```

---

## 🎯 Test Scenarios

### **Scenario 1: Free User Hits Daily Limit**

1. Sign in as `test.free@hotendweekly.com`
2. Use any AI tool 3 times
3. On 4th attempt, expect error: "Usage limit exceeded"
4. Check dashboard - should show 3/3 daily usage
5. Reset for continued testing:
   ```sql
   UPDATE usage_quotas 
   SET daily_usage = 0 
   WHERE user_id = (SELECT id FROM user_profiles WHERE email = 'test.free@hotendweekly.com');
   ```

### **Scenario 2: User Upgrades to Creator**

1. Sign in as `test.creator@hotendweekly.com`
2. Go to `/pricing`
3. Click "Upgrade" on Creator plan
4. Use test card: `4242 4242 4242 4242`
5. Complete checkout
6. Verify:
   - Dashboard shows "Creator" tier
   - Daily limit now 20
   - Monthly limit now 100
   - Can use tools more times

### **Scenario 3: User Manages Billing**

1. Sign in as subscribed user
2. Go to `/dashboard`
3. Click "Manage Billing"
4. In Stripe portal:
   - View payment history
   - Update payment method
   - Download invoices
   - (Don't cancel unless testing)

### **Scenario 4: Webhook Processing**

1. Complete a subscription
2. Check Stripe Dashboard → Webhooks → Your endpoint
3. Verify events received:
   - `checkout.session.completed` ✅
   - `customer.subscription.created` ✅
   - `invoice.payment_succeeded` ✅
4. Check database:
   ```sql
   SELECT * FROM subscription_history 
   WHERE user_id = (SELECT id FROM user_profiles WHERE email = 'test.creator@hotendweekly.com')
   ORDER BY created_at DESC;
   ```

---

## 🔧 Quick Reset Commands

### **Reset User's Daily Usage**
```sql
UPDATE usage_quotas 
SET daily_usage = 0, daily_reset_at = NOW() + INTERVAL '1 day'
WHERE user_id = 'USER_ID_HERE';
```

### **Reset User's Monthly Usage**
```sql
UPDATE usage_quotas 
SET monthly_usage = 0, monthly_reset_at = NOW() + INTERVAL '1 month'
WHERE user_id = 'USER_ID_HERE';
```

### **Downgrade User to Free Tier**
```sql
UPDATE user_profiles 
SET 
  subscription_tier_id = (SELECT id FROM subscription_tiers WHERE slug = 'tinkerer'),
  subscription_status = 'inactive',
  stripe_subscription_id = NULL
WHERE email = 'test.creator@hotendweekly.com';
```

### **Manually Upgrade User**
```sql
UPDATE user_profiles 
SET 
  subscription_tier_id = (SELECT id FROM subscription_tiers WHERE slug = 'creator'),
  subscription_status = 'active',
  subscription_start_date = NOW()
WHERE email = 'test.creator@hotendweekly.com';
```

---

## 📊 Verification Queries

### **Check User's Current Status**
```sql
SELECT 
  up.email,
  st.name as tier,
  up.subscription_status,
  uq.daily_usage || '/' || st.daily_tool_usage_limit as daily,
  uq.monthly_usage || '/' || st.monthly_tool_usage_limit as monthly,
  up.stripe_customer_id,
  up.stripe_subscription_id
FROM user_profiles up
LEFT JOIN subscription_tiers st ON st.id = up.subscription_tier_id
LEFT JOIN usage_quotas uq ON uq.user_id = up.id
WHERE up.email = 'test.free@hotendweekly.com';
```

### **View Recent Tool Usage**
```sql
SELECT 
  up.email,
  tu.tool_name,
  tu.status,
  tu.processing_time_ms,
  tu.created_at
FROM tool_usage tu
JOIN user_profiles up ON up.id = tu.user_id
WHERE up.email = 'test.free@hotendweekly.com'
ORDER BY tu.created_at DESC
LIMIT 10;
```

### **View Subscription History**
```sql
SELECT 
  up.email,
  sh.action,
  sh.previous_tier,
  sh.new_tier,
  sh.created_at
FROM subscription_history sh
JOIN user_profiles up ON up.id = sh.user_id
WHERE up.email = 'test.creator@hotendweekly.com'
ORDER BY sh.created_at DESC;
```

---

## 🎨 Test Images

For testing AI tools, use these sample images:

**Garment Images:**
- https://images.unsplash.com/photo-1521572163474-6864f9cf17ab (T-shirt)
- https://images.unsplash.com/photo-1434389677669-e08b4cac3105 (Dress)

**Model Images:**
- https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e (Fashion model)
- https://images.unsplash.com/photo-1544005313-94ddf0286df2 (Portrait)

**Product Images:**
- https://images.unsplash.com/photo-1523275335684-37898b6baf30 (Watch)
- https://images.unsplash.com/photo-1491553895911-0055eca6402d (Sneakers)

---

## ✅ Testing Checklist

- [ ] Create 3 test accounts (free, creator, pro)
- [ ] Test signup/login flow
- [ ] Test each AI tool with test images
- [ ] Verify usage increments in dashboard
- [ ] Test daily limit enforcement
- [ ] Test subscription upgrade with test card
- [ ] Verify tier changes in database
- [ ] Test billing portal access
- [ ] Check webhook events in Stripe
- [ ] Verify subscription history recorded
- [ ] Test usage reset (manual SQL)
- [ ] Test downgrade/upgrade flows

---

**Pro Tip:** Use Gmail's `+` trick for multiple test accounts:
- `youremail+test1@gmail.com`
- `youremail+test2@gmail.com`
- `youremail+test3@gmail.com`

All emails go to `youremail@gmail.com` but Supabase treats them as different accounts!
