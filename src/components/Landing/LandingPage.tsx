"use client";

import Reveal from "@/components/Landing/Reveal";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import {
  Camera,
  Check,
  LayoutDashboard,
  PlayCircle,
  RefreshCw,
  Share2,
  Video,
  Wand2,
  X,
} from "lucide-react";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCTk4sE611OYVnWors7ZDbgM3wm726Xobs5xpiOcH0w9gHKOKSUx_yYTWMweJ-rCSCDLtoThtSoh7n3K1LKeUV54We6i0F7nyaeB0uCHCRAOMAmcSd35u525InCQ86lT2xjm7fEnLxsG9aqYDtHqhxDd5akKlxvwvQ1G315yUESl6-C1rZbYepwzeRylRVtBWhI9WVbFkzGIsPOR8nbI2kNqUMtlNbzj0rauLcbOJxsvEEByr4e3vKN_Sg0BiRIcnkJ-zUzjnfe2dE";

const FEATURES = [
  {
    icon: Video,
    iconBg: "bg-primary-container/10 text-primary",
    title: "Camera Studio Trực Tiếp",
    description:
      "Xem trước HD với điều chỉnh phơi sáng thời gian thực và preset ánh sáng chuyên nghiệp.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAe7El_g3uLMLjuDZa980fxzfHYLVSo9Xt0msBJsRSs6iGIZIPNYsU_FTbyeqzmzFp6YdbsxobcfSoK2wfvptuKfOsJHflLN5sqAHaHdom2e1PBqp_Y37IxB3zQfl4kmGOvezPa8jzkxKSuIJD5EgBvZkWR-QLfWZowEcRp_nc527ERxfkyFaxuQ8y4Njn0p8eziUQJl6_WZNNKL4Z7EeH49vomcyXbh_U_RupR6TIi-QReLrCXiOgRKmp9FbATv9PWd8-yW6sRFZA",
  },
  {
    icon: Wand2,
    iconBg: "bg-tertiary-container/10 text-tertiary",
    title: "Bộ Lọc AI Tạo Sinh",
    description:
      "Thay nền hoặc biến chân dung thành tranh sơn dầu, khung phim điện ảnh hay phong cách vaporwave ngay lập tức.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDBmlzmMkqASIe3Q-VWQagGyo4CJJXKIZ_Qd5Jm-XZWnHhCLUJg-sakck56nPoPiNrQkmNKiDnaWbtCu8rtZMs3T0kz_9oNlBeDxCuqE_QHQ0jzk4NFgfMZdUXVTfWQxtlUzgp5dvzLHbDfp8OqFbOOjrGwCsc8_jCLUeU8Pcc1RPclz30hhECaDHIb4RkfBUyyUGy6dAxwl91juTdLkA1_UjT86Jcscf7YfiSI2cI9OBbJYN2Ch_cfw_VTbF5R7OXdEXMDbiAWOgI",
  },
  {
    icon: LayoutDashboard,
    iconBg: "bg-secondary-container/20 text-secondary",
    title: "Mẫu Tùy Chỉnh",
    description:
      "Thiết kế overlay thương hiệu, layout tương tác và bộ typography tùy chỉnh với kéo-thả đơn giản.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDg2g0OP8u1Qk2aUKYMSzmmNWSp5TcN4vU-hm5QjBrRwhO45v_lzcsWS0bJS7QzqMASlbNo5oXBrzMvVif6SQ77BZQMeHvIPRgnJKF2CGR5XqIeeVaMA88qq8u--X0l-0yun4PU-LFwrXqn-oUwlLD35cbGXBz489Fgn9iJOL7lu90NwDn_TXFb1vrGYEF8JtrS3xVfDA3137kqs86tDQ1qjI1Fu8-svPCZRUVV1P2gHOWM95UTgqGjMmHj63WT4ofggwIs61jbxoQ",
  },
  {
    icon: Share2,
    iconBg: "bg-primary-fixed/20 text-primary",
    title: "Chia Sẻ Tức Thì",
    description:
      "Đồng bộ đám mây tự động và tạo mã QR để truy cập gallery và chia sẻ mạng xã hội ngay lập tức.",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAMgRm5fbhhrZEIYDBzmPF1hZQo0yqq2FCjkk6XlPAKh7cOw6wxXag3qCGfSUZPuZnv2YNkGHyjkdxn6JEE8OjtdfCURcvqr4QwjJ8bffFYrjV2VSWY4FKPDzg6Gqs5eZFn_6aLKuKyGUGN2oh2-3r5qTyQ2gloIkTGYAA5OO5uE9_J7sUSpJwCX5GZfx8p9KRdo_2WtJR1JdJqVfLZr1Oyn4jeL33foDFlF5ONrtjalgqhQXHePBRY2VEHCgTNtD_e_mGyIPL4Riw",
  },
];

