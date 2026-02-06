export interface WeatherData {
  main: string; // Clear, Clouds, Rain, Thunderstorm, Snow, etc.
  description: string;
  temp: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  icon: string;
}

export type WeatherType = 
  | "Clear" 
  | "Clouds" 
  | "Rain" 
  | "Thunderstorm" 
  | "Snow" 
  | "Wind" 
  | "Fog" 
  | "Mist"
  | "Drizzle";

export interface WeatherAnimationConfig {
  type: WeatherType;
  particles: "warm" | "drops" | "snowflakes" | "wind" | "none";
  gradient: string;
  intensity: "low" | "medium" | "high";
}

export interface DailyNotificationData {
  date: string; // YYYY-MM-DD
  count: number;
  lastShown: number; // timestamp
  messages: string[];
}
