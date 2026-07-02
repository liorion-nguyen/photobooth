"use client";

import Reveal from "@/components/Landing/Reveal";
import { getFramers, type FramerApiItem } from "@/services/framer.service";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { Plus, Sparkles, Wand2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const LAYOUT_FILTERS: { value: LayoutType | ""; label: string }[] = [
  { value: "", label: "Tất cả" },
  { value: "1x4", label: "1×4" },
  { value: "2x3", label: "2×3" },
  { value: "2x2", label: "2×2" },
];

const RECOMMENDED_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAYn4zBog5ArfzCT9NXxqo_d7VB61v618zq0uD_pBQpzxhMJpyuJilbAGBAV_91MU8By1XuKhm8OuV2XTXPv8cXsRfuk046Xw90QeAIvMaKkxz6OA9MUxp9DdjIlvD50FCrrp154CkqwJCPXNivfozKo6hBeA8flAq08wgW2TCUQnW7sMhRJG7ujv9ndbEgXrdqhpVlR30uaWhXFGWnq7X5OzKiYkUvBoRuDbXOS96KRoKLq3ElrNECR7JZYSjhiaCmsQkZP9AfI3A";

function isNewFrame(createdAt: string) {
  const created = new Date(createdAt).getTime();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return created >= weekAgo;
}

function FrameCard({ frame }: { frame: FramerApiItem }) {
  const layout = LAYOUT_CONFIGS[frame.layoutType as LayoutType];
  const slotCount = layout?.totalSlots ?? 0;

  return (
    <article className="group h-full">
      <div className="frames-glass-card h-full rounded-[32px] p-6 flex flex-col gap-4">
        <div className="relative w-full aspect-[3/4] overflow-hidden rounded-[20px] bg-surface-container flex items-center justify-center">
          {frame.imageUrl ? (
            <img
              src={frame.imageUrl}
              alt={frame.name}
              className="max-w-full max-h-full object-contain p-3 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-on-surface-variant text-sm">Không có ảnh</span>
          )}
          {isNewFrame(frame.createdAt) && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full font-body text-[10px] text-primary font-semibold tracking-widest uppercase">
              Mới
            </div>
          )}
        </div>
        <div className="shrink-0">
          <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-display text-xl md:text-2xl text-on-surface truncate">{frame.name}</h3>
            <span className="font-body text-label-caps text-on-surface-variant opacity-60 shrink-0 uppercase">
              {slotCount} ảnh
            </span>
          </div>
          <div className="flex gap-2 flex-wrap">
            <span className="bg-surface-container-high px-3 py-1 rounded-full text-[11px] font-medium tracking-wide text-on-surface-variant">
              {layout?.name ?? frame.layoutType}
            </span>
            {frame.aspectRatio != null && (
              <span className="bg-surface-container-high px-3 py-1 rounded-full text-[11px] font-medium tracking-wide text-on-surface-variant">
                {frame.aspectRatio.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

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

  const recommended = filtered[0] ?? framers[0];

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Hero */}
      <header className="relative pt-8 pb-12 md:pt-12 md:pb-16 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <Reveal className="relative z-10 max-w-[900px] text-center px-6 md:px-margin-mobile">
          <span className="font-body text-label-caps tracking-[0.2em] uppercase text-primary mb-stack-sm block">
            Tuyển chọn tinh tế
          </span>
          <h1 className="font-display text-display-md md:text-display-lg text-on-surface mb-stack-sm leading-tight">
            Chọn <span className="shimmer-text italic">Khung Ảnh</span>
          </h1>
          <p className="font-body text-body-xl text-on-surface-variant max-w-[600px] mx-auto">
            Biến mỗi bức ảnh thành kỷ niệm đẹp. Duyệt bộ sưu tập khung dành cho Photobooth — dùng ngay hoặc đóng góp khung mới.
          </p>
          <Link
            href="/frames/contribute"
            className="inline-flex items-center gap-2 mt-8 primary-glow-button text-white px-8 py-3 rounded-full font-semibold"
          >
            <Plus className="w-4 h-4" />
            Đóng góp khung
          </Link>
        </Reveal>
      </header>

      {/* Sticky filters */}
      {framers.length > 0 && (
        <div className="sticky top-[70px] z-40 py-4 bg-surface/40 backdrop-blur-md border-b border-outline-variant/20">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
                {LAYOUT_FILTERS.map((opt) => (
                  <button
                    key={opt.value || "all"}
                    type="button"
                    onClick={() => setFilterLayout(opt.value)}
                    className={`category-pill whitespace-nowrap px-8 py-3 rounded-full font-body text-label-caps tracking-widest uppercase border border-outline-variant/30 ${
                      filterLayout === opt.value
                        ? "active"
                        : "bg-white/60 backdrop-blur-sm hover:border-primary/50"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <span className="text-sm text-on-surface-variant shrink-0">
                {filtered.length} / {framers.length} khung
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      <main className="max-w-container-max mx-auto px-6 md:px-margin-desktop py-stack-lg">
        {error && (
          <div className="mb-8 rounded-[24px] bg-error-container/30 border border-error/20 p-4 text-error text-sm">
            {error}
          </div>
        )}

        {framers.length === 0 && !error ? (
          <Reveal>
            <div className="frames-glass-card rounded-[32px] p-16 text-center">
              <p className="font-display text-headline-lg-mobile text-on-surface mb-4">
                Chưa có khung nào
              </p>
              <p className="text-on-surface-variant mb-8 max-w-md mx-auto">
                Hãy là người đầu tiên đóng góp khung ảnh cho cộng đồng Photobooth.
              </p>
              <Link
                href="/frames/contribute"
                className="inline-flex items-center gap-2 primary-glow-button text-white px-8 py-3 rounded-full font-semibold"
              >
                <Plus className="w-4 h-4" />
                Đóng góp khung đầu tiên
              </Link>
            </div>
          </Reveal>
        ) : filtered.length === 0 ? (
          <Reveal>
            <div className="frames-glass-card rounded-[32px] p-12 text-center">
              <p className="text-on-surface-variant">Không có khung nào với layout đã chọn.</p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {filtered.map((frame) => (
              <FrameCard key={frame.id} frame={frame} />
            ))}
          </div>
        )}
      </main>

      {/* AI Recommendation */}
      {recommended && (
        <section className="max-w-container-max mx-auto px-6 md:px-margin-desktop py-stack-lg border-t border-outline-variant/20">
          <Reveal>
            <div className="frames-glass-card rounded-[48px] p-8 md:p-12 overflow-hidden relative flex flex-col md:flex-row gap-gutter items-center">
              <div className="w-full md:w-1/2 relative z-10">
                <span className="font-body text-label-caps text-primary tracking-widest mb-4 block uppercase">
                  Gợi ý cho bạn
                </span>
                <h2 className="font-display text-headline-lg md:text-display-md text-on-surface mb-stack-sm leading-[1.1]">
                  Khung phù hợp
                  <br />
                  <span className="italic font-normal">với phong cách của bạn</span>
                </h2>
                <p className="font-body text-body-md text-on-surface-variant mb-8 max-w-[400px]">
                  Thử khung &ldquo;{recommended.name}&rdquo; — layout{" "}
                  {LAYOUT_CONFIGS[recommended.layoutType as LayoutType]?.name ?? recommended.layoutType}{" "}
                  với {LAYOUT_CONFIGS[recommended.layoutType as LayoutType]?.totalSlots ?? "?"} ô ảnh.
                </p>
                <Link
                  href="/photobooth"
                  className="inline-flex items-center gap-2 primary-glow-button text-white px-10 py-4 rounded-full font-bold"
                >
                  Dùng thử ngay
                  <Sparkles className="w-5 h-5" />
                </Link>
              </div>
              <div className="w-full md:w-1/2 relative z-10 flex justify-center">
                <div className="relative w-full max-w-[400px] aspect-[3/4] frames-glass-card rounded-[40px] p-4 rotate-3 hover:rotate-0 transition-all duration-700 group">
                  <img
                    className="w-full h-full object-contain rounded-[32px] group-hover:scale-105 transition-transform p-2"
                    alt={recommended.name}
                    src={recommended.imageUrl || RECOMMENDED_IMAGE}
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] flex items-end p-8">
                    <span className="text-white font-display text-2xl">{recommended.name}</span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {/* Contribute CTA */}
      <section className="bg-on-background py-stack-lg text-center relative overflow-hidden">
        <Reveal>
          <div className="relative z-10 max-w-[700px] mx-auto px-6 md:px-margin-mobile">
            <h2 className="font-display text-headline-lg md:text-display-md text-inverse-on-surface mb-stack-sm">
              Chưa tìm thấy khung ưng ý?
            </h2>
            <p className="font-body text-body-xl text-inverse-on-surface/70 mb-stack-md">
              Đóng góp khung của bạn — admin sẽ duyệt trước khi xuất hiện trong thư viện.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/frames/contribute"
                className="inline-flex items-center gap-2 primary-glow-button text-white px-10 py-4 rounded-full font-bold whitespace-nowrap"
              >
                <Wand2 className="w-5 h-5" />
                Đóng góp khung mới
              </Link>
              <Link
                href="/photobooth"
                className="border border-white/40 text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-colors"
              >
                Vào chụp ảnh
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
