# Contact Form Email Setup

This document explains how the contact form email functionality works and how to configure it.

## Overview

When users submit the contact form, the system will:

1. Send an email to the admin (mohamed.saeed1006@gmail.com) with the form details
2. Send a confirmation email to the user who submitted the form

## Configuration

### Email Environment Variables

The email functionality uses the following environment variables in `.env.local`:

```bash
EMAIL_USER=falpartssa@gmail.com       # Gmail account to send emails FROM
EMAIL_PASS=your_app_password_here      # Gmail App Password (NOT regular password)
EMAIL_TO=mohamed.saeed1006@gmail.com   # Email address to receive contact form submissions
```

### Setting up Gmail App Password

To use Gmail SMTP for sending emails, you need to create an App Password:

1. **Enable 2-Step Verification**

   - Go to your Google Account: https://myaccount.google.com/security
   - Find "2-Step Verification" and enable it if not already enabled

2. **Generate App Password**

   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Enter a name like "Auto Parts Contact Form"
   - Click "Generate"
   - Copy the 16-character password (format: xxxx xxxx xxxx xxxx)
   - Remove spaces and paste it as the `EMAIL_PASS` value in `.env.local`

3. **Important Security Notes**
   - Never use your regular Gmail password in the code
   - Never commit the `.env.local` file to version control
   - Keep your App Password secure
   - You can revoke App Passwords at any time from your Google Account settings

## API Endpoint

### POST /api/contact

Sends an email with the contact form data.

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+966 50 123 4567",
  "subject": "Inquiry about parts",
  "message": "I would like to know about...",
  "inquiryType": "parts"
}
```

**Response (Success):**

```json
{
  "message": "Email sent successfully"
}
```

**Response (Error):**

```json
{
  "error": "Failed to send email. Please try again later."
}
```

## Email Templates

### Admin Email

The email sent to the admin (mohamed.saeed1006@gmail.com) includes:

- Customer name
- Customer email (clickable)
- Phone number (if provided)
- Inquiry type (if selected)
- Subject
- Message content
- Professional HTML formatting with your brand colors

### User Confirmation Email

The email sent to the customer includes:

- Personalized greeting
- Confirmation that their message was received
- Copy of their submitted message
- Professional HTML formatting

## Testing

To test the contact form:

1. Make sure your `.env.local` file has the correct credentials
2. Start your development server: `npm run dev`
3. Navigate to the contact page
4. Fill out the form with valid data
5. Submit the form
6. Check the email inbox for mohamed.saeed1006@gmail.com
7. Check the customer email address for the confirmation email

## Troubleshooting

### "Failed to send email" error

- Verify your Gmail App Password is correct
- Make sure 2-Step Verification is enabled on your Google Account
- Check that the `EMAIL_USER` matches the Gmail account that generated the App Password
- Check the server console for detailed error messages

### Not receiving emails

- Check your spam/junk folder
- Verify the `EMAIL_TO` address is correct
- Make sure Gmail hasn't blocked or rate-limited your account
- Test with a simple email client to ensure the credentials work

### Rate Limits

Gmail has sending limits:

- Free accounts: ~500 emails per day
- Google Workspace: ~2000 emails per day

If you expect high volume, consider using a dedicated email service like SendGrid, AWS SES, or Mailgun.

## Alternative Email Services

If you want to use a different email service instead of Gmail:

### SendGrid

```javascript
// Update the transporter in src/app/api/contact/route.ts
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});
```

### AWS SES

```javascript
const transporter = nodemailer.createTransport({
  host: "email-smtp.us-east-1.amazonaws.com",
  port: 587,
  auth: {
    user: process.env.AWS_SES_USER,
    pass: process.env.AWS_SES_PASS,
  },
});
```

## Files Modified/Created

- `src/app/api/contact/route.ts` - API endpoint for sending emails
- `src/app/[locale]/contact/ContactPageClient.tsx` - Updated to call the API
- `.env.local` - Added EMAIL_TO configuration
- `.env.example` - Documentation for environment variables
- `CONTACT_FORM_EMAIL_SETUP.md` - This file

## Security Best Practices

1. Never commit `.env.local` to version control
2. Use App Passwords, not regular Gmail passwords
3. Validate and sanitize all user input
4. Implement rate limiting to prevent spam (future enhancement)
5. Consider adding CAPTCHA for additional security (future enhancement)

## Future Enhancements

- Add reCAPTCHA to prevent spam
- Implement rate limiting per IP address
- Add attachment support for images/documents
- Store submissions in a database for record-keeping
- Add admin dashboard to view all submissions
- Implement email templates from a template engine
