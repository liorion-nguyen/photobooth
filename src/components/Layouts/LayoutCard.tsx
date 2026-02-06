"use client";

import { motion } from "framer-motion";
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
  // Tạo preview grid với example photos
  const renderPreview = () => {
    const cells = [];

    for (let row = 0; row < layout.rows; row++) {
      for (let col = 0; col < layout.cols; col++) {
        const index = row * layout.cols + col;
        cells.push(
          <motion.div
            key={index}
            className="relative overflow-hidden rounded-lg border-2 border-white shadow-lg w-full"
            style={{
              gridColumn: col + 1,
              gridRow: row + 1,
              aspectRatio: "4 / 3",
              width: "100%",
            }}
            whileHover={{ scale: 1.05, zIndex: 10 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src={getExamplePhoto(index)}
              alt={`Example photo ${index + 1}`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-1.5 right-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg backdrop-blur-sm">
              {index + 1}
            </div>
          </motion.div>
        );
      }
    }

    return (
      <div
        className="grid bg-gradient-to-br from-gray-50 via-white to-gray-100 p-2.5 rounded-xl shadow-inner w-full"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
          gridAutoRows: "auto",
          gap: "0.35rem",
          width: "100%",
        }}
      >
        {cells}
      </div>
    );
  };

  return (
    <motion.button
      onClick={onClick}
      className={`w-full rounded-2xl transition-all overflow-hidden flex flex-col group ${
        isSelected
          ? "border-2 border-blue-500 bg-gradient-to-br from-blue-50 via-white to-purple-50 shadow-2xl shadow-blue-500/20 ring-4 ring-blue-200/50"
          : "border-2 border-gray-200 hover:border-blue-300 bg-white shadow-lg hover:shadow-xl hover:shadow-blue-500/10"
      }`}
      whileHover={{ scale: isSelected ? 1.02 : 1.05, y: isSelected ? 0 : -4 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        scale: isSelected ? 1.02 : 1,
      }}
    >
      {/* Preview Area - Takes most of the space */}
      <div className="flex items-center justify-center p-2 sm:p-3 md:p-4">
        <div className="w-full">
          {renderPreview()}
        </div>
      </div>

      {/* Info Section - Modern Design */}
      <div className="px-2 sm:px-3 md:px-4 pb-2 sm:pb-3 md:pb-4 pt-2 sm:pt-3 flex-shrink-0 bg-gradient-to-t from-gray-50/50 to-transparent border-t border-gray-100/50">
        <div className="flex items-center justify-between mb-1.5 sm:mb-2">
          <div className="flex-1 min-w-0">
            <div className={`font-bold text-sm sm:text-base truncate mb-0.5 ${
              isSelected 
                ? "bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" 
                : "text-gray-800 group-hover:text-blue-600"
            }`}>
              {layout.name}
            </div>
            <div className="text-xs text-gray-500 truncate">
              {layout.description}
            </div>
          </div>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="ml-2 flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white"
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
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 bg-gray-100 rounded-lg">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-semibold text-gray-700">{layout.totalSlots} ảnh</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:inline">•</span>
          <span className="text-xs text-gray-500 hidden sm:inline">Click để chọn</span>
        </div>
      </div>
    </motion.button>
  );
}