const GALLERY_IMAGES = [
  {
    col: "space-y-6",
    items: [
      { h: "h-[400px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVRXl58rpesjYCds5zMVoP26u8H_2u9xLZ-Vopl3ZzrSj-oSMNThv86UrT_9GBJtXha89er8Z3TOYijBN5g3_aankpmEe-KUH_E-sQyJKUy42f1ZyUbJPBPce2LsIQnhZ7C6h60A7NiCygHCoeB8Gn4h2NKEOGmuESouJ9yEG1xa03ojrk4KN7O70s-2NOo2qrLKFHgCqncOxnCZJLuBXuZt-UnFRjI2V6FSDlvjTZIW_JX9m1DzOWGV0I4_nYekAoe2jvsOCi5ko" },
      { h: "h-[250px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1raT3tD_7LBqfXL326AmIUfX2flH5TPuEq6A9w6chuDKga501Duv7r9SLYq3ZF6qJvO-WPyoqnnngFD_r-H59CWDgeuMW0j-zkCktZwdZ0mG44gMmrXRWuVWS8Jqk4bAKI7Iuud5efvnDhOIjVkpwArnr9PpyOxEdjrKecCv_gLBJ-OrT1K1aG-mYVQ-5njos4MDLfsYAB0pCK-safcduAzy63OYEO3fKjqKjK_OjpDJIBxG9jJSsov2fJlqYbdw-qmuYndK_UgI" },
    ],
  },
  {
    col: "space-y-6 pt-12",
    items: [
      { h: "h-[300px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9doDzwR6dJxXnnHf6lP_iX53GRZ0jmMaRsTy53kIxXi_-qgRlwwpY_IhBm5V2jnCN6n9a3mJKRQAoMwGwvBkn-j93CSmjGoumi_dQ3jwnM14h2HtAQ8qnxcXB4yA8nC4nUmRuOXSTNkLQAhv-NEnoaUQHsNYb0a6GYzNA7OeQwrhdK5rA_deHQ7AH-fQvQAViM_qtk4k4H5Dg4nvcF-98FLLlRWQMhHy8Q5erjFlXSQ6tn5po9mbZ0cKoDcBLOSrPYTda3OStC24" },
      { h: "h-[450px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3bQnIL9FPx5WimVfo9qDrIEBgjqyVU_uoSPv4j0VOpdT71-FpH8g5MTACJRE2Zb6fRM7qVE90Q1Ox3qBfJsk3FRtLQJll-932XT2a224XGMapsyiWCkxbnJyJF_XnJOkMIiJA56XLpbL6bjiIlWno2hp0q8nerkH2sVpVLCFbFDDVPeapuxE4_APUIN6_P63DbN03Sfx9DKmhcePwLpb6QGg456u7SR2mwl3rPCD7pARnKARocarnd4-6Mb_Vj1BABuuD5H_z7GY" },
    ],
  },
  {
    col: "space-y-6",
    items: [
      { h: "h-[400px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxy8gObO3a9GUYPEXtPZIe5aWCAKWVv74HdTiDnLSsIXl8jp1I1c9Hnh0rO1lrINpJFna6zJRZJLVaCXDNkvBj1WoUmrkbDMRIojTvKuaAMC0A_dNz9KGBbMGa3EKepXMprVbwBXCu7J2tK65qm-evoytSNzTAhtuRHSgtKL3m0pFpD3rTSgYbxA8WbWnoiyHd2snPas9zEsxUsMS2k-WnHT9-WzyPPqU8Spd36oN-urPv5ipo5WttwDq7V3YtIxQMOmkcVqPVO2g" },
      { h: "h-[250px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3ZWfp6AGMipbX9JVgwVAit-QifmG7loWrl2bd6i3_P8EwgKBu7pEB9MrpBbk2YYwrRe_pFCuDlzizKrvuSM9K8xPJkYgbovvwuyR6lJ8uEpwLcWvPB06WspfH9iNwsuPAfNwO7vKiiAurAohj27swElJFVuN3jVpNSQqcXM8eCcuhg804VNhidoB35bwCQGmZ3hLZkgiyIi8E8Xcu8ECJTAYC8xxvT8VeFRit-aRoGELGsc5F4HxdZd_5J01okOxseeGTVEpQ5Bg" },
    ],
  },
  {
    col: "space-y-6 pt-12",
    items: [
      { h: "h-[300px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCS0qXYTwMGuwbfMtwhffa-FdUK7Q4hyIIjAYnGv24EIl5CG_ODswV49dafTGSKXY7nB_oha6SaHI4nA64ac-l9Use2MXCqqRZ-6tae7d3_2nq3yH3mShpcu1MwBevpdOMWbn5ZQt564FSkltSpEVI1FrJC3EUi7C5noliS7pz9Q3bORs7BjKLQpGybpcfDol-ReG895Ej7q7uugysIyx9_xNhR0eaHtBb3Ls6xU3rBvlADomsOmwRv8UOlJHgHeNuzPS4FcWGmxJ0" },
      { h: "h-[450px]", src: "https://lh3.googleusercontent.com/aida-public/AB6AXuC4VyH6sFKmd2Pu12aJacY9xeFqpLq8kronLQn3j6LstYXrtZJCxEgfArTHZqJ1KtC9gD4K8N3465-ImhdcO3X8Sli9gEmJ2p1IdwiIUCMrljpPJiqRfZUAx0vIjfKIIOpY4NzNbA0Ni1UYbnXlXUdsNP9UnBjZbCLoX368NNNtP52z3MZnTrakwfhOW5edhJuqS6mFKiqLNnI8poez4RZuqfIqzlAMWvlaxAFt6wZ6nENy8SdsYnTN_eMgo-jEUZAC1QpMrriArsg" },
    ],
  },
];

