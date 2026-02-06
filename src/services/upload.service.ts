import type { UploadProgress } from "@/types/photo";
import { resizeImage } from "@/utils/canvas";
import { getToken } from "./auth.service";

// Backend root (auth: /auth/*, photos: /api/photos/*)
const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");
const API_BASE_URL = `${API_ROOT}/api`;

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
    const token = getToken();
    if (!token) {
      return {
        success: false,
        error: "Bạn cần đăng nhập để lưu ảnh",
      };
    }

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
          const errorMsg = xhr.status === 401 
            ? "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            : `Upload thất bại (${xhr.status})`;
          reject(new Error(errorMsg));
        }
      });

      xhr.addEventListener("error", () => {
        reject(new Error("Lỗi kết nối mạng"));
      });

      xhr.addEventListener("abort", () => {
        reject(new Error("Upload đã bị hủy"));
      });

      xhr.open("POST", `${API_BASE_URL}/photos/upload`);
      xhr.setRequestHeader("Authorization", `Bearer ${token}`);
      xhr.send(formData);
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
