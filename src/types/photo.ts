export type FilterType = 
  | "none"
  | "grayscale"
  | "sepia"
  | "brightness"
  | "contrast"
  | "vintage"
  | "blur";

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
