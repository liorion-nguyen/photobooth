"use client";

import { motion } from "framer-motion";
import type { LayoutState } from "@/types/layout";

interface LayoutProgressProps {
  layoutState: LayoutState;
}

export default function LayoutProgress({ layoutState }: LayoutProgressProps) {
  const capturedCount = layoutState.slots.filter((s) => s.captured).length;
  const total = layoutState.config.totalSlots;
  const progress = Math.round((capturedCount / total) * 100);

  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm text-gray-600">
        <span>
          Ảnh {capturedCount}/{total}
        </span>
        <span>{progress}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <motion.div
          className="bg-blue-600 h-2.5 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <div className="text-xs text-gray-500 text-center">
        {layoutState.isComplete
          ? "✅ Hoàn thành! Bạn có thể chụp lại bất kỳ ảnh nào."
          : `Chụp ảnh ${layoutState.currentSlotIndex + 1}/${total}`}
      </div>
    </div>
  );
}
