"use client";

import { motion } from "framer-motion";

export type FrameType = "none" | "classic" | "modern" | "vintage" | "elegant" | "playful";

export interface FrameOption {
  id: FrameType;
  name: string;
  preview: string;
}

const frameOptions: FrameOption[] = [
  { id: "none", name: "Không khung", preview: "none" },
  { id: "classic", name: "Cổ điển", preview: "classic" },
  { id: "modern", name: "Hiện đại", preview: "modern" },
  { id: "vintage", name: "Vintage", preview: "vintage" },
  { id: "elegant", name: "Thanh lịch", preview: "elegant" },
  { id: "playful", name: "Vui nhộn", preview: "playful" },
];

interface FrameSelectorProps {
  selectedFrame: FrameType;
  onSelect: (frame: FrameType) => void;
}

export default function FrameSelector({
  selectedFrame,
  onSelect,
}: FrameSelectorProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Chọn khung ảnh
      </h3>
      <div className="grid grid-cols-3 lg:grid-cols-2 gap-3">
        {frameOptions.map((frame) => (
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
              ) : (
                <div
                  className={`w-3/4 h-3/4 border-4 ${
                    frame.id === "classic"
                      ? "border-amber-600 bg-amber-50"
                      : frame.id === "modern"
                      ? "border-gray-800 bg-white"
                      : frame.id === "vintage"
                      ? "border-amber-800 bg-amber-100"
                      : frame.id === "elegant"
                      ? "border-gray-600 bg-gray-50"
                      : "border-pink-400 bg-pink-50"
                  } rounded ${
                    frame.id === "playful" ? "border-dashed" : ""
                  }`}
                >
                  <div className="w-full h-full bg-white opacity-50" />
                </div>
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
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs py-1 px-2 text-center">
              {frame.name}
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
