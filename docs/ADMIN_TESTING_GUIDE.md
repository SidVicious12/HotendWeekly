# Admin Panel Testing Guide

## Overview
Comprehensive testing checklist for the HotendWeekly admin dashboard implementation.

---

## Pre-Testing Setup

### 1. Database Migration
```bash
# Run the admin migration SQL file in Supabase SQL Editor
# File: supabase-admin-migration.sql
```

**Verify Tables Created:**
- ✅ `user_profiles` (role column added)
- ✅ `analytics_events`
- ✅ `retention_metrics`
- ✅ `admin_reports`

### 2. Create Test Admin User
```sql
-- In Supabase SQL Editor
UPDATE public.user_profiles
SET role = 'admin'
WHERE email = 'your-test-email@example.com';

-- Or create a super admin
UPDATE public.user_profiles
SET role = 'super_admin'
WHERE email = 'your-super-admin@example.com';
```

### 3. Start Development Server
```bash
npm run dev
```

---

## Testing Checklist

### ✅ Step 1: Authentication & Authorization

#### Test Cases:
- [ ] **Non-admin cannot access admin routes**
  - Navigate to `/admin` while logged out → Redirect to login
  - Navigate to `/admin` as regular user → 403 Forbidden

- [ ] **Admin can access admin routes**
  - Login as admin user
  - Navigate to `/admin` → Dashboard loads successfully
  - All navigation links are visible

- [ ] **Super admin sees additional features**
  - Login as super admin
  - Verify "Audit Logs" and "Settings" links visible
  - Regular admin should NOT see these links

**Files to verify:**
- `/src/middleware.ts`
- `/src/contexts/AuthContext.tsx`
- `/src/components/admin/AdminNav.tsx`

---

### ✅ Step 2: Dashboard Layout & Navigation

#### Test Cases:
- [ ] **Dashboard loads correctly**
  - Visit `/admin`
  - Verify welcome message with user name
  - Verify 4 stat cards display
  - Verify quick actions section
  - Verify recent activity feed

- [ ] **Navigation works**
  - Click each nav item (Users, Analytics, Reports, Revenue, Tools)
  - Verify active state highlighting
  - Verify page transitions work smoothly

- [ ] **Responsive design**
  - Test on mobile viewport (< 768px)
  - Test on tablet viewport (768px - 1024px)
  - Test on desktop viewport (> 1024px)
  - Verify sidebar collapses on mobile

**Files to verify:**
- `/src/app/admin/page.tsx`
- `/src/app/admin/layout.tsx`
- `/src/components/admin/AdminNav.tsx`

---

### ✅ Step 3: User Management

#### Test Cases:
- [ ] **User list loads**
  - Navigate to `/admin/users`
  - Verify user table displays
  - Verify pagination works (if > 50 users)

- [ ] **Search functionality**
  - Enter email in search box
  - Verify results filter correctly
  - Clear search → All users return

- [ ] **Filter functionality**
  - Filter by role (All, User, Admin, Super Admin)
  - Filter by subscription (All, Free, Pro, Enterprise)
  - Filter by status (All, Active, Inactive)
  - Verify filters work in combination

- [ ] **User actions**
  - Click "View Details" on a user
  - Navigate to `/admin/users/[id]`
  - Verify user details display
  - Test "Edit Role" functionality
  - Test "Suspend User" functionality
  - Test "Delete User" functionality (with confirmation)

**Files to verify:**
- `/src/app/admin/users/page.tsx`
- `/src/app/admin/users/[id]/page.tsx`
- `/src/components/admin/UserTable.tsx`
- `/src/components/admin/UserFilters.tsx`
- `/src/api/admin/users/route.ts`

---

### ✅ Step 4: Analytics Dashboard

#### Test Cases:
- [ ] **Analytics page loads**
  - Navigate to `/admin/analytics`
  - Verify all 4 key metric cards display
  - Verify loading states show initially

- [ ] **Time range filters**
  - Click each time range button (7d, 30d, 90d, 1y, all)
  - Verify charts update with new data
  - Verify API calls made with correct range parameter

- [ ] **Charts render correctly**
  - **User Growth Chart**: Line chart with 3 lines (total, new, active)
  - **Revenue Chart**: Stacked area chart (subscriptions, one-time)
  - **Tool Usage Chart**: Bar chart with colored bars
  - **Geographic Distribution**: Pie chart with country labels
  - **Top Tools Table**: Table with trend indicators
  - **User Engagement Metrics**: 8 metric cards in grid

- [ ] **Interactive features**
  - Hover over chart elements → Tooltips display
  - Verify tooltip formatting (currency, numbers, percentages)
  - Verify chart responsiveness on different screen sizes

- [ ] **Export functionality**
  - Click "Export Data" button
  - Verify CSV file downloads
  - Open CSV and verify data format

