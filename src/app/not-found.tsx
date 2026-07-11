import Image from "next/image";
import Link from "next/link";
import Footer from "~/components/layout/Footer";
import Navbar from "~/components/layout/Navbar";
import { Suspense } from "react";
import { getContactInfo } from "~/sanity/utils/getContactInfo";

export default async function NotFound() {
  const contactInfo = await getContactInfo();
  return (
    <div className="flex min-h-[100dvh] flex-col bg-soft text-charcoal">
      <Suspense fallback={<div className="h-16 md:h-18" />}>
        <Navbar />
      </Suspense>

      <main className="relative isolate flex-1 overflow-hidden pt-32 pb-24 md:pb-32">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-soft to-soft" />
        <div className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(75%_60%_at_25%_20%,rgba(42,227,148,0.22),transparent_70%)]" />
        <div
          className="absolute right-[-12%] top-20 -z-10 h-80 w-80 rounded-full bg-accent/25 blur-3xl md:h-[420px] md:w-[420px]"
          aria-hidden="true"
        />

        <section className="container mx-auto rounded-[36px] border border-accent/15 bg-white/70 px-6 py-12 shadow-2xl shadow-black/5 backdrop-blur-lg sm:px-8 md:px-16 md:py-16">
          <div className="grid items-center gap-16 md:grid-cols-[1.05fr_1fr]">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white/80 px-4 py-1 text-sm font-semibold text-accent shadow-sm backdrop-blur">
                <span className="size-2 rounded-full bg-accent" />
                404 — Level Unreachable
              </span>
              <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Looks like this floor doesn&apos;t exist yet.
              </h1>
              <p className="max-w-xl text-base text-charcoal/70 sm:text-lg">
                The page you are looking for might have been moved, renamed, or
                is temporarily unavailable. Let us guide you back to the
                experiences we&apos;ve already perfected.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link prefetch={false} href="/" className="btn btn-primary">
                  Back to home
                </Link>
                <Link
                  prefetch={false}
                  href="/#contact"
                  className="btn border-accent/40 bg-white/90 text-charcoal shadow-sm hover:border-accent/60 hover:bg-white"
                >
                  Talk to our team
                </Link>
              </div>
            </div>

            <div className="relative mx-auto max-w-[560px]">
              <Image
                src="/illustrations/404-elevator.png"
                alt="Stylized elevator illustration"
                width={560}
                height={560}
                priority
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          <div className="mt-16 grid gap-8 rounded-2xl border border-accent/20 bg-white/75 p-6 shadow-sm backdrop-blur md:grid-cols-3 md:p-8">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-charcoal/40">
                Contact
              </p>
              <p className="font-semibold text-charcoal">
                {contactInfo?.supportPhone || "+91 1231231233"}
              </p>
              <p className="text-sm text-charcoal/60">
                {contactInfo?.supportPhoneLabel ||
                  "Call us for elevator consultations"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-charcoal/40">
                Email
              </p>
              <p className="font-semibold text-charcoal">
                {contactInfo?.email || "contact@liftronic.com"}
              </p>
              <p className="text-sm text-charcoal/60">
                {contactInfo?.emailLabel ||
                  "We respond within one business day"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] text-charcoal/40">
                Explore
              </p>
              <Link
                prefetch={false}
                href="/products"
                className="text-sm font-semibold text-accent hover:text-accent/80"
              >
                View our product range
              </Link>
              <p className="text-sm text-charcoal/60">
                Discover cabins, controllers, and modernization kits
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
