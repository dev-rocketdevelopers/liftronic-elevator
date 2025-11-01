"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, MouseEvent, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiXMark } from "react-icons/hi2";
import { useSmoothScroll } from "~/hooks/useSmoothScroll";
import { useMegaMenu } from "~/hooks/useMegaMenu";
import ContactModal from "~/components/ContactModal";
import { MegaMenuWrapper } from "./navbar/MegaMenuWrapper";
import { MegaMenuProducts } from "./navbar/MegaMenuProducts";
import { MegaMenuServices } from "./navbar/MegaMenuServices";
import type { NavItem, MegaMenuData } from "./navbar/types";

const navItems: NavItem[] = [
  {
    href: "/products",
    label: "Products",
    hasMegaMenu: true,
    megaMenuType: "products",
  },
  {
    href: "/services",
    label: "Services",
    hasMegaMenu: true,
    megaMenuType: "services",
  },
  { href: "/products/stiltz-homelifts", label: "Stiltz", highlight: true },
  { href: "/media", label: "Success Stories" },
  { href: "/aboutus", label: "About Us" },
];

type NavbarClientProps = {
  megaMenuData: MegaMenuData;
};

export default function NavbarClient({ megaMenuData }: NavbarClientProps) {
  const pathname = usePathname();
  const { scrollTo } = useSmoothScroll();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  const {
    state: megaMenuState,
    actions: megaMenuActions,
    closeImmediate,
  } = useMegaMenu();

  // Check if a link is active
  const isLinkActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  const handleLinkClick = (
    e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string
  ) => {
    // Close mega menu immediately
    closeImmediate();

    if (href.startsWith("#")) {
      e.preventDefault();
      setMobileMenuOpen(false);

      if (pathname !== "/") {
        router.push(`/${href}`);
        setTimeout(() => scrollTo(href), 80);
        return;
      }

      setTimeout(() => scrollTo(href), 80);
      return;
    }

    setMobileMenuOpen(false);
  };

  const handleLogoClick = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    closeImmediate();
    setMobileMenuOpen(false);

    if (pathname === "/") {
      try {
        scrollTo("body");
      } catch {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

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
        className="mx-auto container transition-all duration-300 rounded-2xl glass-solid shadow-elevate relative"
      >
        <div className="flex items-center justify-between h-16 md:h-18 px-4 md:px-5">
          {/* Logo */}
          <Link
            href="/"
            onClick={handleLogoClick}
            className="flex items-center gap-3 font-bold text-lg tracking-tight"
          >
            <Image
              src="/liftronic.png"
              alt="Liftronic logo"
              width={40}
              height={40}
              priority
              className="size-9 md:size-10 transition-all"
            />
            <span className="text-base md:text-lg transition-colors text-gray-800">
              Liftronic
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold">
            {navItems.map((item) => {
              const isActive = isLinkActive(item.href);
              const isFeatured = Boolean(item.highlight);
              const hasMegaMenu = Boolean(item.hasMegaMenu);

              const featuredClasses =
                "relative inline-flex items-center gap-2 rounded-full bg-brand px-4 py-1.5 text-white shadow-brand/30 transition-all hover:shadow-brand/40 hover:-translate-y-0.5";

              const megaMenuClasses = isActive
                ? "nav-link-underline relative text-brand font-bold text-[13px]"
                : "nav-link-underline relative text-gray-700 hover:text-brand text-[13px]";

              const standardClasses = isActive
                ? "nav-link-underline relative text-brand font-bold"
                : "nav-link-underline relative text-gray-700 hover:text-brand";

              return (
                <div
                  key={item.href}
                  className="relative"
                  onMouseEnter={() => {
                    if (item.hasMegaMenu && item.megaMenuType) {
                      megaMenuActions.openMenu(item.megaMenuType);
                    }
                  }}
                  onMouseLeave={() => {
                    if (item.hasMegaMenu) {
                      megaMenuActions.closeMenu();
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={(e) => handleLinkClick(e, item.href)}
                    className={
                      isFeatured
                        ? featuredClasses
                        : hasMegaMenu
                          ? megaMenuClasses
                          : standardClasses
                    }
                  >
                    <span>{item.label}</span>
                    {isFeatured && (
                      <span className="text-[10px] uppercase tracking-wide text-white/80">
                        Featured
                      </span>
                    )}
                    {!isFeatured && isActive && (
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-brand" />
                    )}
                  </Link>
                </div>
              );
            })}
            <button
              onClick={() => setIsContactModalOpen(true)}
              className="btn btn-primary"
            >
              Request a Quote
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            aria-label={mobileMenuOpen ? "Close Menu" : "Open Menu"}
            className="md:hidden inline-flex items-center justify-center size-10 rounded-xl transition-colors text-gray-700 hover:bg-accent/10"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? (
              <HiXMark className="w-6 h-6" />
            ) : (
              <RxHamburgerMenu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="md:hidden overflow-hidden"
            >
              <div className="px-6 pb-6 border-t border-accent/20">
                <div className="flex flex-col gap-2 pt-4">
                  {navItems.map((item) => {
                    const isActive = isLinkActive(item.href);
                    const isFeatured = Boolean(item.highlight);

                    const featuredClasses =
                      "relative flex items-center justify-between gap-2 rounded-lg bg-brand px-4 py-3 text-white shadow-brand/30";

                    const standardClasses = isActive
                      ? "py-3 px-4 rounded-lg bg-brand/10 text-brand font-bold"
                      : "py-3 px-4 rounded-lg text-gray-700 hover:bg-accent/10 hover:text-brand";

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={(e) => handleLinkClick(e, item.href)}
                        className={`transition-colors font-semibold relative ${
                          isFeatured ? featuredClasses : standardClasses
                        }`}
                      >
                        <span>{item.label}</span>
                        {isFeatured && (
                          <span className="text-[10px] uppercase tracking-wide text-white/80">
                            Featured
                          </span>
                        )}
                        {!isFeatured && isActive && (
                          <span className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-brand" />
                        )}
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      setIsContactModalOpen(true);
                      setMobileMenuOpen(false);
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

        {/* Mega Menu - Desktop Only */}
        <div
          className="hidden md:block"
          onMouseEnter={() => {
            // Keep mega menu open when hovering over it
            if (megaMenuState.activeMenu === "products") {
              megaMenuActions.openMenu("products");
            } else if (megaMenuState.activeMenu === "services") {
              megaMenuActions.openMenu("services");
            }
          }}
          onMouseLeave={() => {
            megaMenuActions.closeMenu();
          }}
        >
          <MegaMenuWrapper
            isOpen={megaMenuState.isOpen}
            onClose={closeImmediate}
          >
            {megaMenuState.activeMenu === "products" && (
              <MegaMenuProducts
                productRanges={megaMenuData.productRanges}
                activeRangeId={megaMenuState.activeRangeId}
                onRangeHover={megaMenuActions.setActiveRange}
                contactInfo={megaMenuData.contactInfo}
                onNavigate={closeImmediate}
              />
            )}
            {megaMenuState.activeMenu === "services" && (
              <MegaMenuServices services={megaMenuData.services} />
            )}
          </MegaMenuWrapper>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />
    </div>
  );
}
