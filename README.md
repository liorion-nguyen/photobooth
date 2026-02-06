# 📸 Web Photobooth Platform

Nền tảng web photobooth đầy đủ tính năng cho phép người dùng khám phá dịch vụ, quản lý thông tin cá nhân, và chụp ảnh với filter chuyên nghiệp.

## 🎯 Mục tiêu dự án

Xây dựng một nền tảng web photobooth hoàn chỉnh với các tính năng:

### 🏠 Landing Page
- Trang chủ giới thiệu dịch vụ (giống web thương mại điện tử)
- Hero section với CTA rõ ràng
- Giới thiệu tính năng, ưu điểm
- Gallery showcase ảnh mẫu
- Pricing/Plans (nếu có)
- Testimonials/Reviews

### ℹ️ About Page
- Giới thiệu về công ty/dịch vụ
- Lịch sử phát triển
- Đội ngũ
- Tầm nhìn và sứ mệnh

### 👤 Profile Page
- Quản lý thông tin cá nhân:
  - Tên, email, số điện thoại
  - Avatar/Ảnh đại diện
  - Địa chỉ
- Quản lý ảnh đã chụp:
  - Gallery ảnh của user
  - Xem, tải xuống, xóa ảnh
  - Filter và tìm kiếm ảnh
  - Chia sẻ ảnh

### 📸 Photobooth Feature (Chức năng chính)
- ✅ Truy cập camera trực tiếp trên trình duyệt
- ✅ Chụp ảnh / quay video ngắn
- ✅ Áp dụng filter, sticker
- ✅ Preview kết quả
- ✅ Upload và lưu ảnh vào profile

**Ưu tiên:**
- Trải nghiệm mượt, chuyên nghiệp
- Mobile-first design
- UI/UX giống web thương mại điện tử hiện đại
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
│  ├─ page.tsx                    # Landing Page (trang chủ)
│  ├─ about/
│  │  └─ page.tsx                 # About Page
│  ├─ profile/
│  │  └─ page.tsx                 # Profile Page
│  ├─ photobooth/
│  │  └─ page.tsx                 # Photobooth Feature (chức năng chính)
│  ├─ layout.tsx                  # Root layout với Navigation
│  ├─ globals.css
│
├─ components/
│  ├─ Layout/
│  │  ├─ Header.tsx                # Navigation header
│  │  ├─ Footer.tsx                # Footer
│  │  ├─ Navigation.tsx            # Menu navigation
│  │
│  ├─ Landing/
│  │  ├─ Hero.tsx                  # Hero section
│  │  ├─ Features.tsx              # Tính năng nổi bật
│  │  ├─ Gallery.tsx               # Gallery showcase
│  │  ├─ Testimonials.tsx          # Đánh giá khách hàng
│  │  ├─ CTA.tsx                   # Call to action
│  │
│  ├─ About/
│  │  ├─ AboutHero.tsx
│  │  ├─ CompanyInfo.tsx
│  │  ├─ Team.tsx
│  │
│  ├─ Profile/
│  │  ├─ ProfileHeader.tsx         # Header với avatar, thông tin cơ bản
│  │  ├─ ProfileForm.tsx           # Form chỉnh sửa thông tin
│  │  ├─ PhotoGallery.tsx          # Gallery ảnh của user
│  │  ├─ PhotoCard.tsx             # Card hiển thị ảnh
│  │  ├─ PhotoActions.tsx          # Actions: download, delete, share
│  │
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
│  ├─ Layouts/
│  │  ├─ LayoutCard.tsx
│  │  ├─ LayoutCarousel.tsx
│  │  ├─ LayoutPreview.tsx
│  │  ├─ LayoutProgress.tsx
│  │  ├─ LayoutSelector.tsx
│  │
│  ├─ UI/
│  │  ├─ Button.tsx
│  │  ├─ Modal.tsx
│  │  ├─ Card.tsx
│  │  ├─ Input.tsx
│  │  ├─ Avatar.tsx
│  │
│
├─ hooks/
│  ├─ useCamera.ts
│  ├─ useCapture.ts
│  ├─ useLayout.ts
│  ├─ useAuth.ts                   # Authentication (nếu có)
│  ├─ useProfile.ts                # Profile management
│  ├─ usePhotos.ts                 # Photo management
│
├─ services/
│  ├─ upload.service.ts
│  ├─ profile.service.ts           # API profile
│  ├─ photo.service.ts             # API quản lý ảnh
│  ├─ auth.service.ts              # Authentication service
│
├─ types/
│  ├─ photo.ts
│  ├─ layout.ts
│  ├─ user.ts                      # User/Profile types
│
└─ utils/
   ├─ canvas.ts
   ├─ layout.ts
   ├─ layoutCanvas.ts
   ├─ format.ts                    # Format helpers
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

### 1. Landing Page Flow

1. **Truy cập trang chủ**
   - Hiển thị Hero section với CTA "Bắt đầu chụp ảnh"
   - Scroll để xem Features, Gallery, Testimonials
   - Navigation menu: Home, About, Profile, Photobooth

2. **CTA Actions**
   - Click "Bắt đầu" → Chuyển đến Photobooth
   - Click "Xem thêm" → Scroll đến Features
   - Click menu → Điều hướng đến các trang tương ứng

### 2. About Page Flow

- Hiển thị thông tin về dịch vụ/company
- Lịch sử phát triển
- Đội ngũ
- CTA quay lại Landing hoặc thử Photobooth

### 3. Profile Page Flow

1. **Xem thông tin cá nhân**
   - Hiển thị avatar, tên, email
   - Gallery ảnh đã chụp (grid layout)
   - Thống kê: số lượng ảnh, ngày tham gia

