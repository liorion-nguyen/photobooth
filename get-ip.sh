#!/bin/bash
# Script để lấy IP address của máy tính

echo "🔍 Đang tìm IP address..."
echo ""

# Linux
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    echo "IP Addresses:"
    ip -4 addr show | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | grep -v '127.0.0.1'
fi

# Mac
if [[ "$OSTYPE" == "darwin"* ]]; then
    echo "IP Addresses:"
    ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'
fi

# Windows (WSL)
if [[ "$OSTYPE" == "msys" ]] || [[ -n "$WSL_DISTRO_NAME" ]]; then
    echo "IP Addresses:"
    ipconfig.exe | grep "IPv4" | awk '{print $NF}'
fi

echo ""
echo "📱 Truy cập từ điện thoại:"
echo "   http://[IP-ADDRESS] (qua nginx)"
echo "   hoặc"
echo "   http://[IP-ADDRESS]:3001 (trực tiếp)"
echo ""
echo "⚠️  Lưu ý: Nhiều browser mobile yêu cầu HTTPS để dùng camera!"
