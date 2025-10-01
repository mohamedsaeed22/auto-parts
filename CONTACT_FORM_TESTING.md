# Contact Form Testing Guide

## Quick Test Steps

1. **Start the development server** (if not already running):

   ```bash
   npm run dev
   ```

2. **Open browser console** (F12 or Right-click → Inspect → Console)

3. **Navigate to the contact page** in your browser

4. **Fill out the contact form** with test data:

   - Name: Test User
   - Email: your-test-email@example.com (use your real email to test confirmation)
   - Phone: +966 50 123 4567
   - Subject: Test Message
   - Message: This is a test message from the contact form

5. **Watch for console logs:**

   - In browser console, you should see logs like:

     ```
     🚀 Submitting contact form with data: {...}
     📤 Sending request to /api/contact...
     📥 Response status: 200
     📄 Response data: {...}
     ✅ Email sent successfully!
     ```

   - In terminal (server console), you should see:
     ```
     📧 Contact API called
     📝 Received form data: {...}
     🔧 Creating email transporter...
     📮 Email will be sent from: falpartssa@gmail.com
     📬 Email will be sent to: mohamed.saeed1006@gmail.com
     🔍 Verifying transporter configuration...
     ✅ Transporter verified successfully
     📤 Sending email to admin...
     ✅ Email sent to admin successfully!
     📤 Sending confirmation email to user...
     ✅ Confirmation email sent to user successfully!
     🎉 Contact form submission completed successfully!
     ```

6. **Check for toast notification:**

   - Success: Green toast with "Thank you! Your message has been sent successfully..."
   - Error: Red toast with error message

7. **Check email inbox:**
   - **mohamed.saeed1006@gmail.com** should receive the contact form details
   - The test email address should receive a confirmation email

## Troubleshooting

### Issue: No network request in browser console

**Solution:**

- Check that form validation is passing (all required fields filled)
- Open Network tab in browser dev tools (F12 → Network)
- Filter by "contact" to see the API call
- If no request appears, check browser console for JavaScript errors

### Issue: "Email service authentication failed"

**Problem:** Gmail credentials are incorrect or App Password not set up
**Solution:**

1. Go to https://myaccount.google.com/security
2. Enable 2-Step Verification
3. Go to https://myaccount.google.com/apppasswords
4. Generate new App Password
5. Update `EMAIL_PASS` in `.env.local`
6. Restart the dev server: `npm run dev`

### Issue: "Cannot connect to email server"

**Problem:** Network or firewall blocking Gmail SMTP
**Solution:**

- Check internet connection
- Try disabling VPN if active
- Check if port 587 or 465 is blocked by firewall

### Issue: Email not arriving

**Solution:**

1. Check spam/junk folder in mohamed.saeed1006@gmail.com
2. Check server console for "✅ Email sent to admin successfully!"
3. If message ID appears but no email, wait a few minutes (can take 1-5 minutes)
4. Check Gmail "All Mail" folder
5. Verify EMAIL_TO is correct in .env.local

### Issue: 500 Internal Server Error

**Solution:**

- Check server console for detailed error messages
- Verify all environment variables are set in `.env.local`
- Make sure `.env.local` has no syntax errors
- Restart the dev server

## Testing with cURL

You can also test the API directly without the UI:

```bash
curl -X POST http://localhost:3000/api/contact \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+966 50 123 4567",
    "subject": "Test Subject",
    "message": "This is a test message",
    "inquiryType": "general"
  }'
```

Expected response:

```json
{
  "message": "Email sent successfully",
  "success": true
}
```

## Console Logs Meaning

### Browser Console Logs:

- 🚀 = Form submission started
- 📤 = Request being sent to server
- 📥 = Response received from server
- 📄 = Response data details
- ✅ = Success
- ❌ = Error

### Server Console Logs:

- 📧 = API endpoint called
- 📝 = Form data received
- 🔧 = Setting up email transporter
- 📮 = Sender email address
- 📬 = Recipient email address
- 🔍 = Verifying email configuration
- 📤 = Sending email
- ✅ = Email sent successfully
- 📧 = Email message ID
- 🎉 = Complete success
- ❌ = Error occurred
- ⚠️ = Warning (non-critical)

## Success Indicators

✅ **Everything working correctly when you see:**

1. Browser console shows status 200
2. Server console shows "🎉 Contact form submission completed successfully!"
3. Green toast notification appears
4. Form clears automatically
5. Email arrives at mohamed.saeed1006@gmail.com

## Next Steps After Successful Test

1. ✅ Form works and emails are received
2. ✅ Toast notifications work
3. ✅ Console logs help with debugging
4. Consider adding:
   - Rate limiting to prevent spam
   - CAPTCHA for additional security
   - Database logging of all submissions
   - Admin dashboard to view submissions

## Environment Variables Checklist

Verify these are set in `.env.local`:

- ✅ `EMAIL_USER=falpartssa@gmail.com` (Gmail account to send from)
- ✅ `EMAIL_PASS=djksjzptdsderymw` (App Password, not regular password)
- ✅ `EMAIL_TO=mohamed.saeed1006@gmail.com` (Where to receive submissions)

**Important:** If you change `.env.local`, you MUST restart the dev server!
