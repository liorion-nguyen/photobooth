export type LayoutType = 
  | "single"      // 1 ảnh
  | "vertical-4"  // 4 ảnh dọc (1x4)
  | "horizontal-4" // 4 ảnh ngang (4x1)
  | "grid-2x2"    // 2x2 grid
  | "grid-3x3"    // 3x3 grid
  | "top-bottom"  // 2 ảnh (1 trên, 1 dưới)
  | "left-right"; // 2 ảnh (1 trái, 1 phải)

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
