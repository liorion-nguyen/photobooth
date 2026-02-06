import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Photobooth - Chụp ảnh chuyên nghiệp với filter và layout",
  description: "Nền tảng chụp ảnh chuyên nghiệp với filter đa dạng và layout linh hoạt. Tạo ra những khoảnh khắc đáng nhớ với công nghệ hiện đại.",
};

import Providers from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
