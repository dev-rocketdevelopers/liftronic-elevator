import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactFormSchema } from "~/lib/validation-schemas";
import { submitToGoogleSheets } from "~/lib/google-sheets";
import { generateContactFormEmail } from "~/lib/email-template";
import { protectFormSubmission } from "~/lib/request-protection";
import { sanityFetch, SANITY_CACHE_TAGS } from "~/sanity/lib/cache";

type EmailConfig = {
  host: string;
  password: string;
  port: number;
  recipientEmail?: string[] | string | null;
  secure: boolean;
  user: string;
  fromName?: string | null;
};

type ContactFormSettings = {
  contactFormGoogleSheetUrl?: string | null;
  emailConfig?: EmailConfig | null;
};

// Fetch homePageSettings from Sanity
async function getHomePageSettings() {
  const query = `*[_type == "homePageSettings"][0]{
    contactFormGoogleSheetUrl,
    emailConfig {
      host,
      port,
      secure,
      user,
      password,
      recipientEmail,
      fromName
    }
  }`;

  return sanityFetch<ContactFormSettings | null>({
    query,
    tags: [SANITY_CACHE_TAGS.forms],
  });
}

function parseRecipientEmails(emails?: string[] | string | null) {
  if (!emails) {
    return [];
  }

  // Handle array of emails (new format)
  if (Array.isArray(emails)) {
    return emails.map((email) => email.trim()).filter(Boolean);
  }

  // Handle legacy string format (comma/semicolon/newline separated)
  return emails
    .split(/[;,\n]/)
    .map((email) => email.trim())
    .filter(Boolean);
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);
    const protectionError = protectFormSubmission(
      request,
      validatedData,
      "contact",
    );

    if (protectionError) {
      return protectionError;
    }

    // Get configuration from Sanity
    const settings = await getHomePageSettings();

    if (!settings) {
      return NextResponse.json(
        {
          error:
            "Form configuration not found. Please contact the administrator.",
        },
        { status: 500 },
      );
    }

    // Submit to Google Sheets
    if (settings.contactFormGoogleSheetUrl) {
      const sheetsResult = await submitToGoogleSheets(
        settings.contactFormGoogleSheetUrl,
        {
          timestamp: new Date().toISOString(),
          name: validatedData.name,
          email: validatedData.email || "",
          phone: validatedData.phone || "",
          productInterest: validatedData.productInterest,
          location: validatedData.location || "",
          requirements: validatedData.requirements || "",
        },
      );

      if (!sheetsResult.success) {
        console.error("Google Sheets submission failed:", sheetsResult.error);
        // Don't fail the entire request if Google Sheets fails
      }
    }

    // Send email notification
    if (settings.emailConfig) {
      const { host, port, secure, user, password, recipientEmail, fromName } =
        settings.emailConfig;

      const recipients = parseRecipientEmails(recipientEmail);

      if (!recipients.length) {
        console.error("No recipient emails configured for contact form.");
        return NextResponse.json(
          {
            error:
              "Email configuration missing. Please contact the administrator.",
          },
          { status: 500 },
        );
      }

      // Create email transporter
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass: password,
        },
      });

      // Generate email HTML
      const emailHtml = generateContactFormEmail(validatedData);

      // Send email
      try {
        await transporter.sendMail({
          from: `"${fromName || "Liftronic Elevators"}" <${user}>`,
          to: recipients.join(", "),
          subject: `New Contact Form Submission - ${validatedData.productInterest}`,
          html: emailHtml,
          replyTo: validatedData.email || undefined,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your inquiry. We'll get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Contact form submission error:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Please check your form inputs and try again." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 },
    );
  }
}
