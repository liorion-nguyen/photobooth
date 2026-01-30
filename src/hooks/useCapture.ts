"use client";

import { useCallback } from "react";
import type { CaptureResult } from "@/types/photo";

interface UseCaptureParams {
  videoRef: React.RefObject<HTMLVideoElement>;
  mirror?: boolean;
}

export function useCapture({ videoRef, mirror = false }: UseCaptureParams) {
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
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
          resolve({
            blob,
            dataUrl,
            width: canvas.width,
            height: canvas.height,
          });
        },
        "image/jpeg",
        0.9
      );
    });
  }, [videoRef, mirror]);

  return { capture };
}
