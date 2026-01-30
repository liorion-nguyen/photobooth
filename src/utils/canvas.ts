import type { FilterType } from "@/types/photo";

export function applyFilter(
  canvas: HTMLCanvasElement,
  filter: FilterType
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  switch (filter) {
    case "grayscale":
      for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
      }
      break;

    case "sepia":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        data[i + 1] = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        data[i + 2] = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
      }
      break;

    case "brightness":
      const brightnessValue = 1.2;
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * brightnessValue);
        data[i + 1] = Math.min(255, data[i + 1] * brightnessValue);
        data[i + 2] = Math.min(255, data[i + 2] * brightnessValue);
      }
      break;

    case "contrast":
      const contrastValue = 1.3;
      const factor = (259 * (contrastValue * 255 + 255)) / (255 * (259 - contrastValue * 255));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
      }
      break;

    case "vintage":
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        data[i] = Math.min(255, r * 0.9 + g * 0.1);
        data[i + 1] = Math.min(255, g * 0.9 + b * 0.1);
        data[i + 2] = Math.min(255, b * 0.9 + r * 0.1);
      }
      break;

    case "blur":
      // Simple box blur
      const blurRadius = 2;
      const tempData = new Uint8ClampedArray(data);
      for (let y = blurRadius; y < canvas.height - blurRadius; y++) {
        for (let x = blurRadius; x < canvas.width - blurRadius; x++) {
          let r = 0, g = 0, b = 0, count = 0;
          for (let dy = -blurRadius; dy <= blurRadius; dy++) {
            for (let dx = -blurRadius; dx <= blurRadius; dx++) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              r += tempData[idx];
              g += tempData[idx + 1];
              b += tempData[idx + 2];
              count++;
            }
          }
          const idx = (y * canvas.width + x) * 4;
          data[idx] = r / count;
          data[idx + 1] = g / count;
          data[idx + 2] = b / count;
        }
      }
      break;

    case "none":
    default:
      return;
  }

  ctx.putImageData(imageData, 0, 0);
}

export function resizeImage(
  blob: Blob,
  maxWidth: number = 1080
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (resizedBlob) => {
          if (resizedBlob) {
            resolve(resizedBlob);
          } else {
            reject(new Error("Failed to resize image"));
          }
        },
        "image/jpeg",
        0.85
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}
