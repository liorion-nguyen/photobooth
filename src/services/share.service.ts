import { getToken } from "./auth.service";

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");
const API_BASE_URL = `${API_ROOT}/api`;

export interface ShareLinkResponse {
  token: string;
  shareUrl: string;
  expiresAt: string;
}

export async function createShareLink(photoId: string): Promise<ShareLinkResponse> {
  const token = getToken();
  if (!token) {
    throw new Error("Bạn cần đăng nhập để tạo share link");
  }

  const response = await fetch(`${API_BASE_URL}/photos/${photoId}/share`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    let errorMessage = "Failed to create share link";
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } else {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
    } catch {
      // Ignore parsing errors
    }
    throw new Error(errorMessage);
  }

  // Check if response has content
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Invalid response format from server");
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Failed to parse server response");
  }
}

export async function getShareLink(photoId: string): Promise<ShareLinkResponse | null> {
  const token = getToken();
  if (!token) {
    throw new Error("Bạn cần đăng nhập để xem share link");
  }

  const response = await fetch(`${API_BASE_URL}/photos/${photoId}/share`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      return null; // No share link exists
    }
    let errorMessage = "Failed to get share link";
    try {
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.message || errorMessage;
      } else {
        const text = await response.text();
        errorMessage = text || errorMessage;
      }
    } catch {
      // Ignore parsing errors
    }
    throw new Error(errorMessage);
  }

  // Check if response has content
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return null; // Empty response means no share link
  }

  try {
    const data = await response.json();
    return data;
  } catch (error) {
    // If parsing fails, assume no share link exists
    return null;
  }
}

export interface SharedPhotoData {
  url: string;
  id: string;
  createdAt: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    avatarUrl: string | null;
  } | null;
}

export async function getPhotoByShareToken(token: string): Promise<SharedPhotoData> {
  const response = await fetch(`${API_ROOT}/share/${token}`);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Share link không hợp lệ hoặc đã hết hạn" }));
    throw new Error(error.message || "Share link không hợp lệ hoặc đã hết hạn");
  }

  return response.json();
}
