import type { Metadata } from "next";
import ProductRangeCarouselCard from "~/components/products/ProductRangeCarouselCard";
import ProductsHero from "~/components/products/ProductsHero";
import CallToActionSection from "~/components/CallToActionSection";
import { getProductRanges } from "~/sanity/utils/getProductRanges";

export const metadata: Metadata = {
  title: "Product Ranges - Elevator Solutions | Lift Solutions",
  description:
    "Explore our comprehensive range of elevator solutions spanning residential, commercial and industrial needs. Designed for safety, efficiency and seamless ride quality.",
  openGraph: {
    title: "Elevate every building with precision - Product Ranges",
    description:
      "Explore our comprehensive range of elevator solutions spanning residential, commercial and industrial needs. Designed for safety, efficiency and seamless ride quality.",
    type: "website",
    url: "/products",
  },
  twitter: {
    card: "summary_large_image",
    title: "Product Ranges - Elevator Solutions | Lift Solutions",
    description:
      "Explore our comprehensive range of elevator solutions spanning residential, commercial and industrial needs.",
  },
  alternates: {
    canonical: "/products",
  },
};

export const revalidate = 3600; // 60 minutes

export default async function ProductsPage() {
  const productRanges = await getProductRanges();

  return (
    <main>
      {/* Page hero */}
      <ProductsHero />

      {/* Product Ranges with Carousels */}
      <section className="pt-0 pb-12 md:pt-16 md:pb-16 bg-gradient-to-br from-gray-50/30 to-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {productRanges.map((range) => (
              <div
                key={range._id}
                className={
                  range.products.length === 1
                    ? "md:col-span-1"
                    : "md:col-span-2 lg:col-span-3"
                }
              >
                <ProductRangeCarouselCard
                  title={range.title}
                  description={range.description}
                  slug={range.slug}
                  featured={range.featured}
                  products={range.products}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToActionSection />
    </main>
  );
}
