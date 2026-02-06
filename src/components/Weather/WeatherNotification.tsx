"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Cloud, Sun, CloudRain, Zap, Snowflake, Wind, Eye } from "lucide-react";
import { useDailyNotification } from "@/hooks/useDailyNotification";
import { useWeather } from "@/contexts/WeatherContext";

const weatherMessages: Record<string, string[]> = {
  Clear: [
    "Thời tiết hôm nay đẹp lắm, chúc bạn có một ngày tốt lành!",
    "Trời nắng ấm, chúc bạn một ngày vui vẻ và nhiều năng lượng!",
  ],
  Clouds: [
    "Trời có mây nhẹ, mát mẻ dễ chịu. Chúc bạn một ngày tốt lành!",
    "Thời tiết ôn hòa, chúc bạn có ngày làm việc hiệu quả!",
  ],
  Rain: [
    "Nay có mưa, bạn nhớ mang theo dù nhé!",
    "Trời mưa rồi, nhớ mang ô và giữ ấm khi ra ngoài nhé!",
  ],
  Thunderstorm: [
    "Có bão kèm mưa to, bạn hạn chế ra ngoài và nhớ mang theo dù nhé!",
    "Thời tiết xấu, hãy ở nơi an toàn và nhớ mang theo ô khi cần ra ngoài!",
  ],
  Snow: [
    "Trời có tuyết, nhớ mặc ấm và cẩn thận khi di chuyển nhé!",
    "Thời tiết lạnh, chúc bạn giữ sức khỏe và có ngày an lành!",
  ],
  Wind: [
    "Hôm nay có gió, ra ngoài nhớ mặc đủ ấm và cẩn thận nhé!",
    "Gió khá mạnh, chúc bạn một ngày an toàn và vui vẻ!",
  ],
  Fog: [
    "Sương mù nhiều, di chuyển cẩn thận và chúc bạn ngày tốt lành!",
    "Tầm nhìn hạn chế do sương, lái xe và đi lại cẩn thận nhé!",
  ],
  Mist: [
    "Trời có sương mù nhẹ, chúc bạn một ngày bình an!",
  ],
  Drizzle: [
    "Có mưa phùn nhẹ, bạn nhớ mang theo dù nhé!",
    "Trời đang mưa nhỏ, chuẩn bị ô khi ra ngoài nhé!",
  ],
};

function getWeatherIcon(weatherType: string) {
  const icons = {
    Clear: Sun,
    Clouds: Cloud,
    Rain: CloudRain,
    Thunderstorm: Zap,
    Snow: Snowflake,
    Wind: Wind,
    Fog: Eye,
    Mist: Eye,
  };
  return icons[weatherType as keyof typeof icons] || Sun;
}

export default function WeatherNotification() {
  const { shouldShow, markAsShown, dismiss } = useDailyNotification();
  const { weather, weatherType, loading } = useWeather();
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const displayedMessageRef = useRef<string | null>(null);

  // Hiển thị thông báo khi: đủ điều kiện nhắc + đã có dữ liệu thời tiết (hoặc không loading)
  useEffect(() => {
    if (!shouldShow || hasTriggered) return;
    if (loading) return;
    const type = weatherType || "Clear";
    const messages = weatherMessages[type] || weatherMessages.Clear;
    const chosen = messages[Math.floor(Math.random() * messages.length)];
    displayedMessageRef.current = chosen;
    setHasTriggered(true);
    setIsVisible(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (displayedMessageRef.current) markAsShown(displayedMessageRef.current);
      dismiss();
    }, 8000);
    return () => clearTimeout(timer);
  }, [shouldShow, loading, weatherType, hasTriggered, markAsShown, dismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    const messages = weatherMessages[weatherType] || weatherMessages.Clear;
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    markAsShown(randomMessage);
    dismiss();
  };

  if (!shouldShow || !isVisible) return null;
  // Dùng luôn khi đã trigger (có thể weather chưa kịp có nhưng weatherType từ context đã có)
  const effectiveWeather = weather || { description: "trời đẹp", temp: 0 };
  const effectiveType = weatherType || "Clear";

  const message = displayedMessageRef.current || (weatherMessages[effectiveType] || weatherMessages.Clear)[0];
  const IconComponent = getWeatherIcon(effectiveType);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className="fixed top-24 right-4 z-50 max-w-sm"
        >
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                  <IconComponent className="w-6 h-6" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-800">
                    Thời tiết hôm nay
                  </h4>
                  <button
                    onClick={handleDismiss}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 mb-2">{message}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span>{effectiveWeather.description}</span>
                  <span>•</span>
                  <span>{effectiveWeather.temp}°C</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
