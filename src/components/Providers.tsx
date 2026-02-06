"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { WeatherProvider } from "@/contexts/WeatherContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WeatherProvider>
      <AuthProvider>{children}</AuthProvider>
    </WeatherProvider>
  );
}
