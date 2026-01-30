# 📸 Web Photobooth – Frontend

Web photobooth cho phép người dùng chụp ảnh, áp dụng filter, và upload ảnh trực tiếp trên trình duyệt.

## 🎯 Mục tiêu dự án

Xây dựng web photobooth cho phép người dùng:

- ✅ Truy cập camera trực tiếp trên trình duyệt
- ✅ Chụp ảnh / quay video ngắn
- ✅ Áp dụng filter, sticker
- ✅ Preview kết quả
- ✅ Upload và chia sẻ ảnh

**Ưu tiên:**
- Trải nghiệm mượt
- Mobile-first
- Dễ mở rộng tính năng

## 🛠️ Công nghệ sử dụng

- **Framework:** Next.js 14 (React)
- **Ngôn ngữ:** TypeScript
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **State:** React Hooks / Context
- **Media xử lý:** HTML5 Video, Canvas API
- **API:** RESTful (NestJS backend)

## 📁 Cấu trúc thư mục

```
src/
├─ app/ (Next App Router)
│  ├─ page.tsx            # Trang chính photobooth
│  ├─ layout.tsx
│  ├─ globals.css
│
├─ components/
│  ├─ Camera/
│  │  ├─ CameraView.tsx
│  │  ├─ CameraControls.tsx
│  │
│  ├─ Preview/
│  │  ├─ PreviewImage.tsx
│  │
│  ├─ Filters/
│  │  ├─ FilterList.tsx
│  │  ├─ applyFilter.ts
│  │
│  ├─ UI/
│     ├─ Button.tsx
│     ├─ Modal.tsx
│
├─ hooks/
│  ├─ useCamera.ts
│  ├─ useCapture.ts
│
├─ services/
│  ├─ upload.service.ts
│
├─ types/
│  ├─ photo.ts
│
└─ utils/
   ├─ canvas.ts
```

## 🚀 Cài đặt và chạy

### Yêu cầu

- Node.js >= 18.0.0
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
# hoặc
yarn install
```

### Chạy development server

```bash
npm run dev
# hoặc
yarn dev
```

Mở [http://localhost:3000](http://localhost:3000) trên trình duyệt.

### Build production

```bash
npm run build
npm start
```

## 🔄 Luồng xử lý chính (User Flow)

### 4.1 Truy cập trang

- Kiểm tra trình duyệt có hỗ trợ `getUserMedia`
- Yêu cầu quyền truy cập camera
- Nếu từ chối → hiển thị hướng dẫn / fallback

### 4.2 Camera View

- Hiển thị video stream từ camera
- Cho phép:
  - Chuyển camera (front/back)
  - Bật/tắt gương
  - Chụp ảnh

### 4.3 Chụp ảnh

- Capture frame từ `<video>` vào `<canvas>`
- Convert sang Blob / Base64
- Lưu state tạm thời

```typescript
canvas.toBlob((blob) => {
  setCapturedImage(blob)
})
```

### 4.4 Áp dụng Filter

- Filter xử lý client-side
- Sử dụng Canvas API
- Filter không làm thay đổi ảnh gốc

**Các filter hỗ trợ:**
- Grayscale (Đen trắng)
- Sepia
- Brightness (Sáng)
- Contrast (Tương phản)
- Vintage
- Blur (Mờ)

### 4.5 Preview

- Hiển thị ảnh đã chụp + filter
- Cho phép:
  - Chụp lại
  - Xác nhận upload

### 4.6 Upload

- Gửi ảnh lên backend bằng `multipart/form-data`
- Hiển thị progress upload
- Sau khi thành công → nhận URL ảnh

## 🎣 Hooks

### `useCamera`

Khởi tạo camera, handle permission, cleanup stream khi unmount.

**API:**
```typescript
const {
  stream,
  videoRef,
  isStreaming,
  error,
  facingMode,
  hasPermission,
  startCamera,
  stopCamera,
  switchCamera,
  requestPermission,
} = useCamera();
```

### `useCapture`

Capture ảnh từ video, xử lý canvas, trả về ảnh preview.

**API:**
```typescript
const { capture } = useCapture({ videoRef, mirror: false });
const result = await capture();
```

## 🎨 UI/UX

- ✅ Responsive 100%
- ✅ Mobile ưu tiên
- ✅ Nút chụp to, dễ thao tác
- ✅ Hiệu ứng animation nhẹ
- ✅ Trạng thái loading rõ ràng

## ⚠️ Error Handling

Xử lý các lỗi:
- ❌ Không có camera
- ❌ User từ chối permission
- ❌ Upload thất bại
- ❌ Browser không hỗ trợ

➡️ Mọi lỗi đều có UI thông báo rõ ràng.

## ⚡ Performance

- ✅ Resize ảnh trước khi upload (max width 1080px)
- ✅ Nén ảnh (JPEG/WebP)
- ✅ Không block main thread khi xử lý ảnh

## 🔒 Security

- ✅ Không lưu ảnh lâu trên client
- ✅ Clear state khi reload
- ✅ Không expose API key

## 📋 MVP Checklist

- [x] ✅ Camera hoạt động
- [x] ✅ Chụp ảnh
- [x] ✅ Preview
- [x] ✅ Upload
- [ ] ⏳ Filter nâng cao (đã có basic filters)
- [ ] ⏳ Sticker
- [ ] ⏳ Share link

## ✅ Tiêu chí hoàn thành

- ✅ Web chạy ổn trên Chrome / Safari mobile
- ✅ Không crash khi deny camera
- ✅ Upload thành công ≥ 95%
- ✅ UX mượt, không lag

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### API Endpoint

Mặc định API endpoint là `http://localhost:3001/api/photos/upload`.