const WORKFLOW_STEPS = [
  {
    num: "01",
    title: "Quét & Tham Gia",
    description:
      "Khách quét mã QR tại sự kiện để tham gia hàng đợi studio trực tiếp trên thiết bị của họ.",
  },
  {
    num: "02",
    title: "Tạo Dáng & Chụp",
    description:
      "Chụp ảnh chuyên nghiệp qua giao diện mobile hoặc desktop với hướng dẫn AI thời gian thực.",
  },
  {
    num: "03",
    title: "AI Tạo Phong Cách",
    description:
      "Công cụ tạo sinh xử lý ảnh trong vài giây, áp dụng phong cách nghệ thuật AI hoặc nền thương hiệu.",
  },
  {
    num: "04",
    title: "Chia Sẻ Ngay",
    description:
      "Tác phẩm hoàn chỉnh được gửi qua SMS hoặc Email với đầy đủ branding, sẵn sàng cho mạng xã hội.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "Photobooth đã biến đổi gala của chúng tôi. Không chỉ là photobooth — đó là một tác phẩm nghệ thuật mà mọi người không ngừng bàn tán.",
    name: "Sarah Jenkins",
    role: "Giám đốc, Vogue Events",
  },
  {
    quote:
      "Công nghệ AI tạo phong cách vượt trội hơn hẳn mọi thứ khác. Nó thực sự nắm bắt được bản chất của công nghệ như nghệ thuật.",
    name: "Marcus Thorne",
    role: "Creative Lead, Apple",
  },
  {
    quote:
      "Tích hợp liền mạch. Chúng tôi triển khai trên 12 campus đại học trong một tuần. Quy mô đáng kinh ngạc.",
    name: "Elena Rodriguez",
    role: "VP Marketing, EduCorp",
  },
];

const PRICING_PLANS = [
  {
    label: "CÁ NHÂN",
    price: "$49",
    period: "/sự kiện",
    features: [
      "Truy cập booth 24h",
      "Bộ lọc AI tiêu chuẩn",
      "Tối đa 200 khách",
      "Chia sẻ qua mã QR",
    ],
    cta: "Chọn Cá Nhân",
    highlight: false,
    accent: "primary",
  },
  {
    label: "STUDIO PRO",
    price: "$199",
    period: "/tháng",
    badge: "PHỔ BIẾN NHẤT",
    features: [
      "Sự kiện không giới hạn",
      "Huấn luyện phong cách AI tùy chỉnh",
      "White-label đầy đủ",
      "Xử lý AI ưu tiên",
      "Phân tích nâng cao",
    ],
    cta: "Bắt Đầu Pro Studio",
    highlight: true,
    accent: "primary",
  },
  {
    label: "DOANH NGHIỆP",
    price: "Tùy chỉnh",
    period: "",
    features: [
      "Truy cập API toàn cầu",
      "Quản lý thành công riêng",
      "SDK phần cứng tùy chỉnh",
      "Hosting AI on-premise",
    ],
    cta: "Liên Hệ Kinh Doanh",
    highlight: false,
    accent: "secondary",
  },
];

