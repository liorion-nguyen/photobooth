"use client";

import { useWeather } from "@/contexts/WeatherContext";
import { Cloud, Sun, CloudRain, Zap, Snowflake, Wind, Eye } from "lucide-react";

export default function WeatherIndicator() {
  const { weather, weatherType, loading } = useWeather();

  if (loading || !weather) return null;

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

  const IconComponent = icons[weatherType] || Sun;

  return (
    <div className="fixed bottom-4 left-4 z-50 bg-white/90 backdrop-blur-md rounded-lg shadow-lg border border-gray-200 p-3">
      <div className="flex items-center gap-2">
        <IconComponent className="w-5 h-5 text-purple-600" />
        <div className="text-sm">
          <div className="font-semibold text-gray-800">{weather.temp}°C</div>
          <div className="text-xs text-gray-600">{weather.description}</div>
        </div>
      </div>
    </div>
  );
}
