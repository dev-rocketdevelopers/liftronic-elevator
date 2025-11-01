"use client";

import { motion } from "motion/react";
import Link from "next/link";
import type { ServiceOffered } from "~/sanity/lib/serviceTypes";
import { getIcon } from "~/sanity/utils/iconMapper";

type MegaMenuServicesProps = {
  services: ServiceOffered[];
};

/**
 * Services mega menu with two-column grid layout
 */
export function MegaMenuServices({ services }: MegaMenuServicesProps) {
  return (
    <div className="p-6 lg:p-8 max-h-[80vh] overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wide mb-6">
        Our Services
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {services.map((service, index) => {
          const IconComponent = service.icon ? getIcon(service.icon) : null;

          return (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block p-4 rounded-lg border border-transparent hover:border-accent/30 hover:bg-white/5 hover:shadow-md hover:-translate-y-1 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  {IconComponent && (
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-brand to-accent flex items-center justify-center text-charcoal group-hover:scale-110 transition-transform duration-200">
                      <IconComponent className="w-6 h-6" />
                    </div>
                  )}

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white group-hover:text-accent transition-colors mb-1 flex items-center gap-2">
                      {service.title}
                      {service.featured && (
                        <span className="text-xs px-2 py-0.5 bg-accent/30 text-accent rounded-full">
                          Popular
                        </span>
                      )}
                    </h4>
                    {service.summary && (
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {service.summary}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-gray-500 group-hover:text-accent group-hover:translate-x-1 transition-all"
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
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* View All Link */}
      <div className="pt-4 border-t border-white/10">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-charcoal rounded-lg font-semibold hover:bg-white hover:shadow-lg hover:-translate-y-0.5 transition-all"
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
  );
}
