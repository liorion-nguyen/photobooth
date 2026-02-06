export type StickerType = 
  | "none"
  | "bunny-ears"      // Tai thỏ
  | "cat-ears"         // Tai mèo
  | "crown"            // Vương miện
  | "party-hat"        // Mũ tiệc
  | "mustache"         // Râu
  | "glasses"          // Kính
  | "heart-eyes"       // Mắt trái tim
  | "flower-crown"     // Vòng hoa
  | "beard"            // Râu dài
  | "sunglasses";      // Kính râm

export interface StickerOption {
  type: StickerType;
  label: string;
  icon: string;
  position: "top" | "center" | "bottom";
  scale: number; // Tỷ lệ so với khuôn mặt (ước tính)
}

export const STICKER_OPTIONS: StickerOption[] = [
  { type: "none", label: "Không sticker", icon: "🚫", position: "center", scale: 0 },
  { type: "bunny-ears", label: "Tai thỏ", icon: "🐰", position: "top", scale: 0.3 },
  { type: "cat-ears", label: "Tai mèo", icon: "🐱", position: "top", scale: 0.3 },
  { type: "crown", label: "Vương miện", icon: "👑", position: "top", scale: 0.4 },
  { type: "party-hat", label: "Mũ tiệc", icon: "🎉", position: "top", scale: 0.35 },
  { type: "mustache", label: "Râu", icon: "👨", position: "center", scale: 0.25 },
  { type: "glasses", label: "Kính", icon: "🤓", position: "center", scale: 0.3 },
  { type: "heart-eyes", label: "Mắt trái tim", icon: "😍", position: "center", scale: 0.2 },
  { type: "flower-crown", label: "Vòng hoa", icon: "🌸", position: "top", scale: 0.35 },
  { type: "beard", label: "Râu dài", icon: "🧔", position: "bottom", scale: 0.3 },
  { type: "sunglasses", label: "Kính râm", icon: "🕶️", position: "center", scale: 0.3 },
];
