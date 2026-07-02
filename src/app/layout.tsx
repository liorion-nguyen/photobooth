import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import {
  SEO_KEYWORDS,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  getSiteUrl,
} from "@/lib/seo";
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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${SITE_NAME} | ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  authors: [{ name: "CodeLab Solutions", url: getSiteUrl() }],
  creator: "CodeLab Solutions",
  publisher: SITE_NAME,
  category: "photography",
  applicationName: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    alternateLocale: ["en_US"],
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Chụp ảnh photobooth online miễn phí`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Photobooth AI online`,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  other: {
    "geo.region": "VN",
    "content-language": "vi",
  },
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
