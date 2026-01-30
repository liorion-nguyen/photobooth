"use client";

import { motion } from "framer-motion";
import type { FilterType } from "@/types/photo";

interface FilterListProps {
  selectedFilter: FilterType;
  onFilterSelect: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: "none", label: "Không filter" },
  { value: "grayscale", label: "Đen trắng" },
  { value: "sepia", label: "Sepia" },
  { value: "brightness", label: "Sáng" },
  { value: "contrast", label: "Tương phản" },
  { value: "vintage", label: "Vintage" },
  { value: "blur", label: "Mờ" },
];

export default function FilterList({
  selectedFilter,
  onFilterSelect,
}: FilterListProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 px-4 scrollbar-hide">
      {filters.map((filter) => (
        <motion.button
          key={filter.value}
          onClick={() => onFilterSelect(filter.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedFilter === filter.value
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {filter.label}
        </motion.button>
      ))}
    </div>
  );
}
