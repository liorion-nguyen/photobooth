import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import WeatherAnimation from "@/components/Weather/WeatherAnimation";
import WeatherNotification from "@/components/Weather/WeatherNotification";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col relative">
      <WeatherAnimation />
      <div className="relative z-10 bg-transparent">
        <Header />
        <main className="flex-1 bg-transparent">{children}</main>
        <Footer />
      </div>
      <WeatherNotification />
    </div>
  );
}
