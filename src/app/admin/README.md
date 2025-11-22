# Admin Dashboard

Production-ready admin dashboard with role-based access control, modern UI, and comprehensive navigation.

## Structure

```
/app/admin/
├── layout.tsx          # Admin layout wrapper with access guard
├── page.tsx            # Dashboard home page
└── README.md           # This file

/components/admin/
├── AdminNav.tsx        # Sidebar navigation component
└── StatsCard.tsx       # Reusable stats card component
```

## Features

### Access Control
- **Admin Guard**: Automatic redirect for non-admin users
- **Role-Based Navigation**: Super admin items hidden from regular admins
- **Loading States**: Smooth authentication check with loading indicator

### Layout (layout.tsx)
- **Responsive Sidebar**: Mobile hamburger menu, desktop persistent sidebar
- **Breadcrumb Navigation**: Automatic breadcrumb generation from route
- **User Info Display**: Profile information with logout button
- **Mobile-Optimized**: Touch-friendly navigation and overlay

### Dashboard (page.tsx)
- **Quick Stats**: 4 key metrics with trends (users, revenue, tools, usage)
- **Quick Actions**: Direct links to main admin sections
- **Activity Feed**: Recent platform activity with timestamps
- **Welcome Message**: Personalized greeting with user name

### Components

#### AdminNav
Reusable sidebar navigation with:
- Active link highlighting
- Role-based visibility (super admin items marked with shield icon)
- Icons from lucide-react
- Organized by sections (Management, System)

**Navigation Items:**
- Dashboard (all admins)
- Users (all admins)
- Analytics (all admins)
- Revenue (all admins)
- Tools (all admins)
- Audit Logs (super admin only)
- Settings (super admin only)

#### StatsCard
Reusable statistics card with:
- Loading states (animated spinner)
- Error states (error message display)
- Trend indicators (up/down/neutral with colors)
- Optional click handlers
- Customizable icons

**Props:**
```typescript
interface StatsCardProps {
  title: string
  value: string | number
  icon?: React.ComponentType
  trend?: {
    value: number
    direction: 'up' | 'down' | 'neutral'
    label?: string
  }
  loading?: boolean
  error?: string
  onClick?: () => void
  className?: string
}
```

## Usage

### Accessing the Dashboard
1. Login with admin account
2. Navigate to `/admin`
3. Non-admin users automatically redirected to home

### Creating New Admin Pages
```typescript
// app/admin/new-page/page.tsx
export default function NewAdminPage() {
  return (
    <div>
      <h1>New Page</h1>
      {/* Content automatically wrapped in AdminLayout */}
    </div>
  )
}
```

### Using StatsCard
```typescript
import StatsCard from '@/components/admin/StatsCard'
import { Users } from 'lucide-react'

<StatsCard
  title="Total Users"
  value="1,234"
  icon={Users}
  trend={{ value: 12.5, direction: 'up', label: 'vs last month' }}
/>
```

## Styling

- **Design System**: Tailwind CSS
- **Icons**: lucide-react
- **Color Scheme**: Purple/Pink gradient (matches brand)
- **Responsive**: Mobile-first design
- **Dark Mode**: Not implemented (future enhancement)

## Security

### Access Control
```typescript
// Automatic redirect in layout.tsx
useEffect(() => {
  if (!loading && !isAdmin) {
    router.push('/')
  }
}, [loading, isAdmin, router])
```

### Role Checks
```typescript
// From AuthContext
const { isAdmin, isSuperAdmin } = useAuth()

// Navigation visibility
if (item.superAdminOnly && !isSuperAdmin) {
  return false
}
```

## API Integration (TODO)

Currently using mock data. Replace with actual API calls:

```typescript
// Example: Load real stats
const loadStats = async () => {
  const response = await fetch('/api/admin/stats')
  const data = await response.json()
  setStats(data)
}
```

## Future Enhancements

- [ ] Real-time activity updates (WebSocket)
- [ ] Dark mode support
- [ ] Export data functionality
- [ ] Advanced filtering and search
- [ ] Customizable dashboard widgets
- [ ] Notification system
- [ ] User impersonation (super admin)
- [ ] Audit log viewer
- [ ] System health monitoring

## Dependencies

- Next.js 14+ (App Router)
- React 18+
- TypeScript 5+
- Tailwind CSS
- lucide-react (icons)
- @/contexts/AuthContext (authentication)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)