2. **Chỉnh sửa thông tin**
   - Click "Chỉnh sửa" → Mở form
   - Cập nhật: tên, email, số điện thoại, địa chỉ
   - Upload avatar mới
   - Lưu thay đổi

3. **Quản lý ảnh**
   - Xem ảnh trong gallery
   - Click ảnh → Xem chi tiết (fullscreen)
   - Actions: Download, Xóa, Chia sẻ
   - Filter theo ngày, filter đã áp dụng

### 4. Photobooth Flow (Chức năng chính)

#### 4.1 Truy cập Photobooth

- Từ Landing page hoặc Menu → Click "Photobooth"
- Kiểm tra trình duyệt có hỗ trợ `getUserMedia`
- Yêu cầu quyền truy cập camera
- Nếu từ chối → hiển thị hướng dẫn / fallback

#### 4.2 Camera View

- Hiển thị video stream từ camera
- Cho phép:
  - Chuyển camera (front/back)
  - Bật/tắt gương
  - Chọn layout (nếu có)
  - Chụp ảnh

#### 4.3 Chụp ảnh

- Capture frame từ `<video>` vào `<canvas>`
- Convert sang Blob / Base64
- Lưu state tạm thời

```typescript
canvas.toBlob((blob) => {
  setCapturedImage(blob)
})
```

#### 4.4 Áp dụng Filter

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

#### 4.5 Preview

- Hiển thị ảnh đã chụp + filter
- Cho phép:
  - Chụp lại
  - Thay đổi filter
  - Xác nhận lưu ảnh

#### 4.6 Lưu ảnh

- Gửi ảnh lên backend bằng `multipart/form-data`
- Hiển thị progress upload
- Sau khi thành công:
  - Lưu vào profile của user
  - Hiển thị thông báo thành công
  - Option: Xem trong Profile hoặc Chụp tiếp

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

### Landing Page
- [ ] ⏳ Hero section với CTA
- [ ] ⏳ Features section
- [ ] ⏳ Gallery showcase
- [ ] ⏳ Testimonials/Reviews
- [ ] ⏳ Footer với thông tin liên hệ

### About Page
- [ ] ⏳ Giới thiệu về dịch vụ
- [ ] ⏳ Lịch sử phát triển
- [ ] ⏳ Đội ngũ (nếu có)

### Profile Page
- [ ] ⏳ Hiển thị thông tin cá nhân
- [ ] ⏳ Form chỉnh sửa thông tin
- [ ] ⏳ Upload/đổi avatar
- [ ] ⏳ Gallery ảnh đã chụp
- [ ] ⏳ Xem chi tiết ảnh
- [ ] ⏳ Download ảnh
- [ ] ⏳ Xóa ảnh
- [ ] ⏳ Chia sẻ ảnh

### Photobooth Feature
- [x] ✅ Camera hoạt động
- [x] ✅ Chụp ảnh
- [x] ✅ Preview
- [x] ✅ Upload
- [ ] ⏳ Filter nâng cao (đã có basic filters)
- [ ] ⏳ Sticker
- [ ] ⏳ Layout selection
- [ ] ⏳ Lưu ảnh vào profile

### Navigation & Layout
- [ ] ⏳ Header với menu navigation
- [ ] ⏳ Footer
- [ ] ⏳ Responsive design cho tất cả trang
- [ ] ⏳ Loading states
- [ ] ⏳ Error handling

## ✅ Tiêu chí hoàn thành

### Landing Page
- ✅ UI/UX chuyên nghiệp, giống web thương mại điện tử
- ✅ Responsive trên mọi thiết bị
- ✅ CTA rõ ràng, dễ điều hướng

### Profile Page
- ✅ Quản lý thông tin cá nhân đầy đủ
- ✅ Gallery ảnh hiển thị mượt
- ✅ Upload/Download/Xóa ảnh hoạt động ổn định

### Photobooth
- ✅ Web chạy ổn trên Chrome / Safari mobile
- ✅ Không crash khi deny camera
- ✅ Upload thành công ≥ 95%
- ✅ UX mượt, không lag
- ✅ Lưu ảnh vào profile thành công

## 🔧 Cấu hình

### Environment Variables

Tạo file `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### API Endpoints

Mặc định API endpoint là `http://localhost:3001/api`.

Backend cần hỗ trợ:

**Authentication (nếu có):**
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user hiện tại

**Profile:**
- `GET /api/profile` - Lấy thông tin profile
- `PUT /api/profile` - Cập nhật thông tin profile
- `POST /api/profile/avatar` - Upload avatar

**Photos:**
- `POST /api/photos/upload` - Upload ảnh (multipart/form-data)
  - Response: `{ url: string, id: string, createdAt: string }`
- `GET /api/photos` - Lấy danh sách ảnh của user
  - Query params: `page`, `limit`, `filter`
  - Response: `{ photos: Photo[], total: number }`
- `GET /api/photos/:id` - Lấy chi tiết ảnh
- `DELETE /api/photos/:id` - Xóa ảnh
- `GET /api/photos/:id/download` - Download ảnh

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

### Thêm Section mới vào Landing Page

1. Tạo component trong `src/components/Landing/`
2. Import và sử dụng trong `src/app/page.tsx`
3. Đảm bảo responsive và animation mượt

### Thêm Field mới vào Profile

1. Cập nhật type `User` trong `src/types/user.ts`
2. Thêm field vào `ProfileForm.tsx`
3. Cập nhật API service trong `src/services/profile.service.ts`
4. Cập nhật backend API endpoint

### Quản lý ảnh trong Profile

1. Sử dụng `usePhotos` hook để fetch danh sách ảnh
2. Implement pagination nếu có nhiều ảnh
3. Thêm filter/search nếu cần
4. Xử lý loading và error states

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
