import Image from "next/image";
import Link from "next/link";
import { getSocial } from "~/sanity/utils/getSocials";
import { getCompanyInfo } from "~/sanity/utils/getAboutUs";
import { getIcon } from "~/sanity/utils/iconMapper";
import { FiMail, FiPhone } from "react-icons/fi";
import FooterAddressBlock from "~/components/layout/FooterAddressBlock";
import type { ContactInfo } from "~/../typings";
import type { Branch } from "~/sanity/lib/branchTypes";

interface FooterProps {
  contactInfo: ContactInfo | null;
  branches: Branch[];
}

export default async function Footer({ contactInfo, branches }: FooterProps) {
  const [socials, companyInfo] = await Promise.all([
    getSocial(),
    getCompanyInfo(),
  ]);

  // Build a lightweight list for the footer address block
  const branchAddresses = branches.map((b) => ({
    slug: b.slug,
    city: b.city,
    address: b.address,
  }));

  const headquarters =
    contactInfo?.addresses?.find((item) => /head|hq/i.test(item.label ?? ""))
      ?.address ?? contactInfo?.addresses?.[0]?.address;

  const currentYear = new Date().getFullYear();
  const establishedYear = companyInfo?.establishedYear || 2000;

  return (
    <footer
      className="relative bg-linear-to-br from-charcoal via-charcoal/95 to-charcoal text-white overflow-hidden"
      suppressHydrationWarning
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-350 mx-auto px-6 md:px-12 lg:px-16 py-10 md:py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 md:gap-10 lg:gap-12 mb-8 md:mb-8">
          {/* Company Info - Takes more space */}
          <div className="space-y-4 md:space-y-6 lg:col-span-4 md:col-span-2 text-center md:text-left flex flex-col items-center md:items-start">
            <Link
              prefetch={false}
              href="/"
              className="inline-flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-accent/20 rounded-xl blur-md group-hover:blur-lg transition-all" />
                <Image
                  src="/liftronic-white.png"
                  alt="Liftronic Elevator"
                  width={48}
                  height={48}
                  className="relative size-12 transition-transform group-hover:scale-110 duration-300"
                />
              </div>
              <span className="font-bold text-2xl tracking-tight group-hover:text-accent transition-colors duration-300">
                Liftronic
              </span>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              {companyInfo?.tagline ||
                "Elevators engineered for precision, reliability, and safety. Trusted since " +
                  establishedYear +
                  "."}
            </p>
            <FooterAddressBlock
              headquarters={headquarters}
              branches={branchAddresses}
            />
          </div>

          {/* Contact Info and Quick Links - Side by side on mobile */}
          <div className="col-span-1 md:col-span-2 lg:col-span-5 grid grid-cols-2 md:grid-cols-2 gap-4 md:gap-10 justify-between">
            {/* Quick Links */}
            <div className="flex flex-col items-start">
              <h3 className="font-bold text-base md:text-base mb-5 md:mb-6 text-white uppercase tracking-wider relative inline-block">
                Quick Links
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent rounded-full" />
              </h3>
              <nav className="flex flex-col gap-3 md:gap-3.5 items-start">
                <Link
                  prefetch={false}
                  href="/products"
                  className="text-white/70 hover:text-accent transition-all duration-300 text-sm md:text-sm group w-fit relative"
                >
                  Products
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  prefetch={false}
                  href="/services"
                  className="text-white/70 hover:text-accent transition-all duration-300 text-sm md:text-sm group w-fit relative"
                >
                  Services
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  prefetch={false}
                  href="/aboutus"
                  className="text-white/70 hover:text-accent transition-all duration-300 text-sm md:text-sm group w-fit relative"
                >
                  About Us
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  prefetch={false}
                  href="/blogs"
                  className="text-white/70 hover:text-accent transition-all duration-300 text-sm md:text-sm group w-fit relative"
                >
                  Blogs
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  prefetch={false}
                  href="/media"
                  className="text-white/70 hover:text-accent transition-all duration-300 text-sm md:text-sm group w-fit relative"
                >
                  Media
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
                <Link
                  prefetch={false}
                  href="/contact"
                  className="text-white/70 hover:text-accent transition-all duration-300 text-sm md:text-sm group w-fit relative"
                >
                  Contact
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              </nav>
            </div>
            {/* Contact Info */}
            <div className="flex flex-col items-start">
              <h3 className="font-bold text-base md:text-base mb-5 md:mb-6 text-white uppercase tracking-wider relative inline-block">
                Get in Touch
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent rounded-full" />
              </h3>
              <ul className="space-y-3 md:space-y-4 text-sm md:text-sm">
                {contactInfo?.email && (
                  <li>
                    <a
                      href={`mailto:${contactInfo.email}`}
                      className="flex items-start gap-3 text-white/70 hover:text-white transition-all duration-300 group"
                    >
                      <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                        <FiMail className="text-accent size-4" />
                      </div>
                      <div>
                        <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">
                          {contactInfo.emailLabel || "Email"}
                        </div>
                        <div className="text-white/90 group-hover:text-accent transition-colors font-medium">
                          {contactInfo.email}
                        </div>
                      </div>
                    </a>
                  </li>
                )}
                {contactInfo?.supportPhone && (
                  <li>
                    <a
                      href={`tel:${contactInfo.supportPhone.replace(
                        /\s/g,
                        "",
                      )}`}
                      className="flex items-start gap-3 text-white/70 hover:text-white transition-all duration-300 group"
                    >
                      <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                        <FiPhone className="text-accent size-4" />
                      </div>
                      <div>
                        <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">
                          {contactInfo.supportPhoneLabel || "Support"}
                        </div>
                        <div className="text-white/90 group-hover:text-accent transition-colors font-medium">
                          {contactInfo.supportPhone}
                        </div>
                      </div>
                    </a>
                  </li>
                )}
                {contactInfo?.salesPhone && (
                  <li>
                    <a
                      href={`tel:${contactInfo.salesPhone.replace(/\s/g, "")}`}
                      className="flex items-start gap-3 text-white/70 hover:text-white transition-all duration-300 group"
                    >
                      <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                        <FiPhone className="text-accent size-4" />
                      </div>
                      <div>
                        <div className="text-xs text-white/50 mb-1 uppercase tracking-wider">
                          {contactInfo.salesPhoneLabel || "Sales"}
                        </div>
                        <div className="text-white/90 group-hover:text-accent transition-colors font-medium">
                          {contactInfo.salesPhone}
                        </div>
                      </div>
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="lg:col-span-3 flex flex-col items-center md:items-start">
            <h3 className="font-bold text-base mb-4 md:mb-6 text-white uppercase tracking-wider relative inline-block">
              Follow Us
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 md:left-0 md:translate-x-0 w-12 h-0.5 bg-accent rounded-full" />
            </h3>
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              {socials && socials.length > 0 ? (
                socials.map((social) => {
                  const Icon = getIcon(social.icon);
                  return Icon ? (
                    <a
                      key={social._id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative p-3 bg-white/5 hover:bg-accent/20 rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent/20"
                      aria-label={social.title}
                    >
                      <Icon className="size-5 text-white/70 group-hover:text-accent transition-colors" />
                    </a>
                  ) : null;
                })
              ) : (
                <p className="text-sm text-white/50">Connect with us</p>
              )}
            </div>

            {/* Additional Links */}
            <div className="mt-6 md:mt-8 space-y-3 w-full flex justify-center md:justify-start">
              <Link
                prefetch={false}
                href="/contact"
                className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent/90 text-charcoal font-semibold text-sm rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-accent/30 hover:scale-105 group"
              >
                Request a Quote
                <svg
                  className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="relative border-t border-white/10 pt-6 md:pt-8">
          {/* Decorative accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-linear-to-r from-transparent via-accent to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">
            <div className="text-center md:text-left">
              <p className="text-sm text-white/70">
                © {currentYear}{" "}
                <span className="font-semibold text-white">
                  Liftronic Elevator
                </span>
                . All rights reserved.
              </p>
              {establishedYear && (
                <p className="text-xs text-white/50 mt-1">
                  Trusted excellence since {establishedYear} • Elevating lives,
                  one floor at a time
                </p>
              )}
            </div>
            <div className="flex items-center gap-6 text-xs text-white/50">
              {contactInfo?.privacyPolicyUrl ? (
                <a
                  href={contactInfo.privacyPolicyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300 relative group"
                >
                  Privacy Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  prefetch={false}
                  href="/privacy-policy"
                  className="hover:text-accent transition-colors duration-300 relative group"
                >
                  Privacy Policy
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              )}
              <span className="text-white/20">•</span>
              {contactInfo?.termsOfServiceUrl ? (
                <a
                  href={contactInfo.termsOfServiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors duration-300 relative group"
                >
                  Terms of Service
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </a>
              ) : (
                <Link
                  prefetch={false}
                  href="/terms"
                  className="hover:text-accent transition-colors duration-300 relative group"
                >
                  Terms of Service
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
