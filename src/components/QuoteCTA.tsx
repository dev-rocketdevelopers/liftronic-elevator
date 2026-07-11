"use client";
import { motion } from "motion/react";
import Link from "next/link";
import Quote from "~/components/Quote";

type QuoteCTAProps = {
  quote: string;
  ctaText: string;
  ctaHref: string;
  onClick?: () => void;
  className?: string;
};

export default function QuoteCTA({
  quote,
  ctaText,
  ctaHref,
  onClick,
  className = "",
}: QuoteCTAProps) {
  // Check if custom background is provided in className
  const hasCustomBackground =
    className?.includes("bg-") || className?.includes("backdrop-blur");
  const defaultBackground = hasCustomBackground
    ? ""
    : "bg-gradient-to-r from-gray-50 to-white border-gray-100 shadow-sm";

  return (
    <motion.div
      className={`flex flex-col gap-4 md:gap-6 p-4 md:p-6 rounded-xl md:rounded-2xl md:flex-row md:items-center md:justify-between ${defaultBackground} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Quote */}
      <div className="flex-1">
        <Quote quote={quote} />
      </div>

      {/* CTA Button */}
      <div className="flex-shrink-0 w-full md:w-auto">
        <Link
          prefetch={false}
          href={ctaHref}
          className="inline-flex items-center justify-center w-full md:w-auto rounded-lg bg-accent px-4 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-medium text-black transition-all hover:bg-accent/90 hover:shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 shadow-sm"
          onClick={onClick}
        >
          {ctaText}
          <svg
            className="ml-2 h-4 w-4 md:h-5 md:w-5"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </Link>
      </div>
    </motion.div>
  );
}
