"use client";

import type { LayoutConfig } from "@/types/layout";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useCallback } from "react";

const EXAMPLE_PHOTOS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
];

function LayoutPreviewGrid({ layout, compact = false }: { layout: LayoutConfig; compact?: boolean }) {
  const cells = [];
  for (let row = 0; row < layout.rows; row++) {
    for (let col = 0; col < layout.cols; col++) {
      const index = row * layout.cols + col;
      cells.push(
        <div
          key={index}
          className={`relative overflow-hidden rounded-lg border-2 border-white shadow-md w-full ${
            compact ? "" : "floating-preview-item"
          }`}
          style={{
            gridColumn: col + 1,
            gridRow: row + 1,
            aspectRatio: "4 / 3",
            width: "100%",
          }}
        >
          <img
            src={EXAMPLE_PHOTOS[index % EXAMPLE_PHOTOS.length]}
            alt=""
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute top-1.5 right-1.5 bg-primary text-white text-[10px] font-bold min-w-[1.25rem] h-5 px-1 rounded-full flex items-center justify-center shadow-md">
            {index + 1}
          </div>
        </div>
      );
    }
  }

  return (
    <div
      className="grid w-full bg-gradient-to-br from-surface-container-low via-white to-surface-container p-2.5 rounded-xl shadow-inner"
      style={{
        gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
        gridAutoRows: "auto",
        gap: "0.35rem",
      }}
    >
      {cells}
    </div>
  );
}

interface LayoutCardProps {
  layout: LayoutConfig;
  isSelected: boolean;
  featured?: boolean;
  onClick: () => void;
}

export function LayoutPreviewGridExport({ layout, compact }: { layout: LayoutConfig; compact?: boolean }) {
  return <LayoutPreviewGrid layout={layout} compact={compact} />;
}

export default function LayoutCard({
  layout,
  isSelected,
  featured = false,
  onClick,
}: LayoutCardProps) {
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty("--mouse-x", `${x}%`);
    e.currentTarget.style.setProperty("--mouse-y", `${y}%`);
  }, []);

  const card = (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      className={`layout-card glass-card w-full rounded-3xl p-5 md:p-6 text-left relative overflow-hidden group ${
        isSelected ? "ring-2 ring-primary shadow-xl" : ""
      }`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="mouse-glow" />

      {featured && (
        <div className="absolute top-6 right-6 z-10 bg-primary text-white text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase shadow-lg">
          Phổ biến
        </div>
      )}

      <div className="rounded-2xl overflow-hidden mb-4 bg-surface-container p-2 sm:p-3">
        <LayoutPreviewGrid layout={layout} />
      </div>

      <h3 className="font-display text-xl md:text-2xl text-on-surface mb-1">{layout.name}</h3>
      <p className="text-on-surface-variant font-body text-label-caps uppercase tracking-widest text-[10px] md:text-xs">
        {layout.totalSlots} ảnh • {layout.description}
      </p>

      <div className="flex gap-2 mt-3 flex-wrap">
        <span className="bg-surface-container-high px-3 py-1 rounded-full text-[11px] font-medium text-on-surface-variant">
          {layout.name}
        </span>
        <span className="bg-surface-container-high px-3 py-1 rounded-full text-[11px] font-medium text-on-surface-variant">
          {layout.cols}×{layout.rows}
        </span>
      </div>

      {isSelected && (
        <div className="absolute top-6 left-6 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg z-10">
          <Check className="w-4 h-4 text-white" />
        </div>
      )}
    </motion.button>
  );

  if (featured) {
    return <div className="shimmer-border rounded-3xl">{card}</div>;
  }

  return card;
}
