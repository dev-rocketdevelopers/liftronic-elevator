"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import ProductGalleryModal from "~/components/products/ProductGalleryModal";
import type { GalleryImage } from "~/sanity/lib/productTypes";

type ProductGallerySectionProps = {
  images: GalleryImage[];
  productTitle: string;
};

export default function ProductGallerySection({
  images,
  productTitle,
}: ProductGallerySectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null,
  );

  if (images.length === 0) {
    return null;
  }

  const handleNext = () => {
    if (selectedImageIndex === null || images.length <= 1) {
      return;
    }

    setSelectedImageIndex((selectedImageIndex + 1) % images.length);
  };

  const handlePrevious = () => {
    if (selectedImageIndex === null || images.length <= 1) {
      return;
    }

    setSelectedImageIndex(
      (selectedImageIndex - 1 + images.length) % images.length,
    );
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  return (
    <>
      <section className="border-t border-gray-200/60 bg-gradient-to-br from-gray-50/30 to-white py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-16 space-y-6">
            <div className="inline-block rounded-full bg-accent/10 px-4 py-2">
              <span className="text-sm font-bold uppercase tracking-wider text-accent">
                Visual Gallery
              </span>
            </div>
            <h2 className="text-3xl font-bold leading-tight text-charcoal md:text-4xl lg:text-5xl">
              Experience the quality in detail
            </h2>
            <p className="max-w-2xl text-xl leading-relaxed text-gray-700">
              High-fidelity renders showcasing cabin design, control systems,
              and installation excellence.
            </p>
          </div>

          <div className="grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-4">
            {images.map((image, index) => {
              const bentoPatterns = [
                "col-span-2 row-span-2",
                "col-span-1 row-span-1",
                "col-span-1 row-span-1",
                "col-span-1 row-span-2",
                "col-span-1 row-span-1",
                "col-span-2 row-span-1",
              ];
              const pattern = bentoPatterns[index % bentoPatterns.length];

              return (
                <motion.button
                  key={image._key}
                  type="button"
                  className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200/60 shadow-lg transition-all duration-500 hover:shadow-2xl ${pattern}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`View ${image.alt || `image ${index + 1}`} in fullscreen`}
                >
                  <Image
                    src={image.url}
                    alt={image.alt || `${productTitle} gallery image ${index + 1}`}
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
                    <div className="absolute inset-x-0 bottom-0 translate-y-4 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 md:p-6">
                      <h3 className="line-clamp-2 text-sm font-semibold text-white drop-shadow-lg md:text-lg">
                        {image.alt}
                      </h3>
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {selectedImageIndex !== null && (
        <ProductGalleryModal
          images={images}
          currentIndex={selectedImageIndex}
          onClose={handleCloseModal}
          onNext={handleNext}
          onPrevious={handlePrevious}
          productTitle={productTitle}
        />
      )}
    </>
  );
}
