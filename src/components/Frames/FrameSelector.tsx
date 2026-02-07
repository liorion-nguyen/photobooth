"use client";

import { getCustomFrameImages } from "@/services/customFrameImage.service";
import { getFramers, type FramerApiItem } from "@/services/framer.service";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useMemo, useState, useEffect } from "react";

export type FrameType = "none" | string;

export interface FrameOption {
  id: FrameType;
  name: string;
  preview: string;
  isCustom?: boolean;
  imageData?: string;
  layoutType?: LayoutType;
}

/** Chỉ "Không khung" + framer từ upload/API, không dùng khung cổ điển mặc định. */
const defaultFrameOptions: FrameOption[] = [
  { id: "none", name: "Không khung", preview: "none" },
];

const LAYOUT_OPTIONS: { value: LayoutType | ""; label: string }[] = [
  { value: "", label: "Tất cả danh mục" },
  { value: "1x4", label: "1×4" },
  { value: "2x3", label: "2×3" },
  { value: "2x2", label: "2×2" },
];

interface FrameSelectorProps {
  selectedFrame: FrameType;
  onSelect: (frame: FrameType) => void;
  /** Chỉ hiển thị framer đúng layout (1x4, 2x3, 2x2). Khi có currentLayout, dropdown danh mục mặc định là layout này. */
  currentLayout?: LayoutType;
}

function mapApiFramerToOption(f: FramerApiItem): FrameOption {
  return {
    id: f.id as FrameType,
    name: f.name,
    preview: f.imageUrl ?? "",
    isCustom: true,
    imageData: f.imageUrl,
    layoutType: f.layoutType as LayoutType,
  };
}

export default function FrameSelector({
  selectedFrame,
  onSelect,
  currentLayout,
}: FrameSelectorProps) {
  const [apiFramers, setApiFramers] = useState<FramerApiItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<LayoutType | "">(
    currentLayout ?? ""
  );

  useEffect(() => {
    getFramers()
      .then(setApiFramers)
      .catch(() => setApiFramers([]));
  }, []);

  useEffect(() => {
    if (currentLayout) setCategoryFilter(currentLayout);
  }, [currentLayout]);

  const customFrames = useMemo(() => {
    const local = getCustomFrameImages();
    const localFiltered = currentLayout
      ? local.filter((f) => !f.layoutType || f.layoutType === currentLayout)
      : local;
    const apiFiltered = currentLayout
      ? apiFramers.filter((f) => !f.layoutType || f.layoutType === currentLayout)
      : apiFramers;
    return [
      ...localFiltered.map((f) => ({
        id: f.id as FrameType,
        name: f.name,
        preview: f.imageData ?? "",
        isCustom: true as const,
        imageData: f.imageData,
        layoutType: f.layoutType as LayoutType | undefined,
      })),
      ...apiFiltered.map(mapApiFramerToOption),
    ];
  }, [currentLayout, apiFramers]);

  const frameOptions = useMemo(
    () => [...defaultFrameOptions, ...customFrames],
    [customFrames]
  );

  const filteredOptions = useMemo(() => {
    let list = frameOptions;
    if (categoryFilter) {
      list = list.filter(
        (f) => !f.layoutType || f.layoutType === categoryFilter
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    return list;
  }, [frameOptions, categoryFilter, searchQuery]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Chọn khung ảnh
      </h3>

      {/* Tìm kiếm tên khung */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm tên khung..."
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Chọn danh mục (layout) */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-500 mb-1.5">
          Chọn danh mục
        </label>
        <select
          value={categoryFilter}
          onChange={(e) =>
            setCategoryFilter((e.target.value || "") as LayoutType | "")
          }
          disabled={!!currentLayout}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
        >
          {LAYOUT_OPTIONS.map((opt) => (
            <option key={opt.value || "all"} value={opt.value}>
              {opt.value ? LAYOUT_CONFIGS[opt.value as LayoutType]?.name ?? opt.label : opt.label}
            </option>
          ))}
        </select>
        {currentLayout && (
          <p className="text-xs text-gray-400 mt-1">
            Đang dùng layout {LAYOUT_CONFIGS[currentLayout]?.name ?? currentLayout}
          </p>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3 max-h-[50vh] overflow-y-auto pr-1">
        {filteredOptions.length === 0 ? (
          <p className="col-span-full text-sm text-gray-500 text-center py-4">
            Không có khung nào trùng với bộ lọc.
          </p>
        ) : (
          filteredOptions.map((frame) => (
          <motion.button
            key={frame.id}
            onClick={() => onSelect(frame.id)}
            className={`relative aspect-square rounded-lg border-2 overflow-hidden ${
              selectedFrame === frame.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 hover:border-blue-300"
            } transition-all`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Frame Preview */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              {frame.id === "none" ? (
                <div className="text-xs text-gray-500 font-medium">
                  Không khung
                </div>
              ) : frame.imageData ? (
                <img
                  src={frame.imageData}
                  alt={frame.name}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="text-xs text-gray-400">Khung</div>
              )}
            </div>
            
            {/* Selected indicator */}
            {selectedFrame === frame.id && (
              <div className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
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
              </div>
            )}
            
            {/* Frame name */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs py-1.5 px-2 text-center truncate">
              {frame.name}
            </div>
          </motion.button>
        )))
      }
      </div>
    </div>
  );
}
