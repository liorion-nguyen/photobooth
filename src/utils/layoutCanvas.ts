import type { LayoutState } from "@/types/layout";

export async function exportLayoutAsImage(
  layoutState: LayoutState
): Promise<Blob> {
  const { config, slots } = layoutState;

  // Tạo canvas với kích thước phù hợp
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get canvas context");
  }

  // Kích thước canvas (1080px width cho chất lượng tốt)
  const canvasWidth = 1080;
  const cellWidth = canvasWidth / config.cols;
  const cellHeight = cellWidth; // Square cells
  const canvasHeight = cellHeight * config.rows;

  canvas.width = canvasWidth;
  canvas.height = canvasHeight;

  // Vẽ background trắng
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // Vẽ từng ảnh vào layout
  for (const slot of slots) {
    if (!slot.image) continue;

    const x = slot.col * cellWidth;
    const y = slot.row * cellHeight;

    // Load image
    const img = new Image();
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = slot.image!;
    });

    // Vẽ ảnh vào cell
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
