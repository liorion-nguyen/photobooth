"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { LayoutState } from "@/types/layout";
import type { FrameType } from "@/components/Frames/FrameSelector";
import { exportLayoutAsImage } from "@/utils/layoutCanvas";

interface FramedLayoutPreviewProps {
  layoutState: LayoutState;
  frameType: FrameType;
  onSlotClick?: (slotIndex: number) => void;
}

export default function FramedLayoutPreview({
  layoutState,
  frameType,
  onSlotClick,
}: FramedLayoutPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setPreviewError(null);

    const generatePreview = async () => {
      if (!layoutState.isComplete) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const blob = await exportLayoutAsImage(layoutState, frameType);
        const url = URL.createObjectURL(blob);
        
        if (isMounted) {
          setPreviewUrl(url);
          setPreviewError(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error generating framed preview:", error);
        if (isMounted) {
          setPreviewUrl(null);
          setPreviewError(
            error instanceof Error ? error.message : "Không thể áp dụng khung. Thử khung khác hoặc ảnh từ nguồn hỗ trợ CORS."
          );
          setIsLoading(false);
        }
      }
    };

    generatePreview();

    return () => {
      isMounted = false;
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [layoutState, frameType]);

  if (!layoutState.isComplete) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">Chưa hoàn thành layout</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tạo preview với khung...</p>
        </div>
      </div>
    );
  }

  if (previewError || !previewUrl) {
    return (
      <div className="w-full aspect-square bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4 text-center">
        <p className="text-red-600 text-sm font-medium mb-1">Không thể áp dụng khung</p>
        <p className="text-gray-500 text-xs max-w-xs">
          {previewError ?? "Không thể tạo preview. Thử chọn khung khác."}
        </p>
      </div>
    );
  }

  const is1x4 = layoutState.config.type === "1x4";
  const wrapperClass = is1x4 ? "max-w-xl" : "max-w-md";
  const imgClass = is1x4
    ? "w-full h-auto max-h-[min(32rem,70vh)] object-contain rounded-lg shadow-lg"
    : "w-full h-auto max-h-96 object-contain rounded-lg shadow-lg";
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full flex justify-center"
    >
      <div
        className={`relative rounded-lg overflow-hidden ${wrapperClass} mx-auto ${
          onSlotClick ? "cursor-pointer" : ""
        }`}
        onClick={() => onSlotClick && onSlotClick(0)}
      >
        <img
          src={previewUrl}
          alt="Framed layout preview"
          className={imgClass}
        />
      </div>
    </motion.div>
  );
}
