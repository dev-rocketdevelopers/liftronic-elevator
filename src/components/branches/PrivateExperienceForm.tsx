"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import {
  privateExperienceFormSchema,
  type PrivateExperienceFormData,
} from "~/lib/validation-schemas";

interface PrivateExperienceFormProps {
  branchName: string;
  branchSlug: string;
}

export default function PrivateExperienceForm({
  branchName,
  branchSlug,
}: PrivateExperienceFormProps) {
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
  } = useForm<PrivateExperienceFormData>({
    resolver: zodResolver(privateExperienceFormSchema),
    mode: "onBlur",
    defaultValues: {
      branchName,
      branchSlug,
    },
  });

  const onSubmit = async (data: PrivateExperienceFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/private-experience", {
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
          message:
            result.message ||
            "Thank you! We'll arrange your private experience shortly.",
        });
        reset({ branchName, branchSlug });
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
        {/* Hidden fields */}
        <input type="hidden" {...register("branchName")} />
        <input type="hidden" {...register("branchSlug")} />

        {/* Full Name Field */}
        <div>
          <label
            htmlFor="pe-name"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Full Name <span className="text-accent">*</span>
          </label>
          <input
            id="pe-name"
            type="text"
            {...register("name")}
            className={`w-full rounded-lg border px-4 py-3 ${
              errors.name ? "border-red-500" : "border-gray-300"
            } transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent`}
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="pe-email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email <span className="text-accent">*</span>
          </label>
          <input
            id="pe-email"
            type="email"
            {...register("email")}
            className={`w-full rounded-lg border px-4 py-3 ${
              errors.email ? "border-red-500" : "border-gray-300"
            } transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="pe-phone"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Phone Number <span className="text-accent">*</span>
          </label>
          <input
            id="pe-phone"
            type="tel"
            {...register("phone")}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.value = input.value.replace(/\D/g, "");
            }}
            maxLength={10}
            className={`w-full rounded-lg border px-4 py-3 ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Company Field (optional) */}
        <div>
          <label
            htmlFor="pe-company"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Company
          </label>
          <input
            id="pe-company"
            type="text"
            {...register("company")}
            className={`w-full rounded-lg border px-4 py-3 ${
              errors.company ? "border-red-500" : "border-gray-300"
            } transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-accent`}
            placeholder="Your company name (optional)"
          />
          {errors.company && (
            <p className="mt-1 text-sm text-red-600">
              {errors.company.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-accent px-6 py-4 font-medium transition-all hover:bg-accent/90 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-r-transparent" />
              <span>Submitting...</span>
            </>
          ) : (
            "Request Your Visit"
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
            className={`mt-4 flex items-start gap-3 rounded-lg p-4 ${
              submitStatus.type === "success"
                ? "border border-accent/20 bg-accent/10"
                : "border border-red-200 bg-red-50"
            }`}
          >
            {submitStatus.type === "success" ? (
              <FiCheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
            ) : (
              <FiAlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
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
