import type { StickerType } from "@/types/sticker";
import { STICKER_OPTIONS } from "@/types/sticker";

/**
 * Vẽ sticker lên canvas
 * Sticker được đặt dựa trên vị trí ước tính của khuôn mặt
 */
export function applySticker(
  canvas: HTMLCanvasElement,
  stickerType: StickerType
): void {
  if (stickerType === "none") return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const sticker = STICKER_OPTIONS.find(s => s.type === stickerType);
  if (!sticker) return;

  const width = canvas.width;
  const height = canvas.height;

  // Ước tính vị trí khuôn mặt (giả sử khuôn mặt ở giữa ảnh)
  // Trong thực tế, có thể dùng face detection để tìm vị trí chính xác
  const faceCenterX = width / 2;
  const faceCenterY = height * 0.4; // Khuôn mặt thường ở 40% từ trên xuống
  const faceWidth = width * 0.4; // Khuôn mặt chiếm khoảng 40% chiều rộng
  const faceHeight = height * 0.5; // Khuôn mặt chiếm khoảng 50% chiều cao

  // Tính kích thước sticker dựa trên scale
  const stickerSize = Math.min(faceWidth, faceHeight) * sticker.scale;

  // Tính vị trí sticker dựa trên position
  let stickerX = faceCenterX;
  let stickerY = faceCenterY;

  switch (sticker.position) {
    case "top":
      // Đặt ở trên đầu (khoảng 20% từ trên xuống)
      stickerY = height * 0.2;
      break;
    case "center":
      // Đặt ở giữa khuôn mặt
      stickerY = faceCenterY;
      break;
    case "bottom":
      // Đặt ở dưới cằm (khoảng 60% từ trên xuống)
      stickerY = height * 0.6;
      break;
  }

  // Vẽ sticker dựa trên type
  drawSticker(ctx, stickerType, stickerX, stickerY, stickerSize);
}

/**
 * Vẽ sticker cụ thể lên canvas
 */
function drawSticker(
  ctx: CanvasRenderingContext2D,
  stickerType: StickerType,
  x: number,
  y: number,
  size: number
): void {
  ctx.save();

  // Di chuyển đến vị trí sticker
  ctx.translate(x, y);

  switch (stickerType) {
    case "bunny-ears":
      drawBunnyEars(ctx, size);
      break;
    case "cat-ears":
      drawCatEars(ctx, size);
      break;
    case "crown":
      drawCrown(ctx, size);
      break;
    case "party-hat":
      drawPartyHat(ctx, size);
      break;
    case "mustache":
      drawMustache(ctx, size);
      break;
    case "glasses":
      drawGlasses(ctx, size);
      break;
    case "heart-eyes":
      drawHeartEyes(ctx, size);
      break;
    case "flower-crown":
      drawFlowerCrown(ctx, size);
      break;
    case "beard":
      drawBeard(ctx, size);
      break;
    case "sunglasses":
      drawSunglasses(ctx, size);
      break;
    default:
      break;
  }

  ctx.restore();
}

/**
 * Vẽ tai thỏ
 */
