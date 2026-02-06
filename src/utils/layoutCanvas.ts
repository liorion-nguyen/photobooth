import type { LayoutState } from "@/types/layout";
import type { FrameType } from "@/components/Frames/FrameSelector";
import { applyFrameToCanvas } from "./frameUtils";

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

  // Kích thước canvas (720px width cho preview nhỏ gọn hơn, vẫn đảm bảo chất lượng)
  const baseWidth = 720;
  const cellWidth = baseWidth / config.cols;
  const cellHeight = cellWidth; // Square cells
  const baseHeight = cellHeight * config.rows;

  // Tính toán kích thước với frame
  const framePadding = frameType !== "none" ? 40 : 0; // Padding cho frame
  const canvasWidth = baseWidth + framePadding * 2;
  const canvasHeight = baseHeight + framePadding * 2;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Áp dụng frame trước
  applyFrameToCanvas(ctx, canvasWidth, canvasHeight, frameType);

  // Vẽ background trắng cho layout (với padding cho frame)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(framePadding, framePadding, baseWidth, baseHeight);

  // Vẽ từng ảnh vào layout (với offset cho frame)
  for (const slot of slots) {
    if (!slot.image) continue;

    const x = framePadding + slot.col * cellWidth;
    const y = framePadding + slot.row * cellHeight;

    // Load image
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = slot.image!;
    });

    // Vẽ ảnh fill đầy cell (object-fit: cover) - ảnh đã được crop đúng aspect ratio rồi
    ctx.drawImage(img, x, y, cellWidth, cellHeight);

    // Vẽ border giữa các cell
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, cellWidth, cellHeight);
  }

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
