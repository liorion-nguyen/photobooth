# Hướng dẫn sửa lỗi Weather API

## Bước 1: Thêm API Key vào .env

Thêm dòng sau vào file `.env` trong thư mục `photobooth-fe`:

```env
NEXT_PUBLIC_WEATHER_API_KEY=b451551bdc0b18705cb11e0b3ec907d3
```

## Bước 2: Restart Dev Server

**QUAN TRỌNG**: Sau khi thêm env variable, bạn **PHẢI restart** dev server:

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại:
npm run dev
```

Next.js chỉ load env variables khi khởi động, nên cần restart.

## Bước 3: Kiểm tra trong Browser Console

Mở browser console (F12) và kiểm tra:
- Nếu thấy: `Weather API key not configured` → API key chưa được load
- Nếu thấy: `Error fetching weather:` → Có lỗi từ API

## Bước 4: Test API trực tiếp

Mở browser và test URL này:
```
https://api.openweathermap.org/data/2.5/weather?lat=18.6667&lon=105.7667&appid=b451551bdc0b18705cb11e0b3ec907d3&units=metric&lang=vi
```

Nếu thấy JSON response → API key hoạt động
Nếu thấy lỗi 401 → API key không hợp lệ
Nếu thấy lỗi 429 → Quá nhiều requests (free tier limit)

## Các lỗi thường gặp:

### 1. "Weather API key not configured"
→ API key chưa được thêm vào .env hoặc chưa restart server

### 2. "Weather API error: 401"
→ API key không hợp lệ hoặc đã bị revoke

### 3. "Weather API error: 429"
→ Đã vượt quá free tier limit (60 calls/min)
→ Đợi 1 phút rồi thử lại

### 4. CORS Error
→ OpenWeatherMap API không hỗ trợ CORS từ browser
→ Cần proxy qua backend hoặc dùng server-side fetch

## Lưu ý về CORS:

OpenWeatherMap API có thể block CORS requests từ browser. Nếu gặp CORS error, có 2 cách:

### Option 1: Fetch từ Server-side (Recommended)
Tạo API route trong Next.js để proxy request:

```typescript
// app/api/weather/route.ts
export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=18.6667&lon=105.7667&appid=${apiKey}&units=metric&lang=vi`;
  
  const res = await fetch(url);
  const data = await res.json();
  return Response.json(data);
}
```

Sau đó update `weather.service.ts` để fetch từ `/api/weather` thay vì trực tiếp từ OpenWeatherMap.

### Option 2: Dùng Next.js API Route
Đã được implement trong code hiện tại, nhưng cần đảm bảo API key được set đúng.
