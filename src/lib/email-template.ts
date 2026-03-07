import { ContactFormData, CatalogFormData, PrivateExperienceFormData } from "./validation-schemas";

// Use absolute URL for logo in emails
// Note: Email clients require absolute URLs, not relative paths
const LOGO_URL =
  "https://liftronic-elevator.vercel.app/_next/image?url=%2Fliftronic.png&w=96&q=75"; // Fallback hosted image
// If you have your own domain, replace with: `${process.env.NEXT_PUBLIC_SITE_URL}/liftronic.png`
// Make sure NEXT_PUBLIC_SITE_URL is set to your live domain (not localhost)

const ACCENT_COLOR = "#2ae394";
const CHARCOAL_COLOR = "#1a1a1a";

export function generateContactFormEmail(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, ${ACCENT_COLOR} 0%, #1fa876 100%); border-radius: 16px 16px 0 0;">
              <img src="${LOGO_URL}" alt="Liftronic" style="max-width: 180px; height: auto; margin-bottom: 16px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Contact Form Submission</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                You have received a new contact form submission from your website.
              </p>

              <!-- Form Data -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.name}</p>
                  </td>
                </tr>

                ${
                  data.email
                    ? `
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">
                      <a href="mailto:${data.email}" style="color: ${ACCENT_COLOR}; text-decoration: none;">${data.email}</a>
                    </p>
                  </td>
                </tr>
                `
                    : ""
                }

                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">
                      <a href="tel:${data.phone}" style="color: ${ACCENT_COLOR}; text-decoration: none;">${data.phone}</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Product Interest</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.productInterest}</p>
                  </td>
                </tr>

                ${
                  data.location
                    ? `
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.location}</p>
                  </td>
                </tr>
                `
                    : ""
                }

                ${
                  data.requirements
                    ? `
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Requirements</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; line-height: 1.6; white-space: pre-wrap;">${data.requirements}</p>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>

              <!-- CTA Button -->
              <div style="margin-top: 32px; text-align: center;">
                <p style="margin: 0; color: #999999; font-size: 14px;">
                  Submitted on ${new Date().toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9f9f9; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #999999; font-size: 12px; text-align: center; line-height: 1.5;">
                This email was sent from the contact form on your Liftronic Elevators website.<br>
                Please respond to the customer within 24 hours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generateCatalogFormEmail(data: CatalogFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Catalog Download Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, ${ACCENT_COLOR} 0%, #1fa876 100%); border-radius: 16px 16px 0 0;">
              <img src="${LOGO_URL}" alt="Liftronic" style="max-width: 180px; height: auto; margin-bottom: 16px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Catalog Download Request</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                A visitor has requested to download your product catalog.
              </p>

              <!-- Form Data -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.name}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">
                      <a href="tel:${data.phone}" style="color: ${ACCENT_COLOR}; text-decoration: none;">${data.phone}</a>
                    </p>
                  </td>
                </tr>

                ${
                  data.location
                    ? `
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Location</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.location}</p>
                  </td>
                </tr>
                `
                    : ""
                }
              </table>

              <!-- CTA Button -->
              <div style="margin-top: 32px; text-align: center;">
                <p style="margin: 0; color: #999999; font-size: 14px;">
                  Downloaded on ${new Date().toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9f9f9; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #999999; font-size: 12px; text-align: center; line-height: 1.5;">
                This email was sent from the catalog download form on your Liftronic Elevators website.<br>
                This is a potential lead - consider following up within 24 hours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

export function generatePrivateExperienceEmail(data: PrivateExperienceFormData): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Private Experience Request</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 32px; text-align: center; background: linear-gradient(135deg, ${ACCENT_COLOR} 0%, #1fa876 100%); border-radius: 16px 16px 0 0;">
              <img src="${LOGO_URL}" alt="Liftronic" style="max-width: 180px; height: auto; margin-bottom: 16px;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">New Private Experience Request</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 24px; color: #666666; font-size: 16px; line-height: 1.5;">
                A visitor has requested a private experience at your <strong>${data.branchName}</strong> branch.
              </p>

              <!-- Form Data -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Name</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.name}</p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Email</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">
                      <a href="mailto:${data.email}" style="color: ${ACCENT_COLOR}; text-decoration: none;">${data.email}</a>
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Phone</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">
                      <a href="tel:${data.phone}" style="color: ${ACCENT_COLOR}; text-decoration: none;">${data.phone}</a>
                    </p>
                  </td>
                </tr>

                ${
                  data.company
                    ? `
                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Company</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.company}</p>
                  </td>
                </tr>
                `
                    : ""
                }

                <tr>
                  <td style="padding: 12px 16px; background-color: #f9f9f9; border-left: 4px solid ${ACCENT_COLOR}; margin-bottom: 8px;">
                    <p style="margin: 0; color: #999999; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Branch</p>
                    <p style="margin: 4px 0 0; color: ${CHARCOAL_COLOR}; font-size: 16px; font-weight: 500;">${data.branchName}</p>
                  </td>
                </tr>
              </table>

              <!-- Timestamp -->
              <div style="margin-top: 32px; text-align: center;">
                <p style="margin: 0; color: #999999; font-size: 14px;">
                  Submitted on ${new Date().toLocaleString("en-US", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 32px; background-color: #f9f9f9; border-radius: 0 0 16px 16px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #999999; font-size: 12px; text-align: center; line-height: 1.5;">
                This email was sent from the private experience form on your Liftronic Elevators website.<br>
                Please respond to the customer within 24 hours.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
