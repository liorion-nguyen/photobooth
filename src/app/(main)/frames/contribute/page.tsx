"use client";

import Button from "@/components/UI/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/services/auth.service";
import {
  submitContribution,
  getMyContributions,
  type ContributionItem,
} from "@/services/framer.service";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { motion } from "framer-motion";
import { Check, Clock, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: "1x4", label: "1×4" },
  { value: "2x3", label: "2×3" },
  { value: "2x2", label: "2×2" },
];

const STATUS_MAP = {
  pending: { label: "Chờ duyệt", icon: Clock, color: "text-amber-600" },
  approved: { label: "Đã duyệt", icon: Check, color: "text-emerald-600" },
  rejected: { label: "Đã từ chối", icon: X, color: "text-red-600" },
};

export default function ContributeFramePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [name, setName] = useState("");
  const [layoutType, setLayoutType] = useState<LayoutType>("2x2");
  const [imageUrl, setImageUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [loadingList, setLoadingList] = useState(false);

  const loadMyContributions = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoadingList(true);
    try {
      const list = await getMyContributions(token);
      setContributions(list);
    } catch {
      setContributions([]);
    } finally {
      setLoadingList(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) loadMyContributions();
  }, [user, authLoading, router, loadMyContributions]);

  const setImageFromFile = (f: File | null) => {
    setError("");
    setFile(f);
    if (!f) {
      setPreview(null);
      return;
    }
    if (!f.type.startsWith("image/")) {
      setError("Chọn file ảnh (PNG, JPG, ...)");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("File tối đa 10MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPreview(reader.result as string);
    reader.readAsDataURL(f);
  };

  const handleSubmit = async () => {
    if (!preview && !imageUrl.trim()) {
      setError("Chọn file ảnh hoặc dán link ảnh");
      return;
    }
    const token = getToken();
    if (!token) {
      setError("Vui lòng đăng nhập");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      if (file) {
        await submitContribution(token, {
          name: name.trim() || file.name.replace(/\.[^.]+$/, ""),
          layoutType,
          file,
        });
      } else {
        await submitContribution(token, {
          name: name.trim() || "Khung đóng góp",
          layoutType,
          imageUrl: imageUrl.trim(),
        });
      }
      setName("");
      setLayoutType("2x2");
      setImageUrl("");
      setFile(null);
      setPreview(null);
      await loadMyContributions();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gửi thất bại");
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-purple-500 border-t-transparent"
        />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-50/70 via-white/80 to-purple-50/25">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/frames"
          className="text-sm text-slate-600 hover:text-purple-600 mb-4 inline-block"
        >
          ← Quay lại Khung ảnh
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Đóng góp khung ảnh</h1>
        <p className="text-slate-600 text-sm mb-6">
          Gửi khung của bạn. Admin sẽ xem xét và duyệt trước khi khung xuất hiện trong danh sách.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4"
        >
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Tên khung</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Khung Valentine"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Layout</span>
            <select
              value={layoutType}
              onChange={(e) => setLayoutType(e.target.value as LayoutType)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label} – {LAYOUT_CONFIGS[opt.value].description}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Link ảnh (tùy chọn)</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Hoặc chọn file ảnh</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFromFile(e.target.files?.[0] ?? null)}
              className="mt-1 w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-purple-50 file:px-3 file:py-2 file:text-purple-700"
            />
          </label>
          {preview && (
            <div className="rounded-lg border border-slate-200 p-2 bg-slate-50">
              <img src={preview} alt="Preview" className="max-h-40 mx-auto object-contain" />
            </div>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button
            onClick={handleSubmit}
            disabled={(!preview && !imageUrl.trim()) || submitting}
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            {submitting ? "Đang gửi..." : "Gửi yêu cầu đóng góp"}
          </Button>
        </motion.div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">Yêu cầu của tôi</h2>
          {loadingList ? (
            <p className="text-slate-500 text-sm">Đang tải...</p>
          ) : contributions.length === 0 ? (
            <p className="text-slate-500 text-sm">Chưa có yêu cầu nào.</p>
          ) : (
            <ul className="space-y-3">
              {contributions.map((c) => {
                const statusInfo = STATUS_MAP[c.status];
                const Icon = statusInfo.icon;
                return (
                  <li
                    key={c.id}
                    className="flex items-center gap-4 bg-white rounded-xl border border-slate-200 p-4"
                  >
                    <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      {c.imageUrl && (
                        <img
                          src={c.imageUrl}
                          alt={c.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-800 truncate">{c.name}</p>
                      <p className="text-xs text-slate-500">
                        {LAYOUT_CONFIGS[c.layoutType as LayoutType]?.name ?? c.layoutType}
                      </p>
                    </div>
                    <span className={`flex items-center gap-1 text-sm ${statusInfo.color}`}>
                      <Icon className="w-4 h-4" />
                      {statusInfo.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
