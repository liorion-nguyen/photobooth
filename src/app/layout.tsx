import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin", "vietnamese"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Photobooth | Chụp ảnh chuyên nghiệp với filter và layout",
  description:
    "Nền tảng chụp ảnh chuyên nghiệp với filter đa dạng và layout linh hoạt. Tạo ra những khoảnh khắc đáng nhớ với công nghệ hiện đại.",
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-body bg-surface text-on-surface overflow-x-hidden`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
