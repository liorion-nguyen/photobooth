import type { FrameType } from "@/components/Frames/FrameSelector";
import type { CustomFrameImage } from "@/services/customFrameImage.service";
import { getCustomFrameImage } from "@/services/customFrameImage.service";
import { getFramerById } from "@/services/framer.service";
import type { LayoutState, LayoutType } from "@/types/layout";
import { applyFrameToCanvas, getFrameStyle } from "./frameUtils";

/** Preset vẽ layout 1x4 khi dùng framer upload: 318x958, viền 20px, ô 278x210, khe 13px (4 ô xếp dọc) */
const LAYOUT_1X4_FRAMER_PRESET = {
  canvasWidth: 313,
  canvasHeight: 942,
  paddingTop: 20,
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 59,
  cellWidth: 278,
  cellHeight: 207.5,
  cellSpacing: 11.75,
  rows: 4,
  cols: 1,
} as const;

/** Preset 2x2: khung 677x957, viền trên/trái/phải 25px, ô 304x409, khe 19px; 25+304+19+304+25=677 để khớp lỗ framer */
const LAYOUT_2X2_FRAMER_PRESET = {
  canvasWidth: 665,
  canvasHeight: 935,
  paddingTop: 20,
  paddingLeft: 20,
  paddingRight: 20,
  paddingBottom: 95,
  cellWidth: 304,
  cellHeight: 404,
  cellSpacingCol: 12,
  cellSpacingRow: 12,
  rows: 2,
  cols: 2,
} as const;

/** Preset 2x3: khung 784x958, mỗi ảnh 373x281, khe 11px (3 hàng × 2 cột) */
const LAYOUT_2X3_FRAMER_PRESET = {
  canvasWidth: 768,
  canvasHeight: 942,
  paddingTop: 18,
  paddingLeft: 14, // (784 - 2*373 - 11) / 2 → 14 + 13
  paddingRight: 13,
  paddingBottom: 47,
  cellWidth: 366,
  cellHeight: 272,
  cellSpacingCol: 9,
  cellSpacingRow: 9,
  rows: 3,
  cols: 2,
} as const;

type FramerPreset =
  | typeof LAYOUT_1X4_FRAMER_PRESET
  | typeof LAYOUT_2X2_FRAMER_PRESET
  | typeof LAYOUT_2X3_FRAMER_PRESET;

function getFramerPresetForLayout(
  layoutType: LayoutType,
  customFrameImage: CustomFrameImage | null
): FramerPreset | null {
  if (!customFrameImage) return null;
  const frameLayout = customFrameImage.layoutType ?? layoutType;
  if (layoutType === "1x4" && (frameLayout === "1x4" || !frameLayout)) return LAYOUT_1X4_FRAMER_PRESET;
  if (layoutType === "2x2" && (frameLayout === "2x2" || !frameLayout)) return LAYOUT_2X2_FRAMER_PRESET;
  if (layoutType === "2x3" && (frameLayout === "2x3" || !frameLayout)) return LAYOUT_2X3_FRAMER_PRESET;
  return null;
}

/** Resolve custom frame: localStorage trước, không có thì lấy từ API. */
async function resolveCustomFrameImage(frameType: FrameType): Promise<CustomFrameImage | null> {
  const local = getCustomFrameImage(frameType);
  if (local) return local;
  const api = await getFramerById(frameType);
  if (!api) return null;
  return {
    id: api.id,
    name: api.name,
    imageData: api.imageUrl,
    aspectRatio: api.aspectRatio ?? undefined,
    layoutType: (api.layoutType as LayoutType) ?? undefined,
    fitMode: "contain",
    createdAt: api.createdAt,
  };
}

