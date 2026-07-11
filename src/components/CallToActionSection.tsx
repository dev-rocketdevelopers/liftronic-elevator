"use client";

import type { MouseEventHandler } from "react";
import Link from "next/link";
import { motion } from "motion/react";

type CTAAction = {
  label: string;
  href?: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "primary" | "secondary";
};

type CallToActionSectionProps = {
  title?: string;
  description?: string;
  primaryAction?: CTAAction;
  secondaryAction?: CTAAction | null;
};

const renderAction = (action: CTAAction) => {
  const { label, href, onClick, variant = "primary" } = action;

  const isPrimary = variant === "primary";
  const className = isPrimary
    ? "inline-flex items-center justify-center h-11 px-7 rounded-lg bg-white text-gray-900 text-sm font-semibold transition-all duration-200 hover:bg-gray-100 w-full sm:w-auto"
    : "inline-flex items-center justify-center h-11 px-7 rounded-lg border border-white/30 text-white text-sm font-semibold transition-all duration-200 hover:bg-white/10 w-full sm:w-auto";

  if (href) {
    return (
      <motion.div
        key={label}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full sm:w-auto"
      >
        <Link prefetch={false} href={href} className={className}>
          {label}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      key={label}
      type="button"
      className={className}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );
};

export default function CallToActionSection({
  title = "Get in Touch with Us Today",
  description = "Fill out our contact form and let our team get back to you with tailored solutions for your elevator needs. We're here to help you elevate your building.",
  primaryAction,
  secondaryAction,
}: CallToActionSectionProps) {
  const actions: CTAAction[] = [];

  const resolvedPrimary: CTAAction = {
    label: "Get Free Consultation",
    href: "/#contact",
    variant: "primary",
    ...primaryAction,
  };

  actions.push(resolvedPrimary);

  const resolvedSecondary: CTAAction | null =
    secondaryAction === null
      ? null
      : {
          label: "View Our Services",
          href: "/services",
          variant: "secondary",
          ...secondaryAction,
        };

  if (resolvedSecondary) {
    actions.push(resolvedSecondary);
  }

  return (
    <section className="py-16 bg-gradient-to-r from-accent to-green-500 ">
      <div className="container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] mb-4">
            Let&apos;s Build Together
          </p>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 tracking-tight">
            {title}
          </h2>
          <p className="text-sm md:text-base mb-8 max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
          {actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {actions.map((action) => renderAction(action))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
