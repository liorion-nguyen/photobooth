import type { Metadata } from "next";

/** URL gốc — đặt NEXT_PUBLIC_SITE_URL trên production (vd: https://photobooth.example.com) */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}

export const SITE_NAME = "Photobooth";
export const SITE_TAGLINE = "Chụp ảnh AI chuyên nghiệp — filter, layout & khung ảnh";
export const SITE_DESCRIPTION =
  "Photobooth online miễn phí — chụp ảnh photobooth trên trình duyệt với bộ lọc AI làm đẹp, layout 1x4 2x3 2x2, khung ảnh tùy chỉnh, tải ảnh HD và chia sẻ QR. Phù hợp sự kiện, cưới hỏi, sinh nhật, team building.";

/** Từ khóa SEO chính — tiếng Việt + tiếng Anh */
export const SEO_KEYWORDS = [
  // Core — photobooth
  "photobooth",
  "photobooth online",
  "photobooth miễn phí",
  "photobooth Việt Nam",
  "chụp ảnh photobooth",
  "photobooth trực tuyến",
  "web photobooth",
  "ứng dụng photobooth",
  "photobooth AI",
  "AI photobooth",
  // Chụp ảnh online
  "chụp ảnh online",
  "chụp ảnh trên web",
  "chụp ảnh bằng camera",
  "chụp ảnh trình duyệt",
  "studio chụp ảnh online",
  "camera studio online",
  // Filter & AI
  "bộ lọc ảnh",
  "filter ảnh đẹp",
  "filter làm đẹp",
  "làm đẹp ảnh online",
  "AI filter ảnh",
  "bộ lọc AI",
  "filter chân dung",
  "filter điện ảnh",
  "chỉnh ảnh AI",
  // Layout & khung
  "layout photobooth",
  "dải ảnh photobooth",
  "chụp ảnh layout",
  "photobooth 1x4",
  "photobooth 2x3",
  "photobooth 2x2",
  "khung ảnh photobooth",
  "khung ảnh online",
  "quản lý khung ảnh",
  "tạo khung ảnh",
  // Sự kiện
  "photobooth sự kiện",
  "photobooth cưới hỏi",
  "photobooth sinh nhật",
  "photobooth tiệc",
  "photobooth team building",
  "photobooth doanh nghiệp",
  "photobooth gala",
  // Chia sẻ & tải
  "chia sẻ ảnh QR",
  "tải ảnh photobooth",
  "lưu ảnh HD",
  "in ảnh photobooth",
  // Brand
  "Photobooth CodeLab",
  "CodeLab Solutions photobooth",
] as const;

