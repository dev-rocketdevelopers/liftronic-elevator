import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { catalogFormSchema } from "~/lib/validation-schemas";
import { submitToGoogleSheets } from "~/lib/google-sheets";
import { generateCatalogFormEmail } from "~/lib/email-template";
import { client } from "~/sanity/lib/client";

// Fetch homePageSettings from Sanity
async function getHomePageSettings() {
  const query = `*[_type == "homePageSettings"][0]{
    catalogFormGoogleSheetUrl,
    "catalogPdfUrl": catalogPdf.asset->url,
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

  return await client.fetch(query);
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = catalogFormSchema.parse(body);

    // Get configuration from Sanity
    const settings = await getHomePageSettings();

    if (!settings) {
      return NextResponse.json(
        { error: "Form configuration not found. Please contact the administrator." },
        { status: 500 }
      );
    }

    // Submit to Google Sheets
    if (settings.catalogFormGoogleSheetUrl) {
      const sheetsResult = await submitToGoogleSheets(
        settings.catalogFormGoogleSheetUrl,
        {
          timestamp: new Date().toISOString(),
          name: validatedData.name,
          phone: validatedData.phone,
          location: validatedData.location || "",
        }
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
      const emailHtml = generateCatalogFormEmail(validatedData);

      // Send email
      try {
        await transporter.sendMail({
          from: `"${fromName || "Liftronic Elevators"}" <${user}>`,
          to: recipientEmail,
          subject: "New Catalog Download Request",
          html: emailHtml,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    // Return catalog PDF URL if available
    return NextResponse.json({
      success: true,
      message: "Thank you! Your catalog download will begin shortly.",
      catalogUrl: settings.catalogPdfUrl || null,
    });
  } catch (error) {
    console.error("Catalog form submission error:", error);

    // Handle validation errors
    if (error instanceof Error && error.name === "ZodError") {
      return NextResponse.json(
        { error: "Please check your form inputs and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
