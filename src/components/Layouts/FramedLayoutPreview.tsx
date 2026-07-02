"use client";

import { useEffect, useState } from "react";
import type { LayoutState } from "@/types/layout";
import type { FrameType } from "@/components/Frames/FrameSelector";
import { exportLayoutAsImage } from "@/utils/layoutCanvas";

interface FramedLayoutPreviewProps {
  layoutState: LayoutState;
  frameType: FrameType;
  onSlotClick?: (slotIndex: number) => void;
  /** Hiển thị phẳng, không animation — dùng màn xem kết quả */
  plain?: boolean;
}

export default function FramedLayoutPreview({
  layoutState,
  frameType,
  onSlotClick,
  plain = false,
}: FramedLayoutPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [previewError, setPreviewError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;
    setPreviewError(null);

    const generatePreview = async () => {
      if (!layoutState.isComplete) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const blob = await exportLayoutAsImage(layoutState, frameType);
        objectUrl = URL.createObjectURL(blob);

        if (isMounted) {
          setPreviewUrl(objectUrl);
          setPreviewError(null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error generating framed preview:", error);
        if (isMounted) {
          setPreviewUrl(null);
          setPreviewError(
            error instanceof Error
              ? error.message
              : "Không thể áp dụng khung. Thử khung khác hoặc ảnh từ nguồn hỗ trợ CORS."
          );
          setIsLoading(false);
        }
      }
    };

    generatePreview();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [layoutState, frameType]);

  const loadingBoxClass = plain
    ? "w-full min-h-[200px] flex items-center justify-center"
    : "w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center";

  if (!layoutState.isComplete) {
    return (
      <div className={loadingBoxClass}>
        <p className="text-on-surface-variant text-sm">Chưa hoàn thành layout</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={loadingBoxClass}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">Đang tạo preview với khung...</p>
        </div>
      </div>
    );
  }

  if (previewError || !previewUrl) {
    return (
      <div className={`${loadingBoxClass} flex-col p-4 text-center`}>
        <p className="text-error text-sm font-medium mb-1">Không thể áp dụng khung</p>
        <p className="text-on-surface-variant text-xs max-w-xs">
          {previewError ?? "Không thể tạo preview. Thử chọn khung khác."}
        </p>
      </div>
    );
  }

  const imgClass = plain
    ? "w-full h-auto max-h-[min(80vh,900px)] object-contain"
    : layoutState.config.type === "1x4"
    ? "w-full h-auto max-h-[min(32rem,70vh)] object-contain rounded-lg shadow-lg"
    : "w-full h-auto max-h-96 object-contain rounded-lg shadow-lg";

  const wrapperClass = plain
    ? "w-full max-w-md lg:max-w-xl mx-auto"
    : layoutState.config.type === "1x4"
    ? "max-w-xl"
    : "max-w-md";

  return (
    <div className="w-full flex justify-center">
      <div
        className={`relative overflow-hidden ${wrapperClass} mx-auto ${
          onSlotClick ? "cursor-pointer" : ""
        }`}
        onClick={() => onSlotClick?.(0)}
        onKeyDown={(e) => {
          if (onSlotClick && (e.key === "Enter" || e.key === " ")) {
            onSlotClick(0);
          }
        }}
        role={onSlotClick ? "button" : undefined}
        tabIndex={onSlotClick ? 0 : undefined}
      >
        <img src={previewUrl} alt="Ảnh photobooth với khung" className={imgClass} />
      </div>
    </div>
  );
}
