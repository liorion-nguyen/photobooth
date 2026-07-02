"use client";

import Footer from "@/components/Layout/Footer";
import Header from "@/components/Layout/Header";
import WeatherNotification from "@/components/Weather/WeatherNotification";
import { useImmersiveMode } from "@/contexts/ImmersiveModeContext";

export default function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isImmersive } = useImmersiveMode();

  return (
    <div
      className={`min-h-screen flex flex-col relative ${
        isImmersive ? "bg-[#0c0a0f]" : ""
      }`}
    >
      <div className={`relative z-10 ${isImmersive ? "bg-[#0c0a0f]" : "bg-transparent"}`}>
        {!isImmersive && <Header />}
        <main
          className={`flex-1 ${
            isImmersive ? "p-0 bg-[#0c0a0f] min-h-screen" : "bg-transparent pt-[88px]"
          }`}
        >
          {children}
        </main>
        {!isImmersive && <Footer />}
      </div>
      {!isImmersive && <WeatherNotification />}
    </div>
  );
}
