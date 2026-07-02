"use client";

import type { LayoutState, LayoutType } from "@/types/layout";
import { motion } from "framer-motion";

interface LayoutCameraStripProps {
  layoutState: LayoutState;
  onSlotClick?: (slotIndex: number) => void;
}

/** Kích thước sidebar & tỉ lệ ô theo từng layout để ảnh nhìn rõ */
const STRIP_CONFIG: Record<
  LayoutType,
  {
    sidebarClass: string;
    slotAspect: string;
    gapClass: string;
  }
> = {
  "1x4": {
    sidebarClass: "w-[112px] sm:w-[128px]",
    slotAspect: "3 / 4",
    gapClass: "gap-1.5",
  },
  "2x2": {
    sidebarClass: "w-[156px] sm:w-[176px] md:w-[192px]",
    slotAspect: "1 / 1",
    gapClass: "gap-2",
  },
  "2x3": {
    sidebarClass: "w-[156px] sm:w-[176px] md:w-[192px]",
    slotAspect: "4 / 3",
    gapClass: "gap-2",
  },
};

export function getLayoutStripSidebarClass(type: LayoutType): string {
  return STRIP_CONFIG[type].sidebarClass;
}

export default function LayoutCameraStrip({
  layoutState,
  onSlotClick,
}: LayoutCameraStripProps) {
  const { config, slots } = layoutState;
  const capturedCount = slots.filter((s) => s.captured).length;
  const strip = STRIP_CONFIG[config.type];

  return (
    <div className="flex flex-col w-full min-w-0">
      <div className="mb-2 px-0.5 shrink-0">
        <div className="font-semibold text-xs text-white">{config.name}</div>
        <div className="text-[10px] text-white/50">
          {capturedCount}/{config.totalSlots} ảnh
        </div>
      </div>

      <div
        className={`grid w-full min-w-0 ${strip.gapClass}`}
        style={{
          gridTemplateColumns: `repeat(${config.cols}, minmax(0, 1fr))`,
          gridAutoRows: "minmax(0, auto)",
        }}
      >
        {slots.map((slot, index) => {
          const isActive = index === layoutState.currentSlotIndex;
          const isCaptured = slot.captured;

          return (
            <motion.button
              key={slot.id}
              type="button"
              onClick={() => onSlotClick?.(index)}
              className={`relative isolate min-w-0 w-full rounded-md overflow-hidden box-border transition-colors ${
                isCaptured
                  ? "border border-primary/70"
                  : isActive
                  ? "border border-primary border-dashed ring-1 ring-primary/40"
                  : "border border-white/15 border-dashed"
              } ${onSlotClick ? "cursor-pointer hover:border-primary/60" : ""}`}
              style={{ aspectRatio: strip.slotAspect }}
              whileTap={onSlotClick ? { scale: 0.98 } : {}}
            >
              {slot.image ? (
                <img
                  src={slot.image}
                  alt={`Ảnh ${slot.id + 1}`}
                  className="block w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                  <span
                    className={`text-sm font-display font-semibold ${
                      isActive ? "text-primary" : "text-white/25"
                    }`}
                  >
                    {slot.id + 1}
                  </span>
                </div>
              )}

              {isActive && !isCaptured && (
                <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none rounded-md" />
              )}

              {isCaptured && (
                <div className="absolute bottom-1 left-1 z-10 min-w-[1.125rem] h-[1.125rem] px-0.5 rounded-full bg-primary/90 text-[9px] font-bold text-white flex items-center justify-center shadow-sm leading-none">
                  {slot.id + 1}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
