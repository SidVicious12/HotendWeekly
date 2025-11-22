# Admin Analytics API Endpoints Documentation

Complete documentation for the admin dashboard analytics and user management API endpoints.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Analytics Endpoints](#analytics-endpoints)
4. [User Management Endpoints](#user-management-endpoints)
5. [Response Formats](#response-formats)
6. [Error Handling](#error-handling)
7. [Audit Logging](#audit-logging)

---

## Overview

All admin endpoints are protected by admin middleware and require proper authentication. Admin actions are automatically logged to the audit_logs table for compliance and security tracking.

**Base URL:** `/api/admin`

**Authentication:** Admin or Super Admin role required

---

## Authentication

All endpoints use the `requireAdmin()` middleware for protection:

- **Admin Role:** Can access all analytics and user management endpoints
- **Super Admin Role:** Required for user role changes and certain sensitive operations

**Headers Required:**
- Valid Supabase session cookie (automatic via browser)

**Error Responses:**
- `401 Unauthorized` - Not authenticated
- `403 Forbidden` - Insufficient permissions

---

## Analytics Endpoints

### 1. Platform Overview Analytics

**Endpoint:** `GET /api/admin/analytics/overview`

**Description:** Comprehensive platform statistics including users, subscriptions, revenue, and tool usage.

**Response Schema:**
```typescript
{
  success: true,
  data: {
    // User Metrics
    totalUsers: number
    activeUsers: number        // Last 30 days
    newUsers: number           // Last 7 days
    inactiveUsers: number

    // Subscription Distribution
    subscriptionsByTier: {
      tinkerer: number
      creator: number
      professional: number
      none: number
    }

    // Revenue Metrics
    revenue: {
      monthly: number
      yearly: number
      mrr: number              // Monthly Recurring Revenue
      arr: number              // Annual Recurring Revenue
    }

    // Tool Usage
    toolUsage: {
      total: number
      today: number
      thisWeek: number
      thisMonth: number
      byTool: Record<string, number>
    }

    // Growth Metrics
    growth: {
      userGrowthRate: number       // Percentage
      revenueGrowthRate: number
      activeUserRate: number
    }
  },
  timestamp: string
}
```

**Example Usage:**
```bash
curl -X GET https://your-domain.com/api/admin/analytics/overview \
  -H "Cookie: sb-access-token=..."
```

---

### 2. User Analytics

**Endpoint:** `GET /api/admin/analytics/users`

**Description:** Detailed user analytics including growth, retention, and engagement metrics.

**Query Parameters:**
- `period` - Time period: `7d`, `30d`, `90d`, `1y` (default: `30d`)
- `granularity` - Data granularity: `daily`, `weekly`, `monthly` (default: `daily`)

**Response Schema:**
```typescript
{
  success: true,
  data: {
    // User Growth
    growth: {
      daily: Array<{ date: string; count: number }>
      weekly: Array<{ week: string; count: number }>
      monthly: Array<{ month: string; count: number }>
    }

    // Retention Metrics
    retention: {
      day1: number              // Percentage
      day7: number
      day30: number
      cohortRetention: Array<{
        cohort: string
        size: number
        retained: number
        retentionRate: number
      }>
    }

    // User Activity
    activity: {
      active: number
      inactive: number
      activeRate: number
      averageSessionsPerUser: number
      averageToolUsagePerUser: number
    }

    // Distribution
    distribution: {
      byTier: Record<string, number>
      byRole: Record<string, number>
      byStatus: Record<string, number>
    }

    // Engagement Levels
    engagement: {
      highlyActive: number      // >10 uses/month
      moderatelyActive: number  // 3-10 uses/month
      lightlyActive: number     // 1-2 uses/month
      inactive: number          // 0 uses this month
    }
  },
  params: { period: string, granularity: string },
  timestamp: string
}
```

**Example Usage:**
```bash
curl -X GET "https://your-domain.com/api/admin/analytics/users?period=30d&granularity=daily" \
  -H "Cookie: sb-access-token=..."
```

---

### 3. Revenue Analytics

**Endpoint:** `GET /api/admin/analytics/revenue`

**Description:** Detailed revenue analytics including MRR, ARR, churn, and growth metrics.

**Query Parameters:**
- `period` - Time period: `30d`, `90d`, `1y`, `all` (default: `90d`)

**Response Schema:**
```typescript
{
  success: true,
  data: {
    // Current Metrics
    current: {
      mrr: number                   // Monthly Recurring Revenue
      arr: number                   // Annual Recurring Revenue
      totalRevenue: number
      averageRevenuePerUser: number
    }

    // Revenue Timeline
    timeline: {
      daily: Array<{ date: string; revenue: number; subscriptions: number }>
      monthly: Array<{ month: string; revenue: number; mrr: number; subscriptions: number }>
      yearly: Array<{ year: string; revenue: number; arr: number; subscriptions: number }>
    }

    // Revenue by Tier
    byTier: {
      tinkerer: { revenue: number; subscribers: number; percentage: number }
      creator: { revenue: number; subscribers: number; percentage: number }
      professional: { revenue: number; subscribers: number; percentage: number }
    }

    // Churn Metrics
    churn: {
      rate: number                  // Monthly churn rate (%)
      canceledThisMonth: number
      canceledLastMonth: number
      revenueChurn: number
    }

    // Growth Metrics
    growth: {
      mrrGrowth: number            // Month-over-month (%)
      arrGrowth: number            // Year-over-year (%)
      newMrr: number
      expansionMrr: number
      contractionMrr: number
    }

    // Customer Metrics
    customer: {
      lifetimeValue: number        // Average LTV
      acquisitionCost: number      // Average CAC
      paybackPeriod: number        // Months
    }
  },
  params: { period: string },
  timestamp: string
}
```

**Example Usage:**
```bash
curl -X GET "https://your-domain.com/api/admin/analytics/revenue?period=90d" \
  -H "Cookie: sb-access-token=..."
```

---

### 4. Tool Usage Analytics

**Endpoint:** `GET /api/admin/analytics/tools`

**Description:** Comprehensive tool usage analytics including popularity, performance, and error tracking.

**Query Parameters:**
- `period` - Time period: `7d`, `30d`, `90d` (default: `30d`)
- `tool` - Filter by specific tool name (optional)

**Response Schema:**
```typescript
{
  success: true,
  data: {
    // Overview Statistics
    overview: {
      totalUsage: number
      uniqueUsers: number
      averageUsagePerUser: number
      totalTools: number
    }

    // Popular Tools
    popular: Array<{
      toolName: string
      usageCount: number
      uniqueUsers: number
      successRate: number
      averageProcessingTime: number
    }>

    // Usage Trends
    trends: {
      daily: Array<{ date: string; usage: number; uniqueUsers: number }>
      weekly: Array<{ week: string; usage: number; uniqueUsers: number }>
      monthly: Array<{ month: string; usage: number; uniqueUsers: number }>
    }

    // Usage by Tier
    byTier: {
      tinkerer: { usage: number; users: number; averagePerUser: number }
      creator: { usage: number; users: number; averagePerUser: number }
      professional: { usage: number; users: number; averagePerUser: number }
    }

    // Performance Metrics
    performance: {
      averageProcessingTime: number
      medianProcessingTime: number
      p95ProcessingTime: number
      p99ProcessingTime: number
      successRate: number
      errorRate: number
      rateLimitRate: number
    }

    // Tool-Specific Metrics
    byTool: Record<string, {
      usage: number
      uniqueUsers: number
      successRate: number
      errorRate: number
      averageProcessingTime: number
      trend: 'up' | 'down' | 'stable'
    }>

    // Error Analysis
    errors: {
      total: number
      byType: Record<string, number>
      topErrors: Array<{ tool: string; count: number; lastOccurred: string }>
    }
  },
  params: { period: string, tool?: string },
  timestamp: string
}
```

**Example Usage:**
```bash
# All tools
curl -X GET "https://your-domain.com/api/admin/analytics/tools?period=30d" \
  -H "Cookie: sb-access-token=..."

# Specific tool
curl -X GET "https://your-domain.com/api/admin/analytics/tools?period=30d&tool=virtual-tryon" \
  -H "Cookie: sb-access-token=..."
```

---

## User Management Endpoints

### 5. User List

**Endpoint:** `GET /api/admin/users`

**Description:** List all users with pagination, search, and filtering capabilities.

**Query Parameters:**
- `page` - Page number (default: `1`)
- `limit` - Items per page (default: `20`, max: `100`)
- `search` - Search by email or name (optional)
- `tier` - Filter by tier slug: `tinkerer`, `creator`, `professional` (optional)
- `status` - Filter by subscription status (optional)
- `role` - Filter by user role: `user`, `admin`, `super_admin` (optional)
- `sortBy` - Sort field: `created_at`, `email`, `full_name`, `last_login_at`, `role`, `subscription_status` (default: `created_at`)
- `sortOrder` - Sort order: `asc`, `desc` (default: `desc`)

**Response Schema:**
```typescript
{
  success: true,
  data: {
    users: Array<{
      id: string
      email: string
      full_name: string | null
      avatar_url: string | null
      role: string
      subscription_status: string
      created_at: string
      last_login_at: string | null

      // Subscription Details
      tier: {
        name: string
        slug: string
      } | null

      // Usage Stats
      usage: {
        daily: number
        monthly: number
      }
    }>

    pagination: {
      total: number
      page: number
      limit: number
      totalPages: number
    }

    filters: {
      search?: string
      tier?: string
      status?: string
      role?: string
      sortBy?: string
      sortOrder?: 'asc' | 'desc'
    }
  },
  timestamp: string
}
```

**Example Usage:**
```bash
# Basic list
curl -X GET "https://your-domain.com/api/admin/users?page=1&limit=20" \
  -H "Cookie: sb-access-token=..."

# With filters
curl -X GET "https://your-domain.com/api/admin/users?search=john&tier=professional&page=1" \
  -H "Cookie: sb-access-token=..."
```

---

### 6. User Details

**Endpoint:** `GET /api/admin/users/:id`

**Description:** Get detailed information about a specific user.

**Path Parameters:**
- `id` - User UUID

**Response Schema:**
```typescript
{
  success: true,
  data: {
    // Basic Info
    id: string
    email: string
    full_name: string | null
    avatar_url: string | null
    role: string
    created_at: string
    last_login_at: string | null

    // Subscription Details
    subscription: {
      status: string
      tier: {
        id: string
        name: string
        slug: string
        price_monthly: number
        price_yearly: number
      } | null
      billing_cycle: string
      start_date: string | null
      end_date: string | null
      trial_end_date: string | null
      stripe_customer_id: string | null
      stripe_subscription_id: string | null
    }

    // Usage Details
    usage: {
      daily: number
      monthly: number
      daily_limit: number
      monthly_limit: number
      daily_remaining: number
      monthly_remaining: number
    }

    // Activity History
    activity: {
      total_tool_usage: number
      last_30_days_usage: number
      favorite_tools: Array<{ tool: string; count: number }>
      recent_activity: Array<{
        tool: string
        created_at: string
        status: string
      }>
    }

    // Subscription History
    history: Array<{
      id: string
      action: string
      previous_tier: string | null
      new_tier: string | null
      amount_paid: number | null
      created_at: string
    }>
  },
  timestamp: string
}
```

**Example Usage:**
```bash
curl -X GET "https://your-domain.com/api/admin/users/123e4567-e89b-12d3-a456-426614174000" \
  -H "Cookie: sb-access-token=..."
```

---

### 7. Update User

**Endpoint:** `PATCH /api/admin/users/:id`

**Description:** Update user details including role, tier, or subscription status.

**Path Parameters:**
- `id` - User UUID

**Request Body:**
```typescript
{
  role?: 'user' | 'admin' | 'super_admin'           // Super admin only
  subscription_tier_id?: string                      // UUID of tier
  subscription_status?: 'inactive' | 'active' | 'trialing' | 'past_due' | 'canceled' | 'unpaid'
}
```

**Response Schema:**
```typescript
{
  success: true,
  message: string
  changes: {
    role?: { from: string, to: string }
    subscription_tier_id?: { from: string, to: string }
    subscription_status?: { from: string, to: string }
  },
  timestamp: string
}
```

**Permissions:**
- **Admin:** Can update subscription_tier_id and subscription_status
- **Super Admin:** Can update role (in addition to admin permissions)

**Example Usage:**
```bash
# Update subscription tier
curl -X PATCH "https://your-domain.com/api/admin/users/123e4567-e89b-12d3-a456-426614174000" \
  -H "Cookie: sb-access-token=..." \
  -H "Content-Type: application/json" \
  -d '{
    "subscription_tier_id": "456e7890-e89b-12d3-a456-426614174111",
    "subscription_status": "active"
  }'

# Update user role (super admin only)
curl -X PATCH "https://your-domain.com/api/admin/users/123e4567-e89b-12d3-a456-426614174000" \
  -H "Cookie: sb-access-token=..." \
  -H "Content-Type: application/json" \
  -d '{
    "role": "admin"
  }'
```

---

## Response Formats

### Success Response
```typescript
{
  success: true,
  data: any,              // Endpoint-specific data
  timestamp: string       // ISO 8601 timestamp
}
```

### Error Response
```typescript
{
  success: false,
  error: string,          // Error type
  message: string,        // Human-readable message
  timestamp?: string      // ISO 8601 timestamp
}
```

---

## Error Handling

### HTTP Status Codes

- `200 OK` - Request successful
- `400 Bad Request` - Invalid request parameters or body
- `401 Unauthorized` - Authentication required
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

### Common Error Scenarios

**Authentication Errors:**
```json
{
  "error": "Authentication required",
  "message": "You must be logged in to access this resource"
}
```

**Permission Errors:**
```json
{
  "error": "Forbidden",
  "message": "Admin access required",
  "currentRole": "user"
}
```

**Validation Errors:**
```json
{
  "error": "Invalid role",
  "message": "Role must be one of: user, admin, super_admin"
}
```

---

## Audit Logging

All admin actions are automatically logged to the `audit_logs` table with the following information:

**Logged Information:**
- `user_id` - Admin performing the action
- `action` - Type of action (e.g., `admin.login`, `user.updated`, `user.role_changed`)
- `resource_type` - Type of resource accessed (e.g., `analytics`, `user`)
- `resource_id` - Specific resource ID
- `details` - JSON object with additional context (endpoint, parameters, changes)
- `created_at` - Timestamp of action

**Audit Actions:**
- `admin.login` - Admin accessed analytics or management endpoints
- `user.updated` - Admin updated user details
- `user.role_changed` - Admin changed user role

**Example Audit Log Entry:**
```json
{
  "user_id": "admin-uuid",
  "action": "user.role_changed",
  "resource_type": "user",
  "resource_id": "target-user-uuid",
  "details": {
    "endpoint": "/api/admin/users/[id]",
    "method": "PATCH",
    "changes": {
      "role": { "from": "user", "to": "admin" }
    },
    "target_email": "user@example.com"
  },
  "created_at": "2025-11-22T12:00:00.000Z"
}
```

---

## Testing Examples

### Using cURL

```bash
# Get overview analytics
curl -X GET https://your-domain.com/api/admin/analytics/overview \
  -H "Cookie: sb-access-token=your-token"

# Search users
curl -X GET "https://your-domain.com/api/admin/users?search=john&page=1&limit=10" \
  -H "Cookie: sb-access-token=your-token"

# Update user
curl -X PATCH https://your-domain.com/api/admin/users/user-uuid \
  -H "Cookie: sb-access-token=your-token" \
  -H "Content-Type: application/json" \
  -d '{"subscription_status": "active"}'
```

### Using JavaScript/TypeScript

```typescript
// Fetch overview analytics
const response = await fetch('/api/admin/analytics/overview')
const { data } = await response.json()

console.log('Total Users:', data.totalUsers)
console.log('MRR:', data.revenue.mrr)

// Update user
const updateResponse = await fetch(`/api/admin/users/${userId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    subscription_status: 'active'
  })
})

const result = await updateResponse.json()
```

---

## File Structure

```
src/app/api/admin/
├── analytics/
│   ├── overview/
│   │   └── route.ts          # Platform overview analytics
│   ├── users/
│   │   └── route.ts          # User analytics
│   ├── revenue/
│   │   └── route.ts          # Revenue analytics
│   └── tools/
│       └── route.ts          # Tool usage analytics
└── users/
    ├── route.ts              # User list endpoint
    └── [id]/
        └── route.ts          # Individual user management
```

---

## Security Considerations

1. **Authentication:** All endpoints require valid admin authentication
2. **Role-Based Access:** Super admin required for role changes
3. **Audit Logging:** All actions logged for compliance
4. **Input Validation:** All inputs validated before processing
5. **Rate Limiting:** Consider implementing rate limiting for production
6. **SQL Injection:** Protected by Supabase parameterized queries
7. **XSS Protection:** JSON responses prevent script injection
8. **CORS:** Configure CORS policies for production

---

## Performance Considerations

1. **Pagination:** Use pagination for large datasets
2. **Caching:** Consider caching analytics data for frequently accessed endpoints
3. **Database Indexes:** Ensure proper indexes on frequently queried fields
4. **Query Optimization:** Batch queries where possible
5. **Response Size:** Use filters to reduce response payload size

---

## Next Steps

1. **Frontend Integration:** Build admin dashboard UI consuming these endpoints
2. **Real-time Updates:** Consider WebSocket/SSE for live analytics
3. **Export Features:** Add CSV/Excel export capabilities
4. **Advanced Filters:** Implement date range pickers and multi-select filters
5. **Visualization:** Create charts and graphs using the analytics data
6. **Notifications:** Alert admins on important metrics or changes

---

**Last Updated:** 2025-11-22
**Version:** 1.0.0
**Status:** Production Ready
