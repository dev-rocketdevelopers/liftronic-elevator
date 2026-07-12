import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-[100dvh] items-center overflow-hidden bg-soft py-16 text-charcoal">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white via-soft to-soft" />
      <div className="absolute inset-0 -z-10 opacity-70 [background:radial-gradient(75%_60%_at_25%_20%,rgba(42,227,148,0.22),transparent_70%)]" />
      <div
        className="absolute right-[-12%] top-20 -z-10 h-80 w-80 rounded-full bg-accent/25 blur-3xl md:h-[420px] md:w-[420px]"
        aria-hidden="true"
      />

      <section className="container mx-auto rounded-[36px] border border-accent/15 bg-white/70 px-6 py-12 shadow-2xl shadow-black/5 backdrop-blur-lg sm:px-8 md:px-16 md:py-16">
        <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr] md:gap-16">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white/80 px-4 py-1 text-sm font-semibold text-accent shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-accent" />
              404 — Level Unreachable
            </span>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
              Looks like this floor doesn&apos;t exist yet.
            </h1>
            <p className="max-w-xl text-base text-charcoal/70 sm:text-lg">
              The page you are looking for might have been moved, renamed, or is
              temporarily unavailable. Let us guide you back to the experiences
              we&apos;ve already perfected.
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
              className="h-auto w-full object-contain"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
