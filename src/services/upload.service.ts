import type { UploadProgress } from "@/types/photo";
import { resizeImage } from "@/utils/canvas";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export interface UploadResponse {
  success: boolean;
  url?: string;
  id?: string;
  error?: string;
}

export async function uploadPhoto(
  blob: Blob,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResponse> {
  try {
    // Resize image before upload
    const resizedBlob = await resizeImage(blob, 1080);

    const formData = new FormData();
    formData.append("photo", resizedBlob, "photo.jpg");

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (e) => {
        if (e.lengthComputable && onProgress) {
          onProgress({
            loaded: e.loaded,
            total: e.total,
            percentage: Math.round((e.loaded / e.total) * 100),
          });
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              success: true,
              url: response.url,
              id: response.id,
            });
          } catch {
            resolve({
              success: true,
              url: xhr.responseText,
            });
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Network error during upload"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload aborted"));
      });

      xhr.open("POST", `${API_BASE_URL}/photos/upload`);
      xhr.send(formData);
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
