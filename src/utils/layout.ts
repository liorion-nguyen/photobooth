import type { LayoutType, LayoutConfig, LayoutSlot, LayoutState } from "@/types/layout";

export const LAYOUT_CONFIGS: Record<LayoutType, LayoutConfig> = {
  single: {
    type: "single",
    name: "1 Ảnh",
    rows: 1,
    cols: 1,
    totalSlots: 1,
    description: "Chụp 1 ảnh duy nhất",
  },
  "vertical-4": {
    type: "vertical-4",
    name: "4 Ảnh Dọc",
    rows: 4,
    cols: 1,
    totalSlots: 4,
    description: "4 ảnh xếp dọc",
  },
  "horizontal-4": {
    type: "horizontal-4",
    name: "4 Ảnh Ngang",
    rows: 1,
    cols: 4,
    totalSlots: 4,
    description: "4 ảnh xếp ngang",
  },
  "grid-2x2": {
    type: "grid-2x2",
    name: "Lưới 2x2",
    rows: 2,
    cols: 2,
    totalSlots: 4,
    description: "4 ảnh lưới 2x2",
  },
  "grid-3x3": {
    type: "grid-3x3",
    name: "Lưới 3x3",
    rows: 3,
    cols: 3,
    totalSlots: 9,
    description: "9 ảnh lưới 3x3",
  },
  "top-bottom": {
    type: "top-bottom",
    name: "Trên - Dưới",
    rows: 2,
    cols: 1,
    totalSlots: 2,
    description: "2 ảnh (1 trên, 1 dưới)",
  },
  "left-right": {
    type: "left-right",
    name: "Trái - Phải",
    rows: 1,
    cols: 2,
    totalSlots: 2,
    description: "2 ảnh (1 trái, 1 phải)",
  },
};

export function createLayoutState(type: LayoutType): LayoutState {
  const config = LAYOUT_CONFIGS[type];
  const slots: LayoutSlot[] = [];

  for (let row = 0; row < config.rows; row++) {
    for (let col = 0; col < config.cols; col++) {
      slots.push({
        id: row * config.cols + col,
        row,
        col,
        image: null,
        captured: false,
      });
    }
  }

  return {
    type,
    config,
    slots,
    currentSlotIndex: 0,
    isComplete: false,
  };
}

export function updateLayoutSlot(
  state: LayoutState,
  slotIndex: number,
  imageDataUrl: string
): LayoutState {
  const newSlots = [...state.slots];
  newSlots[slotIndex] = {
    ...newSlots[slotIndex],
    image: imageDataUrl,
    captured: true,
  };

  const isComplete = newSlots.every((slot) => slot.captured);
  const nextSlotIndex = isComplete
    ? state.currentSlotIndex
    : Math.min(state.currentSlotIndex + 1, newSlots.length - 1);

  return {
    ...state,
    slots: newSlots,
    currentSlotIndex: nextSlotIndex,
    isComplete,
  };
}

export function resetLayoutState(state: LayoutState): LayoutState {
  return createLayoutState(state.type);
}

export function getCurrentSlot(state: LayoutState): LayoutSlot | null {
  return state.slots[state.currentSlotIndex] || null;
}

export function getProgress(state: LayoutState): number {
  const capturedCount = state.slots.filter((s) => s.captured).length;
  return Math.round((capturedCount / state.config.totalSlots) * 100);
}
