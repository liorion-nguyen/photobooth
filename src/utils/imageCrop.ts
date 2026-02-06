/**
 * Crop ảnh theo aspect ratio cụ thể
 * @param imageDataUrl - Data URL của ảnh gốc
 * @param targetAspectRatio - Aspect ratio mong muốn (width/height)
 * @returns Data URL của ảnh đã crop
 */
export function cropImageToAspectRatio(
  imageDataUrl: string,
  targetAspectRatio: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      if (!ctx) {
        reject(new Error("Cannot get canvas context"));
        return;
      }

      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgAspectRatio = imgWidth / imgHeight;

      let cropWidth = imgWidth;
      let cropHeight = imgHeight;
      let cropX = 0;
      let cropY = 0;

      if (imgAspectRatio > targetAspectRatio) {
        // Ảnh rộng hơn target, crop theo width (cắt 2 bên)
        cropWidth = imgHeight * targetAspectRatio;
        cropX = (imgWidth - cropWidth) / 2;
      } else {
        // Ảnh cao hơn target, crop theo height (cắt trên dưới)
        cropHeight = imgWidth / targetAspectRatio;
        cropY = (imgHeight - cropHeight) / 2;
      }

      // Set canvas size = crop size
      canvas.width = cropWidth;
      canvas.height = cropHeight;

      // Vẽ phần ảnh đã crop
      ctx.drawImage(
        img,
        cropX, cropY, cropWidth, cropHeight, // Source crop
        0, 0, cropWidth, cropHeight // Destination
      );

      // Convert to data URL
      const croppedDataUrl = canvas.toDataURL("image/jpeg", 0.9);
      resolve(croppedDataUrl);
    };

    img.onerror = reject;
    img.src = imageDataUrl;
  });
}

/**
 * Tính aspect ratio của cell trong layout
 * @param rows - Số hàng
 * @param cols - Số cột
 * @returns Aspect ratio (width/height) - Luôn là 4:3
 */
export function getCellAspectRatio(rows: number, cols: number): number {
  // Luôn trả về 4:3 cho mỗi ảnh
  return 4 / 3;
}
