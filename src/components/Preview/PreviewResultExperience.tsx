"use client";

import { applyFilterToImage } from "@/components/Filters/applyFilter";
import FrameSelector, { type FrameType } from "@/components/Frames/FrameSelector";
import FramedLayoutPreview from "@/components/Layouts/FramedLayoutPreview";
import type { LayoutState } from "@/types/layout";
import type { FilterType, UploadProgress } from "@/types/photo";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  Download,
  Instagram,
  Music2,
  Printer,
  QrCode,
  Sparkles,
  Sun,
  Wand2,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type PreviewMode = "single" | "layout";

interface PreviewResultExperienceProps {
  mode: PreviewMode;
  onBack: () => void;
  onSave: () => void;
  onShare: () => void;
  onRetake: () => void;
  uploadProgress: UploadProgress | null;
  uploadedPhotoId: string | null;
  isSaving: boolean;
  // Single mode
  imageUrl?: string;
  selectedFilter?: FilterType;
  onFilterSelect?: (filter: FilterType) => void;
  // Layout mode
  layoutState?: LayoutState | null;
  selectedFrame?: FrameType;
  onFrameSelect?: (frame: FrameType) => void;
  onSlotClick?: (slotIndex: number) => void;
}

const FEATURED_FILTERS: {
  value: FilterType;
  label: string;
  description: string;
  icon: typeof Sun;
  accent: "primary" | "secondary" | "tertiary";
  shimmer?: boolean;
}[] = [
  {
    value: "beauty",
    label: "Ánh sáng studio",
    description: "Hiệu ứng soft-box mềm mại",
    icon: Sun,
    accent: "primary",
  },
  {
    value: "sepia",
    label: "Hạt phim",
    description: "Kết cấu phim 35mm chân thực",
    icon: Sparkles,
    accent: "secondary",
  },
  {
    value: "vibrant",
    label: "Màu sống động",
    description: "Tăng cường màu sắc bằng AI",
    icon: Wand2,
    accent: "tertiary",
    shimmer: true,
  },
];

const ACCENT_STYLES = {
  primary: {
    iconBg: "bg-primary-container/20 text-primary",
    chevron: "text-primary",
  },
  secondary: {
    iconBg: "bg-secondary-container/20 text-secondary",
    chevron: "text-secondary",
  },
  tertiary: {
    iconBg: "bg-tertiary-container/20 text-tertiary",
    chevron: "text-tertiary",
  },
};

function PhotoStrip3D({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const container = containerRef.current;
    const strip = stripRef.current;
    if (!container || !strip) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 25;
    const rotateY = (centerX - x) / 25;

    strip.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.style.transform = "rotateY(-8deg) rotateX(2deg) rotateZ(-1deg)";
  }, []);

  return (
    <div
      ref={containerRef}
      className="perspective-container flex justify-center lg:justify-start w-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={stripRef}
        className="photo-strip-3d relative w-full max-w-[420px] preview-glass-panel p-4 shadow-2xl"
      >
        <div className="bg-white p-4 shadow-inner rounded-2xl">{children}</div>
        <div className="absolute inset-0 rounded-[32px] pointer-events-none preview-glass-inner-border" />
      </div>
    </div>
  );
}

function SinglePreviewImage({
  imageUrl,
  filter,
}: {
  imageUrl: string;
  filter: FilterType;
}) {
  const [displayUrl, setDisplayUrl] = useState(imageUrl);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (filter === "none") {
      setDisplayUrl(imageUrl);
      return;
    }

    setIsProcessing(true);
    applyFilterToImage(imageUrl, filter)
      .then(setDisplayUrl)
      .catch(() => setDisplayUrl(imageUrl))
      .finally(() => setIsProcessing(false));
  }, [imageUrl, filter]);

  if (isProcessing) {
    return (
      <div className="w-full aspect-[3/4] flex items-center justify-center bg-surface-container-low rounded-sm">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-on-surface-variant">Đang áp dụng bộ lọc...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.img
      src={displayUrl}
      alt="Ảnh chụp"
      className="w-full h-auto aspect-[3/4] object-cover rounded-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    />
  );
}

