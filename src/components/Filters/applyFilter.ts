import { applyFilter as applyCanvasFilter } from "@/utils/canvas";
import type { FilterType } from "@/types/photo";

export function applyFilterToImage(
  imageUrl: string,
  filter: FilterType
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0);
      applyCanvasFilter(canvas, filter);

      const filteredDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      resolve(filteredDataUrl);
    };
    img.onerror = reject;
    img.src = imageUrl;
  });
}
