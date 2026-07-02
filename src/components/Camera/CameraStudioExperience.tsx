"use client";

import CameraView from "@/components/Camera/CameraView";
import FilterList from "@/components/Filters/FilterList";
import LayoutCameraStrip, {
  getLayoutStripSidebarClass,
} from "@/components/Layouts/LayoutCameraStrip";
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
    <div className="fixed inset-0 z-50 bg-[#0c0a0f] text-[#fef7ff] overflow-hidden">
      {/* Ambient particles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
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
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-tertiary/10 blur-[100px] rounded-full" />
      </div>

      {/* Fullscreen camera layer */}
      {isStreaming && (
        <div className="absolute inset-0 z-[1]">
          <CameraView
            videoRef={videoRef}
            isStreaming={isStreaming}
            mirror={mirror}
            onRestartCamera={onStartCamera}
            filter={selectedFilter}
            className="rounded-none"
          />

          {flashActive && (
            <motion.div
              className="absolute inset-0 bg-white z-30 pointer-events-none"
              initial={{ opacity: 0.9 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
          )}

          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 pointer-events-none">
              <motion.span
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="font-display text-[140px] sm:text-[200px] md:text-[280px] text-white countdown-text"
              >
                {countdown}
              </motion.span>
            </div>
          )}

          <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="font-body text-[10px] tracking-widest uppercase">Live</span>
          </div>
        </div>
      )}

      {/* Loading / error states (centered overlay) */}
      {!isStreaming && !cameraError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="studio-glass rounded-3xl p-10 text-center max-w-lg">
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
        </div>
      )}

      {cameraError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
          <div className="studio-glass rounded-3xl p-8 text-center max-w-lg border border-error/30">
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
        </div>
      )}

      {/* Top bar overlay */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 md:py-4 bg-gradient-to-b from-[#0c0a0f]/90 via-[#0c0a0f]/60 to-transparent pointer-events-none">
        <button
          type="button"
          onClick={onBack}
          className="pointer-events-auto flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm bg-black/30 backdrop-blur-md px-3 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Chọn layout</span>
        </button>
        <div className="font-display text-base md:text-xl tracking-tight text-white drop-shadow-lg">
          Photobooth <span className="text-primary">Studio</span>
        </div>
        {layoutLabel ? (
          <div className="pointer-events-auto text-right text-xs md:text-sm bg-black/30 backdrop-blur-md px-3 py-2 rounded-full border border-white/10">
            <div className="font-semibold">{layoutLabel.name}</div>
            <div className="text-white/60">{layoutLabel.progress} ảnh</div>
          </div>
        ) : (
          <div className="text-right text-xs text-white/60 bg-black/30 backdrop-blur-md px-3 py-2 rounded-full">
            Chế độ đơn
          </div>
        )}
      </div>

      {/* Left: layout grid preview — panel cao vừa nội dung */}
      {photoMode === "layout" && layoutState && isStreaming && (
        <aside
          className={`absolute left-3 md:left-6 top-20 z-30 flex flex-col items-stretch pointer-events-none ${getLayoutStripSidebarClass(layoutState.config.type)}`}
        >
          <div className="font-body text-label-caps tracking-widest text-white/50 mb-2 uppercase text-[10px]">
            Dải ảnh
          </div>
          <div className="pointer-events-auto studio-glass rounded-2xl p-2.5 border border-white/10 bg-black/40 backdrop-blur-xl w-full h-fit max-h-[min(70vh,calc(100vh-10rem))] overflow-y-auto no-scrollbar">
            <LayoutCameraStrip
              layoutState={layoutState}
              onSlotClick={onSlotClick}
            />
          </div>
        </aside>
      )}

      {/* Right: filters rail */}
      {isStreaming && (
        <aside className="absolute right-3 md:right-6 top-20 bottom-28 z-30 w-[100px] sm:w-[120px] md:w-[140px] flex flex-col pointer-events-none">
          <div className="font-body text-label-caps tracking-widest text-white/50 mb-2 uppercase text-[10px] text-right">
            Bộ lọc
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar pointer-events-auto">
            <FilterList
              variant="studio"
              selectedFilter={selectedFilter}
              onFilterSelect={onFilterSelect}
            />
          </div>
        </aside>
      )}

      {/* Status bar — nằm trên thanh điều khiển, không chồng lấn */}
      {isStreaming && (
        <div className="absolute bottom-[5.75rem] md:bottom-[8.25rem] left-1/2 -translate-x-1/2 z-30 flex flex-wrap items-center justify-center gap-3 md:gap-5 studio-glass px-5 py-2 rounded-full border border-white/10 bg-[#221f28]/80 backdrop-blur-xl pointer-events-none">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-primary" />
            <span className="font-body text-[10px] tracking-widest uppercase">Sẵn sàng</span>
          </div>
          <div className="w-px h-3 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Timer className="w-3.5 h-3.5 text-secondary-container" />
            <span className="font-body text-[10px] tracking-widest uppercase">
              {captureSettings.mode === "auto"
                ? `${captureSettings.countdown}s tự động`
                : "Chụp thủ công"}
            </span>
          </div>
          <div className="w-px h-3 bg-white/10 hidden sm:block" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-on-surface-variant" />
            <span className="font-body text-[10px] tracking-widest uppercase">Photobooth</span>
          </div>
        </div>
      )}

      {/* Bottom controls */}
      {isStreaming && (
        <footer className="absolute bottom-3 md:bottom-6 left-1/2 -translate-x-1/2 z-40 px-2 w-full max-w-xl md:max-w-none md:w-auto">
          <div className="studio-glass mx-auto px-6 md:px-10 py-3 md:py-4 rounded-full flex items-center justify-center gap-5 md:gap-10 border border-white/10 shadow-2xl bg-[#221f28]/95 backdrop-blur-xl">
            <button
              type="button"
              onClick={onSwitchCamera}
              className="p-2.5 rounded-full text-on-surface-variant hover:text-white hover:bg-white/5 transition-all"
              aria-label="Đổi camera"
            >
              <FlipHorizontal2 className="w-6 h-6 md:w-7 md:h-7" />
            </button>

            <button
              type="button"
              onClick={onStartAutoCapture}
              className={`p-2.5 rounded-full transition-all ${
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
              <div className="relative w-14 h-14 md:w-[72px] md:h-[72px] bg-white rounded-full flex items-center justify-center capture-button-ring group-active:scale-90 transition-transform">
                <div className="w-10 h-10 md:w-14 md:h-14 border-2 border-[#0c0a0f] rounded-full" />
              </div>
            </button>

            <button
              type="button"
              onClick={onToggleMirror}
              className={`p-2.5 rounded-full transition-all ${
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
              className="p-2.5 rounded-full text-on-surface-variant hover:text-white hover:bg-white/5 transition-all"
              aria-label="Chọn layout"
            >
              <LayoutGrid className="w-6 h-6 md:w-7 md:h-7" />
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
