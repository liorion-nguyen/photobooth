"use client";

import type { LayoutType } from "@/types/layout";
import LayoutCarousel from "./LayoutCarousel";

interface LayoutSelectorProps {
  selectedLayout: LayoutType | null;
  onSelect: (layout: LayoutType) => void;
}

export default function LayoutSelector({
  selectedLayout,
  onSelect,
}: LayoutSelectorProps) {
  return <LayoutCarousel selectedLayout={selectedLayout} onSelect={onSelect} />;
}
