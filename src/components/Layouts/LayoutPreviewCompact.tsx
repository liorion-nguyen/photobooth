"use client";

import { motion } from "framer-motion";
import type { LayoutState } from "@/types/layout";

interface LayoutPreviewCompactProps {
  layoutState: LayoutState;
  onSlotClick?: (slotIndex: number) => void;
}

export default function LayoutPreviewCompact({
  layoutState,
  onSlotClick,
}: LayoutPreviewCompactProps) {
  const { config, slots } = layoutState;
  const capturedCount = slots.filter((s) => s.captured).length;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm">
      {/* Header */}
      <div className="mb-3">
        <h4 className="font-semibold text-sm text-gray-800 mb-1">{config.name}</h4>
        <p className="text-xs text-gray-600">
          {capturedCount}/{config.totalSlots} ảnh
        </p>
      </div>

      {/* Compact Grid Preview */}
      <div
        className="grid gap-1 w-full"
        style={{
          gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
          gridAutoRows: "auto",
        }}
      >
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            onClick={() => onSlotClick?.(index)}
            className={`relative aspect-[4/3] rounded overflow-hidden border ${
              slot.captured
                ? "border-green-500 bg-green-50"
                : index === layoutState.currentSlotIndex
                ? "border-blue-500 border-dashed bg-blue-50"
                : "border-gray-300 border-dashed bg-gray-50"
            } ${
              onSlotClick ? "cursor-pointer hover:border-blue-400" : ""
            }`}
            whileHover={onSlotClick ? { scale: 1.05 } : {}}
            whileTap={onSlotClick ? { scale: 0.95 } : {}}
          >
            {slot.image ? (
              <img
                src={slot.image}
                alt={`Slot ${slot.id + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <div className={`text-xs font-bold ${
                    index === layoutState.currentSlotIndex ? "text-blue-600" : "text-gray-400"
                  }`}>
                    {slot.id + 1}
                  </div>
                </div>
              </div>
            )}
            {index === layoutState.currentSlotIndex && !slot.captured && (
              <div className="absolute inset-0 border border-blue-500 border-dashed animate-pulse" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
