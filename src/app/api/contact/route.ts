import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// POST /api/contact - Send contact form email
export async function POST(request: NextRequest) {
  console.log("📧 Contact API called");

  try {
    const body = await request.json();
    const { name, email, phone, subject, message, inquiryType } = body;

    console.log("📝 Received form data:", {
      name,
      email,
      phone,
      subject,
      inquiryType,
      messageLength: message?.length,
    });

    // Validate required fields
    if (!name || !email || !subject || !message) {
      console.error("❌ Validation failed: Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error("❌ Validation failed: Invalid email address");
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Check environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error(
        "❌ Email credentials not configured in environment variables"
      );
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    console.log("🔧 Creating email transporter...");
    console.log("📮 Email will be sent from:", process.env.EMAIL_USER);
    console.log(
      "📬 Email will be sent to:",
      process.env.EMAIL_TO || "mohamed.saeed1006@gmail.com"
    );

    // Create transporter using Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    console.log("🔍 Verifying transporter configuration...");
    try {
      await transporter.verify();
      console.log("✅ Transporter verified successfully");
    } catch (verifyError) {
      console.error("❌ Transporter verification failed:", verifyError);
      throw new Error("Email configuration error");
    }

    // Prepare inquiry type text
    const inquiryTypeText = inquiryType ? `\nInquiry Type: ${inquiryType}` : "";
    const phoneText = phone ? `\nPhone: ${phone}` : "";

    // Email content to admin (you)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || "mohamed.saeed1006@gmail.com",
      subject: `Contact Form: ${subject}`,
      text: `
You have received a new message from the contact form:

Name: ${name}
Email: ${email}${phoneText}${inquiryTypeText}
Subject: ${subject}

Message:
${message}

---
This email was sent from your website contact form.
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8b500; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #555; }
    .value { margin-top: 5px; padding: 10px; background-color: white; border-left: 3px solid #f8b500; }
    .message-box { margin-top: 10px; padding: 15px; background-color: white; border: 1px solid #ddd; border-radius: 5px; white-space: pre-wrap; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">From:</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value"><a href="mailto:${email}">${email}</a></div>
      </div>
      ${
        phone
          ? `
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${phone}</div>
      </div>
      `
          : ""
      }
      ${
        inquiryType
          ? `
      <div class="field">
        <div class="label">Inquiry Type:</div>
        <div class="value">${inquiryType}</div>
      </div>
      `
          : ""
      }
      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${subject}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="message-box">${message}</div>
      </div>
      <div class="footer">
        This email was sent from your website contact form.
      </div>
    </div>
  </div>
</body>
</html>
      `,
    };

    // Send email to admin
    console.log("📤 Sending email to admin...");
    try {
      const adminInfo = await transporter.sendMail(mailOptions);
      console.log("✅ Email sent to admin successfully!");
      console.log("📧 Message ID:", adminInfo.messageId);
    } catch (adminEmailError) {
      console.error("❌ Failed to send email to admin:", adminEmailError);
      throw adminEmailError;
    }

    // Send confirmation email to user
    console.log("📤 Sending confirmation email to user...");
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for contacting us",
      text: `
Dear ${name},

Thank you for contacting us. We have received your message and will get back to you as soon as possible.

Your message:
Subject: ${subject}
${message}

Best regards,
Auto Parts Team
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #f8b500; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
    .content { background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 5px 5px; }
    .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Thank You for Contacting Us</h2>
    </div>
    <div class="content">
      <p>Dear ${name},</p>
      <p>Thank you for contacting us. We have received your message and will get back to you as soon as possible.</p>
      <p><strong>Your message:</strong></p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p style="padding: 15px; background-color: white; border-left: 3px solid #f8b500; white-space: pre-wrap;">${message}</p>
      <div class="footer">
        <p>Best regards,<br>Auto Parts Team</p>
      </div>
    </div>
  </div>
</body>
</html>
      `,
    };

    try {
      const userInfo = await transporter.sendMail(confirmationMailOptions);
      console.log("✅ Confirmation email sent to user successfully!");
      console.log("📧 Message ID:", userInfo.messageId);
    } catch (userEmailError) {
      console.error(
        "⚠️ Failed to send confirmation email to user (non-critical):",
        userEmailError
      );
      // Don't throw error - admin email is more important
    }

    console.log("🎉 Contact form submission completed successfully!");
    return NextResponse.json(
      { message: "Email sent successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error in contact API:", error);

    // Provide more detailed error message
    let errorMessage = "Failed to send email. Please try again later.";
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      if (error.message.includes("Invalid login")) {
        errorMessage =
          "Email service authentication failed. Please contact support.";
      } else if (error.message.includes("ECONNREFUSED")) {
        errorMessage =
          "Cannot connect to email server. Please try again later.";
      }
    }

    return NextResponse.json(
      { error: errorMessage, success: false },
      { status: 500 }
    );
  }
}
