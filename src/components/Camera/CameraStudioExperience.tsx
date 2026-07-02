"use client";

import CameraView from "@/components/Camera/CameraView";
import FilterList from "@/components/Filters/FilterList";
import LayoutPreviewCompact from "@/components/Layouts/LayoutPreviewCompact";
import type { LayoutState } from "@/types/layout";
import type { FilterType } from "@/types/photo";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  FlipHorizontal2,
  LayoutGrid,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useMemo } from "react";

type CaptureMode = "manual" | "auto";

interface CaptureSettings {
  mode: CaptureMode;
  countdown: number;
}

interface CameraStudioExperienceProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  cameraError: string | null;
  hasPermission: boolean | null;
  onStartCamera: () => void;
  mirror: boolean;
  onToggleMirror: () => void;
  onSwitchCamera: () => void;
  selectedFilter: FilterType;
  onFilterSelect: (filter: FilterType) => void;
  countdown: number | null;
  flashActive: boolean;
  onCapture: () => void;
  captureDisabled: boolean;
  captureSettings: CaptureSettings;
  onBack: () => void;
  onStartAutoCapture?: () => void;
  photoMode: "single" | "layout";
  layoutState: LayoutState | null;
  onSlotClick?: (slotIndex: number) => void;
}

const PARTICLES = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: 1 + Math.random() * 2.5,
  left: Math.random() * 100,
  top: Math.random() * 100,
  delay: Math.random() * 20,
  duration: 15 + Math.random() * 15,
}));

