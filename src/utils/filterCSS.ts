import type { FilterType } from "@/types/photo";

/**
 * Convert filter type to CSS filter string for preview
 * 
 * NOTE: CSS filters are approximations and may differ from the actual canvas filters,
 * especially for complex filters like skin-whiten, skin-smooth, and beauty which
 * use pixel-by-pixel skin detection. The final captured image will use the precise
 * canvas filter implementation.
 */
export function getFilterCSS(filter: FilterType): string {
  switch (filter) {
    case "grayscale":
      return "grayscale(100%)";
    case "sepia":
      return "sepia(100%)";
    case "brightness":
      return "brightness(1.2)";
    case "contrast":
      return "contrast(1.3)";
    case "vintage":
      return "sepia(50%) contrast(1.1) brightness(0.9)";
    case "blur":
      return "blur(2px)";
    case "skin-whiten":
      // Approximate: tăng brightness và giảm saturation cho toàn bộ (không thể detect skin trong CSS)
      // Canvas filter chỉ áp dụng cho vùng da, nhưng CSS filter phải áp dụng cho toàn bộ
      return "brightness(1.2) saturate(0.8) contrast(1.08)";
    case "skin-smooth":
      // Approximate: blur nhẹ + brightness (canvas filter chỉ blur vùng da)
      return "blur(2px) brightness(1.1) contrast(1.03)";
    case "beauty":
      // Approximate: combination của các effects (canvas filter có skin detection)
      return "brightness(1.18) saturate(0.85) contrast(1.15) blur(0.8px)";
    case "vibrant":
      return "saturate(1.45) contrast(1.18) brightness(1.02)";
    case "warm":
      // Tăng red/yellow tones
      return "sepia(25%) saturate(1.25) brightness(1.08) contrast(1.05)";
    case "cool":
      // Tăng blue/cyan tones
      return "sepia(0%) saturate(1.15) brightness(1.05) hue-rotate(-5deg)";
    case "cinematic":
      return "contrast(1.45) saturate(0.82) brightness(0.92)";
    case "portrait":
      return "brightness(1.12) saturate(0.85) contrast(1.22)";
    case "none":
    default:
      return "none";
  }
}