export const PAGE_SEO = {
  home: {
    title: "Photobooth Online Miễn Phí | Chụp Ảnh AI, Filter & Layout",
    description:
      "Chụp photobooth online miễn phí với camera studio full màn hình, bộ lọc AI làm đẹp da, layout 1×4 2×3 2×2 và khung ảnh cộng đồng. Tải ảnh HD, chia sẻ QR — lý tưởng cho sự kiện, cưới, sinh nhật.",
    keywords: [
      "photobooth online miễn phí",
      "chụp ảnh photobooth",
      "photobooth AI",
      "bộ lọc làm đẹp",
      "layout photobooth",
    ],
    path: "/",
  },
  photobooth: {
    title: "Chụp Ảnh Photobooth | Camera Studio & Bộ Lọc AI",
    description:
      "Mở camera studio photobooth ngay trên trình duyệt. Chọn layout 1×4, 2×3, 2×2, áp dụng filter AI, chụp tự động có hẹn giờ, gương và đổi camera. Trải nghiệm photobooth chuyên nghiệp không cần cài app.",
    keywords: [
      "chụp ảnh photobooth",
      "camera photobooth",
      "photobooth studio",
      "chụp ảnh layout",
      "filter AI chụp ảnh",
    ],
    path: "/photobooth",
  },
  frames: {
    title: "Quản Lý Khung Ảnh Photobooth | Thư Viện Khung & Frame",
    description:
      "Khám phá và quản lý khung ảnh photobooth cho layout 1×4, 2×3, 2×2. Tải khung tùy chỉnh, đóng góp frame cộng đồng và áp dụng ngay khi chụp ảnh sự kiện.",
    keywords: [
      "khung ảnh photobooth",
      "frame photobooth",
      "quản lý khung ảnh",
      "khung ảnh sự kiện",
      "tải khung photobooth",
    ],
    path: "/frames",
  },
  framesContribute: {
    title: "Đóng Góp Khung Ảnh | Photobooth Frame Gallery",
    description:
      "Tải lên và chia sẻ khung ảnh photobooth của bạn. Hỗ trợ layout 1×4, 2×3, 2×2 — xây dựng thư viện khung ảnh cho cộng đồng Photobooth.",
    keywords: [
      "đóng góp khung ảnh",
      "upload frame photobooth",
      "tạo khung photobooth",
      "khung ảnh cộng đồng",
    ],
    path: "/frames/contribute",
  },
  about: {
    title: "Về Photobooth | Nền Tảng Chụp Ảnh AI Của CodeLab",
    description:
      "Photobooth by CodeLab Solutions — nền tảng chụp ảnh AI với filter đa dạng, layout linh hoạt và khung ảnh cộng đồng. Sứ mệnh biến công nghệ thành trải nghiệm nghệ thuật cho mọi sự kiện.",
    keywords: [
      "về photobooth",
      "CodeLab photobooth",
      "nền tảng chụp ảnh AI",
      "photobooth Việt Nam",
    ],
    path: "/about",
  },
} as const;

type PageSeoKey = keyof typeof PAGE_SEO;

export function buildPageMetadata(
  page: PageSeoKey,
  overrides?: Partial<Metadata>
): Metadata {
  const config = PAGE_SEO[page];
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${config.path}`;
  const keywords = [...SEO_KEYWORDS, ...config.keywords];

  return {
    title: config.title,
    description: config.description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      locale: "vi_VN",
      url,
      siteName: SITE_NAME,
      title: config.title,
      description: config.description,
    },
    twitter: {
      card: "summary_large_image",
      title: config.title,
      description: config.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    ...overrides,
  };
}

export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: getSiteUrl(),
  sameAs: [],
};

export const webAppJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: getSiteUrl(),
  applicationCategory: "PhotographyApplication",
  operatingSystem: "Web Browser",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "VND",
  },
  featureList: [
    "Chụp ảnh photobooth online",
    "Bộ lọc AI làm đẹp",
    "Layout 1x4, 2x3, 2x2",
    "Khung ảnh tùy chỉnh",
    "Chia sẻ QR",
    "Tải ảnh chất lượng cao",
  ],
};

export const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Photobooth online là gì?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Photobooth online cho phép bạn chụp ảnh kiểu photobooth trực tiếp trên trình duyệt, áp dụng bộ lọc AI, chọn layout dải ảnh và tải hoặc chia sẻ qua mã QR — không cần cài ứng dụng.",
      },
    },
    {
      "@type": "Question",
      name: "Photobooth có miễn phí không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có. Photobooth hỗ trợ chụp ảnh, filter AI, layout và tải ảnh miễn phí trên web. Phù hợp cá nhân và sự kiện nhỏ.",
      },
    },
    {
      "@type": "Question",
      name: "Photobooth hỗ trợ những layout nào?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Photobooth hỗ trợ layout 1×4 (dải dọc 4 ảnh), 2×3 (lưới 6 ảnh) và 2×2 (lưới 4 ảnh), kèm khung ảnh tùy chỉnh theo từng layout.",
      },
    },
    {
      "@type": "Question",
      name: "Có thể dùng Photobooth cho sự kiện cưới, sinh nhật không?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Có. Photobooth phù hợp tiệc cưới, sinh nhật, team building, gala và sự kiện doanh nghiệp với camera studio, filter đẹp và chia sẻ QR cho khách.",
      },
    },
  ],
};