**Files to verify:**
- `/src/app/admin/analytics/page.tsx`
- `/src/components/admin/analytics/*.tsx` (6 chart components)
- `/src/api/admin/analytics/*/route.ts` (7 API endpoints)

---

### ✅ Step 5: Reports & Data Export

#### Test Cases:
- [ ] **Reports page loads**
  - Navigate to `/admin/reports`
  - Verify report generation form displays
  - Verify report history section

- [ ] **Generate reports**
  - Select "Daily Report" → Click "Generate Report"
  - Verify loading state during generation
  - Verify JSON file downloads automatically
  - Open JSON file and verify structure

- [ ] **Test all report types**
  - Generate Daily Report
  - Generate Weekly Report
  - Generate Monthly Report
  - Generate Custom Report (if date picker implemented)

- [ ] **Report history**
  - Verify generated reports appear in history
  - Verify report metadata (type, date, generated by)
  - Click "Download" on a historical report
  - Verify report downloads successfully

- [ ] **Quick stats**
  - Verify "Total Reports" count is accurate
  - Verify "This Month" count is accurate
  - Verify "Most Common" type is calculated correctly

**Files to verify:**
- `/src/app/admin/reports/page.tsx`
- `/src/api/admin/reports/generate/route.ts`
- `/src/api/admin/analytics/export/route.ts`

---

### ✅ Step 6: API Endpoints

#### Test Cases:
For each endpoint, test with:
- Valid admin token
- Invalid/missing token → 401 Unauthorized
- Regular user token → 403 Forbidden

**Analytics Endpoints:**
```bash
# Test with curl or Postman
GET /api/admin/analytics/overview?range=30d
GET /api/admin/analytics/user-growth?range=30d
GET /api/admin/analytics/revenue?range=30d
GET /api/admin/analytics/tool-usage?range=30d
GET /api/admin/analytics/geographic?range=30d
GET /api/admin/analytics/top-tools?range=30d
GET /api/admin/analytics/engagement?range=30d
GET /api/admin/analytics/export?range=30d&format=csv
```

**User Management Endpoints:**
```bash
GET /api/admin/users?page=1&limit=50
GET /api/admin/users/[id]
PUT /api/admin/users/[id]
DELETE /api/admin/users/[id]
```

**Reports Endpoints:**
```bash
GET /api/admin/reports/generate
POST /api/admin/reports/generate
```

**Expected Response Codes:**
- ✅ 200: Success
- ✅ 401: Unauthorized (no token)
- ✅ 403: Forbidden (not admin)
- ✅ 404: Not found (invalid ID)
- ✅ 500: Server error (with error message)

---

### ✅ Step 7: Database & RLS Policies

#### Test Cases:
- [ ] **RLS policies work correctly**
  ```sql
  -- Test as regular user (should fail)
  SELECT * FROM analytics_events;
  SELECT * FROM retention_metrics;
  SELECT * FROM admin_reports;
  
  -- Test as admin (should succeed)
  SELECT * FROM analytics_events;
  SELECT * FROM retention_metrics;
  SELECT * FROM admin_reports;
  ```

- [ ] **Indexes exist**
  ```sql
  -- Verify indexes created
  SELECT * FROM pg_indexes 
  WHERE tablename IN ('analytics_events', 'retention_metrics', 'admin_reports');
  ```

- [ ] **Triggers work**
  ```sql
  -- Test updated_at trigger
  UPDATE admin_reports SET type = 'weekly' WHERE id = 'test-id';
  -- Verify updated_at changed
  ```

---

### ✅ Step 8: Error Handling

#### Test Cases:
- [ ] **Network errors**
  - Disconnect internet
  - Try to load analytics page
  - Verify error message displays
  - Reconnect → Verify data loads

- [ ] **Invalid data**
  - Manually call API with invalid parameters
  - Verify appropriate error messages
  - Verify UI doesn't crash

- [ ] **Empty states**
  - Test with brand new database (no data)
  - Verify "No data" messages display
  - Verify charts show empty state gracefully

- [ ] **Loading states**
  - Verify spinners show during data fetch
  - Verify skeleton loaders (if implemented)
  - Verify no flash of empty content

---

### ✅ Step 9: Performance

#### Test Cases:
- [ ] **Page load times**
  - Dashboard: < 2 seconds
  - Analytics: < 3 seconds (with charts)
  - User list: < 2 seconds

- [ ] **Chart rendering**
  - Charts render within 1 second
  - No lag when switching time ranges
  - Smooth animations

- [ ] **API response times**
  - Analytics endpoints: < 1 second
  - User list: < 500ms
  - Report generation: < 5 seconds

- [ ] **Memory usage**
  - No memory leaks when navigating between pages
  - Charts cleanup properly on unmount

---

### ✅ Step 10: Security

#### Test Cases:
- [ ] **SQL injection prevention**
  - Try SQL injection in search fields
  - Verify parameterized queries used

