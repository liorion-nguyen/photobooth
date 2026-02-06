import type { WeatherType, WeatherAnimationConfig } from "@/types/weather";

export function getWeatherAnimationConfig(weatherType: WeatherType, windSpeed: number = 0): WeatherAnimationConfig {
  // Check for wind conditions
  const isWindy = windSpeed > 5;
  
  const configs: Record<WeatherType, WeatherAnimationConfig> = {
    Clear: {
      type: "Clear",
      particles: "warm",
      gradient: "from-yellow-400 via-orange-300 to-yellow-200",
      intensity: "medium",
    },
    Clouds: {
      type: "Clouds",
      particles: "none",
      gradient: "from-gray-200 via-gray-100 to-white",
      intensity: "low",
    },
    Rain: {
      type: "Rain",
      particles: "drops",
      gradient: "from-blue-600 via-gray-500 to-gray-400",
      intensity: "high",
    },
    Thunderstorm: {
      type: "Thunderstorm",
      particles: "drops",
      gradient: "from-gray-800 via-gray-700 to-gray-900",
      intensity: "high",
    },
    Snow: {
      type: "Snow",
      particles: "snowflakes",
      gradient: "from-blue-100 via-white to-gray-100",
      intensity: "medium",
    },
    Wind: {
      type: "Wind",
      particles: "wind",
      gradient: "from-gray-300 via-gray-200 to-gray-100",
      intensity: isWindy ? "high" : "medium",
    },
    Fog: {
      type: "Fog",
      particles: "none",
      gradient: "from-gray-300 via-gray-200 to-gray-300",
      intensity: "low",
    },
    Mist: {
      type: "Mist",
      particles: "none",
      gradient: "from-gray-200 via-gray-100 to-gray-200",
      intensity: "low",
    },
    Drizzle: {
      type: "Rain",
      particles: "drops",
      gradient: "from-blue-400 via-gray-300 to-gray-200",
      intensity: "low",
    },
  };
  
  // Override with Wind if wind speed is high
  if (isWindy && weatherType !== "Thunderstorm" && weatherType !== "Rain") {
    return {
      type: "Wind",
      particles: "wind",
      gradient: "from-gray-300 via-gray-200 to-gray-100",
      intensity: "high",
    };
  }
  
  return configs[weatherType] || configs.Clear;
}
