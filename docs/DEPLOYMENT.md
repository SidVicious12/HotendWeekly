# Deployment Guide

## Hostinger Setup

### Domain Configuration
- Domain: hotendweekly.com
- Hosting: Hostinger

### GitHub Actions Setup

1. **Repository Secrets** (GitHub Settings → Secrets and Variables → Actions):
   ```
   FTP_SERVER: your-domain.com (or ftp.hostinger.com)
   FTP_USERNAME: your-hostinger-username
   FTP_PASSWORD: your-hostinger-password
   ```

2. **Hostinger FTP Details**:
   - Server: Usually `ftp.hostinger.com` or your domain
   - Port: 21 (standard FTP)
   - Directory: `/public_html/`

### Manual Deployment Option

If you prefer manual deployment:

```bash
# Build the site
npm run build

# Upload the 'out' folder contents to your Hostinger public_html directory
# via FTP client (FileZilla, WinSCP, etc.)
```

### Hostinger File Manager
You can also use Hostinger's built-in File Manager:
1. Login to Hostinger control panel
2. Go to File Manager
3. Navigate to public_html
4. Upload the contents of the 'out' folder

## Local Development

```bash
npm install
npm run dev
```

Site runs on http://localhost:3000