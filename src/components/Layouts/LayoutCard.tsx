"use client";

import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import type { LayoutConfig } from "@/types/layout";

interface LayoutCardProps {
  layout: LayoutConfig;
  isSelected: boolean;
  onClick: () => void;
}

// Example photos - sử dụng placeholder images đẹp từ Unsplash
const getExamplePhoto = (index: number): string => {
  const photos = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=400&h=400&fit=crop",
  ];
  return photos[index % photos.length];
};

export default function LayoutCard({
  layout,
  isSelected,
  onClick,
}: LayoutCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current || !previewRef.current) return;

      const container = containerRef.current;
      const preview = previewRef.current;

      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      
      const aspectRatio = layout.cols / layout.rows;
      const previewNaturalHeight = containerWidth / aspectRatio;

      if (previewNaturalHeight > containerHeight) {
        const scaleFactor = containerHeight / previewNaturalHeight;
        setScale(scaleFactor);
      } else {
        setScale(1);
      }
    };

    updateScale();
    window.addEventListener("resize", updateScale);
    const observer = new ResizeObserver(updateScale);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener("resize", updateScale);
      observer.disconnect();
    };
  }, [layout]);

  // Tạo preview grid với example photos thật
  const renderPreview = () => {
    const cells = [];

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        const index = row * layout.cols + col;
        cells.push(
          <div
            key={index}
            className="relative overflow-hidden rounded-lg border-2 border-white shadow-lg"
            style={{
              gridColumn: col + 1,
              gridRow: row + 1,
            }}
          >
            <img
              src={getExamplePhoto(index)}
              alt={`Example photo ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs font-bold px-2 py-1 rounded-full">
              {index + 1}
            </div>
          </div>
        );
      }
    }

    return (
      <div
        ref={previewRef}
        className="grid bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-xl shadow-inner"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
          gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
          gap: "0.5rem",
          aspectRatio: `${layout.cols} / ${layout.rows}`,
          width: "100%",
          height: "auto",
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {cells}
      </div>
    );
  };

  return (
    <motion.button
      onClick={onClick}
      className={`w-full h-full rounded-2xl transition-all overflow-hidden flex flex-col ${
        isSelected
          ? "border-4 border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-200"
          : "border-2 border-gray-200 hover:border-gray-300 bg-white shadow-lg hover:shadow-xl"
      }`}
      whileHover={{ scale: isSelected ? 1.01 : 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isSelected ? 1.01 : 1,
      }}
    >
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center min-h-0 p-4"
        style={{ overflow: "hidden" }}
      >
        <div 
          className="w-full"
          style={{
            maxHeight: "100%",
            maxWidth: "100%",
          }}
        >
          {renderPreview()}
        </div>
      </div>
      <div className="px-6 pb-4 pt-2 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-lg text-gray-800 mb-1">
              {layout.name}
            </div>
            <div className="text-sm text-gray-600">{layout.description}</div>
          </div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </motion.div>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500 font-medium">
          {layout.totalSlots} ảnh • Click để chọn
        </div>
      </div>
    </motion.button>
  );
}
