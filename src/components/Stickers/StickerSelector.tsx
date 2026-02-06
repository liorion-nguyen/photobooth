"use client";

import { motion } from "framer-motion";
import type { StickerType } from "@/types/sticker";
import { STICKER_OPTIONS } from "@/types/sticker";

interface StickerSelectorProps {
  selectedSticker: StickerType;
  onStickerSelect: (sticker: StickerType) => void;
}

export default function StickerSelector({
  selectedSticker,
  onStickerSelect,
}: StickerSelectorProps) {
  const topStickers = STICKER_OPTIONS.filter(s => s.position === "top" || s.type === "none");
  const centerStickers = STICKER_OPTIONS.filter(s => s.position === "center");
  const bottomStickers = STICKER_OPTIONS.filter(s => s.position === "bottom");

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-bold text-gray-800">Sticker</span>
      </div>
      
      <div className="space-y-4">
        {/* Top Stickers (Ears, Crowns) */}
        <div>
          <div className="text-xs font-semibold text-purple-600 mb-2 flex items-center gap-1">
            <span>👑</span>
            <span>Trên đầu</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {topStickers.map((sticker) => (
              <motion.button
                key={sticker.type}
                onClick={() => onStickerSelect(sticker.type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedSticker === sticker.type
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{sticker.icon}</span>
                <span>{sticker.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Center Stickers (Face) */}
        <div>
          <div className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
            <span>😊</span>
            <span>Khuôn mặt</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {centerStickers.map((sticker) => (
              <motion.button
                key={sticker.type}
                onClick={() => onStickerSelect(sticker.type)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedSticker === sticker.type
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-base">{sticker.icon}</span>
                <span>{sticker.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Bottom Stickers */}
        {bottomStickers.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-orange-600 mb-2 flex items-center gap-1">
              <span>👔</span>
              <span>Dưới cằm</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {bottomStickers.map((sticker) => (
                <motion.button
                  key={sticker.type}
                  onClick={() => onStickerSelect(sticker.type)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    selectedSticker === sticker.type
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-base">{sticker.icon}</span>
                  <span>{sticker.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
