import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { privateExperienceFormSchema } from "~/lib/validation-schemas";
import { submitToGoogleSheets } from "~/lib/google-sheets";
import { generatePrivateExperienceEmail } from "~/lib/email-template";
import { protectFormSubmission } from "~/lib/request-protection";
import {
  sanityFetch,
  SANITY_CACHE_TAGS,
  SANITY_DETAIL_TAGS,
} from "~/sanity/lib/cache";

type EmailConfig = {
  host: string;
  password: string;
  port: number;
  secure: boolean;
  user: string;
  fromName?: string | null;
};

type GlobalSettings = {
  emailConfig?: EmailConfig | null;
};

type BranchFormConfig = {
  name: string;
  privateExperienceFormConfig?: {
    formGoogleSheetUrl?: string | null;
    formRecipientEmails?: string[] | string | null;
  } | null;
};

// Fetch global SMTP config from homePageSettings
async function getEmailConfig() {
  const query = `*[_type == "homePageSettings"][0]{
    emailConfig {
      host,
      port,
      secure,
      user,
      password,
      fromName
    }
  }`;

  return sanityFetch<GlobalSettings | null>({
    query,
    tags: [SANITY_CACHE_TAGS.forms],
  });
}

// Fetch branch-specific form config
async function getBranchFormConfig(slug: string) {
  const query = `*[_type == "branch" && slug.current == $slug && isActive == true][0]{
    name,
    privateExperienceFormConfig {
      formGoogleSheetUrl,
      formRecipientEmails
    }
  }`;

  return sanityFetch<BranchFormConfig | null>({
    query,
    params: { slug },
    tags: [SANITY_CACHE_TAGS.forms, SANITY_DETAIL_TAGS.branch(slug)],
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = privateExperienceFormSchema.parse(body);
    const protectionError = protectFormSubmission(
      request,
      validatedData,
      "private-experience",
    );

    if (protectionError) {
      return protectionError;
    }

    // Fetch configs in parallel
    const [globalSettings, branchConfig] = await Promise.all([
      getEmailConfig(),
      getBranchFormConfig(validatedData.branchSlug),
    ]);

    if (!branchConfig?.privateExperienceFormConfig) {
      return NextResponse.json(
        {
          error:
            "Form configuration not found for this branch. Please contact the administrator.",
        },
        { status: 500 },
      );
    }

    const { formGoogleSheetUrl, formRecipientEmails } =
      branchConfig.privateExperienceFormConfig;

    // Submit to Google Sheets (branch-specific)
    if (formGoogleSheetUrl) {
      const sheetsResult = await submitToGoogleSheets(formGoogleSheetUrl, {
        timestamp: new Date().toISOString(),
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone,
        company: validatedData.company || "",
        branch: validatedData.branchName,
      });

      if (!sheetsResult.success) {
        console.error("Google Sheets submission failed:", sheetsResult.error);
        // Don't fail the entire request if Google Sheets fails
      }
    }

    // Send email notification (global SMTP + branch-specific recipients)
    if (globalSettings?.emailConfig && formRecipientEmails?.length) {
      const { host, port, secure, user, password, fromName } =
        globalSettings.emailConfig;

      const transporter = nodemailer.createTransport({
        host,
        port,
        secure,
        auth: {
          user,
          pass: password,
        },
      });

      const emailHtml = generatePrivateExperienceEmail(validatedData);

      try {
        await transporter.sendMail({
          from: `"${fromName || "Liftronic Elevators"}" <${user}>`,
          to: Array.isArray(formRecipientEmails)
            ? formRecipientEmails.join(", ")
            : formRecipientEmails,
          subject: `New Private Experience Request - ${validatedData.branchName}`,
          html: emailHtml,
          replyTo: validatedData.email,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
        // Don't fail the entire request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message:
        "Thank you for your interest. We'll arrange your private experience and get back to you within 24 hours.",
    });
  } catch (error) {
    console.error("Private experience form submission error:", error);

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
