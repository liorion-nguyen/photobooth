import { getToken } from "./auth.service";

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");
const API_BASE_URL = `${API_ROOT}/api`;

export interface Photo {
  id: string;
  url: string;
  createdAt: string;
  userId?: string | null;
  user?: {
    id: string;
    email: string;
    name: string | null;
  } | null;
}

export async function getUserPhotos(): Promise<Photo[]> {
  const token = getToken();
  if (!token) {
    throw new Error("Bạn cần đăng nhập để xem ảnh");
  }

  const response = await fetch(`${API_BASE_URL}/photos`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to fetch photos" }));
    throw new Error(error.message || "Failed to fetch photos");
  }

  return response.json();
}

export async function deletePhoto(photoId: string): Promise<void> {
  const token = getToken();
  if (!token) {
    throw new Error("Bạn cần đăng nhập để xóa ảnh");
  }

  const response = await fetch(`${API_BASE_URL}/photos/${photoId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Failed to delete photo" }));
    throw new Error(error.message || "Failed to delete photo");
  }
}
