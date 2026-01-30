# 🚀 Quick Start - Share Photobooth cho Điện Thoại

## Cách 1: Dùng Nginx (Khuyến nghị)

### Bước 1: Tìm IP máy tính

**Windows:**
```cmd
ipconfig
```
Tìm dòng "IPv4 Address" (ví dụ: `192.168.1.100`)

**Hoặc chạy:** `get-ip.bat`

### Bước 2: Setup Nginx

1. Copy file `nginx.conf` vào thư mục nginx:
   - Linux: `sudo cp nginx.conf /etc/nginx/sites-available/photobooth`
   - Windows: Copy vào `C:\nginx\conf\` hoặc thư mục nginx của bạn

2. Enable site (Linux):
   ```bash
   sudo ln -s /etc/nginx/sites-available/photobooth /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

3. Khởi động nginx (Windows):
   - Mở nginx và start service

### Bước 3: Chạy Next.js

```bash
npm run dev
```

### Bước 4: Truy cập từ điện thoại

Mở browser trên điện thoại và vào:
```
http://[IP-ADDRESS]
```

Ví dụ: `http://192.168.1.100`

---

## Cách 2: Truy cập trực tiếp (Không cần nginx)

### Bước 1: Chạy Next.js

```bash
npm run dev
```

### Bước 2: Tìm IP và truy cập

Từ điện thoại, truy cập:
```
http://[IP-ADDRESS]:3001
```

Ví dụ: `http://192.168.1.100:3001`

**⚠️ Vấn đề:** Nhiều browser mobile (đặc biệt iOS Safari) **KHÔNG cho phép camera qua HTTP** (chỉ HTTPS hoặc localhost).

---

## Cách 3: Dùng ngrok (Có HTTPS, Dễ nhất) ⭐

### Bước 1: Cài đặt ngrok

- Download từ: https://ngrok.com/download
- Hoặc: `choco install ngrok` (Windows)
- Hoặc: `brew install ngrok` (Mac)

### Bước 2: Chạy ngrok

```bash
ngrok http 3001
```

Sẽ có output như:
```
Forwarding  https://abc123.ngrok.io -> http://localhost:3001
```

### Bước 3: Truy cập từ điện thoại

Dùng URL `https://abc123.ngrok.io` trên điện thoại.

**✅ Ưu điểm:**
- Có HTTPS sẵn (camera hoạt động tốt)
- Không cần setup nginx
- Hoạt động từ mọi nơi (không cần cùng mạng)

---

## ⚠️ Lưu ý quan trọng

### Camera API yêu cầu HTTPS

Nhiều browser mobile **yêu cầu HTTPS** để truy cập camera, trừ:
- `localhost`
- `127.0.0.1`

### Giải pháp:

1. **Dùng ngrok** (dễ nhất) - Có HTTPS sẵn
2. **Setup HTTPS với nginx** - Xem `setup-nginx.md`
3. **Dùng mkcert** - Tạo local HTTPS certificate

### Firewall

Đảm bảo firewall cho phép:
- Port 80 (nginx)
- Port 3001 (Next.js)
- Port 443 (HTTPS nếu dùng)

**Windows:**
```cmd
# Mở Windows Firewall và cho phép port 80, 3001
```

**Linux:**
```bash
sudo ufw allow 80
sudo ufw allow 3001
```

---

## 🐛 Troubleshooting

### Không truy cập được từ điện thoại

1. ✅ Kiểm tra cùng mạng WiFi/LAN
2. ✅ Kiểm tra firewall
3. ✅ Kiểm tra nginx đang chạy
4. ✅ Kiểm tra Next.js đang chạy (`npm run dev`)

### Camera không hoạt động

1. ✅ Dùng HTTPS (ngrok hoặc setup HTTPS)
2. ✅ Cho phép camera trong browser settings
3. ✅ Thử browser khác (Chrome, Safari, Firefox)

### Nginx lỗi

```bash
# Kiểm tra config
sudo nginx -t

# Xem log
sudo tail -f /var/log/nginx/error.log
```

---

## 📱 Test Checklist

- [ ] Next.js chạy: `http://localhost:3001` hoạt động trên máy tính
- [ ] Tìm được IP address
- [ ] Nginx chạy (nếu dùng)
- [ ] Truy cập được từ điện thoại: `http://[IP]` hoặc `http://[IP]:3001`
- [ ] Camera hoạt động trên điện thoại (có thể cần HTTPS)

---

## 🎯 Khuyến nghị

**Cho development nhanh:** Dùng **ngrok** - Setup trong 2 phút, có HTTPS sẵn.

**Cho production:** Setup **nginx với HTTPS** - Xem `setup-nginx.md` để biết chi tiết.
