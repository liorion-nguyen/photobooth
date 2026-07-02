"use client";

import type { LayoutConfig, LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { LayoutGrid, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { LayoutPreviewGridExport } from "./LayoutCard";

interface LayoutPreviewModalProps {
  layoutType: LayoutType | null;
  onClose: () => void;
  onConfirm: (layoutType: LayoutType) => void;
}

export default function LayoutPreviewModal({
  layoutType,
  onClose,
  onConfirm,
}: LayoutPreviewModalProps) {
  const layout: LayoutConfig | null = layoutType ? LAYOUT_CONFIGS[layoutType] : null;

  return (
    <AnimatePresence>
      {layout && layoutType && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
        >
          <div
            className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative glass-card w-full max-w-5xl rounded-[32px] overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]"
          >
            <div className="md:w-3/5 bg-surface-container relative overflow-y-auto p-6 md:p-12 flex items-center justify-center min-h-[280px]">
              <div className="relative w-full max-w-xs sm:max-w-sm bg-white rounded-xl shadow-2xl p-4">
                <LayoutPreviewGridExport layout={layout} compact />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-tertiary/5 pointer-events-none" />
            </div>

            <div className="md:w-2/5 p-6 md:p-10 flex flex-col justify-between bg-surface-container-lowest overflow-y-auto">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface mb-1">
                      {layout.name}
                    </h2>
                    <p className="text-primary font-body text-label-caps uppercase tracking-widest">
                      Layout Photobooth
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-on-surface-variant hover:text-primary transition-colors p-1"
                    aria-label="Đóng"
                  >
                    <X className="w-7 h-7" />
                  </button>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-5 h-5 text-primary shrink-0" />
                    <p className="font-body text-sm text-on-surface-variant">
                      {layout.totalSlots} ô ảnh — {layout.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-primary shrink-0" />
                    <p className="font-body text-sm text-on-surface-variant">
                      Hỗ trợ filter và khung ảnh khi chụp
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="button"
                  onClick={() => onConfirm(layoutType)}
                  className="w-full primary-glow-button text-white py-4 rounded-full font-bold"
                >
                  Chọn layout này
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full border border-outline-variant py-4 rounded-full font-semibold text-on-surface-variant hover:bg-surface-container transition-colors"
                >
                  Xem layout khác
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
