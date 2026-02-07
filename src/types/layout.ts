/** Layout: 1x4 (strip dọc), 2x3, 2x2. (1x3 đã gộp vào 1x4) */
export type LayoutType = "1x4" | "2x3" | "2x2";

export interface LayoutConfig {
  type: LayoutType;
  name: string;
  rows: number;
  cols: number;
  totalSlots: number;
  description: string;
}

export interface LayoutSlot {
  id: number;
  row: number;
  col: number;
  image: string | null; // dataUrl
  captured: boolean;
}

export interface LayoutState {
  type: LayoutType;
  config: LayoutConfig;
  slots: LayoutSlot[];
  currentSlotIndex: number;
  isComplete: boolean;
}
