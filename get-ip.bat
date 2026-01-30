@echo off
REM Script để lấy IP address trên Windows

echo 🔍 Đang tìm IP address...
echo.

ipconfig | findstr /i "IPv4"

echo.
echo 📱 Truy cập từ điện thoại:
echo    http://[IP-ADDRESS] (qua nginx)
echo    hoặc
echo    http://[IP-ADDRESS]:3001 (trực tiếp)
echo.
echo ⚠️  Lưu ý: Nhiều browser mobile yêu cầu HTTPS để dùng camera!
echo.

pause
