# Authentication & Security PRD - HotendWeekly

## 🎯 **Problem Statement**

**Current Risk**: API key is exposed in client-side code, allowing anyone to:
- Use all 50 free API calls
- Rack up charges on your card
- No usage tracking or limits per user

**Goal**: Secure the app with authentication and protect API usage.

---

## 🔐 **Solution: Multi-Layer Security**

### **Phase 1: User Authentication (This Session)**
1. **Clerk Authentication** (Recommended - Fastest)
   - Email/password login
   - Social login (Google, GitHub)
   - Pre-built UI components
   - Free tier: 5,000 MAUs

2. **Protected Routes**
   - Redirect unauthenticated users to login
   - Only logged-in users can upload images

3. **User Credits System**
   - Each user gets 5 free credits
   - Track credits in database
   - Show remaining credits in UI

### **Phase 2: API Security**
4. **Supabase Backend** (Database + Auth sync)
   - Store user data
   - Track API usage per user
   - Credit system management

5. **Server-Side API Proxy**
   - Hide API key on server
   - Rate limiting per user
   - Usage analytics

---

## 📋 **Technical Implementation Plan**

### **Stack Decisions**

**Authentication**: Clerk
- ✅ Fastest to implement (30 mins)
- ✅ Beautiful pre-built UI
- ✅ Free tier sufficient
- ✅ Works with Next.js

**Database**: Supabase
- ✅ Free PostgreSQL database
- ✅ Real-time subscriptions
- ✅ Easy integration with Clerk
- ✅ Built-in auth (can sync with Clerk)

**API Protection**: Next.js API Routes + Vercel Deployment
- ✅ Server-side API key storage
- ✅ Per-user rate limiting
- ✅ Free hosting on Vercel
- ✅ Integrates with Clerk auth

---

## 🏗️ **Architecture**

### **Current (Insecure)**
```
User Browser → Remove.bg API (exposed key)
```

### **Secure Architecture**
```
User Browser → Clerk Auth → Next.js API Route (Vercel) → Remove.bg API
                    ↓
                Supabase DB (track usage)
```

---

## 📝 **Implementation Steps (This Session)**

### **Step 1: Setup Clerk Authentication** (15 mins)
- [ ] Create Clerk account
- [ ] Install Clerk Next.js SDK
- [ ] Add Clerk middleware
- [ ] Create sign-in/sign-up pages
- [ ] Protect main page with auth

### **Step 2: Setup Supabase Database** (15 mins)
- [ ] Create Supabase project
- [ ] Create `users` table
- [ ] Create `api_usage` table
- [ ] Create credit tracking logic

### **Step 3: Credit System** (20 mins)
- [ ] Give each new user 5 credits
- [ ] Deduct 1 credit per image processing
- [ ] Show credits in UI
- [ ] Block usage when credits = 0

### **Step 4: Secure API Route** (20 mins)
- [ ] Move API key to server environment
- [ ] Check user authentication
- [ ] Check user credits
- [ ] Process image if credits available
- [ ] Update usage in database

### **Step 5: Deploy to Vercel** (10 mins)
- [ ] Deploy to Vercel (has Node.js support)
- [ ] Add environment variables
- [ ] Test authentication flow
- [ ] Test credit system

---

## 🎨 **User Experience Flow**

### **New User Journey**
1. Lands on homepage
2. Clicks "Start Free Trial"
3. Redirected to Clerk sign-up
4. Signs up (email or Google)
5. Redirected back to app
6. Sees: "You have 5 free credits"
7. Uploads image
8. Image processed
9. Credits: 4 remaining

### **Returning User**
1. Visits site
2. Automatically signed in (Clerk session)
3. Sees remaining credits
4. Uploads image

### **Out of Credits**
1. User has 0 credits
2. Upload button disabled
3. Shows: "Out of credits - Upgrade to Pro"
4. CTA to pricing page (future)

---

## 🗃️ **Database Schema**

### **Table: users**
```sql
id: uuid (primary key)
clerk_user_id: text (unique)
email: text
credits_remaining: integer (default: 5)
total_images_processed: integer (default: 0)
created_at: timestamp
updated_at: timestamp
```

### **Table: api_usage**
```sql
id: uuid (primary key)
user_id: uuid (foreign key → users.id)
image_name: text
background_selected: text
processed_at: timestamp
credits_used: integer (default: 1)
```

---

## 🔒 **Security Features**

### **What's Protected**
✅ API key hidden on server
✅ Only authenticated users can process
✅ Rate limiting per user (5 credits)
✅ Usage tracking and analytics
✅ No direct API access from browser

### **What's Still Open**
- Landing page (public)
- Email capture (public)
- Demo images (future: show without processing)

---

## 💰 **Cost Breakdown**

**Free Tier Limits**:
- Clerk: 5,000 monthly active users
- Supabase: 500MB database, unlimited API requests
- Vercel: 100GB bandwidth/month
- Remove.bg: 50 API calls (you control via credits)

**Total Cost**: $0 for MVP with moderate traffic

---

## 🚀 **Deployment Strategy**

### **Hostinger (Current)**
- ❌ Can't run Node.js API routes
- ✅ Can host static frontend

### **Recommended: Vercel**
- ✅ Free tier perfect for MVP
- ✅ Node.js API routes supported
- ✅ Automatic deployments from GitHub
- ✅ Environment variables secure
- ✅ Clerk integration built-in

### **Hybrid Approach**
- Frontend: Vercel (or Hostinger if you prefer)
- API: Vercel serverless functions
- Database: Supabase
- Auth: Clerk

---

## 📊 **Success Metrics**

- [ ] 100% of API calls are authenticated
- [ ] 0 unauthorized API usage
- [ ] Credits system working (5 per user)
- [ ] User signup conversion >20%
- [ ] Zero API key exposure in browser

---

## 🎯 **Next Steps After Auth**

### **Phase 2: Monetization**
- Stripe integration
- Pricing tiers (10 credits = $5, etc.)
- Subscription plans

### **Phase 3: Enhanced Features**
- Custom backgrounds upload
- Batch processing (multi-images)
- Save/download history
- Team accounts

---

## ⚡ **Quick Start Commands**

```bash
# Install dependencies
npm install @clerk/nextjs @supabase/supabase-js

# Run locally with auth
npm run dev

# Deploy to Vercel
vercel deploy
```

---

## 🤔 **Alternative: Simpler MVP**

If you want to deploy TONIGHT with basic protection:

### **Super Quick Protection** (5 mins)
1. Add simple password gate
2. Store in localStorage
3. Only show upload if password correct
4. Not perfect, but blocks casual abuse

### **Quick Clerk Auth** (30 mins)
1. Add Clerk
2. Protect upload page
3. No credits yet
4. Deploy to Vercel

**Your call!**

- Want full auth + credits system? (1 hour)
- Or quick password protection? (5 mins)
- Or Clerk auth only? (30 mins)

Let me know which approach you prefer!
