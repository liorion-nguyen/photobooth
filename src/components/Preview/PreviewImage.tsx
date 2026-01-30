"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { applyFilterToImage } from "@/components/Filters/applyFilter";
import type { FilterType } from "@/types/photo";

interface PreviewImageProps {
  imageUrl: string;
  filter: FilterType;
  onRetake: () => void;
  onConfirm: () => void;
  isUploading?: boolean;
}

export default function PreviewImage({
  imageUrl,
  filter,
  onRetake,
  onConfirm,
  isUploading = false,
}: PreviewImageProps) {
  const [filteredUrl, setFilteredUrl] = useState<string>(imageUrl);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (filter === "none") {
      setFilteredUrl(imageUrl);
      return;
    }

    setIsProcessing(true);
    applyFilterToImage(imageUrl, filter)
      .then((url) => {
        setFilteredUrl(url);
        setIsProcessing(false);
      })
      .catch((err) => {
        console.error("Error applying filter:", err);
        setFilteredUrl(imageUrl);
        setIsProcessing(false);
      });
  }, [imageUrl, filter]);

  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="relative flex-1 bg-black rounded-lg overflow-hidden">
        {isProcessing ? (
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
              <p>Đang áp dụng filter...</p>
            </div>
          </div>
        ) : (
          <motion.img
            src={filteredUrl}
            alt="Preview"
            className="w-full h-full object-contain"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </div>

      <div className="flex gap-4 p-4">
        <motion.button
          onClick={onRetake}
          disabled={isUploading}
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Chụp lại
        </motion.button>
        <motion.button
          onClick={onConfirm}
          disabled={isUploading || isProcessing}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isUploading ? "Đang upload..." : "Xác nhận"}
        </motion.button>
      </div>
    </div>
  );
}
