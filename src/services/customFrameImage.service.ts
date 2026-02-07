import type { LayoutType } from "@/types/layout";

export interface CustomFrameImage {
  id: string;
  name: string;
  imageData: string; // Base64 image data
  aspectRatio?: number; // width / height
  fitMode?: "cover" | "contain" | "fill";
  /** Layout khung này dùng cho (1x4, 2x3, 2x2) */
  layoutType?: LayoutType;
  createdAt: string;
}

const STORAGE_KEY = "photobooth_custom_frame_images";

export function getCustomFrameImages(): CustomFrameImage[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to load custom frame images:", error);
    return [];
  }
}

export function saveCustomFrameImage(frameImage: CustomFrameImage): void {
  if (typeof window === "undefined") return;
  
  try {
    const frames = getCustomFrameImages();
    const existingIndex = frames.findIndex((f) => f.id === frameImage.id);
    
    if (existingIndex >= 0) {
      frames[existingIndex] = frameImage;
    } else {
      frames.push({
        ...frameImage,
        createdAt: frameImage.createdAt || new Date().toISOString(),
      });
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(frames));
  } catch (error) {
    console.error("Failed to save custom frame image:", error);
  }
}

export function deleteCustomFrameImage(frameId: string): void {
  if (typeof window === "undefined") return;
  
  try {
    const frames = getCustomFrameImages();
    const filtered = frames.filter((f) => f.id !== frameId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete custom frame image:", error);
  }
}

export function getCustomFrameImage(frameId: string): CustomFrameImage | null {
  const frames = getCustomFrameImages();
  return frames.find((f) => f.id === frameId) || null;
}
