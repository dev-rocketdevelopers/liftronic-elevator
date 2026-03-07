import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import type { PortableTextBlock } from "@portabletext/types";
import Breadcrumb from "~/components/Breadcrumb";
import CallToActionSection from "~/components/CallToActionSection";
import FAQ from "~/components/FAQ";
import Features from "~/components/Features";
import ProductGallerySection from "~/components/products/ProductGallerySection";
import type { ProductFull } from "~/sanity/lib/productTypes";

export type LocationPageData = {
  city: string;
  citySlug: string;
  uniqueContent: PortableTextBlock[];
  metaTitle: string;
  metaDescription: string;
  keywords?: string[];
  published: boolean;
  enableIndexing: boolean;
};

type ProductDetailContentProps = {
  product: ProductFull;
  locationPage?: LocationPageData;
};

export default function ProductDetailContent({
  product,
  locationPage,
}: ProductDetailContentProps) {
  const heroImage = product.mainImage || "/illustrations/product01.png";
  const galleryImages = product.gallery ?? [];
  const hasSpecifications =
    Array.isArray(product.specifications) && product.specifications.length > 0;

  return (
    <main className="min-h-screen">
      <section className="relative isolate overflow-hidden bg-gradient-to-br from-white via-white/80 to-gray-50/50">
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

          <div className="mt-6 grid items-start gap-16 lg:grid-cols-[1fr_0.85fr] lg:items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold leading-tight text-charcoal md:text-5xl lg:text-6xl">
                  {product.title}
                </h1>
                {product.subtitle && (
                  <p className="text-xl leading-relaxed text-gray-700 md:text-2xl lg:max-w-xl">
                    {product.subtitle}
                  </p>
                )}
              </div>

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

              <div>
                <p className="text-lg leading-relaxed text-gray-700">
                  {product.description}
                </p>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Link
                  href="/#contact"
                  className="btn btn-primary px-8 py-4 text-lg shadow-lg transition-all duration-300 hover:shadow-xl"
                >
                  Get a Quote
                </Link>
                <Link
                  href="/services"
                  className="btn border-2 border-gray-200 bg-white/80 px-8 py-4 text-lg text-charcoal backdrop-blur-sm transition-all duration-300 hover:border-gray-300 hover:bg-gray-50"
                >
                  Explore Services
                </Link>
              </div>
            </div>

            <div className="order-first lg:order-last">
              <div className="relative mx-auto aspect-[4/3] w-full overflow-hidden rounded-3xl border border-gray-200/60 bg-white shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-gray-900/5" />
                <Image
                  src={heroImage}
                  alt={product.imageAlt || `${product.title} render`}
                  fill
                  sizes="(min-width: 1024px) 40vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
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
            <div className="mx-auto mb-8 space-y-4">
              <div className="inline-block rounded-full bg-accent/10 px-4 py-2">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  Performance
                </span>
              </div>
              <h2 className="text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                Technical specifications for {product.title}
              </h2>
            </div>

            <dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {product.specifications?.map((spec) => (
                <div
                  key={`${spec.label}-${spec.value}`}
                  className="group rounded-2xl border border-gray-200/60 bg-gradient-to-br from-white to-gray-50/30 p-8 shadow-md transition-all duration-300 hover:border-accent/20 hover:shadow-lg"
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

      <ProductGallerySection images={galleryImages} productTitle={product.title} />

      {locationPage && (
        <section className="border-t border-gray-200/60 bg-gradient-to-b from-white to-gray-50 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mb-12 lg:mb-16">
              <div className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-2">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  {locationPage.city}
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                {product.title} in {locationPage.city}
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                Location-specific information and insights about {product.title}{" "}
                availability and services in {locationPage.city}
              </p>
            </div>

            <div className="prose prose-lg max-w-none">
              <PortableText value={locationPage.uniqueContent} />
            </div>
          </div>
        </section>
      )}

      {product.faqs && product.faqs.length > 0 && (
        <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/50 via-white to-gray-50/30 py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="mb-12 lg:mb-16">
              <div className="mb-6 inline-block rounded-full bg-accent/10 px-4 py-2">
                <span className="text-sm font-bold uppercase tracking-wider text-accent">
                  FAQ
                </span>
              </div>
              <h2 className="mb-4 text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
                Frequently Asked Questions
              </h2>
              <p className="max-w-2xl text-lg leading-relaxed text-gray-600">
                Everything you need to know about {product.title}. Can&apos;t
                find what you&apos;re looking for? Contact our support team.
              </p>
            </div>
            <FAQ faqs={product.faqs} />
          </div>
        </section>
      )}

      <CallToActionSection
        secondaryAction={{
          label: "View All Products",
          href: "/products",
        }}
      />
    </main>
  );
}
