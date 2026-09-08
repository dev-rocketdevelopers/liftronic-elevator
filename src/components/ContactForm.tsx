"use client";

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "motion/react";
import { FiCheckCircle, FiAlertCircle } from "react-icons/fi";
import {
  contactFormSchema,
  type ContactFormData,
} from "~/lib/validation-schemas";
import { useModal } from "~/contexts/ModalContext";

interface ContactFormProps {
  productOptions?: string[];
}

const hasVisibleInputValue = (value: FormDataEntryValue) =>
  typeof value === "string" ? value.trim().length > 0 : value.size > 0;

export default function ContactForm({ productOptions = [] }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const { setUserTyping } = useModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    mode: "onBlur", // Validate on blur for better UX
    defaultValues: {
      website: "",
    },
  });

  useEffect(() => {
    return () => setUserTyping(false);
  }, [setUserTyping]);

  const handleFormChange = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      const formData = new FormData(event.currentTarget);
      formData.delete("website");
      setUserTyping(Array.from(formData.values()).some(hasVisibleInputValue));
    },
    [setUserTyping],
  );

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("/api/contact", {
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
          message: result.message || "Thank you! We'll get back to you soon.",
        });
        reset({
          website: "",
        });
        setUserTyping(false);
        window.location.assign("/thankyou");
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
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={handleFormChange}
        className="space-y-4"
      >
        <div
          aria-hidden="true"
          className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden"
        >
          <label htmlFor="contact-website">Website</label>
          <input
            id="contact-website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
          />
        </div>

        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name <span className="text-accent">*</span>
          </label>
          <input
            id="name"
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

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="off"
            {...register("email")}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Phone Number <span className="text-accent">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            {...register("phone", {
              required: "Phone number is required",
            })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.phone ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all`}
            placeholder="Enter your phone number"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Product Interest Dropdown */}
        <div>
          <label
            htmlFor="productInterest"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Product Interest <span className="text-accent">*</span>
          </label>
          <select
            id="productInterest"
            autoComplete="off"
            {...register("productInterest", {
              required: "Please select a product",
            })}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.productInterest ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all bg-white`}
          >
            <option value="">Select a product</option>
            {productOptions.map((product) => (
              <option key={product} value={product}>
                {product}
              </option>
            ))}
          </select>
          {errors.productInterest && (
            <p className="mt-1 text-sm text-red-600">
              {errors.productInterest.message}
            </p>
          )}
        </div>

        {/* Location Field */}
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location <span className="text-accent">*</span>
          </label>
          <input
            id="location"
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

        {/* Requirements Textarea */}
        <div>
          <label
            htmlFor="requirements"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Requirements
          </label>
          <textarea
            id="requirements"
            autoComplete="off"
            {...register("requirements")}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.requirements ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-none`}
            placeholder="Tell us about your project requirements..."
          />
          {errors.requirements && (
            <p className="mt-1 text-sm text-red-600">
              {errors.requirements.message}
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
              <span>Submitting...</span>
            </>
          ) : (
            "Send Message"
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
