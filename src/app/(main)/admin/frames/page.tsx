"use client";

import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/services/auth.service";
import {
  createFramer,
  deleteFramer,
  getAdminFramers,
  updateFramer,
  type FramerApiItem,
} from "@/services/framer.service";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { motion } from "framer-motion";
import { Frame, Filter, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: "1x4", label: "1×4" },
  { value: "2x3", label: "2×3" },
  { value: "2x2", label: "2×2" },
];

export default function AdminFramesPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [frames, setFrames] = useState<FramerApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [listError, setListError] = useState("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadName, setUploadName] = useState("");
  const [uploadLayout, setUploadLayout] = useState<LayoutType>("2x2");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [editingFrame, setEditingFrame] = useState<FramerApiItem | null>(null);
  const [editName, setEditName] = useState("");
  const [editLayout, setEditLayout] = useState<LayoutType>("1x4");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  const [filterLayout, setFilterLayout] = useState<string>("");
  const [filterName, setFilterName] = useState("");

  const filteredFrames = useMemo(() => {
    let list = frames;
    if (filterLayout) {
      list = list.filter((f) => f.layoutType === filterLayout);
    }
    if (filterName.trim()) {
      const q = filterName.trim().toLowerCase();
      list = list.filter((f) => f.name.toLowerCase().includes(q));
    }
    return list;
  }, [frames, filterLayout, filterName]);

  const loadFrames = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setListError("Chưa đăng nhập");
      setFrames([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setListError("");
    try {
      const list = await getAdminFramers(token);
      setFrames(list);
    } catch (e) {
      setListError(e instanceof Error ? e.message : "Không tải được danh sách");
      setFrames([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/");
      return;
    }
    if (user?.role === "admin") loadFrames();
  }, [user, authLoading, router, loadFrames]);

  const setImageFromFile = useCallback((file: File | null) => {
    setUploadError("");
    if (!file) {
      setUploadFile(null);
      setUploadPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("Chọn file ảnh (PNG, JPG, ...)");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File tối đa 10MB");
      return;
    }
    setUploadFile(file);
    const reader = new FileReader();
    reader.onload = () => setUploadPreview(reader.result as string);
    reader.readAsDataURL(file);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageFromFile(e.target.files?.[0] ?? null);
  };

  const handleLoadFromUrl = useCallback(async () => {
    const url = imageUrl.trim();
    if (!url) {
      setUploadError("Nhập link ảnh");
      return;
    }
    setUploadError("");
    setLoadingUrl(true);
    try {
      const res = await fetch(url, { mode: "cors" });
      if (!res.ok) throw new Error("Không tải được ảnh");
      const blob = await res.blob();
      if (!blob.type.startsWith("image/")) throw new Error("Link không phải ảnh");
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });
      setUploadPreview(dataUrl);
      setUploadFile(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Không tải được ảnh. Thử link khác hoặc upload file.");
    } finally {
      setLoadingUrl(false);
    }
  }, [imageUrl]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) setImageFromFile(file);
    },
    [setImageFromFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleUploadSubmit = async () => {
    if (!uploadPreview) {
      setUploadError("Chọn file ảnh, dán link hoặc kéo thả ảnh vào");
      return;
    }
    const token = getToken();
    if (!token) {
      setUploadError("Chưa đăng nhập");
      return;
    }
    const name = uploadName.trim() || uploadFile?.name.replace(/\.[^.]+$/, "") || "Framer từ link";
    setSaving(true);
    setUploadError("");
    try {
      const blob = await (await fetch(uploadPreview)).blob();
      await createFramer(token, blob, name, uploadLayout);
      setShowUpload(false);
      setUploadName("");
      setUploadFile(null);
      setUploadPreview(null);
      setImageUrl("");
      await loadFrames();
    } catch (e) {
      setUploadError(e instanceof Error ? e.message : "Lưu framer thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Xóa khung "${name}"?`)) return;
    const token = getToken();
    if (!token) return;
    try {
      await deleteFramer(token, id);
      await loadFrames();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Xóa thất bại");
    }
  };

  const openEdit = (frame: FramerApiItem) => {
    setEditingFrame(frame);
    setEditName(frame.name);
    setEditLayout((frame.layoutType as LayoutType) || "1x4");
    setEditImageUrl(frame.imageUrl || "");
    setEditError("");
  };

  const handleEditSubmit = async () => {
    if (!editingFrame) return;
    const token = getToken();
    if (!token) {
      setEditError("Chưa đăng nhập");
      return;
    }
    setEditSaving(true);
    setEditError("");
    try {
      await updateFramer(token, editingFrame.id, {
        name: editName.trim() || editingFrame.name,
        layoutType: editLayout,
        imageUrl: editImageUrl.trim() || undefined,
      });
      setEditingFrame(null);
      await loadFrames();
    } catch (e) {
      setEditError(e instanceof Error ? e.message : "Cập nhật thất bại");
    } finally {
      setEditSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-50/70 via-white/80 to-indigo-50/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link
              href="/admin"
              className="text-sm text-slate-600 hover:text-indigo-600 mb-2 inline-block"
            >
              ← Quay lại quản trị
            </Link>
            <h1 className="text-2xl font-bold text-slate-800">Quản lý khung ảnh (Framer)</h1>
            <p className="text-slate-600 text-sm mt-1">
              Upload khung ảnh và chọn layout tương ứng. Khung chỉ hiển thị khi user chọn đúng layout.
            </p>
          </div>
          <Button onClick={() => setShowUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload framer
          </Button>
        </div>

        {listError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {listError}
          </div>
        )}

        {frames.length > 0 && (
          <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white/80 p-4 shadow-sm">
            <Filter className="w-5 h-5 text-slate-500" />
            <select
              value={filterLayout}
              onChange={(e) => setFilterLayout(e.target.value)}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Tất cả layout</option>
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                placeholder="Lọc theo tên..."
                className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            {(filterLayout || filterName.trim()) && (
              <button
                type="button"
                onClick={() => {
                  setFilterLayout("");
                  setFilterName("");
                }}
                className="text-sm text-indigo-600 hover:underline"
              >
                Xóa bộ lọc
              </button>
            )}
            <span className="ml-auto text-sm text-slate-500">
              {filteredFrames.length} / {frames.length} khung
            </span>
          </div>
        )}

        {frames.length === 0 && !listError ? (
          <div className="bg-white/90 rounded-2xl border border-slate-200 p-12 text-center">
            <Frame className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-4">Chưa có khung nào. Upload framer (ảnh PNG có vùng trong suốt) để dùng trong photobooth.</p>
            <Button onClick={() => setShowUpload(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Upload framer
            </Button>
          </div>
        ) : filteredFrames.length === 0 ? (
          <div className="bg-white/90 rounded-2xl border border-slate-200 p-12 text-center">
            <Filter className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-4">Không có khung nào trùng với bộ lọc. Thử đổi layout hoặc từ khóa tên.</p>
            <button
              type="button"
              onClick={() => { setFilterLayout(""); setFilterName(""); }}
              className="text-indigo-600 hover:underline text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFrames.map((frame) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="aspect-[2/3] bg-slate-100 flex items-center justify-center p-2">
                  {frame.imageUrl ? (
                    <img
                      src={frame.imageUrl}
                      alt={frame.name}
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-slate-400 text-sm">Không có ảnh</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 truncate">{frame.name}</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Layout: {frame.layoutType ? LAYOUT_CONFIGS[frame.layoutType as LayoutType]?.name ?? frame.layoutType : "—"}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => openEdit(frame)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(frame.id, frame.name)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <Modal
        isOpen={!!editingFrame}
        onClose={() => setEditingFrame(null)}
        title="Chỉnh sửa framer"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tên khung</span>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="VD: Khung Halloween"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Layout khung</span>
            <select
              value={editLayout}
              onChange={(e) => setEditLayout(e.target.value as LayoutType)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Link ảnh (tùy chọn)</span>
            <input
              type="url"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
            <p className="text-xs text-slate-500 mt-1">Để trống nếu giữ ảnh hiện tại</p>
          </label>
          {editError && <p className="text-sm text-red-600">{editError}</p>}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleEditSubmit} disabled={editSaving}>
              {editSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
            <Button variant="secondary" onClick={() => setEditingFrame(null)}>
              Hủy
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showUpload}
        onClose={() => {
          setShowUpload(false);
          setUploadError("");
          setUploadFile(null);
          setUploadPreview(null);
          setImageUrl("");
        }}
        title="Upload framer"
      >
        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tên khung</span>
            <input
              type="text"
              value={uploadName}
              onChange={(e) => setUploadName(e.target.value)}
              placeholder="VD: Khung Halloween"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Layout khung</span>
            <select
              value={uploadLayout}
              onChange={(e) => setUploadLayout(e.target.value as LayoutType)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Dán link ảnh</span>
            <div className="mt-1 flex gap-2">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onPaste={(e) => {
                  const text = (e.clipboardData?.getData("text") || "").trim();
                  if (text.startsWith("http")) setImageUrl(text);
                }}
                placeholder="https://..."
                className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={handleLoadFromUrl}
                disabled={loadingUrl || !imageUrl.trim()}
              >
                {loadingUrl ? "Đang tải..." : "Tải ảnh"}
              </Button>
            </div>
          </label>

          <div className="block">
            <span className="text-sm font-medium text-slate-700">Hoặc kéo thả / chọn file ảnh</span>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              className={`mt-1 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
                dragOver
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 bg-slate-50/50 hover:border-slate-400"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="framer-file-input"
              />
              <label
                htmlFor="framer-file-input"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload className="w-10 h-10 text-slate-400" />
                <span className="text-sm text-slate-600">
                  Kéo ảnh vào đây hoặc click để chọn file
                </span>
                <span className="text-xs text-slate-500">PNG, JPG — tối đa 10MB</span>
              </label>
            </div>
          </div>
          {uploadPreview && (
            <div className="rounded-lg border border-slate-200 p-2 bg-slate-50">
              <img src={uploadPreview} alt="Preview" className="max-h-40 mx-auto object-contain" />
            </div>
          )}
          {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
          <div className="flex gap-2 pt-2">
            <Button onClick={handleUploadSubmit} disabled={!uploadPreview || saving}>
              {saving ? "Đang lưu..." : "Lưu"}
            </Button>
            <Button variant="secondary" onClick={() => setShowUpload(false)}>
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
