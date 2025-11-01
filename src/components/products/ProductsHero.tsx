"use client";
import Link from "next/link";
import { motion } from "motion/react";
import { FiEye, FiMessageSquare } from "react-icons/fi";
import Breadcrumb from "~/components/Breadcrumb";

export default function ProductsHero() {
  return (
    <section className="relative">
      {/* Background image - hidden on mobile, shown on desktop */}
      <div
        className="absolute inset-0 hidden md:block bg-cover opacity-60 bg-no-repeat bg-right"
        style={{
          backgroundImage: "url(/illustrations/lift01.png)",
        }}
      />

      {/* Content overlay */}
      <div className="relative z-10 container mx-auto px-6 py-8 md:pt-28 md:pb-20">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Products", isCurrentPage: true },
          ]}
        />

        <div className="hidden md:block max-w-3xl mt-10">
          <p className="text-sm font-semibold tracking-wide text-gray-500">
            Our Product Ranges
          </p>
          <h1 className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">
            Elevate every building with precision
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Explore our comprehensive range of elevator solutions spanning
            residential, commercial and industrial needs. Designed for safety,
            efficiency and seamless ride quality.
          </p>
          <div className="mt-6 flex gap-3">
            <Link href="/#contact">
              <motion.button
                className="btn btn-primary px-4 py-2 text-sm md:px-8 md:py-3 md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiMessageSquare className="text-sm md:text-base" />
                Request a Quote
              </motion.button>
            </Link>
            <Link href="/services">
              <motion.button
                className="btn border-2 border-gray-200 bg-white/80 text-charcoal hover:bg-gray-50 hover:border-gray-300 backdrop-blur-sm transition-all duration-300 px-4 py-2 text-sm md:px-8 md:py-3 md:text-base"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiEye className="text-sm md:text-base" />
                View Services
              </motion.button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
