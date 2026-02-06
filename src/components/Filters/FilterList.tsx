"use client";

import { motion } from "framer-motion";
import type { FilterType } from "@/types/photo";
import { Camera, Snowflake } from "lucide-react";

interface FilterListProps {
  selectedFilter: FilterType;
  onFilterSelect: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string; icon: string | React.ComponentType<{ className?: string }>; category: "beauty" | "color" | "basic" }[] = [
  { value: "none", label: "Gốc", icon: Camera, category: "basic" },
  { value: "beauty", label: "Làm đẹp", icon: "✨", category: "beauty" },
  { value: "skin-whiten", label: "Trắng da", icon: "🤍", category: "beauty" },
  { value: "skin-smooth", label: "Mịn da", icon: "💆", category: "beauty" },
  { value: "portrait", label: "Chân dung", icon: "👤", category: "beauty" },
  { value: "vibrant", label: "Rực rỡ", icon: "🌈", category: "color" },
  { value: "warm", label: "Ấm áp", icon: "🔥", category: "color" },
  { value: "cool", label: "Mát mẻ", icon: Snowflake, category: "color" },
  { value: "cinematic", label: "Điện ảnh", icon: "🎬", category: "color" },
  { value: "grayscale", label: "Đen trắng", icon: "⚫", category: "basic" },
  { value: "sepia", label: "Sepia", icon: "🟤", category: "basic" },
  { value: "vintage", label: "Vintage", icon: "📜", category: "basic" },
];

export default function FilterList({
  selectedFilter,
  onFilterSelect,
}: FilterListProps) {
  const beautyFilters = filters.filter(f => f.category === "beauty");
  const colorFilters = filters.filter(f => f.category === "color");
  const basicFilters = filters.filter(f => f.category === "basic");

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span className="text-sm font-bold text-gray-800">Bộ lọc</span>
      </div>
      
      <div className="space-y-4">
        {/* Beauty Filters */}
        <div>
          <div className="text-xs font-semibold text-pink-600 mb-2 flex items-center gap-1">
            <span>✨</span>
            <span>Làm đẹp</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {beautyFilters.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => onFilterSelect(filter.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedFilter === filter.value
                    ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {typeof filter.icon === "string" ? (
                  <span>{filter.icon}</span>
                ) : (
                  <filter.icon className="w-4 h-4" />
                )}
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Color Filters */}
        <div>
          <div className="text-xs font-semibold text-blue-600 mb-2 flex items-center gap-1">
            <span>🎨</span>
            <span>Màu sắc</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {colorFilters.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => onFilterSelect(filter.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedFilter === filter.value
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {typeof filter.icon === "string" ? (
                  <span>{filter.icon}</span>
                ) : (
                  <filter.icon className="w-4 h-4" />
                )}
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Basic Filters */}
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1">
            <span>📸</span>
            <span>Cơ bản</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {basicFilters.map((filter) => (
              <motion.button
                key={filter.value}
                onClick={() => onFilterSelect(filter.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedFilter === filter.value
                    ? "bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {typeof filter.icon === "string" ? (
                  <span>{filter.icon}</span>
                ) : (
                  <filter.icon className="w-4 h-4" />
                )}
                <span>{filter.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
