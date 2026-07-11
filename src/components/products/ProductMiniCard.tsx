"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

type ProductMiniCardProps = {
  title: string;
  description: string;
  slug: string;
  imageSrc?: string;
  imageAlt?: string;
  blurDataURL?: string;
  featured?: boolean;
  rangeTitle?: string;
};

export default function ProductMiniCard({
  title,
  description,
  slug,
  imageSrc,
  imageAlt,
  blurDataURL,
  featured = false,
  rangeTitle,
}: ProductMiniCardProps) {
  const finalImageSrc = imageSrc || "/illustrations/product01.png";
  const finalImageAlt = imageAlt || `${title} - Product image`;

  return (
    <Link
      prefetch={false}
      href={`/products/${slug}`}
      className="block h-full group"
    >
      <motion.article
        className="relative h-full flex flex-col overflow-hidden rounded-xl bg-white border border-gray-200 transition-all duration-300 hover:border-gray-200"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.2 }}
      >
        {featured && (
          <div className="absolute right-3 top-3 z-10">
            <span className="inline-flex bg-accent items-center font-semibold rounded-md px-2 py-0.5 text-[10px] uppercase tracking-wider">
              Featured
            </span>
          </div>
        )}

        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <Image
            src={finalImageSrc}
            alt={finalImageAlt}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(min-width: 1280px) 400px, (min-width: 768px) 350px, 100vw"
            placeholder={blurDataURL ? "blur" : "empty"}
            blurDataURL={blurDataURL}
            loading="lazy"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col p-4 md:p-5">
          {/* Range category label for single-product ranges */}
          {rangeTitle && (
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gray-400 mb-1.5">
              {rangeTitle}
            </p>
          )}
          <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-gray-700 transition-colors line-clamp-2">
            {title}
          </h3>
          <p className="mt-1.5 text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
            {description}
          </p>

          {/* View Details link */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <span className="inline-flex items-center text-xs font-medium text-gray-900 group-hover:text-gray-600 transition-colors">
              View Details
              <svg
                className="ml-1 h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
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
            </span>
          </div>
        </div>
      </motion.article>
    </Link>
  );
}
