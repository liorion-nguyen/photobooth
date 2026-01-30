"use client";

import { useState, useRef, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import LayoutCard from "./LayoutCard";

interface LayoutCarouselProps {
  selectedLayout: LayoutType | null;
  onSelect: (layout: LayoutType) => void;
}

export default function LayoutCarousel({
  selectedLayout,
  onSelect,
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
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <h3 className="text-xl font-bold text-gray-800">Chọn Layout</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">
            {currentIndex + 1} / {layouts.length}
          </span>
        </div>
      </div>

      {/* Main Carousel - Full Screen Layout */}
      <div className="relative flex-1 flex items-center min-h-0 overflow-hidden">
        {/* Navigation Buttons */}
        {currentIndex > 0 && (
          <motion.button
            onClick={goToPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
            aria-label="Previous"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6 text-gray-700"
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
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 z-20 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-gray-50 transition-colors border-2 border-gray-200"
            aria-label="Next"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg
              className="w-6 h-6 text-gray-700"
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

        {/* Carousel Container */}
        <div className="overflow-hidden w-full h-full flex items-center" ref={containerRef}>
          <motion.div
            className="flex cursor-grab active:cursor-grabbing h-full"
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
                className="flex-shrink-0 h-full flex items-center justify-center px-3"
                style={{ width: "100%" }}
              >
                <div className="w-full h-full max-w-full max-h-full flex items-center">
                  <LayoutCard
                    layout={layout}
                    isSelected={selectedLayout === layout.type}
                    onClick={() => onSelect(layout.type)}
                  />
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="flex justify-center gap-2 mt-4 flex-shrink-0">
        {layouts.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToIndex(index)}
            className={`h-3 rounded-full transition-all ${
              index === currentIndex
                ? "w-10 bg-blue-500"
                : "w-3 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to layout ${index + 1}`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>

      {/* Swipe Hint */}
      <div className="text-center text-sm text-gray-500 flex items-center justify-center gap-2 mt-2 flex-shrink-0">
        <svg
          className="w-5 h-5"
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
          className="w-5 h-5"
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
    </div>
  );
}
