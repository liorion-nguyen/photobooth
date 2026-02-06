# Hướng dẫn cấu hình Weather API

## 1. Lấy API Key từ OpenWeatherMap

1. Truy cập: https://openweathermap.org/api
2. Đăng ký tài khoản miễn phí
3. Vào phần "API keys" trong dashboard
4. Copy API key của bạn

## 2. Thêm vào file .env

Thêm dòng sau vào file `.env` trong thư mục `photobooth-fe`:

```env
NEXT_PUBLIC_WEATHER_API_KEY=your_api_key_here
```

## 3. Không có API Key?

Nếu không có API key, hệ thống sẽ tự động sử dụng thời tiết mặc định (nắng đẹp) và vẫn hoạt động bình thường.

## 4. Các tính năng

- ✅ Fetch thời tiết từ API OpenWeatherMap (Nghi Xuân, Hà Tĩnh)
- ✅ Cache 1 giờ để giảm API calls
- ✅ Animation tự động theo thời tiết:
  - ☀️ Nắng: Sun rays, warm particles
  - ☁️ Mây: Floating clouds
  - 🌧️ Mưa: Rain drops animation
  - ⚡ Bão: Lightning effects
  - ❄️ Tuyết: Snowflakes
  - 💨 Gió: Wind particles
- ✅ Nhắc nhở hàng ngày (tối đa 3 lần/ngày)
- ✅ Tự động reset mỗi ngày mới

## 5. Customization

Bạn có thể thay đổi:
- Số lần nhắc nhở mỗi ngày: `MAX_NOTIFICATIONS_PER_DAY` trong `useDailyNotification.ts`
- Thời gian cache: `CACHE_DURATION` trong `weather.service.ts`
- Vị trí địa lý: `LAT` và `LON` trong `weather.service.ts`
