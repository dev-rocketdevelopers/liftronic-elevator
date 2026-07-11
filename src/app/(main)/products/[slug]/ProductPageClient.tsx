"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Breadcrumb from "~/components/Breadcrumb";
import Features from "~/components/Features";
import FAQ from "~/components/FAQ";
import ProductGalleryModal from "~/components/products/ProductGalleryModal";
import { motion } from "motion/react";
import CallToActionSection from "~/components/CallToActionSection";
import { FiMessageSquare, FiEye } from "react-icons/fi";
import type { ProductFull } from "~/sanity/lib/productTypes";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";

interface LocationPageData {
  city: string;
  citySlug: string;
  uniqueContent: PortableTextBlock[];
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  published: boolean;
  enableIndexing: boolean;
}

type ProductPageClientProps = {
  product: ProductFull;
  locationPage?: LocationPageData;
};

export default function ProductPageClient({
  product,
  locationPage,
}: ProductPageClientProps) {
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  // Prefetch the products page immediately when this page loads
  useEffect(() => {
    router.prefetch("/products");
  }, [router]);

  const heroImage = product.mainImage || "/illustrations/product01.png";

  // Use gallery from Sanity
  const galleryImages =
    product.gallery && product.gallery.length > 0 ? product.gallery : [];

  const hasSpecifications =
    Array.isArray(product.specifications) && product.specifications.length > 0;

  // Modal navigation handlers
  const handleNext = () => {
    if (selectedImageIndex === null || galleryImages.length <= 1) return;
    setSelectedImageIndex((selectedImageIndex + 1) % galleryImages.length);
  };

  const handlePrevious = () => {
    if (selectedImageIndex === null || galleryImages.length <= 1) return;
    setSelectedImageIndex(
      (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length,
    );
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-white/80 to-gray-50/50">
        {/* Background Elements */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_farthest-corner_at_top_right,_rgba(42,227,148,0.12),_transparent_60%)]" />
          <div className="absolute -left-20 top-1/3 h-80 w-80 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl opacity-60" />
          <div className="absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-accent/15 blur-3xl opacity-50" />
        </div>

        <div className="container mx-auto px-6 py-16 md:py-28">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Products", href: "/products" },
              { label: product.title, isCurrentPage: true },
            ]}
          />

          <div className="grid items-start gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-center mt-6">
            {/* Content */}
            <div className="space-y-8">
              {/* Title and Subtitle */}
              <div className="space-y-4">
                <h1 className="product-title text-4xl font-bold leading-tight text-charcoal md:text-5xl lg:text-6xl">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-xl leading-relaxed text-gray-700 md:text-2xl lg:max-w-xl">
                    {product.subtitle}
                  </p>
                )}
              </div>

              {/* Product Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-3">
                  {product.tags.map((tag) => (
                    <span
                      key={tag._id}
                      className="inline-flex items-center rounded-md bg-brand px-4 py-2 text-sm font-semibold text-white shadow-md"
                    >
                      {tag.title}
                    </span>
                  ))}
                </div>
              )}

              {/* Description Card */}
              <div>
                <p className="text-lg leading-relaxed text-gray-700">
                  {product.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Link prefetch={false} href="/#contact">
                  <motion.button
                    className="btn btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiMessageSquare className="text-lg" />
                    Get a Quote
                  </motion.button>
                </Link>
                <Link prefetch={false} href="/services">
                  <motion.button
                    className="btn border-2 border-gray-200 bg-white/80 text-charcoal hover:bg-gray-50 hover:border-gray-300 text-lg px-8 py-4 backdrop-blur-sm transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <FiEye className="text-lg" />
                    Explore Services
                  </motion.button>
                </Link>
              </div>
            </div>

            {/* Product Image */}
            <div className="order-first lg:order-last">
              <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-2xl product-image">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-900/5" />
                <Image
                  src={heroImage}
                  alt={product.imageAlt || `${product.title} render`}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  className="object-contain p-4"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {hasSpecifications && (
        <section className="border-t border-gray-200/60 bg-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="mx-auto space-y-4 mb-8">
              <div className="inline-block rounded-full bg-accent/10 px-4 py-2">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  Performance
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                Technical specifications for {product.title}
              </h2>
            </div>

            {/* Specifications Grid */}
            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {product.specifications?.map((spec) => (
                <div
                  key={`${spec.label}-${spec.value}`}
                  className="group rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/30 p-8 shadow-md transition-all duration-300 hover:shadow-lg hover:border-accent/20"
                >
                  <dt className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-500">
                    {spec.label}
                  </dt>
                  <dd className="mt-3 text-2xl font-bold text-charcoal md:text-3xl">
                    {spec.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {product.keyFeatures && product.keyFeatures.length > 0 && (
        <Features
          features={product.keyFeatures.map((feature) => ({
            title: feature.title,
            description: feature.description || "",
            icon: feature.icon || "fiPackage",
          }))}
        />
      )}

      {/* Gallery Section - Bento Grid */}
      {galleryImages.length > 0 && (
        <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white py-20 md:py-28">
          <div className="container mx-auto px-4">
            {/* Section Header */}
            <div className="mx-auto space-y-6 mb-16">
              <div className="inline-block rounded-full bg-accent/10 px-4 py-2">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  Visual Gallery
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                Experience the quality in detail
              </h2>
              <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                High-fidelity renders showcasing cabin design, control systems,
                and installation excellence.
              </p>
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px] md:auto-rows-[280px]">
              {galleryImages.map((image, index) => {
                // Bento grid pattern: different sizes for visual interest
                const bentoPatterns = [
                  "col-span-2 row-span-2", // Large featured
                  "col-span-1 row-span-1", // Small
                  "col-span-1 row-span-1", // Small
                  "col-span-1 row-span-2", // Tall
                  "col-span-1 row-span-1", // Small
                  "col-span-2 row-span-1", // Wide
                ];
                const pattern = bentoPatterns[index % bentoPatterns.length];

                return (
                  <motion.div
                    key={image._key}
                    className={`group relative overflow-hidden rounded-2xl border border-gray-200/60 shadow-lg transition-all duration-500 hover:shadow-2xl cursor-pointer ${pattern}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => setSelectedImageIndex(index)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View ${
                      image.alt || `image ${index + 1}`
                    } in fullscreen`}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedImageIndex(index);
                      }
                    }}
                  >
                    <Image
                      src={image.url}
                      alt={
                        image.alt ||
                        `${product.title} gallery image ${index + 1}`
                      }
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                      placeholder={image.lqip ? "blur" : "empty"}
                      blurDataURL={image.lqip}
                      quality={85}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    {image.alt && (
                      <div className="absolute inset-x-0 bottom-0 p-4 md:p-6 translate-y-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                        <h3 className="text-sm md:text-lg font-semibold text-white drop-shadow-lg line-clamp-2">
                          {image.alt}
                        </h3>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Location-Specific Content Section - After FAQ */}
      {locationPage && (
        <section className="py-20 md:py-28 bg-gradient-to-b from-white to-gray-50 border-t border-gray-200/60">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 lg:mb-16"
            >
              <div className="inline-block rounded-full bg-accent/10 px-4 py-2 mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  📍 {locationPage.city}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 leading-tight">
                {product.title} in {locationPage.city}
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                Location-specific information and insights about {product.title}{" "}
                availability and services in {locationPage.city}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <PortableText value={locationPage.uniqueContent} />
            </motion.div>
          </div>
        </section>
      )}

      {!locationPage && product.faqs && product.faqs.length > 0 && (
        <section className="py-20 md:py-28 bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 border-t border-gray-200/60">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12 lg:mb-16"
            >
              <div className="inline-block rounded-full bg-accent/10 px-4 py-2 mb-6">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  FAQ
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-charcoal mb-4 leading-tight">
                Frequently Asked Questions
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl leading-relaxed">
                Everything you need to know about {product.title}. Can&apos;t
                find what you&apos;re looking for? Contact our support team.
              </p>
            </motion.div>
            <FAQ faqs={product.faqs} />

            {/* Location Page Links */}
            {product.locationPages && product.locationPages.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-8 text-center"
              >
                <div className="flex flex-wrap justify-center gap-2 text-xs text-gray-500">
                  {product.locationPages.map((location, index) => (
                    <span key={location.citySlug}>
                      <Link
                        prefetch={false}
                        href={`/products/${product.slug}/${location.citySlug}`}
                        className="hover:text-accent transition-colors duration-200 underline"
                      >
                        {product.title} in {location.city}
                      </Link>
                      {index < product.locationPages!.length - 1 && (
                        <span className="mx-1">•</span>
                      )}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </section>
      )}

      <CallToActionSection
        secondaryAction={{
          label: "View All Products",
          href: "/products",
        }}
      />

      {/* Gallery Modal */}
      {selectedImageIndex !== null && (
        <ProductGalleryModal
          images={galleryImages}
          currentIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          productTitle={product.title}
        />
      )}
    </main>
  );
}
