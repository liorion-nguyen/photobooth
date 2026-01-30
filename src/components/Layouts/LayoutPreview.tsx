"use client";

import { motion } from "framer-motion";
import type { LayoutState } from "@/types/layout";

interface LayoutPreviewProps {
  layoutState: LayoutState;
  onSlotClick?: (slotIndex: number) => void;
  showNumbers?: boolean;
}

export default function LayoutPreview({
  layoutState,
  onSlotClick,
  showNumbers = true,
}: LayoutPreviewProps) {
  const { config, slots } = layoutState;

  return (
    <div
      className="grid gap-2"
      style={{
        gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
        gridTemplateRows: `repeat(${config.rows}, 1fr)`,
        aspectRatio: `${config.cols} / ${config.rows}`,
      }}
    >
      {slots.map((slot, index) => (
        <motion.div
          key={slot.id}
          onClick={() => onSlotClick?.(index)}
          className={`relative aspect-square rounded-lg overflow-hidden border-2 ${
            slot.captured
              ? "border-green-500"
              : index === layoutState.currentSlotIndex
              ? "border-blue-500 border-dashed"
              : "border-gray-300 border-dashed"
          } ${
            onSlotClick ? "cursor-pointer hover:border-blue-400" : ""
          } bg-gray-100`}
          whileHover={onSlotClick ? { scale: 1.02 } : {}}
          whileTap={onSlotClick ? { scale: 0.98 } : {}}
        >
          {slot.image ? (
            <img
              src={slot.image}
              alt={`Slot ${slot.id + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <div className="text-center">
                {showNumbers && (
                  <div className="text-2xl font-bold">{slot.id + 1}</div>
                )}
                <div className="text-xs mt-1">
                  {index === layoutState.currentSlotIndex ? "Tiếp theo" : "Trống"}
                </div>
              </div>
            </div>
          )}
          {index === layoutState.currentSlotIndex && !slot.captured && (
            <div className="absolute inset-0 border-2 border-blue-500 border-dashed animate-pulse" />
          )}
        </motion.div>
      ))}
    </div>
  );
}
