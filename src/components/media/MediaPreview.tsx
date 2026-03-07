"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { HiX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { MediaItem } from "~/sanity/lib/mediaTypes";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "~/sanity/lib/client";

// Initialize image URL builder
const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function urlFor(source: any) {
  return builder.image(source);
}

// Extract YouTube video ID from URL
function getYouTubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

type MediaPreviewProps = {
  item: MediaItem | null;
  onClose: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasMultiple: boolean;
};

export default function MediaPreview({ item, onClose, onNext, onPrevious, hasMultiple }: MediaPreviewProps) {
  useEffect(() => {
    if (item) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight" && hasMultiple) {
        onNext();
      } else if (e.key === "ArrowLeft" && hasMultiple) {
        onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [item, hasMultiple, onClose, onNext, onPrevious]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
            aria-label="Close"
          >
            <HiX className="w-6 h-6" />
          </button>

          {/* Navigation buttons */}
          {hasMultiple && (
            <>
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                aria-label="Previous media"
              >
                <HiChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
                aria-label="Next media"
              >
                <HiChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          {/* Media content */}
          <div className="relative">
            {item.type === "video" && item.youtubeUrl ? (
              <div className="relative aspect-video">
                <iframe
                  src={`https://www.youtube.com/embed/${getYouTubeId(item.youtubeUrl)}?autoplay=1`}
                  title={item.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            ) : (
              <div className="relative aspect-video bg-gray-100">
                <Image
                  src={urlFor(item.image!).width(1920).height(1080).url()}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 80vw, 100vw"
                  className="object-contain"
                />
              </div>
            )}
          </div>

          {/* Info section */}
          <div className="p-6">
            <h2 className="text-2xl font-bold text-charcoal mb-2">
              {item.title}
            </h2>
            <p className="text-gray-600 mb-4">{item.description}</p>

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
