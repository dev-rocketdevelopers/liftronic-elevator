"use client";

import { useEffect, useState, type ReactElement } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  BiBrush,
  BiGlobeAlt,
  BiPhoneCall,
  BiRefresh,
  BiWrench,
  BiShield,
  BiStar,
} from "react-icons/bi";
import QuoteCTA from "~/components/QuoteCTA";
import type { ServiceOffered } from "~/sanity/lib/serviceTypes";

type ServicesProps = {
  services?: ServiceOffered[];
};

const FALLBACK_CREATED_AT = "1970-01-01T00:00:00.000Z";

// Icon mapping function
const getServiceIcon = (iconName?: string): ReactElement => {
  const iconMap: Record<string, ReactElement> = {
    brush: <BiBrush className="h-6 w-6 text-accent" aria-hidden />,
    globe: <BiGlobeAlt className="h-6 w-6 text-accent" aria-hidden />,
    phone: <BiPhoneCall className="h-6 w-6 text-accent" aria-hidden />,
    refresh: <BiRefresh className="h-6 w-6 text-accent" aria-hidden />,
    wrench: <BiWrench className="h-6 w-6 text-accent" aria-hidden />,
    shield: <BiShield className="h-6 w-6 text-accent" aria-hidden />,
    star: <BiStar className="h-6 w-6 text-accent" aria-hidden />,
  };

  return (
    iconMap[iconName?.toLowerCase() || "wrench"] || (
      <BiWrench className="h-6 w-6 text-accent" aria-hidden />
    )
  );
};

// Fallback services data
const fallbackServices: ServiceOffered[] = [
  {
    _id: "fallback-1",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Design Strategy",
    slug: "design-strategy",
    summary:
      "Concept-to-cab styling shaped around traffic flow, comfort, and safety priorities. We align every detail with your brand vision and passenger expectations.",
    tags: [
      "Design insight",
      "Performance",
      "Reliability",
      "Refined aesthetics",
    ],
    icon: "brush",
    featured: true,
  },
  {
    _id: "fallback-2",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Supply (Domestic / Exports)",
    slug: "supply-domestic-exports",
    summary:
      "Certified passenger, home, and freight elevators shipped with meticulous component traceability. Logistics are synchronized for dependable global rollouts.",
    tags: ["Passenger", "Home", "Freight", "Global delivery"],
    icon: "globe",
    featured: true,
  },
  {
    _id: "fallback-3",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Installation & Maintenance",
    slug: "installation-maintenance",
    summary:
      "Swift deployment sustained by preventive inspections, 24/7 support, and quick resolutions. Our teams stay on-call to keep every ride smooth and secure.",
    tags: [
      "24/7 support",
      "Scheduled care",
      "Rapid callbacks",
      "Expert repairs",
    ],
    icon: "phone",
    featured: true,
  },
  {
    _id: "fallback-4",
    _createdAt: FALLBACK_CREATED_AT,
    title: "Replacement Excellence",
    slug: "replacement-excellence",
    summary:
      "Modernize legacy elevators to unlock smoother rides, current tech, and enduring safety. From ambiance to automation, we future-proof every upgrade.",
    tags: [
      "Performance uplift",
      "Comfort upgrade",
      "Tech refresh",
      "Safety assured",
    ],
    icon: "refresh",
    featured: true,
  },
];

const AUTO_ROTATE_MS = 5000;
const DESKTOP_VISIBLE = 3;

