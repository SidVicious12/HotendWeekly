# How to Deploy HotendWeekly

## 1. Push to GitHub
If you haven't already, these commands will sync your local code to a new GitHub repository:

```bash
# Initialize Git (if not done)
git init
git add .
git commit -m "feat: complete holiday redesign"

# Create and Push (requires GitHub CLI)
gh repo create hotend-weekly --public --source=. --push
```

## 2. Deploy to Vercel (The "Reselling" Platform)
Vercel is the standard for Next.js deployments.

1.  Go to [vercel.com](https://vercel.com)
2.  Click "Add New..." -> "Project"
3.  Import `hotend-weekly` from your GitHub
4.  Click **Deploy**

Your site will be live at `https://hotend-weekly.vercel.app` (or similar) in minutes!
