"use client";

import Reveal from "@/components/Landing/Reveal";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/services/auth.service";
import {
  submitContribution,
  getMyContributions,
  type ContributionItem,
} from "@/services/framer.service";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { ArrowLeft, Check, Clock, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const LAYOUT_OPTIONS: { value: LayoutType; label: string }[] = [
  { value: "1x4", label: "1×4" },
  { value: "2x3", label: "2×3" },
  { value: "2x2", label: "2×2" },
];

const STATUS_MAP = {
  pending: { label: "Chờ duyệt", icon: Clock, color: "text-secondary" },
  approved: { label: "Đã duyệt", icon: Check, color: "text-primary" },
  rejected: { label: "Đã từ chối", icon: X, color: "text-error" },
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="w-full max-w-2xl mx-auto px-6 md:px-margin-desktop py-8 md:py-stack-md">
      <Link
        href="/frames"
        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Quay lại thư viện khung
      </Link>

      <Reveal>
        <span className="font-body text-label-caps tracking-[0.2em] uppercase text-primary mb-2 block">
          Cộng đồng
        </span>
        <h1 className="font-display text-headline-lg-mobile md:text-headline-lg text-on-surface mb-2">
          Đóng góp khung ảnh
        </h1>
        <p className="text-on-surface-variant text-body-md mb-8">
          Gửi khung của bạn. Admin sẽ xem xét và duyệt trước khi khung xuất hiện trong danh sách.
        </p>
      </Reveal>

      <Reveal>
        <div className="frames-glass-card rounded-[32px] p-6 md:p-8 space-y-5">
          <label className="block">
            <span className="text-sm font-semibold text-on-surface">Tên khung</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Khung Valentine"
              className="mt-2 w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-on-surface">Layout</span>
            <div className="mt-2 flex flex-wrap gap-2">
              {LAYOUT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLayoutType(opt.value)}
                  className={`category-pill px-6 py-2.5 rounded-full font-body text-label-caps tracking-widest uppercase border border-outline-variant/30 ${
                    layoutType === opt.value
                      ? "active"
                      : "bg-white/60 hover:border-primary/50"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">
              {LAYOUT_CONFIGS[layoutType].description}
            </p>
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-on-surface">Link ảnh (tùy chọn)</span>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="mt-2 w-full rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold text-on-surface">Hoặc chọn file ảnh</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFromFile(e.target.files?.[0] ?? null)}
              className="mt-2 w-full text-sm text-on-surface-variant file:mr-3 file:rounded-full file:border-0 file:bg-primary/10 file:px-4 file:py-2 file:text-primary file:font-medium"
            />
          </label>

          {preview && (
            <div className="rounded-[20px] border border-outline-variant p-4 bg-surface-container">
              <img src={preview} alt="Preview" className="max-h-48 mx-auto object-contain" />
            </div>
          )}

          {error && (
            <p className="text-sm text-error bg-error-container/20 rounded-xl px-4 py-3">{error}</p>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={(!preview && !imageUrl.trim()) || submitting}
            className="w-full inline-flex items-center justify-center gap-2 primary-glow-button text-white px-6 py-4 rounded-full font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <Upload className="w-4 h-4" />
            {submitting ? "Đang gửi..." : "Gửi yêu cầu đóng góp"}
          </button>
        </div>
      </Reveal>

      <section className="mt-10">
        <h2 className="font-display text-2xl text-on-surface mb-4">Yêu cầu của tôi</h2>
        {loadingList ? (
          <p className="text-on-surface-variant text-sm">Đang tải...</p>
        ) : contributions.length === 0 ? (
          <p className="text-on-surface-variant text-sm">Chưa có yêu cầu nào.</p>
        ) : (
          <ul className="space-y-3">
            {contributions.map((c) => {
              const statusInfo = STATUS_MAP[c.status];
              const Icon = statusInfo.icon;
              return (
                <li
                  key={c.id}
                  className="frames-glass-card rounded-[24px] p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-container flex-shrink-0 overflow-hidden">
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
                    <p className="font-semibold text-on-surface truncate">{c.name}</p>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      {LAYOUT_CONFIGS[c.layoutType as LayoutType]?.name ?? c.layoutType}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1 text-sm shrink-0 ${statusInfo.color}`}>
                    <Icon className="w-4 h-4" />
                    {statusInfo.label}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
