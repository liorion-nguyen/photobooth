import type { WeatherData, WeatherType } from "@/types/weather";

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "";
const WEATHER_CACHE_KEY = "photobooth_weather_cache";
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour
const LAT = 18.6667; // Nghi Xuân, Hà Tĩnh
const LON = 105.7667;

interface WeatherCache {
  data: WeatherData;
  timestamp: number;
}

function getCachedWeather(): WeatherData | null {
  if (typeof window === "undefined") return null;
  
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;
    
    const cache: WeatherCache = JSON.parse(cached);
    const now = Date.now();
    
    // Check if cache is still valid (within 1 hour)
    if (now - cache.timestamp < CACHE_DURATION) {
      return cache.data;
    }
    
    // Cache expired, remove it
    localStorage.removeItem(WEATHER_CACHE_KEY);
    return null;
  } catch (error) {
    console.error("Error reading weather cache:", error);
    return null;
  }
}

function setCachedWeather(data: WeatherData): void {
  if (typeof window === "undefined") return;
  
  try {
    const cache: WeatherCache = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cache));
  } catch (error) {
    console.error("Error caching weather:", error);
  }
}

export async function getWeather(): Promise<WeatherData | null> {
  // Check for mock weather first (for testing)
  if (typeof window !== "undefined") {
    const mockKey = localStorage.getItem("photobooth_weather_mock");
    if (mockKey) {
      const cached = getCachedWeather();
      if (cached) {
        console.log("🌤️ Using mock weather:", mockKey);
        return cached;
      }
    }
  }

  // Check cache first
  const cached = getCachedWeather();
  if (cached) {
    return cached;
  }

  // If no API key, return default sunny weather
  if (!WEATHER_API_KEY) {
    console.warn("Weather API key not configured, using default sunny weather");
    return {
      main: "Clear",
      description: "trời quang đãng",
      temp: 25,
      feelsLike: 27,
      windSpeed: 2.5,
      humidity: 60,
      icon: "01d",
    };
  }

  try {
    // Use Next.js API route to avoid CORS issues
    const url = '/api/weather';
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data (API route handles caching)
    });
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check for API error response
    if (data.cod && data.cod !== 200) {
      console.error('Weather API returned error:', data);
      throw new Error(data.message || 'Weather API error');
    }
    
    const weatherData: WeatherData = {
      main: data.weather[0]?.main || "Clear",
      description: data.weather[0]?.description || "trời quang đãng",
      temp: Math.round(data.main?.temp || 25),
      feelsLike: Math.round(data.main?.feels_like || 27),
      windSpeed: data.wind?.speed || 0,
      humidity: data.main?.humidity || 60,
      icon: data.weather[0]?.icon || "01d",
    };
    
    // Cache the result
    setCachedWeather(weatherData);
    
    return weatherData;
  } catch (error) {
    console.error("Error fetching weather:", error);
    // Return default sunny weather on error
    return {
      main: "Clear",
      description: "trời quang đãng",
      temp: 25,
      feelsLike: 27,
      windSpeed: 2.5,
      humidity: 60,
      icon: "01d",
    };
  }
}

export function mapWeatherToType(weatherMain: string): WeatherType {
  const mapping: Record<string, WeatherType> = {
    Clear: "Clear",
    Clouds: "Clouds",
    Rain: "Rain",
    Drizzle: "Rain",
    Thunderstorm: "Thunderstorm",
    Snow: "Snow",
    Mist: "Mist",
    Fog: "Fog",
    Haze: "Fog",
  };
  
  return mapping[weatherMain] || "Clear";
}
