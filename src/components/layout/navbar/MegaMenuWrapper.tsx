"use client";

import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef } from "react";

type MegaMenuWrapperProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

/**
 * Wrapper component for mega menus with backdrop and animations
 */
export function MegaMenuWrapper({
  isOpen,
  onClose,
  children,
}: MegaMenuWrapperProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(4px)" }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{ opacity: 0, y: -10, scale: 0.95, filter: "blur(4px)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute top-full left-0 right-0 mt-2 mx-auto container"
        >
          <div className="bg-charcoal rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
