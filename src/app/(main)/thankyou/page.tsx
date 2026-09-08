import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You | Liftronic Elevator",
  description:
    "Thank you for contacting Liftronic Elevator. Our team will be in touch shortly.",
  alternates: {
    canonical: "/thankyou",
  },
};

export default function ThankYouPage() {
  return (
    <div className="relative isolate flex min-h-[70dvh] items-center overflow-hidden bg-soft py-20 text-charcoal md:py-28">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-soft to-soft" />
      <div className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(70%_65%_at_20%_15%,rgba(42,227,148,0.2),transparent_70%)]" />
      <div
        className="absolute right-[-10%] top-10 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl md:h-[420px] md:w-[420px]"
        aria-hidden="true"
      />

      <main className="container mx-auto px-6 sm:px-8">
        <section className="mx-auto max-w-3xl rounded-[36px] border border-accent/15 bg-white/75 px-6 py-14 text-center shadow-2xl shadow-black/5 backdrop-blur-lg sm:px-12 md:py-20">
          <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-full bg-accent text-3xl font-semibold text-charcoal shadow-lg shadow-accent/20">
            ✓
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Message received
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Thank you for reaching out.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-charcoal/70 sm:text-lg">
            We have received your details. A member of the Liftronic team will
            review your request and get back to you shortly.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link prefetch={false} href="/" className="btn btn-primary">
              Back to home
            </Link>
            <Link
              prefetch={false}
              href="/contact"
              className="btn border-accent/40 bg-white/90 text-charcoal shadow-sm hover:border-accent/60 hover:bg-white"
            >
              Contact our team
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}