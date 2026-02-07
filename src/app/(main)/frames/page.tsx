"use client";

import { getFramers, type FramerApiItem } from "@/services/framer.service";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { motion } from "framer-motion";
import { Frame, Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const LAYOUT_OPTIONS: { value: LayoutType | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "1x4", label: "1×4" },
  { value: "2x3", label: "2×3" },
  { value: "2x2", label: "2×2" },
];

export default function FramesGalleryPage() {
  const [framers, setFramers] = useState<FramerApiItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterLayout, setFilterLayout] = useState<LayoutType | "">("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const list = await getFramers();
      setFramers(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được danh sách khung");
      setFramers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    if (!filterLayout) return framers;
    return framers.filter((f) => f.layoutType === filterLayout);
  }, [framers, filterLayout]);

  if (loading) {
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

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-50/70 via-white/80 to-purple-50/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Khung ảnh</h1>
            <p className="text-slate-600 text-sm mt-1">
              Xem tất cả khung có sẵn để dùng trong Photobooth. Bạn có thể đóng góp khung mới.
            </p>
          </div>
          <Link
            href="/frames/contribute"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Đóng góp khung
          </Link>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        {framers.length > 0 && (
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm text-slate-600">Layout:</span>
            <select
              value={filterLayout}
              onChange={(e) => setFilterLayout(e.target.value as LayoutType | "")}
              className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
            >
              {LAYOUT_OPTIONS.map((opt) => (
                <option key={opt.value || "all"} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <span className="text-sm text-slate-500">
              {filtered.length} / {framers.length} khung
            </span>
          </div>
        )}

        {framers.length === 0 && !error ? (
          <div className="bg-white/90 rounded-2xl border border-slate-200 p-12 text-center">
            <Frame className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600 mb-4">Chưa có khung nào. Hãy đóng góp khung đầu tiên!</p>
            <Link
              href="/frames/contribute"
              className="inline-flex items-center gap-2 rounded-lg bg-purple-600 text-white px-4 py-2.5 text-sm font-medium hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              Đóng góp khung
            </Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white/90 rounded-2xl border border-slate-200 p-12 text-center">
            <p className="text-slate-600">Không có khung nào với layout đã chọn.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((frame, i) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
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
                    <span className="text-slate-400 text-xs">Không có ảnh</span>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-slate-800 text-sm truncate">{frame.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {LAYOUT_CONFIGS[frame.layoutType as LayoutType]?.name ?? frame.layoutType}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
