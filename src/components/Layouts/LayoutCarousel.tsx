"use client";

import { useState, useRef, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import LayoutCard from "./LayoutCard";

interface LayoutCarouselProps {
  selectedLayout: LayoutType | null;
  onSelect: (layout: LayoutType) => void;
  hideHeader?: boolean;
}

export default function LayoutCarousel({
  selectedLayout,
  onSelect,
  hideHeader = false,
}: LayoutCarouselProps) {
  const layouts = Object.values(LAYOUT_CONFIGS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  // Update container width on resize
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Update current index when selected layout changes
  useEffect(() => {
    if (selectedLayout) {
      const index = layouts.findIndex((l) => l.type === selectedLayout);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedLayout, layouts]);

  const goToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, layouts.length - 1)));
  };

  const goToNext = () => {
    if (currentIndex < layouts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleDragEnd = (_: any, info: PanInfo) => {
    const threshold = 50;
    const offset = info.offset.x;

    if (offset > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (offset < -threshold && currentIndex < layouts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      {!hideHeader && (
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <h3 className="text-xl font-bold text-gray-800">Chọn Layout</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">
              {currentIndex + 1} / {layouts.length}
            </span>
          </div>
        </div>
      )}

      {/* Main Carousel - Full Screen Layout */}
      <div className="relative flex-1 min-h-0 flex items-start">
        {/* Carousel Container */}
        <div className="overflow-hidden w-full relative" ref={containerRef} style={{ minHeight: 0, maxHeight: "100%" }}>
          <motion.div
            className="flex"
            drag="x"
            dragElastic={0.1}
            dragConstraints={
              containerWidth > 0
                ? {
                    left: -(layouts.length - 1) * containerWidth,
                    right: 0,
                  }
                : undefined
            }
            onDragEnd={handleDragEnd}
            animate={{
              x: containerWidth > 0 ? -currentIndex * containerWidth : 0,
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 40,
            }}
            style={{
              width: `${layouts.length * 100}%`,
            }}
          >
            {layouts.map((layout, index) => (
              <div
                key={layout.type}
                className="flex-shrink-0 flex items-start justify-center px-2 sm:px-3"
                style={{ 
                  width: `${100 / layouts.length}%`,
                  minWidth: `${100 / layouts.length}%`,
                  maxWidth: `${100 / layouts.length}%`,
                }}
              >
                <div className="w-full flex items-start justify-center max-w-full py-2">
                  <div className="w-full" style={{ maxHeight: "calc(100vh - 300px)", overflowY: "auto" }}>
                    <LayoutCard
                      layout={layout}
                      isSelected={selectedLayout === layout.type}
                      onClick={() => onSelect(layout.type)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons - Mobile optimized */}
        {currentIndex > 0 && (
          <motion.button
            onClick={goToPrev}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors border-2 border-gray-200"
            aria-label="Previous"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>
        )}

        {currentIndex < layouts.length - 1 && (
          <motion.button
            onClick={goToNext}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors border-2 border-gray-200"
            aria-label="Next"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </motion.button>
        )}
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-1.5 sm:gap-2 mt-3 sm:mt-4 flex-shrink-0 px-4">
        {layouts.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToIndex(index)}
            className={`h-2.5 sm:h-3 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 sm:w-10 bg-blue-500"
                : "w-2.5 sm:w-3 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to layout ${index + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      {!hideHeader && (
        <div className="text-center text-xs sm:text-sm text-gray-500 flex items-center justify-center gap-1.5 sm:gap-2 mt-2 flex-shrink-0">
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16l-4-4m0 0l4-4m-4 4h18"
            />
          </svg>
          <span className="font-medium">Lướt để xem thêm</span>
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 8l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
