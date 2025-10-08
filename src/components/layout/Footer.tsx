import Image from "next/image";
import Link from "next/link";
import { getContactInfo } from "~/sanity/utils/getContactInfo";
import { getSocial } from "~/sanity/utils/getSocials";
import { getCompanyInfo } from "~/sanity/utils/getAboutUs";
import { getIcon } from "~/sanity/utils/iconMapper";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export default async function Footer() {
  const [contactInfo, socials, companyInfo] = await Promise.all([
    getContactInfo(),
    getSocial(),
    getCompanyInfo(),
  ]);

  const currentYear = new Date().getFullYear();
  const establishedYear = companyInfo?.establishedYear || 2000;

  return (
    <footer
      className="relative bg-gradient-to-br from-charcoal via-charcoal/95 to-charcoal text-white overflow-hidden"
      suppressHydrationWarning
    >
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/50 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-8 md:px-12 lg:px-16 py-16 lg:py-20">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 md:gap-10 lg:gap-12 mb-16">
          {/* Company Info - Takes more space */}
          <div className="space-y-6 lg:col-span-4 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 group">
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
            {contactInfo?.serviceArea && (
              <div className="flex items-start gap-3 text-sm">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <FiMapPin className="text-accent size-4" />
                </div>
                <div>
                  <p className="text-xs text-white/50 mb-1 uppercase tracking-wider">
                    Service Area
                  </p>
                  <p className="text-white/80 font-medium">
                    {contactInfo.serviceArea}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="font-bold text-base mb-6 text-white uppercase tracking-wider relative inline-block">
              Quick Links
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent rounded-full" />
            </h3>
            <nav className="flex flex-col gap-3.5">
              <Link
                href="/products"
                className="text-white/70 hover:text-accent transition-all duration-300 text-sm group w-fit relative"
              >
                Products
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/services"
                className="text-white/70 hover:text-accent transition-all duration-300 text-sm group w-fit relative"
              >
                Services
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/aboutus"
                className="text-white/70 hover:text-accent transition-all duration-300 text-sm group w-fit relative"
              >
                About Us
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/blogs"
                className="text-white/70 hover:text-accent transition-all duration-300 text-sm group w-fit relative"
              >
                Blogs
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <Link
                href="/media"
                className="text-white/70 hover:text-accent transition-all duration-300 text-sm group w-fit relative"
              >
                Media
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-base mb-6 text-white uppercase tracking-wider relative inline-block">
              Get in Touch
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent rounded-full" />
            </h3>
            <ul className="space-y-4 text-sm">
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
                    href={`tel:${contactInfo.supportPhone.replace(/\s/g, "")}`}
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

          {/* Social Links */}
          <div className="lg:col-span-3">
            <h3 className="font-bold text-base mb-6 text-white uppercase tracking-wider relative inline-block">
              Follow Us
              <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-accent rounded-full" />
            </h3>
            <div className="flex flex-wrap gap-3">
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
            <div className="mt-8 space-y-3">
              <Link
                href="/#contact"
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
        <div className="relative border-t border-white/10 pt-8">
          {/* Decorative accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-accent to-transparent" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
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
              <Link
                href="/privacy-policy"
                className="hover:text-accent transition-colors duration-300 relative group"
              >
                Privacy Policy
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
              <span className="text-white/20">•</span>
              <Link
                href="/terms"
                className="hover:text-accent transition-colors duration-300 relative group"
              >
                Terms of Service
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent group-hover:w-full transition-all duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