export async function exportLayoutAsImage(
  layoutState: LayoutState,
  frameType: FrameType = "none"
): Promise<Blob> {
  const { config, slots } = layoutState;

  // Tạo canvas với kích thước phù hợp
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get canvas context");
  }

  // Custom frame: localStorage hoặc API
  const customFrameImage = await resolveCustomFrameImage(frameType);

  const framerPreset = getFramerPresetForLayout(config.type, customFrameImage);

  let canvasWidth: number;
  let canvasHeight: number;
  let framePadding: number;
  let baseWidth: number;
  let baseHeight: number;
  let finalCellWidth: number;
  let finalCellHeight: number;
  let cellSpacing: number;
  let drawRows: number;
  let drawCols: number;
  let frameStyle = !customFrameImage && frameType !== "none" ? getFrameStyle(frameType) : null;
  const borderWidth = frameStyle?.borderWidth || 8;

  if (framerPreset) {
    canvasWidth = framerPreset.canvasWidth;
    canvasHeight = framerPreset.canvasHeight;
    framePadding = 0;
    baseWidth = framerPreset.canvasWidth;
    baseHeight = framerPreset.canvasHeight;
    finalCellWidth = framerPreset.cellWidth;
    finalCellHeight = framerPreset.cellHeight;
    cellSpacing = "cellSpacingCol" in framerPreset ? framerPreset.cellSpacingRow : framerPreset.cellSpacing;
    drawRows = framerPreset.rows;
    drawCols = framerPreset.cols;
  } else {
    let baseWidthDefault = 720;
    cellSpacing = frameStyle?.borderWidth ?? 8;
    const totalSpacingWidth = cellSpacing * (config.cols - 1);
    const totalSpacingHeight = cellSpacing * (config.rows - 1);
    let cellWidth = (baseWidthDefault - totalSpacingWidth) / config.cols;
    let cellHeight = cellWidth;
    let baseHeightDefault = cellHeight * config.rows + totalSpacingHeight;

    if (customFrameImage && customFrameImage.aspectRatio) {
      const frameAspectRatio = customFrameImage.aspectRatio;
      const layoutAspectRatio = baseWidthDefault / baseHeightDefault;
      if (frameAspectRatio > layoutAspectRatio) {
        baseHeightDefault = baseWidthDefault / frameAspectRatio;
        cellHeight = (baseHeightDefault - totalSpacingHeight) / config.rows;
        cellWidth = cellHeight;
        baseWidthDefault = cellWidth * config.cols + totalSpacingWidth;
      } else {
        baseWidthDefault = baseHeightDefault * frameAspectRatio;
        cellWidth = (baseWidthDefault - totalSpacingWidth) / config.cols;
        cellHeight = cellWidth;
        baseHeightDefault = cellHeight * config.rows + totalSpacingHeight;
      }
    }

    finalCellWidth = (baseWidthDefault - totalSpacingWidth) / config.cols;
    finalCellHeight = (baseHeightDefault - totalSpacingHeight) / config.rows;
    framePadding = customFrameImage ? 0 : (frameType !== "none" ? 40 : 0);
    canvasWidth = customFrameImage ? baseWidthDefault : baseWidthDefault + framePadding * 2;
    canvasHeight = customFrameImage ? baseHeightDefault : baseHeightDefault + framePadding * 2;
    baseWidth = baseWidthDefault;
    baseHeight = baseHeightDefault;
    drawRows = config.rows;
    drawCols = config.cols;
  }

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  if (!customFrameImage && frameType !== "none") {
    const fs = getFrameStyle(frameType);
    if (fs.backgroundColor) {
      ctx.fillStyle = fs.backgroundColor;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    }
  }

  ctx.fillStyle = "#ffffff";
  if (framerPreset) {
    if ("cellSpacingCol" in framerPreset) {
      const P = framerPreset;
      const contentW = P.cellWidth * P.cols + P.cellSpacingCol * (P.cols - 1);
      const contentH = P.cellHeight * P.rows + P.cellSpacingRow * (P.rows - 1);
      ctx.fillRect(P.paddingLeft, P.paddingTop, contentW, contentH);
    } else {
      const P = framerPreset;
      ctx.fillRect(P.paddingLeft, P.paddingTop, P.cellWidth, P.rows * P.cellHeight + (P.rows - 1) * P.cellSpacing);
    }
  } else {
    ctx.fillRect(framePadding, framePadding, baseWidth, baseHeight);
  }

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    if (!slot.image) continue;

    let x: number, y: number, w: number, h: number;
    if (framerPreset) {
      if ("cellSpacingCol" in framerPreset) {
        const P = framerPreset;
        x = P.paddingLeft + slot.col * (P.cellWidth + P.cellSpacingCol);
        y = P.paddingTop + slot.row * (P.cellHeight + P.cellSpacingRow);
        w = P.cellWidth;
        h = P.cellHeight;
      } else {
        const P = framerPreset;
        x = P.paddingLeft;
        y = P.paddingTop + i * (P.cellHeight + P.cellSpacing);
        w = P.cellWidth;
        h = P.cellHeight;
      }
    } else {
      x = framePadding + slot.col * (finalCellWidth + cellSpacing);
      y = framePadding + slot.row * (finalCellHeight + cellSpacing);
      w = finalCellWidth;
      h = finalCellHeight;
    }

    const img = new Image();
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = slot.image!;
    });
    ctx.drawImage(img, x, y, w, h);
  }

  const borderColor = frameStyle?.borderColor || "#E5E7EB";
  ctx.fillStyle = borderColor;

  if (framerPreset) {
    if ("cellSpacingCol" in framerPreset) {
      const P = framerPreset;
      for (let row = 1; row < P.rows; row++) {
        const y = P.paddingTop + row * (P.cellHeight + P.cellSpacingRow) - P.cellSpacingRow / 2;
        ctx.fillRect(P.paddingLeft, y, P.cellWidth * P.cols + P.cellSpacingCol * (P.cols - 1), P.cellSpacingRow);
      }
      for (let col = 1; col < P.cols; col++) {
        const x = P.paddingLeft + col * (P.cellWidth + P.cellSpacingCol) - P.cellSpacingCol / 2;
        ctx.fillRect(x, P.paddingTop, P.cellSpacingCol, P.cellHeight * P.rows + P.cellSpacingRow * (P.rows - 1));
      }
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      for (let row = 0; row < P.rows; row++) {
        for (let col = 0; col < P.cols; col++) {
          const x = P.paddingLeft + col * (P.cellWidth + P.cellSpacingCol);
          const y = P.paddingTop + row * (P.cellHeight + P.cellSpacingRow);
          ctx.strokeRect(x, y, P.cellWidth, P.cellHeight);
        }
      }
    } else {
      const P = framerPreset;
      for (let row = 1; row < P.rows; row++) {
        const y = P.paddingTop + row * (P.cellHeight + P.cellSpacing) - P.cellSpacing / 2;
        ctx.fillRect(P.paddingLeft, y, P.cellWidth, P.cellSpacing);
      }
      ctx.strokeStyle = borderColor;
      ctx.lineWidth = 1;
      for (let i = 0; i < P.rows; i++) {
        const y = P.paddingTop + i * (P.cellHeight + P.cellSpacing);
        ctx.strokeRect(P.paddingLeft, y, P.cellWidth, P.cellHeight);
      }
    }
  } else {
    for (let row = 1; row < drawRows; row++) {
      const y = framePadding + row * (finalCellHeight + cellSpacing) - cellSpacing / 2;
      ctx.fillRect(framePadding, y, baseWidth, cellSpacing);
    }
    for (let col = 1; col < drawCols; col++) {
      const x = framePadding + col * (finalCellWidth + cellSpacing) - cellSpacing / 2;
      ctx.fillRect(x, framePadding, cellSpacing, baseHeight);
    }
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    for (let row = 0; row < drawRows; row++) {
      for (let col = 0; col < drawCols; col++) {
        const x = framePadding + col * (finalCellWidth + cellSpacing);
        const y = framePadding + row * (finalCellHeight + cellSpacing);
        ctx.strokeRect(x, y, finalCellWidth, finalCellHeight);
      }
    }
  }

  // Áp dụng frame sau khi đã vẽ ảnh và viền
  // Với custom frame image: Frame sẽ overlay lên trên, phần trong suốt sẽ không che ảnh
  // Với default frame: Frame sẽ được vẽ như border
  await applyFrameToCanvas(ctx, canvasWidth, canvasHeight, frameType, customFrameImage);

  // Convert to blob
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error("Failed to export layout"));
        }
      },
      "image/jpeg",
      0.9
    );
  });
}
