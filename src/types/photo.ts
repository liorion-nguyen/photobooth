export type FilterType = 
  | "none"
  | "grayscale"
  | "sepia"
  | "brightness"
  | "contrast"
  | "vintage"
  | "blur"
  | "skin-whiten"      // Làm trắng da
  | "skin-smooth"       // Làm mịn da
  | "beauty"            // Làm đẹp tổng hợp
  | "vibrant"           // Màu rực rỡ
  | "warm"              // Ấm áp
  | "cool"              // Mát mẻ
  | "cinematic"         // Điện ảnh
  | "portrait";         // Chân dung

export interface Photo {
  id?: string;
  blob: Blob;
  url: string;
  filter?: FilterType;
  timestamp: number;
}

export interface CaptureResult {
  blob: Blob;
  dataUrl: string;
  width: number;
  height: number;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}
