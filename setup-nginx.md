# Hướng dẫn Setup Nginx để Share Photobooth cho Điện Thoại

## 📋 Yêu cầu

- Nginx đã được cài đặt trên máy tính
- Máy tính và điện thoại cùng mạng WiFi/LAN
- Biết IP address của máy tính

## 🚀 Các bước setup

### 1. Tìm IP Address của máy tính

**Windows:**
```bash
ipconfig
# Tìm IPv4 Address (ví dụ: 192.168.1.100)
```

**Linux/Mac:**
```bash
ifconfig
# hoặc
ip addr show
# Tìm inet address (ví dụ: 192.168.1.100)
```

### 2. Cấu hình Nginx

#### Option A: Copy file config vào nginx (Linux/Mac)

```bash
# Copy config file
sudo cp nginx.conf /etc/nginx/sites-available/photobooth

# Tạo symbolic link
sudo ln -s /etc/nginx/sites-available/photobooth /etc/nginx/sites-enabled/photobooth

# Kiểm tra config
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

#### Option B: Thêm vào nginx.conf chính (Windows hoặc nếu không có sites-available)

Mở file nginx config chính (thường ở `C:\nginx\conf\nginx.conf` trên Windows hoặc `/etc/nginx/nginx.conf` trên Linux)

Thêm vào phần `http { ... }`:

```nginx
include /path/to/nginx.conf;  # Đường dẫn đến file nginx.conf trong project
```

Hoặc copy nội dung từ `nginx.conf` vào file config chính.

### 3. Khởi động Next.js với network binding

```bash
npm run dev
```

App sẽ chạy trên `http://0.0.0.0:3001` (có thể truy cập từ mạng local)

### 4. Truy cập từ điện thoại

Mở trình duyệt trên điện thoại và truy cập:

```
http://[IP-ADDRESS]
```

Ví dụ: `http://192.168.1.100`

**Lưu ý:** Nếu dùng port khác 80, thêm port vào URL: `http://192.168.1.100:80`

## ⚠️ Lưu ý về Camera API

Nhiều trình duyệt mobile (đặc biệt là iOS Safari) **yêu cầu HTTPS** để truy cập camera API, trừ khi là `localhost`.

### Giải pháp:

#### Option 1: Dùng HTTPS với Self-Signed Certificate

1. Tạo self-signed certificate:

```bash
# Tạo private key
openssl genrsa -out key.pem 2048

# Tạo certificate
openssl req -new -x509 -key key.pem -out cert.pem -days 365
```

2. Cập nhật `nginx.conf` để uncomment phần HTTPS config
3. Cập nhật đường dẫn certificate trong config
4. Reload nginx

5. Trên điện thoại, truy cập `https://[IP-ADDRESS]` và chấp nhận certificate warning

#### Option 2: Dùng ngrok (Dễ nhất, có HTTPS sẵn)

```bash
# Cài đặt ngrok
# Windows: Download từ https://ngrok.com/
# Linux/Mac: 
#   brew install ngrok
#   hoặc
#   wget https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-linux-amd64.tgz

# Chạy ngrok
ngrok http 3001

# Sẽ có URL như: https://abc123.ngrok.io
# Dùng URL này trên điện thoại
```

#### Option 3: Dùng mkcert (Local HTTPS dễ dàng)

```bash
# Cài đặt mkcert
# Windows: choco install mkcert
# Mac: brew install mkcert
# Linux: xem https://github.com/FiloSottile/mkcert

# Tạo local CA
mkcert -install

# Tạo certificate cho IP
mkcert 192.168.1.100 localhost 127.0.0.1

# Sẽ tạo ra: 192.168.1.100+2.pem và 192.168.1.100+2-key.pem
# Cập nhật nginx.conf với các file này
```

## 🔧 Troubleshooting

### Không truy cập được từ điện thoại

1. **Kiểm tra firewall:**
   - Windows: Cho phép port 80 và 3001 trong Windows Firewall
   - Linux: `sudo ufw allow 80` và `sudo ufw allow 3001`

2. **Kiểm tra nginx đang chạy:**
   ```bash
   sudo systemctl status nginx  # Linux
   # hoặc kiểm tra process manager trên Windows
   ```

3. **Kiểm tra Next.js đang chạy:**
   ```bash
   # Xem terminal có log "Ready" không
   ```

4. **Kiểm tra cùng mạng:**
   - Đảm bảo điện thoại và máy tính cùng WiFi/LAN

### Camera không hoạt động trên điện thoại

1. **Kiểm tra HTTPS:** Nhiều browser yêu cầu HTTPS
2. **Kiểm tra permission:** Cho phép camera trong browser settings
3. **Thử browser khác:** Chrome, Safari, Firefox

### Nginx không start

```bash
# Kiểm tra config
sudo nginx -t

# Xem log
sudo tail -f /var/log/nginx/error.log
```

## 📱 Test nhanh

1. Mở terminal trên máy tính
2. Chạy: `npm run dev`
3. Mở browser trên máy tính: `http://localhost:3001` (phải hoạt động)
4. Tìm IP: `ipconfig` (Windows) hoặc `ifconfig` (Linux/Mac)
5. Mở browser trên điện thoại: `http://[IP]` (qua nginx) hoặc `http://[IP]:3001` (trực tiếp)

## 🎯 Quick Start (Không cần nginx)

Nếu không muốn setup nginx, có thể truy cập trực tiếp:

1. Chạy: `npm run dev` (đã bind với 0.0.0.0)
2. Tìm IP máy tính
3. Truy cập từ điện thoại: `http://[IP]:3001`

**Nhưng:** Nhiều browser mobile sẽ không cho phép camera qua HTTP (chỉ HTTPS hoặc localhost).
