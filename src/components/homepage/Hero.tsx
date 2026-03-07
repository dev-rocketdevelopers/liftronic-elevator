"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSmoothScroll } from "~/hooks/useSmoothScroll";
import {
  FiHeadphones,
  FiMail,
  FiPhoneCall,
  FiEye,
} from "react-icons/fi";
import { Social, ContactInfo } from "~/../typings";
import { getIcon } from "~/sanity/utils/iconMapper";

interface HeroProps {
  socials: Social[];
  contactInfo: ContactInfo | null;
}

export default function Hero({ socials, contactInfo }: HeroProps) {
  const { scrollTo } = useSmoothScroll();
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Fallback data in case Sanity data is not available
  const fallbackContactInfo = {
    supportPhone: "1800 890 8411",
    supportPhoneLabel: "Liftronic Care",
    email: "info@liftronicelevator.com",
    emailLabel: "Send us Email",
    salesPhone: "+91 9028226664",
    salesPhoneLabel: "Sales Enquiry",
    serviceArea: "Serving Mumbai, Pune & major metros",
  };

  const contact = contactInfo || fallbackContactInfo;

  useEffect(() => {
    // Lazy load video after initial paint
    const loadVideo = () => {
      if (videoRef.current && !videoLoaded) {
        const video = videoRef.current;
        video.src = "/assets/sample_1.mp4";
        video.load();

        const tryPlay = () => {
          video.play().catch(() => {
            /* autoplay blocked — will retry on interaction */
          });
        };

        video.addEventListener(
          "loadeddata",
          () => {
            setVideoLoaded(true);
            tryPlay();
          },
          { once: true }
        );
      }
    };

    // Use Intersection Observer to load video when hero is visible
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Delay video load slightly to prioritize FCP
            setTimeout(loadVideo, 100);
            observerRef.current?.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    const heroElement = document.querySelector("#hero-section");
    if (heroElement) {
      observerRef.current.observe(heroElement);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [videoLoaded]);

  const handleScroll = () => {
    const el = document.getElementById("about");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
    }
  };
  return (
    <section
      id="hero-section"
      className="relative h-[100svh] min-h-[600px] w-full overflow-hidden bg-gradient-to-b from-[#010101] via-[#050505] to-[#0e0e0e] text-white pt-24 md:pt-28 lg:pt-32"
    >
      {/* === BACKGROUND VIDEO + OVERLAY === */}
      <div className="absolute inset-0 overflow-hidden">
        {!videoLoaded && (
          <Image
            src="/assets/hero-poster.jpg"
            alt="Liftronic Elevator Hero"
            fill
            priority
            sizes="100vw"
            className="object-cover brightness-[0.6]"
          />
        )}

        <video
          ref={videoRef}
          id="hero-bg"
          className={`absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto object-cover -translate-x-1/2 -translate-y-1/2 transition-opacity duration-700 ${
            videoLoaded ? "opacity-100" : "opacity-0"
          }`}
          loop
          muted
          playsInline
        />

        {/* Gradient overlays + elevator glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90" />
        <div className="absolute inset-0 [background:radial-gradient(40%_60%_at_50%_30%,rgba(0,255,163,0.1),transparent_70%)]" />
        <div className="absolute inset-0 [background:radial-gradient(40%_60%_at_60%_80%,rgba(0,200,255,0.1),transparent_70%)]" />
      </div>

      {/* === MAIN CONTENT === */}
      <div className="relative container mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-end lg:justify-between gap-8 lg:gap-12 pb-12 lg:pb-0">
        {/* Left content with floating parallax effect */}
        <div
          className="relative z-10 max-w-2xl text-center lg:text-left"
          style={{
            transform: `translateY(0px)`,
            transition: "transform 0.1s ease-out",
            opacity: 1,
          }}
        >
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
            <span className="bg-gradient-to-r from-accent via-white to-accent bg-clip-text text-transparent">
              Redefining Vertical Luxury
            </span>
          </h1>

          {/* Description */}
          <p className="mt-3 md:mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-white leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium">
            &quot;Redefining Vertical Luxury&quot; reflects our commitment to
            transforming every ride through engineering excellence — crafted
            with precision, built for safety, and designed for luxury to deliver
            a truly seamless passenger experience.
          </p>
          <div className="mt-5 md:mt-6 flex flex-col items-center lg:items-start gap-3 md:gap-4">
            {/* Buttons */}
            <div className="order-2 lg:order-1 flex flex-row justify-center lg:justify-start gap-2 md:gap-4 w-full">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 md:px-8 py-3 md:py-3.5 text-xs sm:text-base font-medium hover:bg-accent hover:text-black hover:shadow-[0_0_30px_rgba(0,255,163,0.4)] transition-all duration-300"
              >
                <FiEye className="text-base md:text-lg group-hover:scale-110 transition-transform" />
                <span>View Lifts</span>
              </Link>

              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("#services");
                }}
                className="group inline-flex items-center justify-center gap-1.5 md:gap-2 rounded-2xl border border-accent/40 bg-accent/10 text-accent px-4 md:px-8 py-3 md:py-3.5 text-xs sm:text-base hover:bg-accent hover:text-black font-medium hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] transition-all duration-300"
              >
                <FiHeadphones className="text-base md:text-lg group-hover:scale-110 transition-transform" />
                <span>Our Services</span>
              </a>
            </div>

            {/* Subline */}
            <div className="order-1 lg:order-2 flex justify-center lg:justify-start">
              <span className="text-[10px] sm:text-xs uppercase tracking-widest text-accent font-semibold">
                Building Trust with Builders, Architects, Consultants,
                Technology Partners, and Customers.
              </span>
            </div>
          </div>

          {/* Social Icons - Desktop only */}
          <div className="hidden sm:block mt-6 md:mt-7">
            <span className="block text-xs uppercase tracking-[0.3em] text-white/50 mb-2">
              Connect
            </span>
            <div className="flex flex-wrap justify-center lg:justify-start gap-2">
              {socials?.map((social) => {
                const Icon = getIcon(social.icon);
                return (
                  <a
                    key={social._id}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 hover:bg-accent/10 hover:border-accent/40 hover:text-accent transition-all duration-300"
                  >
                    {Icon && <Icon className="text-accent text-base" />}
                    <span className="text-xs font-medium">{social.title}</span>
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT CARD - Hide on medium and below for better zoom experience */}
        <aside className="hidden xl:flex flex-col w-full max-w-md rounded-3xl bg-white/10 backdrop-blur-2xl border border-white/20 p-6 lg:p-8 shadow-[0_0_40px_rgba(0,255,163,0.1)]">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-base lg:text-lg font-semibold">
                Request a Quote
              </h3>
              <p className="text-xs lg:text-sm text-white/70">
                Speak to our design & installation team
              </p>
            </div>
            <div className="rounded-full bg-accent/20 p-2.5 lg:p-3 flex-shrink-0">
              <FiHeadphones className="text-accent text-xl lg:text-2xl" />
            </div>
          </div>

          <div className="mt-4 lg:mt-5 grid gap-2.5 lg:gap-3">
            <a
              href={`tel:${contact.supportPhone.replace(/\s/g, "")}`}
              className="flex items-center justify-between bg-white/5 p-2.5 lg:p-3 rounded-xl border border-white/10 hover:bg-white/15 transition-all"
            >
              <div>
                <p className="text-[10px] lg:text-xs text-white/70">
                  {contact.supportPhoneLabel}
                </p>
                <p className="text-sm lg:text-base font-medium">
                  {contact.supportPhone}
                </p>
              </div>
              <FiPhoneCall className="text-accent text-lg lg:text-xl" />
            </a>

            <a
              href={`mailto:${contact.email}`}
              className="flex items-center justify-between bg-white/5 p-2.5 lg:p-3 rounded-xl border border-white/10 hover:bg-white/15 transition-all"
            >
              <div>
                <p className="text-[10px] lg:text-xs text-white/70">
                  {contact.emailLabel}
                </p>
                <p className="text-sm lg:text-base font-medium">
                  {contact.email}
                </p>
              </div>
              <FiMail className="text-accent text-lg lg:text-xl" />
            </a>

            <a
              href={`tel:${contact.salesPhone.replace(/\s/g, "")}`}
              className="flex items-center justify-between bg-white/5 p-2.5 lg:p-3 rounded-xl border border-white/10 hover:bg-white/15 transition-all"
            >
              <div>
                <p className="text-[10px] lg:text-xs text-white/70">
                  {contact.salesPhoneLabel}
                </p>
                <p className="text-sm lg:text-base font-medium">
                  {contact.salesPhone}
                </p>
              </div>
              <FiPhoneCall className="text-accent text-lg lg:text-xl" />
            </a>
          </div>

          <div className="mt-4 lg:mt-5 text-[10px] lg:text-xs text-white/60">
            {contact.serviceArea}
          </div>
        </aside>

        {/* Scroll Indicator - Hidden on mobile */}
        <button
          type="button"
          onClick={handleScroll}
          className="hidden md:flex absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex-col items-center text-white/70 hover:text-white text-xs transition-all"
        >
          <span className="text-[10px] md:text-xs">Scroll</span>
          <svg
            className="mt-1 animate-bounce"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
    </section>
  );
}