const STUDIO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBBMpYuAT5kZIMhVnOV-EzLZuBobg8UDz5fNG0OdVdSj1KEb-4azViUDq-JX8x3T35PFWy5PHqtrWFqcAI0amFKzx1BMuk9M5MzB2wXa0_iRr2lpVy5XHNuhY5A__jlUxeXYFco1GKpiRNeV7uOJ0ZpN1jII5G_pfTPF8ZQYzwXkiGj2BWuQmMXhKXJIZ44kB0fiHuXfsQddnFw8qsXhkERIKx-hRFp0pcRlkQ5LmxWmDivuX4XWfU-_aQektREQN9n0L6eiDUg4UQ";

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="w-[400px] h-64 glass-card !bg-white/5 !border-white/10 p-10 rounded-3xl text-white flex flex-col justify-between shrink-0">
      <p className="text-lg italic opacity-80">&ldquo;{quote}&rdquo;</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-surface-variant" />
        <div>
          <div className="font-bold">{name}</div>
          <div className="text-sm opacity-60">{role}</div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-48 px-6 md:px-16 max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <Reveal className="z-10">
          <span className="font-body text-label-caps text-primary tracking-[0.2em] mb-6 block uppercase">
            CÔNG CỤ AI THẾ HỆ MỚI
          </span>
          <h1 className="font-display text-headline-lg-mobile md:text-display-lg mb-8 leading-[1.1] text-on-background">
            Tạo trải nghiệm Photobooth mà mọi người{" "}
            <span className="italic font-normal">không thể quên</span>.
          </h1>
          <p className="font-body text-body-xl text-on-surface-variant mb-12 max-w-lg">
            Biến mọi sự kiện thành studio editorial cao cấp. Công cụ AI tiên tiến biến selfie đơn giản thành tác phẩm nghệ thuật mang thương hiệu ngay lập tức.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/photobooth"
              className="primary-gradient text-white px-10 py-5 rounded-full font-semibold text-lg hover:scale-105 transition-transform shadow-xl inline-block"
            >
              Khởi Chạy Booth
            </Link>
            <Link
              href="/about"
              className="bg-surface-container-low text-on-surface px-10 py-5 rounded-full font-semibold text-lg border border-outline-variant hover:bg-surface transition-colors flex items-center gap-2"
            >
              <PlayCircle className="w-5 h-5" />
              Xem Demo
            </Link>
          </div>
        </Reveal>

        <Reveal className="relative">
          <div className="absolute -inset-10 bg-primary/10 blur-[120px] rounded-full" />
          <div className="relative rounded-[40px] overflow-hidden shadow-2xl glass-card p-4 transform lg:rotate-3 transition-transform hover:rotate-0 duration-700">
            <img
              alt="Photobooth Mockup"
              className="w-full h-auto rounded-[32px]"
              src={HERO_IMAGE}
            />
          </div>
          <div className="absolute -bottom-8 -left-8 glass-card p-6 rounded-3xl shadow-xl hidden md:block">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-white">
                <Wand2 className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm">Đang xử lý...</div>
                <div className="text-xs text-on-surface-variant">Áp dụng bộ lọc AI Noir</div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Trust */}
      <Reveal>
        <section className="py-24 bg-surface-container-lowest/40 backdrop-blur-sm border-y border-outline-variant">
          <div className="px-6 md:px-16 max-w-container-max mx-auto text-center">
            <p className="font-body text-label-caps text-on-surface-variant mb-12 opacity-70 uppercase">
              ĐƯỢC TIN DÙNG BỞI CÁC ĐỘI NGŨ SÁNG TẠO HÀNG ĐẦU
            </p>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500 font-display">
              {["VOGUE", "APPLE", "NIKE", "MUSEUM OF ART", "STANFORD"].map((brand) => (
                <div key={brand} className="text-2xl">{brand}</div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      {/* Features */}
      <section className="py-stack-lg overflow-hidden" id="features">
        <Reveal>
          <div className="px-6 md:px-16 max-w-container-max mx-auto mb-16">
            <h2 className="font-display text-headline-lg text-on-background">
              Thiết kế cho nghệ thuật.
            </h2>
          </div>
        </Reveal>
        <div className="flex gap-8 px-6 md:px-16 pb-12 overflow-x-auto no-scrollbar snap-x snap-mandatory">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="flex-none w-[85vw] md:w-[450px] snap-center">
                <div className="glass-card p-12 rounded-[32px] h-[600px] flex flex-col group hover:-translate-y-2 transition-transform duration-500">
                  <div className={`mb-8 w-16 h-16 rounded-2xl ${feature.iconBg} flex items-center justify-center`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-display text-3xl mb-4 text-on-surface">{feature.title}</h3>
                  <p className="text-on-surface-variant text-lg mb-auto">{feature.description}</p>
                  <div className="relative rounded-2xl overflow-hidden mt-8 aspect-video border border-outline-variant">
                    <img className="w-full h-full object-cover" alt={feature.title} src={feature.image} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Studio Preview */}
      <section className="py-stack-lg px-6 md:px-16 max-w-container-max mx-auto">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="font-display text-headline-lg md:text-display-md mb-8 leading-tight">
                Studio, ngay trong{" "}
                <span className="italic text-primary">trình duyệt</span>.
              </h2>
              <p className="font-body text-body-xl text-on-surface-variant mb-12">
                Trải nghiệm sức mạnh xử lý AI thời gian thực. Không cần tải app — giao diện glassmorphic liền mạch như tương lai.
              </p>
              <ul className="space-y-6">
                {[
                  "Độ trễ dưới 200ms cho biến đổi AI",
                  "Xuất 4K cho in ấn kích thước lớn",
                  "Đồng bộ đa thiết bị cho sự kiện hybrid",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4">
                    <span className="w-6 h-6 rounded-full primary-gradient flex items-center justify-center text-white shrink-0">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    <span className="font-medium text-lg">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative aspect-[4/5] md:aspect-square group">
              <div className="absolute inset-0 glass-card rounded-[48px] p-8 shadow-2xl overflow-hidden border border-white/60">
                <div className="flex justify-between items-center mb-8">
                  <div className="text-primary font-bold text-lg">PHOTOBOOTH CAM</div>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-error" />
                    <div className="w-2 h-2 rounded-full bg-outline" />
                  </div>
                </div>
                <div className="relative aspect-square rounded-3xl overflow-hidden bg-surface-dim group-hover:scale-[1.02] transition-transform duration-700">
                  <img className="w-full h-full object-cover" alt="Studio preview" src={STUDIO_IMAGE} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="text-white">
                      <div className="text-xs uppercase tracking-widest opacity-70">Phong cách đã chọn</div>
                      <div className="text-xl font-display">CYBER_NOIR</div>
                    </div>
                    <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center text-white">
                      <Wand2 className="w-5 h-5" />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-center gap-6">
                  <div className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </div>
                  <div className="w-20 h-20 rounded-full primary-gradient shadow-lg flex items-center justify-center text-white scale-110 cursor-pointer active:scale-95 transition-transform">
                    <Camera className="w-8 h-8" />
                  </div>
                  <div className="w-14 h-14 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors cursor-pointer">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="absolute -z-10 -bottom-12 -right-12 w-64 h-64 bg-tertiary/20 blur-[80px] rounded-full" />
            </div>
          </div>
        </Reveal>
      </section>

      {/* Gallery */}
      <section className="py-stack-lg bg-surface-container-low/30" id="gallery">
        <Reveal>
          <div className="px-6 md:px-16 max-w-container-max mx-auto text-center mb-16">
            <h2 className="font-display text-headline-lg md:text-display-md mb-4">
              Ghi lại khoảnh khắc rực rỡ.
            </h2>
            <p className="text-on-surface-variant font-body text-body-xl">
              Một cái nhìn vào các phong cách và khoảnh khắc đa dạng được Photobooth ghi lại.
            </p>
          </div>
        </Reveal>
        <div className="px-6 md:px-16 max-w-container-max mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {GALLERY_IMAGES.map((column, colIdx) => (
            <div key={colIdx} className={column.col}>
              {column.items.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-3xl overflow-hidden glass-card group cursor-pointer relative"
                >
                  <img
                    className={`w-full ${item.h} object-cover group-hover:scale-110 transition-transform duration-700`}
                    alt="Gallery"
                    src={item.src}
                  />
                  <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="py-stack-lg px-6 md:px-16 max-w-container-max mx-auto">
        <Reveal>
          <h2 className="font-display text-headline-lg mb-20 text-center">
            Bốn bước đến{" "}
            <span className="text-primary italic">hoàn hảo</span>.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {WORKFLOW_STEPS.map((step) => (
              <div key={step.num} className="relative group">
                <div className="font-display text-8xl text-surface-container-highest mb-8 group-hover:text-primary/20 transition-colors">
                  {step.num}
                </div>
                <h4 className="text-2xl font-bold mb-4">{step.title}</h4>
                <p className="text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* Testimonials */}
      <section className="py-stack-lg overflow-hidden bg-on-background">
        <Reveal>
          <div className="px-6 md:px-16 max-w-container-max mx-auto mb-16">
            <h2 className="font-display text-headline-lg md:text-display-md text-white">
              Lời từ{" "}
              <span className="italic text-tertiary">Studio</span>.
            </h2>
          </div>
        </Reveal>
        <div className="marquee gap-8 px-8">
          {[0, 1].map((set) => (
            <div key={set} className="flex gap-8">
              {TESTIMONIALS.map((t) => (
                <TestimonialCard key={`${set}-${t.name}`} {...t} />
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="py-stack-lg px-6 md:px-16 max-w-container-max mx-auto" id="pricing">
        <Reveal>
          <div className="text-center mb-20">
            <h2 className="font-display text-headline-lg md:text-display-md mb-4">
              Đầu tư cho nghệ thuật.
            </h2>
            <p className="text-on-surface-variant text-xl">
              Gói phù hợp cho creator cá nhân và mạng lưới studio toàn cầu.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.label}
                className={`glass-card p-10 flex flex-col transition-transform duration-500 ${
                  plan.highlight
                    ? "rounded-[40px] border-primary/20 bg-primary/5 relative scale-105 shadow-2xl z-10"
                    : "rounded-[32px] hover:scale-105"
                } ${!plan.highlight && plan.accent === "secondary" ? "border-secondary/20" : ""}`}
              >
                {plan.badge && (
                  <div className="absolute top-0 right-10 -translate-y-1/2 bg-primary-container text-white px-6 py-2 rounded-full font-body text-[10px] tracking-widest shadow-lg uppercase">
                    {plan.badge}
                  </div>
                )}
                <div className="mb-8">
                  <span
                    className={`font-body text-label-caps uppercase ${
                      plan.highlight ? "text-primary" : plan.accent === "secondary" ? "text-secondary" : "text-on-surface-variant"
                    }`}
                  >
                    {plan.label}
                  </span>
                  <div className="text-5xl font-display mt-4">
                    {plan.price}
                    {plan.period && (
                      <span className="text-lg text-on-surface-variant font-body">{plan.period}</span>
                    )}
                  </div>
                </div>
                <ul className="space-y-4 mb-12 flex-grow">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className={`flex gap-3 ${plan.highlight ? "font-semibold" : "text-on-surface-variant"}`}
                    >
                      <Check
                        className={`w-5 h-5 shrink-0 ${
                          plan.accent === "secondary" ? "text-secondary" : "text-primary"
                        }`}
                      />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-4 rounded-full font-semibold transition-all ${
                    plan.highlight
                      ? "primary-gradient text-white shadow-xl hover:scale-105"
                      : plan.accent === "secondary"
                        ? "border border-secondary text-secondary hover:bg-secondary hover:text-white"
                        : "border border-outline hover:bg-on-surface hover:text-white"
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="py-stack-lg px-6 md:px-16 max-w-container-max mx-auto">
        <Reveal>
          <div className="primary-gradient rounded-[64px] p-16 md:p-32 text-center text-white relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-tertiary/40 blur-[100px] rounded-full" />
            <div className="relative z-10">
              <h2 className="font-display text-headline-lg md:text-display-lg mb-12">
                Sẵn sàng tạo{" "}
                <span className="italic">Photobooth</span> của riêng bạn?
              </h2>
              <p className="font-body text-xl mb-16 opacity-90 max-w-2xl mx-auto">
                Gia nhập hàng ngũ các studio sáng tạo nhất thế giới. Bắt đầu trong vài phút, không cần thẻ tín dụng cho bản dùng thử.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link
                  href="/photobooth"
                  className="bg-white text-primary px-12 py-6 rounded-full font-bold text-xl hover:scale-110 transition-transform shadow-2xl inline-block"
                >
                  Tạo Booth Của Bạn
                </Link>
                {!user && (
                  <Link
                    href="/register"
                    className="bg-transparent border-2 border-white/40 hover:border-white text-white px-12 py-6 rounded-full font-bold text-xl transition-colors inline-block"
                  >
                    Đặt Lịch Demo
                  </Link>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
