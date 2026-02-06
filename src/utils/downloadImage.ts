/**
 * Download ảnh xuống máy người dùng
 * @param blob - Blob của ảnh
 * @param filename - Tên file (không cần extension)
 */
export function downloadImage(blob: Blob, filename: string = "photobooth"): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}_${Date.now()}.jpg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
