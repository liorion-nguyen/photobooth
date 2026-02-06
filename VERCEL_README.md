# Photobooth Frontend - Vercel Deployment

Frontend Next.js được deploy trên Vercel với hỗ trợ native.

## 📁 Cấu trúc

- `vercel.json` - Cấu hình Vercel
- `.vercelignore` - Files/folders bị ignore khi deploy
- `next.config.js` - Cấu hình Next.js

## 🚀 Deploy

Xem hướng dẫn chi tiết tại [VERCEL_DEPLOY.md](../VERCEL_DEPLOY.md)

### Quick Start

1. Cài đặt dependencies:
```bash
npm install
```

2. Deploy qua Vercel CLI:
```bash
vercel
```

Hoặc import project qua Vercel Dashboard và chọn thư mục `photobooth-fe`.

## ⚙️ Environment Variables

Đảm bảo đã set các biến môi trường trong Vercel Dashboard:
- `NEXT_PUBLIC_API_URL` - URL của backend API

## 🔧 Build

Vercel sẽ tự động detect Next.js và build. Build command: `npm run build`

## 📝 Notes

- Next.js được hỗ trợ native trên Vercel
- Static assets được serve qua Vercel Edge Network
- API routes (nếu có) được deploy như serverless functions
