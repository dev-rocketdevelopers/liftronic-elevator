"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { href: "/products", label: "Products" },
  { href: "#services", label: "Services" },
  { href: "#clients", label: "Clients" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [scrolled, setScrolled] = useState(!isHomePage); // Default to scrolled style for non-home pages
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Only apply scroll detection on home page
    if (isHomePage) {
      const onScroll = () => {
        // Change navbar style when scrolled past a reasonable threshold
        setScrolled(window.scrollY > 940);
      };
      onScroll();
      window.addEventListener("scroll", onScroll);
      return () => window.removeEventListener("scroll", onScroll);
    } else {
      // For non-home pages, always use scrolled style
      setScrolled(true);
    }
  }, [isHomePage]);

  // Prevent hydration mismatch by not applying scroll-based styles during SSR
  if (!mounted) {
    // For SSR, show appropriate style based on page
    const defaultScrolled = !isHomePage;
    return (
      <div className="fixed top-0 inset-x-0 z-50" suppressHydrationWarning>
        <div
          className={`mx-auto container px-4 transition-all ${
            defaultScrolled ? "mt-2" : "mt-4"
          }`}
        >
          <div
            className={`rounded-2xl transition-all duration-700 ease-in-out ${
              defaultScrolled
                ? "glass-solid shadow-elevate"
                : "glass-transparent"
            }`}
          >
            <div className="flex items-center justify-between h-16 px-6">
              <Link
                href="/"
                className={`flex items-center gap-3 font-bold text-lg tracking-tight transition-all duration-700 ${
                  defaultScrolled ? "text-gray-800" : "text-white"
                }`}
              >
                <Image
                  src={
                    defaultScrolled ? "/liftronic.png" : "/liftronic-white.png"
                  }
                  alt="Liftronic logo"
                  width={40}
                  height={40}
                  priority
                  className="size-10"
                />
                <span
                  className={!defaultScrolled ? "drop-shadow-lg" : undefined}
                >
                  Liftronic
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-8 text-sm font-medium">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`relative transition-all duration-700 before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-accent before:transition-all before:duration-200 hover:before:w-full ${
                      defaultScrolled
                        ? "text-gray-700 hover:text-accent"
                        : "text-white/90 hover:text-white drop-shadow-md"
                    }`}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link href="#contact" className="btn btn-primary">
                  Request a Quote
                </Link>
              </div>

              <button
                aria-label="Open Menu"
                className={`md:hidden inline-flex items-center justify-center size-10 rounded-xl backdrop-blur-sm transition-all duration-700 ${
                  defaultScrolled
                    ? "bg-accent/10 border border-accent/20 hover:bg-accent/20 text-gray-700"
                    : "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
                }`}
                onClick={() => setOpen((v) => !v)}
              >
                <div className="relative w-4 h-3">
                  <span className="absolute inset-x-0 top-0 h-0.5 bg-current transition-transform" />
                  <span className="absolute inset-x-0 top-1.5 h-0.5 bg-current transition-opacity opacity-100" />
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-current transition-transform" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50" suppressHydrationWarning>
      <div
        className={`mx-auto container px-4 transition-all ${
          scrolled ? "mt-2" : "mt-4"
        }`}
      >
        <div
          className={`rounded-2xl transition-all duration-700 ease-in-out relative ${
            scrolled ? "glass-solid shadow-elevate" : "glass-transparent"
          }`}
        >
          <div className="flex items-center justify-between h-16 px-6">
            <Link
              href="/"
              className={`flex items-center gap-3 font-bold text-lg tracking-tight transition-all duration-700 ${
                scrolled ? "text-gray-800" : "text-white"
              }`}
            >
              <Image
                src={scrolled ? "/liftronic.png" : "/liftronic-white.png"}
                alt="Liftronic logo"
                width={40}
                height={40}
                priority
                className="size-10"
              />
              <span className={!scrolled ? "drop-shadow-lg" : undefined}>
                Liftronic
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative transition-all duration-700 before:absolute before:-bottom-1 before:left-0 before:w-0 before:h-0.5 before:bg-accent before:transition-all before:duration-200 hover:before:w-full ${
                    scrolled
                      ? "text-gray-700 hover:text-accent"
                      : "text-white/90 hover:text-white drop-shadow-md"
                  }`}
                >
                  {l.label}
                </Link>
              ))}
              <Link href="#contact" className="btn btn-primary">
                Request a Quote
              </Link>
            </div>

            <button
              aria-label="Open Menu"
              className={`md:hidden inline-flex items-center justify-center size-10 rounded-xl backdrop-blur-sm transition-all duration-700 ${
                scrolled
                  ? "bg-accent/10 border border-accent/20 hover:bg-accent/20 text-gray-700"
                  : "bg-white/10 border border-white/20 hover:bg-white/20 text-white"
              }`}
              onClick={() => setOpen((v) => !v)}
            >
              <div className="relative w-4 h-3">
                <span
                  className={`absolute inset-x-0 top-0 h-0.5 bg-current transition-transform ${
                    open ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute inset-x-0 top-1.5 h-0.5 bg-current transition-opacity ${
                    open ? "opacity-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`absolute inset-x-0 bottom-0 h-0.5 bg-current transition-transform ${
                    open ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className={`md:hidden px-6 pb-6 transition-all duration-700 ${
                  scrolled
                    ? "border-t border-accent/20"
                    : "border-t border-white/10"
                }`}
              >
                <div className="flex flex-col gap-3 pt-4">
                  {navLinks.map((l) => (
                    <Link
                      key={l.href}
                      href={l.href}
                      className={`py-3 px-4 rounded-xl transition-all duration-700 font-medium ${
                        scrolled
                          ? "text-gray-700 hover:bg-accent/10 hover:text-accent"
                          : "text-white/90 hover:bg-white/10 hover:text-white"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  ))}
                  <Link
                    href="#contact"
                    className="btn btn-primary w-full text-center"
                    onClick={() => setOpen(false)}
                  >
                    Request a Quote
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
