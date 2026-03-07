import { z } from "zod";

// Contact Form Validation Schema
export const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email address").optional().or(z.literal("")),
  phone: z.string()
    .refine(
      (val) => {
        // Remove all non-digit characters
        const digits = val.replace(/\D/g, "");
        // Check if it's 10 digits (without country code) or 12 digits (with 91 country code)
        if (digits.length === 10) {
          // Check if first digit is 6-9 (valid mobile range)
          return /^[6-9]/.test(digits);
        } else if (digits.length === 12) {
          // Must start with 91 (India country code) followed by 6-9
          return /^91[6-9]/.test(digits);
        }
        return false;
      },
      "Please enter a valid Indian phone number (10 digits starting with 6-9)"
    ),
  productInterest: z.string().min(1, "Please select a product"),
  location: z.string().optional(),
  requirements: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Catalog Form Validation Schema
export const catalogFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z.string()
    .refine(
      (val) => {
        // Remove all non-digit characters
        const digits = val.replace(/\D/g, "");
        // Must be exactly 10 digits
        return digits.length === 10 && /^[6-9]/.test(digits);
      },
      "Please enter a valid 10-digit phone number starting with 6-9"
    ),
  location: z.string().optional(),
});

export type CatalogFormData = z.infer<typeof catalogFormSchema>;

// Private Experience Form Validation Schema
export const privateExperienceFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.email("Please enter a valid email address"),
  phone: z.string()
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, "");
        if (digits.length === 10) {
          return /^[6-9]/.test(digits);
        } else if (digits.length === 12) {
          return /^91[6-9]/.test(digits);
        }
        return false;
      },
      "Please enter a valid Indian phone number (10 digits starting with 6-9)"
    ),
  company: z.string().optional(),
  branchName: z.string(),
  branchSlug: z.string(),
});

export type PrivateExperienceFormData = z.infer<typeof privateExperienceFormSchema>;
