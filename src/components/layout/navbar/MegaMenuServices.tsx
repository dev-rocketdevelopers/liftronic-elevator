"use client";

import { motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";
import { FiHeadphones, FiMail, FiPhoneCall } from "react-icons/fi";
import type { ServiceOffered } from "~/sanity/lib/serviceTypes";
import type { ContactInfo } from "~/../typings";

type MegaMenuServicesProps = {
  services: ServiceOffered[];
  contactInfo: ContactInfo | null;
  onNavigate: () => void;
};

/**
 * Services mega menu with two-column layout:
 * - Left pane: All services in a grid (similar to Products)
 * - Right pane: Contact Us card (same as Products)
 */
export function MegaMenuServices({
  services,
  contactInfo,
  onNavigate,
}: MegaMenuServicesProps) {
  // Fallback contact data
  const fallbackContactInfo = {
    supportPhone: "1800 890 8411",
    supportPhoneLabel: "Liftronic Care",
    email: "info@liftronicelevator.com",
    emailLabel: "Send us Email",
    salesPhone: "+91 9028226664",
    salesPhoneLabel: "Sales Enquiry",
    serviceArea: "Serving Mumbai, Pune & major metros",
  };

  const contact = contactInfo || fallbackContactInfo;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-6 lg:p-8 h-[650px]">
      {/* Left Pane: Services Grid */}
      <div className="lg:col-span-9 border-r border-white/10 px-6 overflow-y-auto">
        <h3 className="text-sm font-bold text-gray-300 uppercase tracking-wide mb-4 sticky top-0 bg-charcoal pb-2 z-10">
          Our Services
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pb-2">
          {services.map((service, index) => {
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={`/services/${service.slug}`}
                  onClick={() => onNavigate()}
                  className="group block rounded-lg overflow-hidden bg-gray-700/40 hover:bg-gray-600/50 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-600/30"
                >
                  {/* Service Image */}
                  <div className="relative aspect-[4/3] bg-gray-800">
                    {service.image ? (
                      <Image
                        src={service.image}
                        alt={service.imageAlt || service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 50vw, 300px"
                        placeholder={service.imageLqip ? "blur" : "empty"}
                        blurDataURL={service.imageLqip}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span className="text-xs">No Image</span>
                      </div>
                    )}
                    {service.featured && (
                      <div className="absolute top-2 right-2 bg-accent text-charcoal text-xs px-2 py-1 rounded-full font-bold shadow-lg">
                        Popular
                      </div>
                    )}
                  </div>

                  {/* Service Content */}
                  <div className="p-3 bg-gray-700/60">
                    <h4 className="font-semibold text-sm text-white group-hover:text-accent transition-colors line-clamp-2">
                      {service.title}
                    </h4>
                    {service.summary && (
                      <p className="text-xs text-gray-300 mt-1 line-clamp-1">
                        {service.summary}
                      </p>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="mt-4 text-center">
          <Link
            href="/services"
            onClick={() => onNavigate()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand/20 hover:bg-brand/30 text-white rounded-lg transition-all font-semibold text-sm border border-brand/40 hover:border-brand/60"
          >
            View All Services
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>

      {/* Right Pane: Contact Details (Same as Products) */}
      <div className="lg:col-span-3 overflow-y-auto">
        <div className="sticky top-0">
          <div className="bg-gradient-to-br from-brand/30 to-accent/30 rounded-xl p-5 border border-brand/40 backdrop-blur-sm shadow-lg">
            <div className="flex items-center gap-2 mb-4">
              <span className="h-1 w-8 bg-accent rounded-full" />
              <span className="text-xs font-bold text-accent uppercase tracking-wide">
                Contact Us
              </span>
            </div>

            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex-1">
                <h4 className="text-base font-semibold text-white">
                  Request a Quote
                </h4>
                <p className="text-xs text-gray-200 mt-1">
                  Speak to our design & installation team
                </p>
              </div>
              <div className="rounded-full bg-accent/30 p-2 flex-shrink-0">
                <FiHeadphones className="text-accent text-lg" />
              </div>
            </div>

            <div className="space-y-2">
              <a
                href={`tel:${contact.supportPhone.replace(/\s/g, "")}`}
                className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div>
                  <p className="text-[10px] text-gray-200">
                    {contact.supportPhoneLabel}
                  </p>
                  <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                    {contact.supportPhone}
                  </p>
                </div>
                <FiPhoneCall className="text-accent text-base" />
              </a>

              <a
                href={`mailto:${contact.email}`}
                className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div>
                  <p className="text-[10px] text-gray-200">
                    {contact.emailLabel}
                  </p>
                  <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                    {contact.email}
                  </p>
                </div>
                <FiMail className="text-accent text-base" />
              </a>

              <a
                href={`tel:${contact.salesPhone.replace(/\s/g, "")}`}
                className="flex items-center justify-between bg-white/10 p-2.5 rounded-lg border border-white/20 hover:bg-white/20 transition-all group"
              >
                <div>
                  <p className="text-[10px] text-gray-200">
                    {contact.salesPhoneLabel}
                  </p>
                  <p className="text-sm font-medium text-white group-hover:text-accent transition-colors">
                    {contact.salesPhone}
                  </p>
                </div>
                <FiPhoneCall className="text-accent text-base" />
              </a>
            </div>

            {contact.serviceArea && (
              <div className="mt-4 text-[10px] text-gray-200 border-t border-white/20 pt-3">
                {contact.serviceArea}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
