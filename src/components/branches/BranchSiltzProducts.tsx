"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { HiArrowUpRight } from "react-icons/hi2";
import type { BranchProduct } from "~/sanity/lib/branchTypes";

interface BranchSiltzProductsProps {
  products: BranchProduct[];
  bgVariant?: "white" | "soft";
}

export default function BranchSiltzProducts({
  products,
  bgVariant = "soft",
}: BranchSiltzProductsProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className={`bg-${bgVariant} py-10 md:py-16`}>
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          viewport={{ once: true, margin: "-80px" }}
          className="mb-12 flex flex-col gap-6 border-b border-black/10 pb-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-3xl">
            <h2 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-charcoal md:text-5xl">
              Stiltz Collection
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">
              Discover our premium Stiltz home-lift model available for private
              residences through this branch.
            </p>
          </div>
          <Link
            prefetch={false}
            href="/products/stiltz-homelifts"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand transition-colors hover:text-charcoal sm:mb-1"
          >
            All Stiltz products
            <HiArrowUpRight className="h-4 w-4" />
          </Link>
        </motion.div>

        <div className="space-y-6">
          {products.map((product, index) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              viewport={{ once: true, margin: "-60px" }}
            >
              {/*
                Full-width model card for branch pages.
                Entire card links to the product detail page.
              */}
              <Link
                prefetch={false}
                href={`/products/${product.slug}`}
                className="group block overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_12px_34px_rgba(17,24,39,0.07)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_18px_42px_rgba(17,24,39,0.12)]"
              >
                <article className="grid lg:grid-cols-[1.05fr_1fr]">
                  <div className="relative min-h-[260px] md:min-h-[330px]">
                    <Image
                      src={product.mainImage ?? "/illustrations/product01.png"}
                      alt={product.imageAlt || `${product.title} image`}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      placeholder={product.mainImageLqip ? "blur" : "empty"}
                      blurDataURL={product.mainImageLqip}
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-black/5 to-transparent" />
                    <span className="absolute left-5 top-5 text-4xl font-extrabold leading-none text-white/80 drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] md:left-6 md:top-6 md:text-5xl">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  <div className="flex flex-col justify-between p-6 md:p-8">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
                        Stiltz model
                      </p>
                      <h3 className="mt-2 text-2xl font-bold leading-tight tracking-tight text-charcoal transition-colors group-hover:text-brand md:text-3xl">
                        {product.title}
                      </h3>
                      {product.subtitle && (
                        <p className="mt-3 text-base font-medium leading-relaxed text-gray-700">
                          {product.subtitle}
                        </p>
                      )}
                      <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">
                        {product.description ||
                          "Engineered for compact footprints with smooth, quiet travel and everyday comfort."}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-gray-500">
                        Book a live demo with our branch team to compare cabin
                        feel, finishes, and installation fit for your home.
                      </p>
                    </div>

                    <div className="mt-7 flex items-center justify-between border-t border-black/10 pt-5">
                      <span className="text-sm font-semibold text-charcoal transition-colors group-hover:text-brand md:text-base">
                        Explore model details
                      </span>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/12 transition-all group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                        <HiArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
