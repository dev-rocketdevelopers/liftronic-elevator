"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { FiCheckCircle, FiAlertCircle, FiDownload } from "react-icons/fi";
import {
  catalogFormSchema,
  type CatalogFormData,
} from "~/lib/validation-schemas";

interface CatalogFormProps {
  onSuccess?: () => void;
}

export default function CatalogForm({ onSuccess }: CatalogFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CatalogFormData>({
    resolver: zodResolver(catalogFormSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      website: "",
    },
  });

  const onSubmit = async (data: CatalogFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/catalog", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitStatus({
          type: "success",
          message: result.message || "Download will begin shortly!",
        });
        reset({
          website: "",
        });

        // Trigger PDF download if URL is available
        if (result.catalogUrl) {
          // Create a temporary anchor element to trigger download
          const link = document.createElement("a");
          link.href = result.catalogUrl;
          link.download = "Liftronic-Catalog.pdf";
          link.target = "_blank";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          // Call success callback after a short delay to allow download to start
          if (onSuccess) {
            setTimeout(onSuccess, 1500);
          }
          setTimeout(() => window.location.assign("/thankyou"), 1500);
        } else {
          // If no catalog URL, show error
          setSubmitStatus({
            type: "error",
            message: "Catalog file not available. Please contact support.",
          });
        }
      } else {
        setSubmitStatus({
          type: "error",
          message: result.error || "Something went wrong. Please try again.",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus({
        type: "error",
        message: "Failed to submit form. Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="catalog-website">Website</label>
          <input
            id="catalog-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor="catalog-name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="catalog-name"
            type="text"
            autoComplete="off"
            {...register("name", { required: "Name is required" })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="catalog-phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number <span className="text-accent">*</span>
          </label>
          <input
            id="catalog-phone"
            type="tel"
            autoComplete="off"
            {...register("phone", { required: "Phone number is required" })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label
            htmlFor="catalog-location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location <span className="text-accent">*</span>
          </label>
          <input
            id="catalog-location"
            type="text"
            autoComplete="off"
            {...register("location", { required: "Location is required" })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.location ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
            placeholder="City, State"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full px-6 py-4 bg-accent rounded-lg font-medium hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <FiDownload className="w-5 h-5" />
              <span>Download Catalog</span>
            </>
          )}
        </button>
      </form>

      {/* Success/Error Messages */}
      <AnimatePresence>
        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mt-4 p-4 rounded-lg flex items-start gap-3 ${
              submitStatus.type === "success"
                ? "bg-accent/10 border border-accent/20"
                : "bg-red-50 border border-red-200"
            }`}
          >
            {submitStatus.type === "success" ? (
              <FiCheckCircle className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            ) : (
              <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <p
              className={`text-sm ${
                submitStatus.type === "success" ? "text-accent" : "text-red-600"
              }`}
            >
              {submitStatus.message}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
