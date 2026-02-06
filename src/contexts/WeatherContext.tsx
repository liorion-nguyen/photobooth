"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { getWeather, mapWeatherToType } from "@/services/weather.service";
import { getWeatherAnimationConfig } from "@/utils/weatherMapper";
import type { WeatherData, WeatherType, WeatherAnimationConfig } from "@/types/weather";

interface WeatherContextType {
  weather: WeatherData | null;
  weatherType: WeatherType;
  animationConfig: WeatherAnimationConfig;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getWeather();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
      console.error("Weather fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Refresh weather every hour
    const interval = setInterval(fetchWeather, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const weatherType = weather ? mapWeatherToType(weather.main) : "Clear";
  const animationConfig = getWeatherAnimationConfig(weatherType, weather?.windSpeed || 0);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        weatherType,
        animationConfig,
        loading,
        error,
        refresh: fetchWeather,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error("useWeather must be used within a WeatherProvider");
  }
  return context;
}
