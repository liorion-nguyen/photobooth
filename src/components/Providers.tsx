"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { ImmersiveModeProvider } from "@/contexts/ImmersiveModeContext";
import { WeatherProvider } from "@/contexts/WeatherContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WeatherProvider>
      <AuthProvider>
        <ImmersiveModeProvider>{children}</ImmersiveModeProvider>
      </AuthProvider>
    </WeatherProvider>
  );
}
