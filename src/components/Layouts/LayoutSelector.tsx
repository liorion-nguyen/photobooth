"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import LayoutCard from "./LayoutCard";
import LayoutCarousel from "./LayoutCarousel";
import Button from "../UI/Button";

type CaptureMode = "manual" | "auto";

interface CaptureSettings {
  mode: CaptureMode;
  countdown: number;
}

interface LayoutSelectorProps {
  selectedLayout: LayoutType | null;
  onSelect: (layout: LayoutType, settings?: CaptureSettings) => void;
}

export default function LayoutSelector({
  selectedLayout,
  onSelect,
}: LayoutSelectorProps) {
  const layouts = Object.values(LAYOUT_CONFIGS);
  const [showSettings, setShowSettings] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>("manual");
  const [countdown, setCountdown] = useState(3);

  const handleSelectLayout = (layout: LayoutType) => {
    if (showSettings) {
      onSelect(layout, {
        mode: captureMode,
        countdown: countdown,
      });
    } else {
      onSelect(layout);
    }
  };

  const handleCarouselSelect = (layout: LayoutType) => {
    handleSelectLayout(layout);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header - Modern Design */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 flex-shrink-0 gap-3 sm:gap-0">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-1">
            Chọn Layout Ảnh
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">Chọn layout phù hợp cho bộ ảnh của bạn</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-xl transition-all ${
              showSettings
                ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                : "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600"
            }`}
          >
            <span className="flex items-center gap-1.5 sm:gap-2">
              {showSettings ? (
                <>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="hidden sm:inline">Đã bật</span>
                  <span className="sm:hidden">Bật</span>
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  Cài đặt
                </>
              )}
            </span>
          </motion.button>
          <div className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
            <span className="text-xs sm:text-sm font-semibold text-gray-700">
              {layouts.length} <span className="text-gray-500 font-normal hidden sm:inline">layouts</span>
            </span>
          </div>
        </div>
      </div>

      {/* Settings Panel - Modern Glassmorphism Design */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mb-4 sm:mb-6 bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100/50 shadow-xl shadow-blue-500/5 flex-shrink-0"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
            <h4 className="text-lg font-bold text-gray-800">Cài đặt chụp ảnh</h4>
          </div>
          <div className="space-y-5">
            {/* Capture Mode */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Chế độ chụp
              </label>
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => setCaptureMode("manual")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-4 py-3.5 rounded-xl border-2 transition-all ${
                    captureMode === "manual"
                      ? "border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 font-semibold shadow-lg shadow-blue-500/20"
                      : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Nhấn chụp</span>
                  </div>
                  {captureMode === "manual" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
                <motion.button
                  onClick={() => setCaptureMode("auto")}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`relative px-4 py-3.5 rounded-xl border-2 transition-all ${
                    captureMode === "auto"
                      ? "border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 text-purple-700 font-semibold shadow-lg shadow-purple-500/20"
                      : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50"
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Tự động</span>
                  </div>
                  {captureMode === "auto" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                    >
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Countdown Settings */}
            {captureMode === "auto" && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/60 rounded-xl p-4 border border-purple-100"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Thời gian đếm ngược
                </label>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={countdown}
                      onChange={(e) => setCountdown(Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    />
                  </div>
                  <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg">
                    <span className="text-xl font-bold text-white">
                      {countdown}s
                    </span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Camera sẽ tự động chụp sau {countdown} giây
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Mobile: Carousel (1 card at a time) | Desktop: Grid Layout */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {/* Mobile Carousel - Only show 1 card */}
        <div className="block md:hidden h-full overflow-y-auto">
          <LayoutCarousel
            selectedLayout={selectedLayout}
            onSelect={handleCarouselSelect}
            hideHeader={true}
          />
        </div>

        {/* Desktop Grid Layout */}
        <div className="hidden md:block h-full overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 auto-rows-min pb-4">
            {layouts.map((layout, index) => (
              <motion.div
                key={layout.type}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ 
                  delay: index * 0.03,
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="min-h-0"
              >
                <LayoutCard
                  layout={layout}
                  isSelected={selectedLayout === layout.type}
                  onClick={() => handleSelectLayout(layout.type)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
