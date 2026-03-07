"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { HiPhone } from "react-icons/hi2";
import type { BookingSection, StiltzExperience } from "~/sanity/lib/branchTypes";
import PrivateExperienceModal from "~/components/branches/PrivateExperienceModal";

interface BranchStiltzExperienceProps {
  experience?: StiltzExperience;
  bookingSection?: BookingSection;
  branchSlug?: string;
  branchName?: string;
  bgVariant?: "white" | "soft";
}

export default function BranchStiltzExperience({
  experience,
  bookingSection,
  branchSlug,
  branchName,
  bgVariant = "white",
}: BranchStiltzExperienceProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const data = experience;

  if (!data?.intro && (!data?.experiences || data.experiences.length === 0)) {
    return null;
  }

  const isGoa = branchSlug === "goa";

  return (
    <section className={`bg-${bgVariant} py-10 md:py-16`}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-10 md:mb-12"
        >
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-charcoal md:text-5xl">
            {isGoa ? "Experience the Lift of Luxury – Stiltz" : "Stiltz Experience"}
          </h2>
          <p className="mt-4 max-w-4xl text-base leading-relaxed text-gray-600 md:text-lg">
            {data.intro ||
              "Experience a premium home lift in person through live demos, design consultation, and technical walkthroughs with our branch experts."}
          </p>
        </motion.div>

        {data.experiences && data.experiences.length > 0 && (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.experiences.map((item, index) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                viewport={{ once: true, margin: "-60px" }}
                className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-6 shadow-[0_10px_30px_rgba(17,24,39,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_14px_32px_rgba(17,24,39,0.1)] md:p-7"
              >
                <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-brand/85 to-brand/20" />

                <div className="mb-5 flex items-start justify-between">
                  <span className="text-4xl font-extrabold leading-none text-black/12 transition-colors duration-300 group-hover:text-brand/35 md:text-5xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Step
                  </span>
                </div>

                <h3 className="text-xl font-bold leading-snug tracking-tight text-charcoal md:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">
                  {item.description}
                </p>
              </motion.article>
            ))}
          </div>
        )}

        {/* Booking block — shown for any branch with bookingSection */}
        {bookingSection && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2 }}
            viewport={{ once: true, margin: "-60px" }}
            className="mt-10 border-t border-black/8 pt-10"
          >
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              {/* Left: label + heading + description + phone */}
              <div className="space-y-3">
                <p className="text-lg font-normal leading-tight tracking-tight text-gray-500 md:text-xl">
                  Request a Private Experience
                </p>
                {bookingSection.description && (
                  <p className="max-w-md text-base font-semibold leading-relaxed text-gray-700 md:text-lg">
                    To ensure an exclusive personalized experience, we operate
                    by rate of appointment.
                  </p>
                )}
                {bookingSection.conciergePhone && (
                  <a
                    href={`tel:${bookingSection.conciergePhone.replace(/\s/g, "")}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-charcoal"
                  >
                    <HiPhone className="h-4 w-4" />
                    {bookingSection.conciergePhone}
                  </a>
                )}
              </div>

              {/* Right: CTA */}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-charcoal px-7 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-charcoal/90 hover:shadow-lg"
              >
                Book Your Visit Today
              </button>
            </div>
          </motion.div>
        )}
      </div>

      <PrivateExperienceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        branchName={branchName || ""}
        branchSlug={branchSlug || ""}
      />
    </section>
  );
}
