"use client";

import { motion, AnimatePresence } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { HiXMark } from "react-icons/hi2";
import type { TeaserPopupConfig } from "~/sanity/lib/popupTypes";
import { useModal } from "~/hooks/useModal";

interface TeaserPopupModalProps {
  popup: TeaserPopupConfig;
  isOpen: boolean;
  onClose: () => void;
}

type YouTubePlayerCommand = "mute" | "playVideo" | "setVolume" | "unMute";

// Extract YouTube video ID from various URL formats
function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
    /youtube\.com\/shorts\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match?.[1]) {
      return match[1];
    }
  }
  return null;
}

function buildYouTubeEmbedSrc(videoId: string, origin: string): string {
  const params = new URLSearchParams({
    autoplay: "1",
    controls: "0",
    enablejsapi: "1",
    fs: "0",
    loop: "1",
    modestbranding: "1",
    mute: "1",
    playlist: videoId,
    playsinline: "1",
    rel: "0",
  });

  if (origin) {
    params.set("origin", origin);
  }

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

function getYouTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export default function TeaserPopupModal({
  popup,
  isOpen,
  onClose,
}: TeaserPopupModalProps) {
  const videoId = extractYouTubeId(popup.videoUrl);
  const title = popup.title?.trim();
  const playerOrigin =
    typeof window === "undefined" ? "" : window.location.origin;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [isPlayerLoaded, setIsPlayerLoaded] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [showTapHint, setShowTapHint] = useState(true);
  const [showExternalFallback, setShowExternalFallback] = useState(false);

  const handleClose = useCallback(() => {
    setIsPlayerLoaded(false);
    setIsSoundEnabled(false);
    setShowTapHint(true);
    setShowExternalFallback(false);
    onClose();
  }, [onClose]);

  useModal({ isOpen, onClose: handleClose });

  const postPlayerCommand = useCallback(
    (
      func: YouTubePlayerCommand,
      args: Array<number | string> = [],
    ): boolean => {
      const playerWindow = iframeRef.current?.contentWindow;
      if (!playerWindow) return false;

      playerWindow.postMessage(
        JSON.stringify({
          event: "command",
          func,
          args,
        }),
        "*",
      );
      return true;
    },
    [],
  );

  const syncPlayerSound = useCallback(
    (shouldEnableSound: boolean): boolean => {
      if (!postPlayerCommand(shouldEnableSound ? "unMute" : "mute")) {
        return false;
      }

      if (shouldEnableSound) {
        postPlayerCommand("setVolume", [100]);
        postPlayerCommand("playVideo");
      }

      return true;
    },
    [postPlayerCommand],
  );

  useEffect(() => {
    if (!isOpen || !isPlayerLoaded) return;

    const timeoutId = window.setTimeout(() => {
      const didSync = syncPlayerSound(isSoundEnabled);
      if (isSoundEnabled && !didSync) {
        setShowExternalFallback(true);
      }
    }, 180);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isOpen, isPlayerLoaded, isSoundEnabled, syncPlayerSound]);

  useEffect(() => {
    if (!isOpen || !isSoundEnabled) return;

    const fallbackTimeout = window.setTimeout(() => {
      setShowExternalFallback(true);
    }, 1400);

    return () => {
      window.clearTimeout(fallbackTimeout);
    };
  }, [isOpen, isSoundEnabled]);

  useEffect(() => {
    if (!showExternalFallback) return;

    const dismissTimeout = window.setTimeout(() => {
      setShowExternalFallback(false);
    }, 5000);

    return () => {
      window.clearTimeout(dismissTimeout);
    };
  }, [showExternalFallback]);

  if (!videoId) {
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              aria-label="Close popup"
            >
              <HiXMark className="w-5 h-5" />
            </button>

            {/* Header — collapses entirely when title is empty */}
            {title ? (
              <div className="px-6 pt-6 pb-4">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  {title}
                </h3>
              </div>
            ) : null}

            {/* Video Container */}
            <div className="relative w-full aspect-video bg-black">
              <iframe
                ref={iframeRef}
                src={buildYouTubeEmbedSrc(videoId, playerOrigin)}
                title={title || "Teaser popup video"}
                onLoad={() => setIsPlayerLoaded(true)}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                tabIndex={-1}
                className="pointer-events-none absolute inset-0 h-full w-full"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-4">
                <motion.button
                  type="button"
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  onClick={() => {
                    setIsSoundEnabled((previous) => {
                      const next = !previous;
                      const didSync = syncPlayerSound(next);
                      setShowExternalFallback(next ? !didSync : false);
                      return next;
                    });
                    setShowTapHint(false);
                  }}
                  aria-label={
                    isSoundEnabled ? "Mute video audio" : "Play video audio"
                  }
                  aria-pressed={isSoundEnabled}
                  className={`pointer-events-auto inline-flex items-center rounded-full bg-black/65 p-1.5 text-white shadow-lg ring-1 ring-white/15 backdrop-blur-md transition-all duration-200 hover:bg-black/75 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-black ${
                    !isSoundEnabled && showTapHint ? "gap-2 pr-3" : ""
                  }`}
                  whileTap={{ scale: 0.96 }}
                >
                  <span
                    className={`flex size-10 items-center justify-center rounded-full transition-colors duration-200 ${
                      isSoundEnabled
                        ? "bg-accent text-black"
                        : "bg-white/14 text-white"
                    }`}
                  >
                    {isSoundEnabled ? (
                      <FiVolume2 className="h-5 w-5" />
                    ) : (
                      <FiVolumeX className="h-5 w-5" />
                    )}
                  </span>

                  <AnimatePresence initial={false}>
                    {!isSoundEnabled && showTapHint ? (
                      <motion.span
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: -10,
                          transition: { duration: 0.18 },
                        }}
                        className="pr-1 text-sm font-medium tracking-[0.01em] text-white/92"
                      >
                        Tap to play audio
                      </motion.span>
                    ) : null}
                  </AnimatePresence>
                </motion.button>

                <AnimatePresence initial={false}>
                  {showExternalFallback ? (
                    <motion.div
                      initial={{ opacity: 0, x: 12, y: 8 }}
                      animate={{ opacity: 1, x: 0, y: 0 }}
                      exit={{ opacity: 0, x: 12, y: 8 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className="pointer-events-auto flex max-w-full items-center gap-2 rounded-full border border-white/15 bg-black/72 px-3 py-2 text-[11px] text-white shadow-lg backdrop-blur-md sm:text-xs"
                    >
                      <span className="whitespace-nowrap text-white/76">
                        Audio not responding?
                      </span>
                      <a
                        href={getYouTubeWatchUrl(videoId)}
                        target="_blank"
                        rel="noreferrer"
                        className="whitespace-nowrap font-medium text-accent transition-colors hover:text-accent/80"
                      >
                        Open on YouTube
                      </a>
                      <button
                        type="button"
                        onClick={() => setShowExternalFallback(false)}
                        aria-label="Dismiss audio fallback hint"
                        className="inline-flex size-5 items-center justify-center rounded-full border border-white/10 bg-white/8 text-white/70 transition-colors hover:bg-white/12 hover:text-white"
                      >
                        <HiXMark className="h-3.5 w-3.5" />
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
