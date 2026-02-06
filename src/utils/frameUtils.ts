import type { FrameType } from "@/components/Frames/FrameSelector";

export interface FrameStyle {
  borderWidth: number;
  borderColor: string;
  borderStyle: "solid" | "dashed" | "dotted";
  padding: number;
  backgroundColor?: string;
  borderRadius?: number;
}

export function getFrameStyle(frameType: FrameType): FrameStyle {
  switch (frameType) {
    case "classic":
      return {
        borderWidth: 20,
        borderColor: "#d97706", // amber-600
        borderStyle: "solid",
        padding: 10,
        backgroundColor: "#fef3c7", // amber-50
        borderRadius: 0,
      };
    case "modern":
      return {
        borderWidth: 15,
        borderColor: "#1f2937", // gray-800
        borderStyle: "solid",
        padding: 5,
        backgroundColor: "#ffffff",
        borderRadius: 0,
      };
    case "vintage":
      return {
        borderWidth: 25,
        borderColor: "#92400e", // amber-800
        borderStyle: "solid",
        padding: 15,
        backgroundColor: "#fef3c7", // amber-100
        borderRadius: 0,
      };
    case "elegant":
      return {
        borderWidth: 12,
        borderColor: "#4b5563", // gray-600
        borderStyle: "solid",
        padding: 8,
        backgroundColor: "#f9fafb", // gray-50
        borderRadius: 0,
      };
    case "playful":
      return {
        borderWidth: 18,
        borderColor: "#f472b6", // pink-400
        borderStyle: "dashed",
        padding: 10,
        backgroundColor: "#fce7f3", // pink-50
        borderRadius: 0,
      };
    default:
      return {
        borderWidth: 0,
        borderColor: "transparent",
        borderStyle: "solid",
        padding: 0,
      };
  }
}

export function applyFrameToCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameType: FrameType
): void {
  if (frameType === "none") return;

  const frameStyle = getFrameStyle(frameType);
  const { borderWidth, borderColor, borderStyle, backgroundColor } = frameStyle;

  // Vẽ background nếu có
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }

  // Vẽ border bằng cách vẽ 4 hình chữ nhật (top, right, bottom, left)
  ctx.fillStyle = borderColor;

  if (borderStyle === "dashed" || borderStyle === "dotted") {
    // Với dashed/dotted, vẽ từng cạnh
    ctx.strokeStyle = borderColor;
    ctx.lineWidth = borderWidth;
    if (borderStyle === "dashed") {
      ctx.setLineDash([20, 10]);
    } else {
      ctx.setLineDash([5, 5]);
    }
    
    // Top
    ctx.beginPath();
    ctx.moveTo(0, borderWidth / 2);
    ctx.lineTo(width, borderWidth / 2);
    ctx.stroke();
    
    // Right
    ctx.beginPath();
    ctx.moveTo(width - borderWidth / 2, 0);
    ctx.lineTo(width - borderWidth / 2, height);
    ctx.stroke();
    
    // Bottom
    ctx.beginPath();
    ctx.moveTo(width, height - borderWidth / 2);
    ctx.lineTo(0, height - borderWidth / 2);
    ctx.stroke();
    
    // Left
    ctx.beginPath();
    ctx.moveTo(borderWidth / 2, height);
    ctx.lineTo(borderWidth / 2, 0);
    ctx.stroke();
  } else {
    // Solid border - vẽ bằng fillRect
    // Top
    ctx.fillRect(0, 0, width, borderWidth);
    // Right
    ctx.fillRect(width - borderWidth, 0, borderWidth, height);
    // Bottom
    ctx.fillRect(0, height - borderWidth, width, borderWidth);
    // Left
    ctx.fillRect(0, 0, borderWidth, height);
  }

  // Reset line dash
  ctx.setLineDash([]);
}
