"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, MouseEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiXMark, HiChevronDown } from "react-icons/hi2";
import { HiMapPin } from "react-icons/hi2";
import { useSmoothScroll } from "~/hooks/useSmoothScroll";
import { useOptionalPopupManager } from "~/contexts/PopupManagerContext";

interface NavLink {
  href: string;
  label: string;
  highlight?: boolean;
}

const navLinks: NavLink[] = [
  { href: "/products", label: "Products" },
  { href: "/services", label: "Services" },
  { href: "/products?featured=true", label: "Featured", highlight: true },
  { href: "/media", label: "Success Stories" },
  { href: "/aboutus", label: "About Us" },
];

export default function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isFeaturedFilterActive = searchParams.get("featured") === "true";
  const { scrollTo } = useSmoothScroll();
  const router = useRouter();
  const popupManager = useOptionalPopupManager();
  const branches = popupManager?.branches ?? [];
  const isHomePage = pathname === "/";
  const isBranchesRoute = pathname.startsWith("/branches");

  // scrolled tracks whether the user has scrolled >300px (only meaningful on homepage)
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [branchesOpen, setBranchesOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const branchesRef = useRef<HTMLDivElement>(null);

  // isTransparent: ONLY true when we're on the home page and haven't scrolled yet.
  // On every other page this is always false → solid background, dark text.
  const isTransparent = isHomePage && !scrolled && !open;

  // Check if a link is active
  const isLinkActive = (href: string) => {
    // Exact match for homepage
    if (href === "/" && pathname === "/") return true;

    // Is this the Featured link specifically?
    if (href.includes("featured=true")) {
      return pathname.startsWith("/products") && isFeaturedFilterActive;
    }

    // Is this the main Products link?
    // It should ONLY be active if we are on products AND featured=true is not set
    if (href === "/products") {
      return pathname.startsWith("/products") && !isFeaturedFilterActive;
    }

    // For other routes, check if pathname starts with the href
    // This handles both /services and /services/something
    if (href !== "/" && pathname.startsWith(href)) return true;

    return false;
  };

  const isBranchLocationActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  // Handle click outside to close mobile menu
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        (open || branchesOpen) &&
        navRef.current &&
        !navRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setBranchesOpen(false);
      }
      // Close branches dropdown when clicking outside
      if (
        branchesOpen &&
        branchesRef.current &&
        !branchesRef.current.contains(event.target as Node)
      ) {
        setBranchesOpen(false);
      }
    };

    if (open || branchesOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [open, branchesOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        setBranchesOpen(false);
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  // Scroll listener — resets when pathname changes so navigating back to home works correctly
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 300);
    };

    // Sync once after mount/route change without calling setState directly in effect body.
    const frameId = window.requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
    };
  }, [pathname]);

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) => {
    // Handle hash links specially: if we're not on the home page,
    // navigate to the home page with the hash so the target exists.
    if (href.startsWith("#")) {
      e.preventDefault();
      // close the menu first so layout stabilizes
      setOpen(false);

      if (pathname !== "/") {
        // navigate to home with hash, then scroll after navigation completes
        router.push(`/${href}`);
        // give browser a tick to render / mount elements, then smooth-scroll
        setTimeout(() => scrollTo(href), 80);
        return;
      }

      // if already on homepage, wait briefly for menu close animation to finish
      setTimeout(() => scrollTo(href), 80);
      return;
    }

    // For normal links, just close the mobile menu (no-op on desktop)
    setOpen(false);
    setBranchesOpen(false);
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    // Prevent full page reload. Smooth-scroll to top on homepage,
    // otherwise navigate to homepage then scroll.
    e.preventDefault();
    // close mobile menu if open
    setOpen(false);
    setBranchesOpen(false);
    if (isHomePage) {
      // scroll to top element
      try {
        scrollTo("body");
      } catch {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    // navigate to home and then scroll a tick later
    router.push("/");
    setTimeout(() => {
      try {
        scrollTo("body");
      } catch {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 80);
  };

  return (
    <div className="fixed top-2 md:top-4 inset-x-0 z-50 px-4 md:px-5">
      <div
        ref={navRef}
        className={`mx-auto container transition-all duration-300 rounded-2xl ${
          isTransparent ? "glass-transparent" : "glass-solid shadow-elevate"
        }`}
      >
        <div className="flex items-center justify-between h-16 md:h-18 px-4 md:px-5">
          <Link
            prefetch={false}
            href="/"
            onClick={(e) =>
              handleLogoClick(e as unknown as MouseEvent<HTMLAnchorElement>)
            }
            className="flex items-center"
          >
            <Image
              src={isTransparent ? "/liftronic-white.png" : "/liftronic.png"}
              alt="Liftronic logo"
              width={160}
              height={48}
              priority
              className="h-10 md:h-12 w-auto transition-all"
            />
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
            {navLinks.map((l) => {
              const isActive = isLinkActive(l.href);
              const isFeatured = Boolean(l.highlight);

              const featuredClasses = isTransparent
                ? "relative inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-white font-semibold shadow-white/30 transition-all hover:bg-white/30 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                : "relative inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-white font-semibold shadow-brand/30 transition-all hover:shadow-brand/40 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50";

              const standardClasses = isActive
                ? isTransparent
                  ? "nav-link-underline relative text-white font-bold"
                  : "nav-link-underline relative text-brand font-bold"
                : isTransparent
                  ? "nav-link-underline relative text-white/90 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-sm"
                  : "nav-link-underline relative text-gray-700 hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 rounded-sm";

              return (
                <Link
                  prefetch={false}
                  key={l.href}
                  href={l.href}
                  onClick={(e) => handleLinkClick(e, l.href)}
                  className={isFeatured ? featuredClasses : standardClasses}
                >
                  <span>{l.label}</span>
                  {!isFeatured && isActive && (
                    <span
                      className={`absolute -bottom-1 left-0 right-0 h-0.5 rounded-full ${
                        isTransparent ? "bg-white" : "bg-brand"
                      }`}
                    />
                  )}
                </Link>
              );
            })}

            <div
              className="relative"
              onMouseEnter={() => setBranchesOpen(true)}
              onMouseLeave={() => setBranchesOpen(false)}
            >
              <div className="inline-flex items-center gap-0">
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={branchesOpen}
                  aria-controls="branches-menu"
                  onClick={() => setBranchesOpen((value) => !value)}
                  className={`nav-link-underline relative inline-flex items-center rounded-sm px-1 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 ${
                    isBranchesRoute
                      ? isTransparent
                        ? "text-white font-bold focus-visible:ring-white/80"
                        : "text-brand font-bold focus-visible:ring-brand/60"
                      : isTransparent
                        ? "text-white/90 hover:text-white focus-visible:ring-white/80"
                        : "text-gray-700 hover:text-brand focus-visible:ring-brand/60"
                  }`}
                >
                  <span>Branches</span>
                </button>
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={branchesOpen}
                  aria-controls="branches-menu"
                  onClick={() => setBranchesOpen((value) => !value)}
                  className={`inline-flex items-center rounded-sm px-0.5 py-1 transition-all focus-visible:outline-none focus-visible:ring-2 ${
                    isBranchesRoute
                      ? isTransparent
                        ? "text-white font-bold focus-visible:ring-white/80"
                        : "text-brand font-bold focus-visible:ring-brand/60"
                      : isTransparent
                        ? "text-white/90 hover:text-white focus-visible:ring-white/80"
                        : "text-gray-700 hover:text-brand focus-visible:ring-brand/60"
                  }`}
                >
                  <HiChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      branchesOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
              <AnimatePresence>
                {branchesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    id="branches-menu"
                    role="menu"
                    aria-label="Branch locations"
                    className="absolute top-full right-0 mt-3 w-72 rounded-2xl border border-brand/20 bg-white/95 shadow-[0_22px_40px_-18px_rgba(0,0,0,0.35)] backdrop-blur-xl overflow-hidden z-50"
                  >
                    <div className="p-2">
                      {branches.map((branch) => {
                        const href = `/branches/${branch.slug}`;
                        return (
                          <Link
                            prefetch={false}
                            key={branch.slug}
                            href={href}
                            role="menuitem"
                            onClick={() => setBranchesOpen(false)}
                            className={`mb-1 group block rounded-xl px-4 py-3 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${
                              isBranchLocationActive(href)
                                ? "bg-brand/10 text-brand"
                                : "text-gray-800 hover:bg-accent/15 hover:text-brand"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <HiMapPin className="h-4 w-4 shrink-0 opacity-80" />
                              <p className="truncate text-sm font-semibold">
                                {branch.name}
                              </p>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              type="button"
              onClick={() => {
                setOpen(false);
                setBranchesOpen(false);
                popupManager?.triggerPopupByType("requestQuote");
              }}
              className="btn btn-primary"
            >
              Request a Quote
            </button>
          </div>

          <button
            aria-label={open ? "Close Menu" : "Open Menu"}
            className={`md:hidden inline-flex items-center justify-center size-10 rounded-xl transition-colors ${
              isTransparent
                ? "text-white hover:bg-white/10"
                : "text-gray-700 hover:bg-accent/10"
            }`}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <HiXMark className="w-6 h-6" />
            ) : (
              <RxHamburgerMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div
                className={`px-6 pb-6 border-t ${
                  isTransparent ? "border-white/20" : "border-accent/20"
                }`}
              >
                <div className="flex flex-col gap-2 pt-4">
                  {navLinks.map((l) => {
                    const isActive = isLinkActive(l.href);
                    const isFeatured = Boolean(l.highlight);

                    const featuredClasses = isTransparent
                      ? "relative flex items-center justify-between gap-2 rounded-lg bg-white/20 px-4 py-3 text-white shadow-white/25"
                      : "relative flex items-center justify-between gap-2 rounded-lg bg-brand px-4 py-3 text-white shadow-brand/30";

                    const standardClasses = isActive
                      ? isTransparent
                        ? "py-3 px-4 rounded-lg bg-white/20 text-white font-bold"
                        : "py-3 px-4 rounded-lg bg-brand/10 text-brand font-bold"
                      : isTransparent
                        ? "py-3 px-4 rounded-lg text-white/90 hover:bg-white/10 hover:text-white"
                        : "py-3 px-4 rounded-lg text-gray-700 hover:bg-accent/10 hover:text-brand";

                    return (
                      <Link
                        prefetch={false}
                        key={l.href}
                        href={l.href}
                        onClick={(e) => handleLinkClick(e, l.href)}
                        className={`transition-colors font-semibold relative ${
                          isFeatured ? featuredClasses : standardClasses
                        }`}
                      >
                        <span>{l.label}</span>
                        {/* Active indicator for mobile */}
                        {!isFeatured && isActive && (
                          <span
                            className={`absolute left-0 top-0 bottom-0 w-1 rounded-r-full ${
                              isTransparent ? "bg-white" : "bg-brand"
                            }`}
                          />
                        )}
                      </Link>
                    );
                  })}

                  {/* Mobile Branches Section */}
                  <div
                    className={`pt-2 border-t mt-2 ${
                      isTransparent ? "border-white/20" : "border-accent/20"
                    }`}
                  >
                    <p
                      className={`block py-2 px-4 text-xs uppercase tracking-wide font-semibold transition-colors ${
                        isTransparent
                          ? "text-white/70 hover:text-white"
                          : "text-gray-500 hover:text-brand"
                      }`}
                    >
                      Our Branches
                    </p>
                    {branches.map((branch) => {
                      const href = `/branches/${branch.slug}`;
                      return (
                        <Link
                          prefetch={false}
                          key={branch.slug}
                          href={href}
                          onClick={() => {
                            setOpen(false);
                            setBranchesOpen(false);
                          }}
                          className={`block py-3 px-4 rounded-lg transition-colors font-semibold text-sm ${
                            isTransparent
                              ? "text-white/90 hover:bg-white/10 hover:text-white"
                              : "text-gray-700 hover:bg-accent/10 hover:text-brand"
                          }`}
                        >
                          {branch.name}
                        </Link>
                      );
                    })}
                  </div>
                  <button
                    onClick={() => {
                      setOpen(false);
                      setBranchesOpen(false);
                      popupManager?.triggerPopupByType("requestQuote");
                    }}
                    className="btn btn-primary w-full mt-2"
                  >
                    Request a Quote
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