function drawBunnyEars(ctx: CanvasRenderingContext2D, size: number): void {
  const earWidth = size * 0.3;
  const earHeight = size * 0.5;
  const spacing = size * 0.4;

  // Tai trái
  ctx.fillStyle = "#FFB6C1";
  ctx.beginPath();
  ctx.ellipse(-spacing, -size * 0.3, earWidth, earHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FF69B4";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tai trong trái
  ctx.fillStyle = "#FFC0CB";
  ctx.beginPath();
  ctx.ellipse(-spacing, -size * 0.25, earWidth * 0.5, earHeight * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();

  // Tai phải
  ctx.fillStyle = "#FFB6C1";
  ctx.beginPath();
  ctx.ellipse(spacing, -size * 0.3, earWidth, earHeight, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#FF69B4";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tai trong phải
  ctx.fillStyle = "#FFC0CB";
  ctx.beginPath();
  ctx.ellipse(spacing, -size * 0.25, earWidth * 0.5, earHeight * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Vẽ tai mèo
 */
function drawCatEars(ctx: CanvasRenderingContext2D, size: number): void {
  const earWidth = size * 0.3;
  const earHeight = size * 0.4;
  const spacing = size * 0.4;

  // Tai trái
  ctx.fillStyle = "#FFA500";
  ctx.beginPath();
  ctx.moveTo(-spacing, -size * 0.2);
  ctx.lineTo(-spacing - earWidth, -size * 0.5);
  ctx.lineTo(-spacing + earWidth, -size * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#FF8C00";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tai trong trái
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.moveTo(-spacing, -size * 0.25);
  ctx.lineTo(-spacing - earWidth * 0.5, -size * 0.45);
  ctx.lineTo(-spacing + earWidth * 0.5, -size * 0.45);
  ctx.closePath();
  ctx.fill();

  // Tai phải
  ctx.fillStyle = "#FFA500";
  ctx.beginPath();
  ctx.moveTo(spacing, -size * 0.2);
  ctx.lineTo(spacing - earWidth, -size * 0.5);
  ctx.lineTo(spacing + earWidth, -size * 0.5);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#FF8C00";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Tai trong phải
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.moveTo(spacing, -size * 0.25);
  ctx.lineTo(spacing - earWidth * 0.5, -size * 0.45);
  ctx.lineTo(spacing + earWidth * 0.5, -size * 0.45);
  ctx.closePath();
  ctx.fill();
}

/**
 * Vẽ vương miện
 */
function drawCrown(ctx: CanvasRenderingContext2D, size: number): void {
  const width = size * 0.8;
  const height = size * 0.3;
  const peaks = 5;
  const peakHeight = height * 0.6;

  ctx.fillStyle = "#FFD700";
  ctx.strokeStyle = "#FFA500";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(-width / 2, 0);

  // Vẽ các đỉnh
  for (let i = 0; i <= peaks; i++) {
    const x = -width / 2 + (width / peaks) * i;
    const y = i % 2 === 0 ? -peakHeight : -peakHeight * 0.5;
    ctx.lineTo(x, y);
  }

  ctx.lineTo(width / 2, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Vẽ viên ngọc
  ctx.fillStyle = "#FF1493";
  ctx.beginPath();
  ctx.arc(0, -peakHeight * 0.3, size * 0.05, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Vẽ mũ tiệc
 */
function drawPartyHat(ctx: CanvasRenderingContext2D, size: number): void {
  const width = size * 0.6;
  const height = size * 0.5;

  // Thân mũ
  ctx.fillStyle = "#FF6B6B";
  ctx.beginPath();
  ctx.arc(0, -height * 0.3, width / 2, 0, Math.PI, true);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#FF4757";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Pom pom
  ctx.fillStyle = "#FFA502";
  ctx.beginPath();
  ctx.arc(0, -height * 0.6, size * 0.08, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Vẽ râu
 */
function drawMustache(ctx: CanvasRenderingContext2D, size: number): void {
  const width = size * 0.6;
  const height = size * 0.2;

  ctx.fillStyle = "#2C2C2C";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;

  // Râu trái
  ctx.beginPath();
  ctx.ellipse(-width * 0.25, 0, width * 0.2, height, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Râu phải
  ctx.beginPath();
  ctx.ellipse(width * 0.25, 0, width * 0.2, height, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

/**
 * Vẽ kính
 */
function drawGlasses(ctx: CanvasRenderingContext2D, size: number): void {
  const width = size * 0.8;
  const lensSize = size * 0.25;
  const spacing = size * 0.15;

  ctx.strokeStyle = "#2C2C2C";
  ctx.lineWidth = 3;
  ctx.fillStyle = "rgba(200, 200, 255, 0.3)";

  // Kính trái
  ctx.beginPath();
  ctx.arc(-spacing, 0, lensSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Kính phải
  ctx.beginPath();
  ctx.arc(spacing, 0, lensSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cầu nối
  ctx.beginPath();
  ctx.moveTo(-spacing + lensSize, 0);
  ctx.lineTo(spacing - lensSize, 0);
  ctx.stroke();
}

/**
 * Vẽ mắt trái tim
 */
function drawHeartEyes(ctx: CanvasRenderingContext2D, size: number): void {
  const heartSize = size * 0.15;
  const spacing = size * 0.25;

  ctx.fillStyle = "#FF1493";
  ctx.strokeStyle = "#C71585";
  ctx.lineWidth = 2;

  // Trái tim trái
  drawHeart(ctx, -spacing, 0, heartSize);
  // Trái tim phải
  drawHeart(ctx, spacing, 0, heartSize);
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, size * 0.3);
  ctx.bezierCurveTo(0, 0, -size, 0, -size, size * 0.3);
  ctx.bezierCurveTo(-size, size * 0.5, 0, size * 0.7, 0, size);
  ctx.bezierCurveTo(0, size * 0.7, size, size * 0.5, size, size * 0.3);
  ctx.bezierCurveTo(size, 0, 0, 0, 0, size * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

/**
 * Vẽ vòng hoa
 */
function drawFlowerCrown(ctx: CanvasRenderingContext2D, size: number): void {
  const width = size * 0.8;
  const flowers = 5;

  for (let i = 0; i < flowers; i++) {
    const x = -width / 2 + (width / (flowers - 1)) * i;
    const y = -size * 0.3;
    drawFlower(ctx, x, y, size * 0.1);
  }
}

function drawFlower(ctx: CanvasRenderingContext2D, x: number, y: number, size: number): void {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#FF69B4";
  ctx.strokeStyle = "#FF1493";
  ctx.lineWidth = 1;

  // Cánh hoa
  for (let i = 0; i < 5; i++) {
    const angle = (Math.PI * 2 * i) / 5;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.ellipse(0, -size * 0.3, size * 0.2, size * 0.3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // Nhụy hoa
  ctx.fillStyle = "#FFD700";
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.15, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/**
 * Vẽ râu dài
 */
function drawBeard(ctx: CanvasRenderingContext2D, size: number): void {
  const width = size * 0.7;
  const height = size * 0.4;

  ctx.fillStyle = "#2C2C2C";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.ellipse(0, height * 0.3, width / 2, height, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
}

/**
 * Vẽ kính râm
 */
function drawSunglasses(ctx: CanvasRenderingContext2D, size: number): void {
  const width = size * 0.8;
  const lensSize = size * 0.3;
  const spacing = size * 0.2;

  ctx.fillStyle = "#1a1a1a";
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 3;

  // Kính trái
  ctx.beginPath();
  ctx.arc(-spacing, 0, lensSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Kính phải
  ctx.beginPath();
  ctx.arc(spacing, 0, lensSize, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Cầu nối
  ctx.beginPath();
  ctx.moveTo(-spacing + lensSize, 0);
  ctx.lineTo(spacing - lensSize, 0);
  ctx.stroke();

  // Phản chiếu
  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.beginPath();
  ctx.ellipse(-spacing, -lensSize * 0.3, lensSize * 0.3, lensSize * 0.1, -0.3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(spacing, -lensSize * 0.3, lensSize * 0.3, lensSize * 0.1, 0.3, 0, Math.PI * 2);
  ctx.fill();
}