export default function Services({ services: servicesProp }: ServicesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // Use provided services or fallback
  const services =
    servicesProp && servicesProp.length > 0 ? servicesProp : fallbackServices;

  useEffect(() => {
    if (services.length <= 1 || isDragging) return;

    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % services.length);
    }, AUTO_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [services.length, isDragging]);

  if (services.length === 0) {
    return null;
  }

  const visibleDesktop = Array.from(
    { length: Math.min(DESKTOP_VISIBLE, services.length) },
    (_, offset) => services[(activeIndex + offset) % services.length],
  );

  const currentService = services[activeIndex];

  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    setIsDragging(false);
    const swipeThreshold = 50;

    if (info.offset.x > swipeThreshold) {
      // Swiped right - go to previous
      setActiveIndex((prev) => (prev - 1 + services.length) % services.length);
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left - go to next
      setActiveIndex((prev) => (prev + 1) % services.length);
    }
  };

  return (
    <section
      id="services"
      className="relative isolate overflow-hidden scroll-mt-24 text-white"
    >
      <div className="absolute inset-0 -z-10 bg-[#071812]/80" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-accent/20 via-[#0d221a]/60 to-[#04110c]/75" />
      <div className="container mx-auto flex min-h-screen flex-col justify-center px-4 py-24">
        <div className="max-w-3xl space-y-4">
          <h2 className="text-4xl font-extrabold text-white md:text-5xl">
            Services provided
          </h2>
          <p className="text-lg leading-relaxed text-white/75 md:text-xl">
            Liftronic delivers end-to-end elevator expertise, blending bespoke
            design, precise execution, and future-ready modernization for every
            building we serve .
          </p>
        </div>

        <div className="mt-12 md:hidden">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={`${currentService.title}-${activeIndex}`}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragStart={() => setIsDragging(true)}
              onDragEnd={handleDragEnd}
              className="touch-pan-y"
            >
              <Link
                prefetch={false}
                href={`/services/${currentService.slug}`}
                className="block"
              >
                <article className="group relative flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/15 p-8 shadow-xl shadow-black/15 backdrop-blur-xl cursor-pointer">
                  <ImageBackdrop
                    alt={currentService.title}
                    sizes="100vw"
                    imageSrc={currentService.image}
                    imageLqip={currentService.imageLqip}
                  />
                  <CardContent service={currentService} />
                </article>
              </Link>
            </motion.div>
          </AnimatePresence>
          <CarouselDots
            activeIndex={activeIndex}
            total={services.length}
            onSelect={setActiveIndex}
          />
        </div>

        <div className="mt-12 hidden gap-6 md:grid md:grid-cols-3">
          <AnimatePresence initial={false} mode="popLayout">
            {visibleDesktop.map((service, offset) => (
              <Link
                prefetch={false}
                href={`/services/${service.slug}`}
                key={`${service.title}-${
                  (activeIndex + offset) % services.length
                }`}
                className="block"
              >
                <motion.article
                  layout
                  initial={{ opacity: 0, x: 56 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -56 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  whileHover={{ y: -10 }}
                  className="group relative flex min-h-[460px] flex-col overflow-hidden rounded-3xl border border-white/15 bg-white/15 p-8 shadow-xl shadow-black/15 transition-shadow duration-300 backdrop-blur-xl hover:shadow-2xl cursor-pointer"
                >
                  <ImageBackdrop
                    alt={service.title}
                    sizes="(min-width: 768px) 33vw"
                    imageSrc={service.image}
                    imageLqip={service.imageLqip}
                  />
                  <CardContent service={service} />
                </motion.article>
              </Link>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-10 hidden md:flex">
          <CarouselDots
            activeIndex={activeIndex}
            total={services.length}
            onSelect={setActiveIndex}
          />
        </div>

        {/* Quote and CTA Section - matching Products section */}
        <div className="mt-12">
          <QuoteCTA
            quote="Elevating safety, efficiency, and comfort in every installation."
            ctaText="See All Services"
            ctaHref="/services"
            className="bg-white/20 backdrop-blur-lg border border-white/30 shadow-2xl [&_blockquote]:text-white [&_blockquote]:font-semibold"
          />
        </div>
      </div>
    </section>
  );
}

function ImageBackdrop({
  alt,
  sizes,
  imageSrc,
  imageLqip,
}: {
  alt: string;
  sizes: string;
  imageSrc?: string;
  imageLqip?: string;
}) {
  const defaultImage = "/assets/sample_img.jpg";

  return (
    <>
      <div className="absolute inset-0">
        <Image
          src={imageSrc || defaultImage}
          alt={alt}
          fill
          sizes={sizes}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          placeholder={imageLqip ? "blur" : undefined}
          blurDataURL={imageLqip || undefined}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#071812]/80 via-[#0f231b]/72 to-accent/30" />
    </>
  );
}

function CardContent({ service }: { service: ServiceOffered }) {
  return (
    <div className="relative flex h-full flex-col justify-between gap-10 text-white">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <span className="flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent shadow-sm ring-1 ring-accent/30">
            {getServiceIcon(service.icon)}
          </span>
          <h3 className="text-2xl font-bold md:text-3xl">{service.title}</h3>
        </div>
        <p className="text-base leading-relaxed text-white/85 md:text-lg">
          {service.summary}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {(service.tags || []).map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-white/15 px-3 py-1 text-sm font-semibold text-white ring-1 ring-inset ring-white/20 capitalize backdrop-blur-sm"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function CarouselDots({
  activeIndex,
  total,
  onSelect,
}: {
  activeIndex: number;
  total: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div
      className="mx-auto flex gap-2"
      role="group"
      aria-label="Service carousel navigation"
    >
      <div className="mx-auto mt-6 flex w-full justify-center gap-2 md:mt-0 md:w-auto">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={`dot-${index}`}
            type="button"
            onClick={() => onSelect(index)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
              index === activeIndex
                ? "bg-white scale-110"
                : "bg-white/30 hover:bg-white/55"
            }`}
            aria-label={`Go to service ${index + 1}`}
            aria-current={index === activeIndex ? "true" : "false"}
          />
        ))}
      </div>
    </div>
  );
}
