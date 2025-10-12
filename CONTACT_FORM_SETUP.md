# Contact Form Setup Guide

This guide will help you set up the contact form with Supabase integration for HotendWeekly.

## 🎯 What's Been Done

✅ **Component Created**: ContactForm component at `src/components/ContactForm.tsx`
✅ **API Route**: Contact submission endpoint at `src/app/api/contact/route.ts`
✅ **Homepage Integration**: Contact form added to homepage with navigation link
✅ **Database Schema**: SQL schema file created at `supabase-schema.sql`

## 📋 Setup Steps

### 1. Set Up Supabase Database

You need to run the SQL schema in your Supabase project to create the database table.

**Option A: Using Supabase Dashboard**
1. Go to your Supabase project dashboard at https://app.supabase.com
2. Click on "SQL Editor" in the left sidebar
3. Click "New Query"
4. Copy the contents of `supabase-schema.sql` and paste it into the editor
5. Click "Run" to execute the SQL

**Option B: Using Supabase CLI**
```bash
# If you have Supabase CLI installed
supabase db push
```

### 2. Verify Environment Variables

Make sure your `.env.local` file has the following Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these in your Supabase project settings under "API" settings.

### 3. Test the Contact Form

1. Start your development server:
```bash
npm run dev
```

2. Navigate to http://localhost:3000
3. Scroll down to the Contact section or click "Contact" in the navigation
4. Fill out the form with:
   - Name: Test User
   - Email: test@example.com
   - Subject: General Inquiry
   - Message: This is a test message

5. Click "Send Message"
6. You should see a success message

### 4. Verify Data in Supabase

1. Go to your Supabase dashboard
2. Click on "Table Editor" in the left sidebar
3. Select the `contact_submissions` table
4. You should see your test submission

## 🔒 Security Features

- **Row Level Security (RLS)** enabled on the table
- **Input validation** on both client and server
- **Email format validation**
- **Message length restrictions** (10-5000 characters)
- **SQL injection protection** via Supabase client
- **Anonymous users can submit** (no auth required)
- **Authenticated users can view their own submissions** via GET endpoint

## 📊 Database Schema

The `contact_submissions` table has the following structure:

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key (auto-generated) |
| name | TEXT | Submitter's name |
| email | TEXT | Submitter's email |
| subject | TEXT | Subject category |
| message | TEXT | Message content |
| status | TEXT | Status: 'new', 'in_progress', 'resolved' |
| created_at | TIMESTAMP | Submission timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

## 🎨 Design Features

The contact form matches the design from your screenshot with:
- ✅ Two-column layout (contact info + form)
- ✅ Purple gradient background section
- ✅ Customer support hours section
- ✅ Email address with icon
- ✅ Office address with icon
- ✅ Subject dropdown with predefined options
- ✅ Name and Email fields with icons
- ✅ Message textarea
- ✅ Send button with paper plane icon
- ✅ Success/error message display
- ✅ Form validation
- ✅ Loading states during submission

## 🚀 API Endpoints

### POST /api/contact
Submit a new contact form.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "General Inquiry",
  "message": "I have a question about..."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Contact form submitted successfully",
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "General Inquiry",
    "message": "I have a question about...",
    "status": "new",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Response (Error):**
```json
{
  "error": "All fields are required"
}
```

### GET /api/contact
Retrieve your own contact submissions (requires authentication).

**Response:**
```json
{
  "success": true,
  "submissions": [
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "subject": "General Inquiry",
      "message": "I have a question about...",
      "status": "new",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

## 📧 Next Steps (Optional Enhancements)

1. **Email Notifications**
   - Set up email notifications when forms are submitted
   - Use services like SendGrid, Resend, or AWS SES
   - Example: Send confirmation email to user and notification to admin

2. **Admin Dashboard**
   - Create an admin page to view and manage submissions
   - Add ability to update status (new → in_progress → resolved)
   - Add filtering and search functionality

3. **Spam Protection**
   - Add reCAPTCHA or hCaptcha
   - Implement rate limiting
   - Add honeypot fields

4. **Analytics**
   - Track form submission rates
   - Monitor response times
   - Track resolution rates

## 🐛 Troubleshooting

**Issue: "Failed to submit contact form"**
- Check that Supabase environment variables are set correctly
- Verify the database table was created successfully
- Check browser console for detailed error messages

**Issue: "Unauthorized" when trying GET endpoint**
- The GET endpoint requires authentication
- Make sure you're logged in
- Check that the email in the submission matches your logged-in email

**Issue: Form doesn't appear on homepage**
- Clear your browser cache and reload
- Check that the import statement is correct
- Verify the component file exists at `src/components/ContactForm.tsx`

## 📝 Notes

- The contact form is now integrated into your homepage
- Users don't need to be authenticated to submit the form
- All submissions are stored in Supabase with timestamps
- The form includes client-side and server-side validation
- Success messages auto-clear after 5 seconds
- The design matches the screenshot you provided

---

Need help? Contact support at support@sellerpic.ai
