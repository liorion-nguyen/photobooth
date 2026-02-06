import { NextResponse } from "next/server";

const WEATHER_API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "";
const LAT = 18.6667; // Nghi Xuân, Hà Tĩnh
const LON = 105.7667;

export async function GET() {
  // If no API key, return default weather
  if (!WEATHER_API_KEY) {
    return NextResponse.json({
      weather: [{ main: "Clear", description: "trời quang đãng", icon: "01d" }],
      main: {
        temp: 25,
        feels_like: 27,
        humidity: 60,
      },
      wind: {
        speed: 2.5,
      },
    });
  }

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&appid=${WEATHER_API_KEY}&units=metric&lang=vi`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Weather API error:", response.status, errorText);
      
      // Return default weather on error
      return NextResponse.json({
        weather: [{ main: "Clear", description: "trời quang đãng", icon: "01d" }],
        main: {
          temp: 25,
          feels_like: 27,
          humidity: 60,
        },
        wind: {
          speed: 2.5,
        },
      });
    }
    
    const data = await response.json();
    
    // Check for API error response
    if (data.cod && data.cod !== 200) {
      console.error("Weather API returned error:", data);
      return NextResponse.json({
        weather: [{ main: "Clear", description: "trời quang đãng", icon: "01d" }],
        main: {
          temp: 25,
          feels_like: 27,
          humidity: 60,
        },
        wind: {
          speed: 2.5,
        },
      });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching weather:", error);
    // Return default weather on error
    return NextResponse.json({
      weather: [{ main: "Clear", description: "trời quang đãng", icon: "01d" }],
      main: {
        temp: 25,
        feels_like: 27,
        humidity: 60,
      },
      wind: {
        speed: 2.5,
      },
    });
  }
}
