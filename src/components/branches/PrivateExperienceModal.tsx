"use client";

import { motion, AnimatePresence } from "motion/react";
import { FiX } from "react-icons/fi";
import PrivateExperienceForm from "~/components/branches/PrivateExperienceForm";
import { useModal } from "~/hooks/useModal";

interface PrivateExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchName: string;
  branchSlug: string;
}

export default function PrivateExperienceModal({
  isOpen,
  onClose,
  branchName,
  branchSlug,
}: PrivateExperienceModalProps) {
  useModal({ isOpen, onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal panel */}
          <motion.div
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-5">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  Request a Private Experience
                </h2>
                <p className="mt-0.5 text-sm text-gray-500">
                  Fill in your details and we&apos;ll arrange an exclusive visit
                  for you.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
                aria-label="Close modal"
              >
                <FiX className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Scrollable form area */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <PrivateExperienceForm
                branchName={branchName}
                branchSlug={branchSlug}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
