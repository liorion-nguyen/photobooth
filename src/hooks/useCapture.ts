"use client";

import { useCallback } from "react";
import type { CaptureResult, FilterType } from "@/types/photo";
import type { StickerType } from "@/types/sticker";
import { cropImageToAspectRatio, getCellAspectRatio } from "@/utils/imageCrop";
import { applyFilter } from "@/utils/canvas";
import { applySticker } from "@/utils/stickerUtils";

interface UseCaptureParams {
  videoRef: React.RefObject<HTMLVideoElement>;
  mirror?: boolean;
  layoutRows?: number; // Số hàng của layout
  layoutCols?: number; // Số cột của layout
  filter?: FilterType; // Filter để áp dụng
  sticker?: StickerType; // Sticker để áp dụng
}

export function useCapture({ 
  videoRef, 
  mirror = false,
  layoutRows,
  layoutCols,
  filter = "none",
  sticker = "none",
}: UseCaptureParams) {
  const capture = useCallback(async (): Promise<CaptureResult | null> => {
    if (!videoRef.current) {
      return null;
    }

    const video = videoRef.current;
    if (video.readyState !== video.HAVE_ENOUGH_DATA) {
      return null;
    }

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return null;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Apply mirror effect if needed
    if (mirror) {
      ctx.save(); // Save context state
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.restore(); // Restore context state
    } else {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    }

    return new Promise(async (resolve) => {
      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          let dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          let finalWidth = canvas.width;
          let finalHeight = canvas.height;

          // Luôn crop ảnh theo aspect ratio 4:3
          const targetAspectRatio = 4 / 3; // Luôn là 4:3
          try {
            dataUrl = await cropImageToAspectRatio(dataUrl, targetAspectRatio);
            
            // Tính lại kích thước sau khi crop
            const img = new Image();
            await new Promise((resolveImg) => {
              img.onload = resolveImg;
              img.src = dataUrl;
            });
            finalWidth = img.width;
            finalHeight = img.height;
          } catch (error) {
            console.error("Error cropping image:", error);
            // Nếu crop fail, dùng ảnh gốc
          }

          // Áp dụng filter và sticker nếu có (sau khi crop)
          if ((filter && filter !== "none") || (sticker && sticker !== "none")) {
            try {
              const img = new Image();
              img.crossOrigin = "anonymous";
              await new Promise((resolveImg, rejectImg) => {
                img.onload = () => {
                  // Đảm bảo image đã load hoàn toàn
                  if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
                    resolveImg(undefined);
                  } else {
                    rejectImg(new Error("Image not fully loaded"));
                  }
                };
                img.onerror = rejectImg;
                img.src = dataUrl;
              });

              const processCanvas = document.createElement("canvas");
              processCanvas.width = finalWidth;
              processCanvas.height = finalHeight;
              const processCtx = processCanvas.getContext("2d", { 
                willReadFrequently: true,
                colorSpace: "srgb" // Đảm bảo color space đúng
              });
              
              if (processCtx) {
                // Clear canvas trước khi vẽ
                processCtx.clearRect(0, 0, finalWidth, finalHeight);
                // Vẽ ảnh
                processCtx.drawImage(img, 0, 0, finalWidth, finalHeight);
                
                // Áp dụng filter trước
                if (filter && filter !== "none") {
                  applyFilter(processCanvas, filter);
                }
                
                // Áp dụng sticker sau filter
                if (sticker && sticker !== "none") {
                  applySticker(processCanvas, sticker);
                }
                
                dataUrl = processCanvas.toDataURL("image/jpeg", 0.9);
              }
            } catch (error) {
              console.error("Error applying filter/sticker:", error);
              // Nếu filter/sticker fail, dùng ảnh gốc
            }
          }

          // Tạo blob từ dataUrl cuối cùng (đã crop và filter)
          try {
            const response = await fetch(dataUrl);
            blob = await response.blob();
          } catch (error) {
            console.error("Error creating blob:", error);
          }

          resolve({
            blob,
            dataUrl,
            width: finalWidth,
            height: finalHeight,
          });
        },
        "image/jpeg",
        0.9
      );
    });
  }, [videoRef, mirror, layoutRows, layoutCols, filter, sticker]);

  return { capture };
}