export default function PreviewResultExperience({
  mode,
  onBack,
  onSave,
  onShare,
  onRetake,
  uploadProgress,
  uploadedPhotoId,
  isSaving,
  imageUrl,
  selectedFilter = "none",
  onFilterSelect,
  layoutState,
  selectedFrame = "none",
  onFrameSelect,
  onSlotClick,
}: PreviewResultExperienceProps) {
  const sessionLabel = useMemo(() => {
    const num = String(Date.now()).slice(-4);
    return `Photobooth N°${num}`;
  }, []);

  const year = new Date().getFullYear();

  const handlePrint = () => {
    window.print();
  };

  const handleShareClick = () => {
    if (uploadedPhotoId) {
      onShare();
    } else {
      onSave();
    }
  };

  const isProcessingFilter =
    mode === "single" && selectedFilter !== "none" && !imageUrl;

  return (
    <div className="relative -mx-2 sm:-mx-4 min-h-[calc(100vh-88px)]">
      <div className="absolute inset-0 -z-10 bg-surface rounded-2xl overflow-hidden">
        <div className="preview-noise-overlay absolute inset-0" />
      </div>

      <div className="relative max-w-container-max mx-auto px-4 md:px-margin-desktop py-6 md:py-10 pb-stack-lg">
        {/* Header */}
        <header className="mb-8 md:mb-stack-md">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
          <h1 className="font-display text-3xl md:text-5xl lg:text-display-lg text-on-surface mb-2 text-balance">
            Tác phẩm của bạn đã sẵn sàng
          </h1>
          <p className="font-body text-body-md md:text-body-xl text-on-surface-variant opacity-80 max-w-2xl">
            Tinh chỉnh bởi AI, được bạn chọn lọc. Một kỷ niệm kỹ thuật số của khoảnh khắc này.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-gutter items-start">
          {/* Preview left */}
          <div className="lg:col-span-7">
            <PhotoStrip3D>
              {mode === "single" && imageUrl ? (
                <>
                  <SinglePreviewImage imageUrl={imageUrl} filter={selectedFilter} />
                  <div className="mt-4 flex justify-between items-center px-2">
                    <span className="font-body text-label-caps text-on-surface-variant tracking-[0.2em] uppercase">
                      {sessionLabel}
                    </span>
                    <span className="font-body text-label-caps text-on-surface-variant opacity-40">
                      {year}
                    </span>
                  </div>
                </>
              ) : mode === "layout" && layoutState ? (
                <>
                  <div
                    className={onSlotClick ? "cursor-pointer" : ""}
                    onClick={() => onSlotClick?.(0)}
                  >
                    <FramedLayoutPreview
                      layoutState={layoutState}
                      frameType={selectedFrame}
                      onSlotClick={onSlotClick}
                    />
                  </div>
                  <div className="mt-4 flex justify-between items-center px-2">
                    <span className="font-body text-label-caps text-on-surface-variant tracking-[0.2em] uppercase">
                      {layoutState.config.name} · {sessionLabel}
                    </span>
                    <span className="font-body text-label-caps text-on-surface-variant opacity-40">
                      {year}
                    </span>
                  </div>
                  <p className="text-xs text-on-surface-variant text-center mt-2 opacity-70">
                    Nhấn vào ảnh để chụp lại từng ô
                  </p>
                </>
              ) : null}
            </PhotoStrip3D>
          </div>

          {/* Controls right */}
          <div className="lg:col-span-5 space-y-6 md:space-y-gutter">
            {/* Enhancements / Frames */}
            <section className="preview-glass-panel p-6 md:p-8 space-y-4">
              <h3 className="font-body text-label-caps text-on-surface-variant tracking-widest uppercase">
                {mode === "single" ? "Tinh chỉnh AI" : "Khung ảnh"}
              </h3>

              {mode === "single" && onFilterSelect && (
                <div className="space-y-3">
                  {FEATURED_FILTERS.map((item) => {
                    const Icon = item.icon;
                    const styles = ACCENT_STYLES[item.accent];
                    const isActive = selectedFilter === item.value;
                    return (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => onFilterSelect(item.value)}
                        className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group relative overflow-hidden ${
                          isActive
                            ? "bg-primary/10 border border-primary/30"
                            : "bg-surface-container-low/50 hover:bg-surface-container border border-transparent"
                        }`}
                      >
                        {item.shimmer && (
                          <div className="preview-shimmer absolute inset-0 opacity-40 pointer-events-none" />
                        )}
                        <div className="relative flex items-center gap-4">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${styles.iconBg}`}
                          >
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="text-left">
                            <p className="font-body text-body-md font-semibold text-on-surface">
                              {item.label}
                            </p>
                            <p className="text-xs text-on-surface-variant opacity-70">
                              {item.description}
                            </p>
                          </div>
                        </div>
                        <ChevronRight
                          className={`relative w-5 h-5 ${styles.chevron} group-hover:translate-x-1 transition-transform`}
                        />
                      </button>
                    );
                  })}
                  <button
                    type="button"
                    onClick={() => onFilterSelect("none")}
                    className={`w-full text-left px-4 py-2 text-sm rounded-xl transition-colors ${
                      selectedFilter === "none"
                        ? "text-primary font-semibold"
                        : "text-on-surface-variant hover:text-primary"
                    }`}
                  >
                    Không bộ lọc (ảnh gốc)
                  </button>
                </div>
              )}

              {mode === "layout" && layoutState && onFrameSelect && (
                <FrameSelector
                  selectedFrame={selectedFrame}
                  onSelect={onFrameSelect}
                  currentLayout={layoutState.config.type}
                />
              )}
            </section>

            {/* Upload progress */}
            {uploadProgress && (
              <section className="preview-glass-panel p-6">
                <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full primary-gradient rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress.percentage}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-center text-sm text-on-surface-variant mt-3">
                  Đang lưu: {uploadProgress.percentage}%
                </p>
              </section>
            )}

            {/* Actions */}
            <section className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={onSave}
                disabled={isSaving || isProcessingFilter}
                className="col-span-2 py-5 px-8 rounded-full primary-glow-button text-white font-body font-bold flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <Download className="w-5 h-5" />
                {isSaving ? "Đang lưu..." : "Tải ảnh chất lượng cao"}
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="py-4 px-6 rounded-3xl bg-white border border-outline-variant hover:bg-surface-container-low text-on-surface font-body font-medium transition-all flex flex-col items-center gap-2"
              >
                <Printer className="w-5 h-5 text-primary" />
                <span className="text-sm">In ảnh</span>
              </button>

              <button
                type="button"
                onClick={handleShareClick}
                disabled={isSaving}
                className="py-4 px-6 rounded-3xl bg-white border border-outline-variant hover:bg-surface-container-low text-on-surface font-body font-medium transition-all flex flex-col items-center gap-2 disabled:opacity-50"
              >
                <QrCode className="w-5 h-5 text-primary" />
                <span className="text-sm">
                  {uploadedPhotoId ? "Chia sẻ QR" : "Lưu & chia sẻ"}
                </span>
              </button>

              <button
                type="button"
                onClick={onRetake}
                disabled={isSaving}
                className="col-span-2 py-3 text-sm text-on-surface-variant hover:text-primary transition-colors disabled:opacity-50"
              >
                {mode === "layout" ? "Chụp lại từ đầu" : "Chụp lại ảnh"}
              </button>
            </section>

            {/* Social sync */}
            {uploadedPhotoId && (
              <section className="preview-glass-panel p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-body text-label-caps text-on-surface-variant tracking-widest uppercase">
                    Chia sẻ mạng xã hội
                  </h3>
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onShare}
                    className="flex-1 flex items-center gap-3 p-3 bg-surface-container-low hover:bg-white rounded-2xl border border-outline-variant/30 transition-all"
                  >
                    <Instagram className="w-5 h-5 text-on-surface" />
                    <span className="font-body text-on-surface text-sm">Instagram</span>
                  </button>
                  <button
                    type="button"
                    onClick={onShare}
                    className="flex-1 flex items-center gap-3 p-3 bg-surface-container-low hover:bg-white rounded-2xl border border-outline-variant/30 transition-all"
                  >
                    <Music2 className="w-5 h-5 text-on-surface" />
                    <span className="font-body text-on-surface text-sm">TikTok</span>
                  </button>
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