export default function CameraStudioExperience({
  videoRef,
  isStreaming,
  cameraError,
  hasPermission,
  onStartCamera,
  mirror,
  onToggleMirror,
  onSwitchCamera,
  selectedFilter,
  onFilterSelect,
  countdown,
  flashActive,
  onCapture,
  captureDisabled,
  captureSettings,
  onBack,
  onStartAutoCapture,
  photoMode,
  layoutState,
  onSlotClick,
}: CameraStudioExperienceProps) {
  const layoutLabel = useMemo(() => {
    if (!layoutState) return null;
    const captured = layoutState.slots.filter((s) => s.captured).length;
    return {
      name: layoutState.config.name,
      progress: `${captured}/${layoutState.config.totalSlots}`,
    };
  }, [layoutState]);

  return (
    <div className="relative min-h-[calc(100vh-88px)] -mx-2 sm:-mx-4 bg-[#0c0a0f] text-[#fef7ff] overflow-hidden rounded-2xl">
      {/* Ambient background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden rounded-2xl">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="studio-particle"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
            }}
          />
        ))}
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/25 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary/15 blur-[100px] rounded-full" />
      </div>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-4 md:px-8 py-4 border-b border-white/10 bg-[#121016]/80 backdrop-blur-xl">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Chọn layout</span>
        </button>
        <div className="font-display text-lg md:text-xl tracking-tight">
          Photobooth <span className="text-primary">Studio</span>
        </div>
        {layoutLabel ? (
          <div className="text-right text-xs md:text-sm">
            <div className="font-semibold">{layoutLabel.name}</div>
            <div className="text-on-surface-variant">{layoutLabel.progress} ảnh</div>
          </div>
        ) : (
          <div className="text-right text-xs text-on-surface-variant">Chế độ đơn</div>
        )}
      </div>

      {/* Main grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 px-4 md:px-8 py-4 md:py-6 pb-36">
        {/* Photo strip — layout mode only */}
        {photoMode === "layout" && layoutState && (
          <aside className="lg:col-span-2 order-2 lg:order-1 flex flex-col max-h-[40vh] lg:max-h-[70vh]">
            <div className="font-body text-label-caps tracking-widest text-on-surface-variant mb-3 uppercase text-xs">
              Dải ảnh
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
              <LayoutPreviewCompact
                variant="studio"
                layoutState={layoutState}
                onSlotClick={onSlotClick}
              />
            </div>
          </aside>
        )}

        {/* Camera center */}
        <section
          className={`flex flex-col items-center justify-center ${
            photoMode === "layout" && layoutState ? "lg:col-span-8" : "lg:col-span-10 lg:col-start-2"
          } order-1 lg:order-2`}
        >
          {!isStreaming && !cameraError && (
            <div className="studio-glass rounded-3xl p-10 text-center w-full max-w-lg">
              <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-on-surface-variant mb-4">Đang khởi động camera...</p>
              {hasPermission === false && (
                <button
                  type="button"
                  onClick={onStartCamera}
                  className="primary-glow-button text-white px-6 py-3 rounded-full font-semibold text-sm"
                >
                  Cho phép Camera
                </button>
              )}
            </div>
          )}

          {cameraError && (
            <div className="studio-glass rounded-3xl p-8 text-center w-full max-w-lg border border-error/30">
              <p className="text-error font-semibold mb-2">Lỗi Camera</p>
              <p className="text-sm text-on-surface-variant mb-4">{cameraError}</p>
              <button
                type="button"
                onClick={onStartCamera}
                className="px-6 py-3 rounded-full border border-outline-variant hover:bg-white/5 transition-colors"
              >
                Thử lại
              </button>
            </div>
          )}

          {isStreaming && (
            <>
              <div className="relative w-full aspect-video max-h-[50vh] lg:max-h-[60vh] studio-glass rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl">
                <div className="absolute inset-0">
                  <CameraView
                    videoRef={videoRef}
                    isStreaming={isStreaming}
                    mirror={mirror}
                    onRestartCamera={onStartCamera}
                    filter={selectedFilter}
                    className="rounded-none"
                  />
                </div>

                {flashActive && (
                  <motion.div
                    className="absolute inset-0 bg-white z-30 pointer-events-none"
                    initial={{ opacity: 0.9 }}
                    animate={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  />
                )}

                {countdown !== null && countdown > 0 && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 pointer-events-none">
                    <motion.span
                      key={countdown}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="font-display text-[120px] md:text-[200px] text-white countdown-text"
                    >
                      {countdown}
                    </motion.span>
                  </div>
                )}

                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="font-body text-[10px] tracking-widest uppercase">Live</span>
                </div>

                <div className="absolute top-4 right-4 z-20 text-white/40">
                  <LayoutGrid className="w-5 h-5" />
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:gap-6 studio-glass px-6 py-3 rounded-full border border-white/10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-body text-[11px] tracking-widest uppercase">Sẵn sàng</span>
                </div>
                <div className="w-px h-4 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-secondary-container" />
                  <span className="font-body text-[11px] tracking-widest uppercase">
                    {captureSettings.mode === "auto"
                      ? `${captureSettings.countdown}s tự động`
                      : "Chụp thủ công"}
                  </span>
                </div>
                <div className="w-px h-4 bg-white/10 hidden sm:block" />
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-on-surface-variant" />
                  <span className="font-body text-[11px] tracking-widest uppercase">Photobooth</span>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Filters rail */}
        {isStreaming && (
          <aside className="lg:col-span-2 order-3 flex flex-col max-h-[30vh] lg:max-h-[70vh]">
            <div className="font-body text-label-caps tracking-widest text-on-surface-variant mb-3 uppercase text-xs text-right">
              Bộ lọc
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar">
              <FilterList
                variant="studio"
                selectedFilter={selectedFilter}
                onFilterSelect={onFilterSelect}
              />
            </div>
          </aside>
        )}
      </div>

      {/* Bottom controls */}
      {isStreaming && (
        <footer className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-50 px-2 w-full max-w-xl md:max-w-none md:w-auto">
          <div className="studio-glass mx-auto px-6 md:px-10 py-4 md:py-5 rounded-full flex items-center justify-center gap-6 md:gap-12 border border-white/10 shadow-2xl bg-[#221f28]/95">
            <button
              type="button"
              onClick={onSwitchCamera}
              className="p-3 rounded-full text-on-surface-variant hover:text-white hover:bg-white/5 transition-all"
              aria-label="Đổi camera"
            >
              <FlipHorizontal2 className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <button
              type="button"
              onClick={onStartAutoCapture}
              className={`p-3 rounded-full transition-all ${
                captureSettings.mode === "auto"
                  ? "text-primary bg-primary/20"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              }`}
              aria-label="Hẹn giờ"
            >
              <Timer className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <button
              type="button"
              onClick={onCapture}
              disabled={captureDisabled}
              className="relative group disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Chụp ảnh"
            >
              <div className="absolute -inset-3 bg-primary/20 blur-xl rounded-full group-hover:bg-primary/40 transition-all" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center capture-button-ring group-active:scale-90 transition-transform">
                <div className="w-12 h-12 md:w-16 md:h-16 border-2 border-[#0c0a0f] rounded-full" />
              </div>
            </button>

            <button
              type="button"
              onClick={onToggleMirror}
              className={`p-3 rounded-full transition-all ${
                mirror
                  ? "text-primary bg-primary/20"
                  : "text-on-surface-variant hover:text-white hover:bg-white/5"
              }`}
              aria-label="Gương"
            >
              <FlipHorizontal2 className="w-6 h-6 md:w-7 md:h-7 rotate-90" />
            </button>

            <button
              type="button"
              onClick={onBack}
              className="p-3 rounded-full text-on-surface-variant hover:text-white hover:bg-white/5 transition-all"
              aria-label="Cài đặt"
            >
              <LayoutGrid className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
