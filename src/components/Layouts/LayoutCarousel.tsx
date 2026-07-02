"use client";

import { useState, useRef, useEffect } from "react";
import { motion, PanInfo } from "framer-motion";
import type { LayoutConfig, LayoutType } from "@/types/layout";
import LayoutCard from "./LayoutCard";

interface LayoutCarouselProps {
  selectedLayout: LayoutType | null;
  onSelect: (layout: LayoutType) => void;
  layouts: LayoutConfig[];
}

export default function LayoutCarousel({
  selectedLayout,
  onSelect,
  layouts,
}: LayoutCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

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

  useEffect(() => {
    if (selectedLayout) {
      const index = layouts.findIndex((l) => l.type === selectedLayout);
      if (index !== -1) setCurrentIndex(index);
    }
  }, [selectedLayout, layouts]);

  useEffect(() => {
    if (currentIndex >= layouts.length && layouts.length > 0) {
      setCurrentIndex(0);
    }
  }, [layouts.length, currentIndex]);

  if (layouts.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 text-center text-on-surface-variant">
        Không tìm thấy layout phù hợp.
      </div>
    );
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, layouts.length - 1)));
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -threshold && currentIndex < layouts.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex items-center justify-between mb-3 flex-shrink-0 px-1">
        <span className="text-sm font-medium text-on-surface-variant">
          {currentIndex + 1} / {layouts.length}
        </span>
      </div>

      <div className="relative flex-1 min-h-0">
        <div className="overflow-hidden w-full relative" ref={containerRef}>
          <motion.div
            className="flex"
            drag="x"
            dragElastic={0.1}
            dragConstraints={
              containerWidth > 0
                ? { left: -(layouts.length - 1) * containerWidth, right: 0 }
                : undefined
            }
            onDragEnd={handleDragEnd}
            animate={{ x: containerWidth > 0 ? -currentIndex * containerWidth : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            style={{ width: `${layouts.length * 100}%` }}
          >
            {layouts.map((layout) => (
              <div
                key={layout.type}
                className="flex-shrink-0 px-1"
                style={{ width: `${100 / layouts.length}%` }}
              >
                <LayoutCard
                  layout={layout}
                  isSelected={selectedLayout === layout.type}
                  featured={layout.type === "2x2"}
                  onClick={() => onSelect(layout.type)}
                />
              </div>
            ))}
          </motion.div>
        </div>

        {currentIndex > 0 && (
          <button
            type="button"
            onClick={() => goToIndex(currentIndex - 1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 glass-card rounded-full shadow-lg flex items-center justify-center text-on-surface"
            aria-label="Trước"
          >
            ‹
          </button>
        )}
        {currentIndex < layouts.length - 1 && (
          <button
            type="button"
            onClick={() => goToIndex(currentIndex + 1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 glass-card rounded-full shadow-lg flex items-center justify-center text-on-surface"
            aria-label="Sau"
          >
            ›
          </button>
        )}
      </div>

      <div className="flex justify-center gap-2 mt-4 flex-shrink-0">
        {layouts.map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => goToIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex ? "w-8 bg-primary" : "w-2 bg-outline-variant"
            }`}
            aria-label={`Layout ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
