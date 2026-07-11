"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { HiArrowUpRight, HiMapPin } from "react-icons/hi2";
import type { Branch } from "~/sanity/lib/branchTypes";

interface BranchesClientProps {
  branches: Branch[];
}

export default function BranchesClient({ branches }: BranchesClientProps) {
  if (!branches || branches.length === 0) {
    return null;
  }

  const isSingle = branches.length === 1;
  const isDouble = branches.length === 2;

  return (
    <div
      className={`grid gap-5 ${
        isSingle
          ? "grid-cols-1"
          : isDouble
            ? "grid-cols-1 md:grid-cols-2"
            : "grid-cols-1 md:grid-cols-2 xl:grid-cols-3"
      }`}
    >
      {branches.map((branch, index) => (
        <motion.div
          key={branch._id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.06 }}
          viewport={{ once: true, margin: "-80px" }}
          className={isSingle ? "w-full" : ""}
        >
          <Link
            prefetch={false}
            href={`/branches/${branch.slug}`}
            className="group block h-full overflow-hidden rounded-2xl border border-black/10 bg-white shadow-[0_12px_34px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-brand/35 hover:shadow-[0_18px_42px_rgba(17,24,39,0.12)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <article className="flex h-full flex-col">
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5">
                    <span className="mr-2 text-2xl font-extrabold leading-none text-black/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <HiMapPin className="h-3.5 w-3.5 text-brand" />
                    <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand">
                      {branch.city}
                    </span>
                  </div>
                  <span className="rounded-full border border-black/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-400">
                    Branch
                  </span>
                </div>
                <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-charcoal transition-colors duration-300 group-hover:text-brand md:text-3xl">
                  {branch.city}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{branch.name}</p>

                {branch.description && (
                  <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-600 md:text-base">
                    {branch.description}
                  </p>
                )}

                <div className="mt-auto flex items-center justify-between border-t border-black/10 pt-5">
                  <span className="text-sm font-semibold text-charcoal transition-colors duration-300 group-hover:text-brand">
                    Explore branch
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-all duration-300 group-hover:border-brand group-hover:bg-brand group-hover:text-white">
                    <HiArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
