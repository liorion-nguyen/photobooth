"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, CloudRain, Zap, Snowflake, Wind, Eye } from "lucide-react";
import type { WeatherData } from "@/types/weather";

const mockWeathers: Record<string, WeatherData> = {
  Clear: {
    main: "Clear",
    description: "trời quang đãng",
    temp: 28,
    feelsLike: 30,
    windSpeed: 2.5,
    humidity: 55,
    icon: "01d",
  },
  Clouds: {
    main: "Clouds",
    description: "có mây",
    temp: 24,
    feelsLike: 26,
    windSpeed: 3.0,
    humidity: 65,
    icon: "02d",
  },
  Rain: {
    main: "Rain",
    description: "mưa nhẹ",
    temp: 22,
    feelsLike: 24,
    windSpeed: 4.5,
    humidity: 85,
    icon: "10d",
  },
  Thunderstorm: {
    main: "Thunderstorm",
    description: "có bão",
    temp: 20,
    feelsLike: 22,
    windSpeed: 8.0,
    humidity: 90,
    icon: "11d",
  },
  Snow: {
    main: "Snow",
    description: "tuyết rơi",
    temp: -2,
    feelsLike: -5,
    windSpeed: 3.5,
    humidity: 75,
    icon: "13d",
  },
  Wind: {
    main: "Clear",
    description: "có gió mạnh",
    temp: 25,
    feelsLike: 23,
    windSpeed: 7.0,
    humidity: 60,
    icon: "01d",
  },
  Fog: {
    main: "Fog",
    description: "sương mù",
    temp: 18,
    feelsLike: 18,
    windSpeed: 1.0,
    humidity: 95,
    icon: "50d",
  },
};

const weatherIcons = {
  Clear: Sun,
  Clouds: Cloud,
  Rain: CloudRain,
  Thunderstorm: Zap,
  Snow: Snowflake,
  Wind: Wind,
  Fog: Eye,
};

export default function WeatherTester() {
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const applyMockWeather = (weatherKey: string) => {
    const mockData = mockWeathers[weatherKey];
    if (!mockData) return;

    // Store in localStorage to override real weather
    const cache = {
      data: mockData,
      timestamp: Date.now(),
    };
    localStorage.setItem("photobooth_weather_cache", JSON.stringify(cache));
    localStorage.setItem("photobooth_weather_mock", weatherKey);

    setSelectedWeather(weatherKey);
    // Reload page to apply changes
    window.location.reload();
  };

  const clearMock = () => {
    localStorage.removeItem("photobooth_weather_cache");
    localStorage.removeItem("photobooth_weather_mock");
    setSelectedWeather(null);
    window.location.reload();
  };

  // Check if mock is active
  const activeMock = typeof window !== "undefined" 
    ? localStorage.getItem("photobooth_weather_mock") 
    : null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Test Weather Animations"
      >
        <Cloud className="w-5 h-5" />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="absolute bottom-16 right-0 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 w-64"
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Test Weather</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {activeMock && (
            <div className="mb-3 p-2 bg-purple-50 rounded-lg text-xs text-purple-700">
              Active: {activeMock}
            </div>
          )}

          <div className="space-y-2">
            {Object.entries(mockWeathers).map(([key, weather]) => {
              const IconComponent = weatherIcons[key as keyof typeof weatherIcons] || Sun;
              const isActive = activeMock === key;

              return (
                <motion.button
                  key={key}
                  onClick={() => applyMockWeather(key)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-purple-100 text-purple-700 border-2 border-purple-500"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="flex-1 text-left">{weather.description}</span>
                  {isActive && <span className="text-xs">✓</span>}
                </motion.button>
              );
            })}

            {activeMock && (
              <button
                onClick={clearMock}
                className="w-full mt-3 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100 transition-colors border border-red-200"
              >
                Clear Mock & Use Real Weather
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
