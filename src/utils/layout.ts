import type { LayoutType, LayoutConfig, LayoutSlot, LayoutState } from "@/types/layout";

/** Quy ước: 1x4 = 4 ô xếp dọc (1 cột 4 hàng). 2x2, 2x3 = hàng × cột. */
export const LAYOUT_CONFIGS: Record<LayoutType, LayoutConfig> = {
  "1x4": {
    type: "1x4",
    name: "1×4",
    rows: 4,
    cols: 1,
    totalSlots: 4,
    description: "4 ô xếp dọc (1 cột 4 hàng)",
  },
  "2x3": {
    type: "2x3",
    name: "2×3",
    rows: 3,
    cols: 2,
    totalSlots: 6,
    description: "2 cột dọc, mỗi cột 3 ô (lưới 3×2)",
  },
  "2x2": {
    type: "2x2",
    name: "2×2",
    rows: 2,
    cols: 2,
    totalSlots: 4,
    description: "2 hàng 2 ô (lưới 2×2)",
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