Backend cần hỗ trợ:
- `POST /api/photos/upload` - Upload ảnh (multipart/form-data)
- Response: `{ url: string, id?: string }`

## 🌐 Share cho Điện Thoại (Nginx Setup)

Để truy cập app từ điện thoại qua mạng local:

### Quick Start (Không cần nginx)

1. Chạy: `npm run dev` (đã bind với 0.0.0.0)
2. Tìm IP máy tính:
   - Windows: `get-ip.bat` hoặc `ipconfig`
   - Linux/Mac: `./get-ip.sh` hoặc `ifconfig`
3. Truy cập từ điện thoại: `http://[IP]:3001`

**⚠️ Lưu ý:** Nhiều browser mobile yêu cầu HTTPS để dùng camera (trừ localhost).

### Setup Nginx (Khuyến nghị)

Xem file **[setup-nginx.md](./setup-nginx.md)** để có hướng dẫn chi tiết.

**Tóm tắt:**
1. Copy `nginx.conf` vào nginx sites-available
2. Enable site và reload nginx
3. Truy cập từ điện thoại: `http://[IP]` (port 80)

**Giải pháp HTTPS (cho camera trên mobile):**
- Dùng **ngrok** (dễ nhất): `ngrok http 3001`
- Dùng **mkcert** (local HTTPS): Xem setup-nginx.md
- Tự tạo self-signed certificate

## 📱 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Lưu ý:** Cần HTTPS hoặc localhost để truy cập camera.

## 🧪 Testing

```bash
# Lint
npm run lint

# Type check
npx tsc --noEmit
```

## 📝 Development Notes

### Thêm Filter mới

1. Thêm type vào `src/types/photo.ts`:
```typescript
export type FilterType = ... | "newFilter";
```

2. Implement logic trong `src/utils/canvas.ts`:
```typescript
case "newFilter":
  // Filter logic
  break;
```

3. Thêm vào `FilterList.tsx`:
```typescript
{ value: "newFilter", label: "Tên Filter" }
```

### Thêm Sticker

1. Tạo component `StickerOverlay.tsx`
2. Thêm sticker selection UI
3. Render sticker trên canvas khi capture

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Photobooth Team

---

**Note:** MVP ưu tiên đúng – ổn – nhanh, không ôm đồm filter phức tạp từ đầu.
# photobooth
