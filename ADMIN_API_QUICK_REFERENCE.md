# Admin API Quick Reference

Quick reference guide for admin analytics and user management API endpoints.

## Endpoints Overview

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/admin/analytics/overview` | GET | Platform statistics | Admin |
| `/api/admin/analytics/users` | GET | User analytics | Admin |
| `/api/admin/analytics/revenue` | GET | Revenue analytics | Admin |
| `/api/admin/analytics/tools` | GET | Tool usage analytics | Admin |
| `/api/admin/users` | GET | List users | Admin |
| `/api/admin/users/:id` | GET | User details | Admin |
| `/api/admin/users/:id` | PATCH | Update user | Admin/Super Admin |

## Analytics Endpoints

### Overview Analytics
```bash
GET /api/admin/analytics/overview
```
Returns: Users, subscriptions, revenue, tool usage, growth metrics

### User Analytics
```bash
GET /api/admin/analytics/users?period=30d&granularity=daily
```
**Params:** `period` (7d/30d/90d/1y), `granularity` (daily/weekly/monthly)
Returns: Growth, retention, activity, distribution, engagement

### Revenue Analytics
```bash
GET /api/admin/analytics/revenue?period=90d
```
**Params:** `period` (30d/90d/1y/all)
Returns: MRR, ARR, churn, growth, LTV

### Tool Analytics
```bash
GET /api/admin/analytics/tools?period=30d&tool=virtual-tryon
```
**Params:** `period` (7d/30d/90d), `tool` (optional)
Returns: Popular tools, trends, performance, errors

## User Management

### List Users
```bash
GET /api/admin/users?page=1&limit=20&search=john&tier=professional
```
**Params:**
- `page` - Page number (default: 1)
- `limit` - Per page (default: 20, max: 100)
- `search` - Email/name search
- `tier` - Filter by tier (tinkerer/creator/professional)
- `status` - Filter by subscription status
- `role` - Filter by role (user/admin/super_admin)
- `sortBy` - Sort field
- `sortOrder` - asc/desc

### Get User Details
```bash
GET /api/admin/users/:id
```
Returns: Full user profile, subscription, usage, activity, history

### Update User
```bash
PATCH /api/admin/users/:id
Content-Type: application/json

{
  "role": "admin",                              // Super admin only
  "subscription_tier_id": "tier-uuid",          // Admin
  "subscription_status": "active"               // Admin
}
```

## Common Responses

### Success
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2025-11-22T12:00:00Z"
}
```

### Error
```json
{
  "success": false,
  "error": "Error type",
  "message": "Human-readable message"
}
```

## Status Codes

- `200` - Success
- `400` - Bad request (invalid params)
- `401` - Unauthorized (not logged in)
- `403` - Forbidden (insufficient permissions)
- `404` - Not found
- `500` - Server error

## cURL Examples

### Get Analytics
```bash
curl -X GET https://your-domain.com/api/admin/analytics/overview \
  -H "Cookie: sb-access-token=..."
```

### Search Users
```bash
curl -X GET "https://your-domain.com/api/admin/users?search=john&page=1" \
  -H "Cookie: sb-access-token=..."
```

### Update User Role
```bash
curl -X PATCH https://your-domain.com/api/admin/users/user-uuid \
  -H "Cookie: sb-access-token=..." \
  -H "Content-Type: application/json" \
  -d '{"role": "admin"}'
```

## TypeScript Examples

### Fetch Analytics
```typescript
const res = await fetch('/api/admin/analytics/overview')
const { data } = await res.json()

console.log('Total Users:', data.totalUsers)
console.log('MRR:', data.revenue.mrr)
```

### Update User
```typescript
const res = await fetch(`/api/admin/users/${userId}`, {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ subscription_status: 'active' })
})

const result = await res.json()
```

## Key Metrics

### Overview
- Total/Active/New/Inactive Users
- Subscriptions by Tier
- MRR/ARR
- Tool Usage (total, today, week, month)
- Growth Rates

### User Analytics
- Daily/Weekly/Monthly Growth
- Day 1/7/30 Retention
- Active vs Inactive
- Engagement Levels

### Revenue
- MRR/ARR
- Revenue by Tier
- Churn Rate
- Customer LTV

### Tools
- Popular Tools
- Usage Trends
- Performance (avg/median/p95/p99)
- Success/Error Rates

## Permissions

### Admin Can:
- View all analytics
- List and view users
- Update user subscriptions
- Update subscription status

### Super Admin Can:
- Everything Admin can do
- Change user roles
- Manage other admins

## Audit Logging

All admin actions are logged:
- User: Who performed action
- Action: What was done
- Resource: What was affected
- Details: Full context (endpoint, changes, etc.)
- Timestamp: When it happened

## Files Created

```
/api/admin/analytics/overview/route.ts
/api/admin/analytics/users/route.ts
/api/admin/analytics/revenue/route.ts
/api/admin/analytics/tools/route.ts
/api/admin/users/route.ts
/api/admin/users/[id]/route.ts
```

## Dependencies

- `@/middleware/admin` - Authentication middleware
- `@/lib/admin` - Admin utilities and audit logging
- `@/lib/supabase-server` - Database client

## Security Features

✓ Admin authentication required
✓ Role-based access control
✓ Input validation
✓ Audit logging
✓ SQL injection protection
✓ XSS protection

## Next Steps

1. Build admin dashboard UI
2. Add real-time updates
3. Implement data export
4. Create visualizations
5. Add email notifications

---

**Documentation:** See `ADMIN_API_ENDPOINTS.md` for complete details
**Version:** 1.0.0
**Status:** Production Ready
