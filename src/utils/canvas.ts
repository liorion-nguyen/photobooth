import type { FilterType } from "@/types/photo";

export function applyFilter(
  canvas: HTMLCanvasElement,
  filter: FilterType
): void {
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return;

  // Đảm bảo canvas có kích thước hợp lệ
  if (canvas.width === 0 || canvas.height === 0) {
    console.warn("Canvas has zero dimensions, skipping filter");
    return;
  }

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

    case "skin-whiten":
      // Làm trắng da - tăng độ sáng cho vùng da (màu gần với màu da)
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Detect skin tone (màu da thường có R > G > B và trong khoảng nhất định)
        const isSkin = r > 95 && g > 40 && b > 20 && 
                      r > g && g > b && 
                      Math.max(r, g, b) - Math.min(r, g, b) > 15;
        
        if (isSkin) {
          // Làm trắng da: tăng độ sáng và giảm độ bão hòa
          const brightness = 1.15;
          const desaturate = 0.85;
          const gray = r * 0.299 + g * 0.587 + b * 0.114;
          
          data[i] = Math.min(255, (r * brightness * desaturate + gray * (1 - desaturate)));
          data[i + 1] = Math.min(255, (g * brightness * desaturate + gray * (1 - desaturate)));
          data[i + 2] = Math.min(255, (b * brightness * desaturate + gray * (1 - desaturate)));
        }
      }
      break;

    case "skin-smooth":
      // Làm mịn da - áp dụng blur nhẹ cho vùng da
      const smoothRadius = 3;
      const smoothTempData = new Uint8ClampedArray(data);
      
      for (let y = smoothRadius; y < canvas.height - smoothRadius; y++) {
        for (let x = smoothRadius; x < canvas.width - smoothRadius; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = smoothTempData[idx];
          const g = smoothTempData[idx + 1];
          const b = smoothTempData[idx + 2];
          
          // Detect skin tone
          const isSkin = r > 95 && g > 40 && b > 20 && 
                        r > g && g > b && 
                        Math.max(r, g, b) - Math.min(r, g, b) > 15;
          
          if (isSkin) {
            // Áp dụng blur nhẹ cho da
            let rSum = 0, gSum = 0, bSum = 0, count = 0;
            for (let dy = -smoothRadius; dy <= smoothRadius; dy++) {
              for (let dx = -smoothRadius; dx <= smoothRadius; dx++) {
                const smoothIdx = ((y + dy) * canvas.width + (x + dx)) * 4;
                rSum += smoothTempData[smoothIdx];
                gSum += smoothTempData[smoothIdx + 1];
                bSum += smoothTempData[smoothIdx + 2];
                count++;
              }
            }
            data[idx] = rSum / count;
            data[idx + 1] = gSum / count;
            data[idx + 2] = bSum / count;
          }
        }
      }
      break;

    case "beauty":
      // Làm đẹp tổng hợp: làm trắng + mịn da + tăng độ sáng nhẹ
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const isSkin = r > 95 && g > 40 && b > 20 && 
                      r > g && g > b && 
                      Math.max(r, g, b) - Math.min(r, g, b) > 15;
        
        if (isSkin) {
          // Làm trắng và sáng
          const brightness = 1.12;
          const desaturate = 0.9;
          const gray = r * 0.299 + g * 0.587 + b * 0.114;
          
          data[i] = Math.min(255, (r * brightness * desaturate + gray * (1 - desaturate)));
          data[i + 1] = Math.min(255, (g * brightness * desaturate + gray * (1 - desaturate)));
          data[i + 2] = Math.min(255, (b * brightness * desaturate + gray * (1 - desaturate)));
        } else {
          // Tăng độ sáng nhẹ cho toàn bộ ảnh
          data[i] = Math.min(255, data[i] * 1.05);
          data[i + 1] = Math.min(255, data[i + 1] * 1.05);
          data[i + 2] = Math.min(255, data[i + 2] * 1.05);
        }
      }
      // Áp dụng smooth nhẹ
      const beautyTempData = new Uint8ClampedArray(data);
      const beautyRadius = 2;
      for (let y = beautyRadius; y < canvas.height - beautyRadius; y++) {
        for (let x = beautyRadius; x < canvas.width - beautyRadius; x++) {
          const idx = (y * canvas.width + x) * 4;
          const r = beautyTempData[idx];
          const g = beautyTempData[idx + 1];
          const b = beautyTempData[idx + 2];
          
          const isSkin = r > 95 && g > 40 && b > 20 && 
                        r > g && g > b && 
                        Math.max(r, g, b) - Math.min(r, g, b) > 15;
          
          if (isSkin) {
            let rSum = 0, gSum = 0, bSum = 0, count = 0;
            for (let dy = -beautyRadius; dy <= beautyRadius; dy++) {
              for (let dx = -beautyRadius; dx <= beautyRadius; dx++) {
                const smoothIdx = ((y + dy) * canvas.width + (x + dx)) * 4;
                rSum += beautyTempData[smoothIdx];
                gSum += beautyTempData[smoothIdx + 1];
                bSum += beautyTempData[smoothIdx + 2];
                count++;
              }
            }
            data[idx] = rSum / count;
            data[idx + 1] = gSum / count;
            data[idx + 2] = bSum / count;
          }
        }
      }
      break;

    case "vibrant":
      // Màu rực rỡ - tăng độ bão hòa và contrast
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Tăng saturation
        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        const satFactor = 1.4;
        
        data[i] = Math.min(255, Math.max(0, gray + (r - gray) * satFactor));
        data[i + 1] = Math.min(255, Math.max(0, gray + (g - gray) * satFactor));
        data[i + 2] = Math.min(255, Math.max(0, gray + (b - gray) * satFactor));
        
        // Tăng contrast nhẹ
        const contrast = 1.15;
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        data[i] = Math.min(255, Math.max(0, factor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, factor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, factor * (data[i + 2] - 128) + 128));
      }
      break;

    case "warm":
      // Ấm áp - tăng red và yellow tones
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 1.15); // Tăng red
        data[i + 1] = Math.min(255, data[i + 1] * 1.08); // Tăng green (yellow)
        data[i + 2] = Math.min(255, data[i + 2] * 0.95); // Giảm blue
      }
      break;

    case "cool":
      // Mát mẻ - tăng blue và cyan tones
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, data[i] * 0.95); // Giảm red
        data[i + 1] = Math.min(255, data[i + 1] * 1.05); // Tăng green nhẹ
        data[i + 2] = Math.min(255, data[i + 2] * 1.12); // Tăng blue
      }
      break;

    case "cinematic":
      // Điện ảnh - tăng contrast, giảm saturation nhẹ, tăng shadow
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // Giảm saturation nhẹ
        const gray = r * 0.299 + g * 0.587 + b * 0.114;
        const satFactor = 0.85;
        
        let newR = gray + (r - gray) * satFactor;
        let newG = gray + (g - gray) * satFactor;
        let newB = gray + (b - gray) * satFactor;
        
        // Tăng contrast mạnh
        const contrast = 1.4;
        const factor = (259 * (contrast * 255 + 255)) / (255 * (259 - contrast * 255));
        newR = factor * (newR - 128) + 128;
        newG = factor * (newG - 128) + 128;
        newB = factor * (newB - 128) + 128;
        
        // Tăng shadow (làm tối vùng tối)
        const brightness = newR * 0.299 + newG * 0.587 + newB * 0.114;
        if (brightness < 128) {
          newR *= 0.92;
          newG *= 0.92;
          newB *= 0.92;
        }
        
        data[i] = Math.min(255, Math.max(0, newR));
        data[i + 1] = Math.min(255, Math.max(0, newG));
        data[i + 2] = Math.min(255, Math.max(0, newB));
      }
      break;

    case "portrait":
      // Chân dung - làm đẹp da + tăng độ sáng nhẹ + tăng contrast
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        const isSkin = r > 95 && g > 40 && b > 20 && 
                      r > g && g > b && 
                      Math.max(r, g, b) - Math.min(r, g, b) > 15;
        
        if (isSkin) {
          // Làm trắng và mịn da
          const brightness = 1.1;
          const desaturate = 0.88;
          const gray = r * 0.299 + g * 0.587 + b * 0.114;
          
          data[i] = Math.min(255, (r * brightness * desaturate + gray * (1 - desaturate)));
          data[i + 1] = Math.min(255, (g * brightness * desaturate + gray * (1 - desaturate)));
          data[i + 2] = Math.min(255, (b * brightness * desaturate + gray * (1 - desaturate)));
        }
      }
      // Tăng contrast nhẹ cho toàn bộ
      const portraitContrast = 1.2;
      const portraitFactor = (259 * (portraitContrast * 255 + 255)) / (255 * (259 - portraitContrast * 255));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.min(255, Math.max(0, portraitFactor * (data[i] - 128) + 128));
        data[i + 1] = Math.min(255, Math.max(0, portraitFactor * (data[i + 1] - 128) + 128));
        data[i + 2] = Math.min(255, Math.max(0, portraitFactor * (data[i + 2] - 128) + 128));
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