- [ ] **XSS prevention**
  - Try XSS in user inputs
  - Verify proper escaping

- [ ] **CSRF protection**
  - Verify CSRF tokens on forms (if applicable)

- [ ] **Rate limiting**
  - Make rapid API requests
  - Verify rate limiting (if implemented)

- [ ] **Data sanitization**
  - Verify user inputs sanitized
  - Verify file uploads validated (if applicable)

---

## Known Issues & Limitations

### Current Limitations:
1. **Mock Data**: Some endpoints may return mock/simulated data until real data accumulates
2. **Chart Data**: Charts require actual usage data to display meaningful visualizations
3. **Geographic Data**: Requires IP geolocation service integration
4. **Email Notifications**: Scheduled reports email feature not yet implemented

### TypeScript Warnings:
- Module import warnings for analytics components will resolve after TS server reload
- These are false positives - all files exist and are properly typed

---

## Test Data Setup

### Create Test Users:
```sql
-- Insert test users with different roles
INSERT INTO auth.users (email, encrypted_password) VALUES
  ('admin@test.com', crypt('password123', gen_salt('bf'))),
  ('user@test.com', crypt('password123', gen_salt('bf')));

INSERT INTO public.user_profiles (id, email, role, subscription_status) VALUES
  ((SELECT id FROM auth.users WHERE email = 'admin@test.com'), 'admin@test.com', 'admin', 'pro'),
  ((SELECT id FROM auth.users WHERE email = 'user@test.com'), 'user@test.com', 'user', 'free');
```

### Create Test Analytics Events:
```sql
-- Insert sample analytics events
INSERT INTO public.analytics_events (user_id, event_type, event_data, created_at)
SELECT 
  (SELECT id FROM auth.users LIMIT 1),
  'tool_usage',
  jsonb_build_object('tool', 'virtual-tryon', 'duration', 120),
  NOW() - (random() * interval '30 days')
FROM generate_series(1, 100);
```

### Create Test Payments:
```sql
-- Insert sample payments (if payments table exists)
INSERT INTO public.payments (user_id, amount, currency, status, payment_type, created_at)
SELECT 
  (SELECT id FROM auth.users ORDER BY random() LIMIT 1),
  (random() * 10000)::int,
  'usd',
  'succeeded',
  CASE WHEN random() > 0.5 THEN 'subscription' ELSE 'one-time' END,
  NOW() - (random() * interval '30 days')
FROM generate_series(1, 50);
```

---

## Success Criteria

### All tests pass when:
- ✅ All 8 steps of the implementation are complete
- ✅ Authentication and authorization work correctly
- ✅ All pages load without errors
- ✅ All charts render with data
- ✅ All API endpoints return correct responses
- ✅ Export and reporting functionality works
- ✅ RLS policies enforce proper access control
- ✅ No console errors or warnings
- ✅ Responsive design works on all screen sizes
- ✅ Performance meets benchmarks

---

## Deployment Checklist

Before deploying to production:
- [ ] Run database migration on production Supabase
- [ ] Create production admin users
- [ ] Test all functionality on staging environment
- [ ] Verify environment variables are set
- [ ] Test with production data volumes
- [ ] Set up monitoring and error tracking
- [ ] Document admin user creation process
- [ ] Create admin user guide/documentation

---

## Support & Troubleshooting

### Common Issues:

**Issue**: "Unauthorized" errors
- **Solution**: Verify user has admin role in database
- **Check**: `SELECT role FROM user_profiles WHERE id = 'user-id'`

**Issue**: Charts not displaying
- **Solution**: Check browser console for API errors
- **Check**: Verify API endpoints return data

**Issue**: Export not working
- **Solution**: Check browser popup blocker
- **Check**: Verify API returns CSV format correctly

**Issue**: RLS policy errors
- **Solution**: Verify policies are created correctly
- **Check**: Run RLS policy verification queries

---

## Files Summary

### Created Files (Step 7):
1. `/src/app/api/admin/analytics/export/route.ts` - CSV/JSON export endpoint
2. `/src/app/api/admin/reports/generate/route.ts` - Report generation endpoint
3. `/src/app/admin/reports/page.tsx` - Reports management UI
4. Updated: `/src/components/admin/AdminNav.tsx` - Added Reports link
5. Updated: `/supabase-admin-migration.sql` - Added admin_reports table

### Total Admin Implementation:
- **Database Tables**: 4 (user_profiles, analytics_events, retention_metrics, admin_reports)
- **API Endpoints**: 10+ endpoints
- **UI Pages**: 5 main pages (dashboard, users, user detail, analytics, reports)
- **Components**: 16 components
- **Total Lines of Code**: ~5,000+ lines

---

**Testing Status**: Ready for comprehensive testing
**Last Updated**: November 22, 2024
