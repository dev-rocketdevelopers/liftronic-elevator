"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HiEnvelope, HiMapPin, HiPhone } from "react-icons/hi2";
import type { Branch } from "~/sanity/lib/branchTypes";

interface BranchHeroProps {
  branch: Branch;
}

export default function BranchHero({ branch }: BranchHeroProps) {
  const isGoa = branch.slug === "goa";
  const heroTitle = branch.heroTitle;
  const tagline = branch.tagline;

  return (
    <section className="relative overflow-hidden bg-white">
      {/* Decorative large city name — behind content */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-6 right-0 select-none overflow-hidden"
      >
        <span
          className="block text-[clamp(6rem,20vw,18rem)] font-extrabold leading-none tracking-tighter text-black/[0.035]"
          style={{ whiteSpace: "nowrap" }}
        >
          {branch.city}
        </span>
      </div>

      {/* Thin accent line at top */}
      <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

      <div className="container mx-auto px-4 pb-14 pt-32 md:px-6 md:pb-20 md:pt-40">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          aria-label="Breadcrumb"
        >
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
            <li>
              <Link
                prefetch={false}
                href="/"
                className="transition-colors hover:text-charcoal"
              >
                Home
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li>
              <Link
                prefetch={false}
                href="/branches"
                className="transition-colors hover:text-charcoal"
              >
                Branches
              </Link>
            </li>
            <li aria-hidden className="text-gray-300">
              /
            </li>
            <li aria-current="page" className="font-medium text-charcoal">
              {branch.city}
            </li>
          </ol>
        </motion.nav>

        {/* Main headline block */}
        <div
          className={`mt-4 grid grid-cols-1 gap-12 ${!isGoa && branch.contactPerson ? "lg:grid-cols-[1fr_auto] lg:items-stretch" : ""}`}
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
            >
              <h1 className="mt-3 text-5xl font-extrabold leading-[1.0] tracking-tight text-charcoal md:text-7xl">
                {branch.name}
              </h1>

              {isGoa ? (
                <>
                  {heroTitle && (
                    <h2 className="mt-6 text-xl font-semibold leading-relaxed text-gray-700 md:text-2xl">
                      {heroTitle}
                    </h2>
                  )}
                  {tagline && (
                    <p className="mt-4 font-serif italic text-lg leading-relaxed text-gray-500 md:text-xl">
                      {tagline}
                    </p>
                  )}
                </>
              ) : (
                <>
                  {heroTitle && (
                    <p className="mt-6 text-lg leading-relaxed text-gray-600 md:text-xl">
                      {heroTitle}
                    </p>
                  )}
                  {tagline && !heroTitle && (
                    <p className="mt-6 text-lg leading-relaxed text-gray-500 md:text-xl">
                      {tagline}
                    </p>
                  )}
                  {branch.description && (
                    <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
                      {branch.description}
                    </p>
                  )}
                </>
              )}
            </motion.div>

            {/* CTA row */}
            {!isGoa && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 }}
                className="mt-9 flex flex-wrap items-center gap-3"
              >
                <a
                  href={`mailto:${branch.email}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                >
                  <HiEnvelope className="h-4 w-4 text-brand" />
                  Email Team
                </a>
                {branch.mapUrl && (
                  <a
                    href={branch.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3 text-sm font-semibold text-charcoal transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
                  >
                    <HiMapPin className="h-4 w-4 text-brand" />
                    View on Map
                  </a>
                )}
              </motion.div>
            )}
          </div>

          {/* Branch lead contact card — hidden for Goa */}
          {!isGoa && branch.contactPerson && (
            <motion.aside
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="self-stretch"
            >
              <div className="flex h-full w-full flex-col rounded-2xl border border-accent/30 bg-accent/[0.07] p-7 shadow-[0_4px_24px_-8px_rgba(42,227,148,0.12)] backdrop-blur-[2px] ring-1 ring-black/[0.04] lg:w-80">
                {/* Label */}
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand/70">
                  Branch Lead
                </p>

                {/* Name + position */}
                <div className="mt-5">
                  <p className="text-3xl font-extrabold leading-tight tracking-tight text-charcoal">
                    {branch.contactPerson.name}
                  </p>
                  <p className="mt-2 text-[15px] font-medium text-gray-500">
                    {branch.contactPerson.position}
                  </p>
                </div>

                {/* Divider */}
                <div className="my-5 h-px w-full bg-accent/20" />

                {/* Contact links */}
                <div className="space-y-2.5">
                  {branch.contactPerson.phone && (
                    <a
                      href={`tel:${branch.contactPerson.phone}`}
                      className="flex items-center gap-3 rounded-xl border border-accent/15 bg-accent/[0.06] px-4 py-3 text-[15px] font-medium text-charcoal transition-all duration-200 hover:border-accent/40 hover:bg-accent/[0.14] hover:text-brand"
                    >
                      <HiPhone className="h-4 w-4 shrink-0 text-brand" />
                      {branch.contactPerson.phone}
                    </a>
                  )}
                  {branch.contactPerson.email && (
                    <a
                      href={`mailto:${branch.contactPerson.email}`}
                      className="flex items-center gap-3 rounded-xl border border-accent/15 bg-accent/[0.06] px-4 py-3 text-[15px] font-medium text-charcoal transition-all duration-200 hover:border-accent/40 hover:bg-accent/[0.14] hover:text-brand"
                    >
                      <HiEnvelope className="h-4 w-4 shrink-0 text-brand" />
                      <span className="break-all">
                        {branch.contactPerson.email}
                      </span>
                    </a>
                  )}
                </div>

                {/* Accent bar at bottom */}
                <div className="mt-auto pt-6">
                  <div className="h-[2px] w-8 rounded-full bg-accent/50" />
                </div>
              </div>
            </motion.aside>
          )}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="absolute bottom-0 left-0 h-px w-full bg-black/8" />
    </section>
  );
}
