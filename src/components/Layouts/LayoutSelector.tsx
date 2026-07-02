"use client";

import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { Clock, Search, Settings, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import LayoutCard from "./LayoutCard";
import LayoutCarousel from "./LayoutCarousel";
import LayoutPreviewModal from "./LayoutPreviewModal";

type CaptureMode = "manual" | "auto";

interface CaptureSettings {
  mode: CaptureMode;
  countdown: number;
}

interface LayoutSelectorProps {
  selectedLayout: LayoutType | null;
  onSelect: (layout: LayoutType, settings?: CaptureSettings) => void;
}

const FEATURED_LAYOUT: LayoutType = "2x2";

export default function LayoutSelector({
  selectedLayout,
  onSelect,
}: LayoutSelectorProps) {
  const layouts = Object.values(LAYOUT_CONFIGS);
  const [showSettings, setShowSettings] = useState(false);
  const [captureMode, setCaptureMode] = useState<CaptureMode>("auto");
  const [countdown, setCountdown] = useState(3);
  const [filter, setFilter] = useState<LayoutType | "all">("all");
  const [search, setSearch] = useState("");
  const [previewLayout, setPreviewLayout] = useState<LayoutType | null>(null);

  const filteredLayouts = useMemo(() => {
    return layouts.filter((layout) => {
      const matchesFilter = filter === "all" || layout.type === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        layout.name.toLowerCase().includes(q) ||
        layout.description.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [layouts, filter, search]);

  const confirmSelect = (layoutType: LayoutType) => {
    setPreviewLayout(null);
    if (showSettings) {
      onSelect(layoutType, { mode: captureMode, countdown });
    } else {
      onSelect(layoutType);
    }
  };

  const filterPills: { value: LayoutType | "all"; label: string }[] = [
    { value: "all", label: "Tất cả" },
    { value: "1x4", label: "1×4" },
    { value: "2x3", label: "2×3" },
    { value: "2x2", label: "2×2" },
  ];

  return (
    <div className="flex flex-col min-h-0">
      {/* Hero */}
      <header className="relative py-8 md:py-12 text-center overflow-hidden flex-shrink-0">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-tertiary/10 rounded-full blur-[80px]" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-3">
          <span className="font-body text-label-caps tracking-[0.2em] uppercase text-primary block">
            Bước 1
          </span>
          <h2 className="font-display text-headline-lg-mobile md:text-display-md text-on-surface leading-tight">
            Chọn <span className="shimmer-text italic">Layout</span> ảnh
          </h2>
          <p className="font-body text-body-md md:text-body-xl text-on-surface-variant max-w-xl mx-auto">
            Mỗi kỷ niệm xứng đáng một cách kể chuyện khác nhau.
          </p>
        </div>
      </header>

      {/* Toolbar */}
      <div className="sticky top-[88px] z-30 py-4 bg-surface/60 backdrop-blur-md border-b border-outline-variant/20 flex-shrink-0">
        <div className="max-w-container-max mx-auto px-4 md:px-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {filterPills.map((pill) => (
              <button
                key={pill.value}
                type="button"
                onClick={() => setFilter(pill.value)}
                className={`category-pill whitespace-nowrap px-5 py-2.5 rounded-full font-body text-label-caps uppercase tracking-widest border border-outline-variant/30 ${
                  filter === pill.value
                    ? "active"
                    : "bg-surface-container hover:bg-surface-container-high text-on-surface-variant"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-56">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Tìm layout..."
                className="w-full pl-11 pr-4 py-2.5 rounded-full bg-surface-container border-none focus:ring-2 focus:ring-primary/20 text-sm text-on-surface"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowSettings(!showSettings)}
              className={`shrink-0 p-2.5 rounded-full border transition-colors ${
                showSettings
                  ? "bg-primary text-white border-primary"
                  : "bg-surface-container border-outline-variant text-on-surface-variant hover:text-primary"
              }`}
              aria-label="Cài đặt chụp"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Settings */}
      {showSettings && (
        <div className="max-w-container-max mx-auto px-4 md:px-6 py-4 flex-shrink-0">
          <div className="glass-card rounded-3xl p-5 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-5 h-5 text-primary" />
              <h4 className="font-display text-lg text-on-surface">Cài đặt chụp ảnh</h4>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-2">
                {(["manual", "auto"] as CaptureMode[]).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setCaptureMode(mode)}
                    className={`flex-1 py-3 rounded-2xl font-medium text-sm transition-all ${
                      captureMode === mode
                        ? "bg-primary text-white shadow-md"
                        : "bg-surface-container text-on-surface-variant hover:bg-surface-container-high"
                    }`}
                  >
                    {mode === "manual" ? "Nhấn chụp" : "Tự động"}
                  </button>
                ))}
              </div>
              {captureMode === "auto" && (
                <div className="flex items-center gap-4 bg-surface-container rounded-2xl px-4 py-3">
                  <Clock className="w-4 h-4 text-primary shrink-0" />
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={countdown}
                    onChange={(e) => setCountdown(Number(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-sm font-bold text-primary w-8">{countdown}s</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Gallery */}
      <div className="flex-1 min-h-0 overflow-y-auto py-6 md:py-8">
        <div className="max-w-container-max mx-auto px-4 md:px-6">
          {/* Mobile carousel */}
          <div className="block md:hidden min-h-[420px]">
            <LayoutCarousel
              selectedLayout={selectedLayout}
              onSelect={(layout) => setPreviewLayout(layout)}
              layouts={filteredLayouts}
            />
          </div>

          {/* Desktop masonry */}
          <div className="hidden md:block">
            {filteredLayouts.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center text-on-surface-variant">
                Không tìm thấy layout phù hợp.
              </div>
            ) : (
              <div className="layout-masonry">
                {filteredLayouts.map((layout) => (
                  <div key={layout.type} className="layout-masonry-item">
                    <LayoutCard
                      layout={layout}
                      isSelected={selectedLayout === layout.type}
                      featured={layout.type === FEATURED_LAYOUT}
                      onClick={() => setPreviewLayout(layout.type)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <LayoutPreviewModal
        layoutType={previewLayout}
        onClose={() => setPreviewLayout(null)}
        onConfirm={confirmSelect}
      />
    </div>
  );
}
