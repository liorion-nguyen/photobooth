import type { LayoutType } from "@/types/layout";

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(
  /\/api\/?$/,
  ""
);

export interface FramerApiItem {
  id: string;
  name: string;
  imageUrl: string;
  layoutType: string;
  aspectRatio: number | null;
  createdAt: string;
}

export async function getFramers(): Promise<FramerApiItem[]> {
  const res = await fetch(`${API_ROOT}/api/framers`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error("Không tải được danh sách framer");
  const data = await res.json();
  return data.framers || [];
}

export async function getFramerById(id: string): Promise<FramerApiItem | null> {
  const res = await fetch(`${API_ROOT}/api/framers/${id}`, {
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getAdminFramers(token: string): Promise<FramerApiItem[]> {
  const res = await fetch(`${API_ROOT}/api/admin/framers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Chưa đăng nhập");
    if (res.status === 403) throw new Error("Không có quyền admin");
    throw new Error("Không tải được danh sách framer");
  }
  const data = await res.json();
  return data.framers || [];
}

export async function createFramer(
  token: string,
  file: Blob,
  name: string,
  layoutType: LayoutType
): Promise<FramerApiItem> {
  const form = new FormData();
  form.append("photo", file, "framer.png");
  form.append("name", name);
  form.append("layoutType", layoutType);

  const res = await fetch(`${API_ROOT}/api/admin/framers`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Tạo framer thất bại");
  }
  return res.json();
}

export async function updateFramer(
  token: string,
  id: string,
  payload: { name?: string; layoutType?: string; imageUrl?: string }
): Promise<FramerApiItem> {
  const res = await fetch(`${API_ROOT}/api/admin/framers/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Cập nhật framer thất bại");
  }
  return res.json();
}

export async function deleteFramer(token: string, id: string): Promise<void> {
  const res = await fetch(`${API_ROOT}/api/admin/framers/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Xóa framer thất bại");
}

// --- Framer contributions (user đóng góp, admin duyệt) ---

export interface ContributionItem {
  id: string;
  name: string;
  imageUrl: string;
  layoutType: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  reviewedAt: string | null;
}

export async function getMyContributions(
  token: string
): Promise<ContributionItem[]> {
  const res = await fetch(`${API_ROOT}/api/framer-contributions/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Chưa đăng nhập");
    throw new Error("Không tải được yêu cầu đóng góp");
  }
  const data = await res.json();
  return data.contributions || [];
}

export async function submitContribution(
  token: string,
  payload: {
    name: string;
    layoutType: LayoutType;
    imageUrl?: string;
    file?: Blob;
  }
): Promise<ContributionItem> {
  const form = new FormData();
  form.append("name", payload.name);
  form.append("layoutType", payload.layoutType);
  if (payload.imageUrl?.trim()) form.append("imageUrl", payload.imageUrl.trim());
  if (payload.file) form.append("photo", payload.file, "framer.png");

  const res = await fetch(`${API_ROOT}/api/framer-contributions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Gửi đóng góp thất bại");
  }
  return res.json();
}

export async function getAdminContributions(
  token: string,
  status?: "pending" | "approved" | "rejected"
): Promise<(ContributionItem & { userId: string; reviewedBy: string | null })[]> {
  const url = status
    ? `${API_ROOT}/api/admin/framer-contributions?status=${status}`
    : `${API_ROOT}/api/admin/framer-contributions`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    if (res.status === 401) throw new Error("Chưa đăng nhập");
    if (res.status === 403) throw new Error("Không có quyền admin");
    throw new Error("Không tải được danh sách đóng góp");
  }
  const data = await res.json();
  return data.contributions || [];
}

export async function acceptContribution(
  token: string,
  id: string
): Promise<{ success: boolean; framer: FramerApiItem }> {
  const res = await fetch(`${API_ROOT}/api/admin/framer-contributions/${id}/accept`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Duyệt thất bại");
  }
  return res.json();
}

export async function rejectContribution(
  token: string,
  id: string
): Promise<void> {
  const res = await fetch(`${API_ROOT}/api/admin/framer-contributions/${id}/reject`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Từ chối thất bại");
}
