"use client";

import { useState, useCallback } from "react";
import type { LayoutType, LayoutState } from "@/types/layout";
import {
  createLayoutState,
  updateLayoutSlot,
  resetLayoutState,
  getCurrentSlot,
  getProgress,
} from "@/utils/layout";

export function useLayout() {
  const [layoutState, setLayoutState] = useState<LayoutState | null>(null);

  const initializeLayout = useCallback((type: LayoutType) => {
    const newState = createLayoutState(type);
    setLayoutState(newState);
    return newState;
  }, []);

  const captureSlot = useCallback((imageDataUrl: string) => {
    if (!layoutState) return;

    const currentSlot = getCurrentSlot(layoutState);
    if (!currentSlot || currentSlot.captured) return;

    const updatedState = updateLayoutSlot(
      layoutState,
      layoutState.currentSlotIndex,
      imageDataUrl
    );
    setLayoutState(updatedState);
    return updatedState;
  }, [layoutState]);

  const resetLayout = useCallback(() => {
    if (!layoutState) return;
    const newState = resetLayoutState(layoutState);
    setLayoutState(newState);
    return newState;
  }, [layoutState]);

  const goToNextSlot = useCallback(() => {
    if (!layoutState || layoutState.isComplete) return;
    
    setLayoutState({
      ...layoutState,
      currentSlotIndex: Math.min(
        layoutState.currentSlotIndex + 1,
        layoutState.slots.length - 1
      ),
    });
  }, [layoutState]);

  const goToPreviousSlot = useCallback(() => {
    if (!layoutState) return;
    
    setLayoutState({
      ...layoutState,
      currentSlotIndex: Math.max(layoutState.currentSlotIndex - 1, 0),
    });
  }, [layoutState]);

  const goToSlot = useCallback((slotIndex: number) => {
    if (!layoutState) return;
    
    setLayoutState({
      ...layoutState,
      currentSlotIndex: Math.max(0, Math.min(slotIndex, layoutState.slots.length - 1)),
    });
  }, [layoutState]);

  const progress = layoutState ? getProgress(layoutState) : 0;
  const currentSlot = layoutState ? getCurrentSlot(layoutState) : null;

  return {
    layoutState,
    progress,
    currentSlot,
    initializeLayout,
    captureSlot,
    resetLayout,
    goToNextSlot,
    goToPreviousSlot,
    goToSlot,
  };
}
