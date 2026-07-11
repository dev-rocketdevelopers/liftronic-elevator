import type { Metadata } from "next";
import { getBranches } from "~/sanity/utils/getBranches";
import BranchesClient from "~/components/branches/BranchesClient";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Branches | Liftronic Elevators",
  description:
    "Visit our branch offices across India for elevator solutions and services.",
  openGraph: {
    title: "Our Branches | Liftronic Elevators",
    description:
      "Visit our branch offices across India for elevator solutions and services.",
    url: "/branches",
    type: "website",
  },
};

export default async function BranchesPage() {
  const branches = await getBranches();

  return (
    <main className="bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-4 right-0 select-none overflow-hidden"
        >
          <span className="block text-[clamp(5rem,18vw,16rem)] font-extrabold leading-none tracking-tighter text-black/[0.03]">
            INDIA
          </span>
        </div>

        <div className="absolute left-0 top-0 h-[3px] w-full bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

        <div className="container mx-auto px-4 pb-16 pt-32 md:px-6 md:pb-20 md:pt-44">
          <nav aria-label="Breadcrumb">
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
              <li aria-current="page" className="font-medium text-charcoal">
                Branches
              </li>
            </ol>
          </nav>

          <div className="mt-8 max-w-5xl">
            <h1 className="mt-3 text-5xl font-extrabold leading-[1.0] tracking-tight text-charcoal md:text-7xl xl:whitespace-nowrap">
              Our Branches Across India
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-600 md:text-lg">
              Explore city-specific teams, product guidance, and on-ground
              engineering support — designed for your project requirements.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-6 pt-8">
            <div>
              <p className="text-4xl font-extrabold leading-none text-charcoal">
                {branches.length}
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Active branches
              </p>
            </div>
            <div className="h-10 w-px bg-black/10" />
            <div>
              <p className="text-4xl font-extrabold leading-none text-charcoal">
                15+
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Years of service
              </p>
            </div>
            <div className="h-10 w-px bg-black/10" />
            <div>
              <p className="text-4xl font-extrabold leading-none text-charcoal">
                Pan-India
              </p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-gray-400">
                Coverage
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Branch cards */}
      <section className="bg-soft py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-10">
            <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-charcoal md:text-5xl">
              Active branch locations
            </h2>
            <p className="mt-3 text-sm font-semibold uppercase tracking-[0.14em] text-gray-400">
              {branches.length} listed
            </p>
          </div>

          {branches.length > 0 ? (
            <BranchesClient branches={branches} />
          ) : (
            <div className="rounded-2xl border border-dashed border-black/20 bg-soft px-6 py-16 text-center">
              <p className="text-base text-gray-500">
                No branches available yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
