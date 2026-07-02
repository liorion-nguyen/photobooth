"use client";

import Reveal from "@/components/Landing/Reveal";
import Link from "next/link";
import {
  Cloud,
  Cpu,
  Eye,
  Heart,
  Lightbulb,
  Network,
  Palette,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

const HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAXSowEDIguO6ju1asy1j2ZncaXkBv90oIpgSoTSXjy3yY_4X_ZheqoAyHfW3-UsFDrRaEUZ4xNET0gGmvBywtINYOrF0BU7E8pkF8RdQolc6JTUMS2LCwyrL41mx4wBjPvaBrVe2Z5gU0o4vxf03mr0XSYfQqmnTh78Z8Pg2q6zNlP7x-CyTW64CO4_OSooGCLO842GXjqRKCdXqjZi_TlNDHw2H-MqKFYYnfPth0hL4crdfUV9_MfONwfXKJ8aDCDu7kviDdOPsw";

const WORKSPACE_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCUFQJiuf6g1Ly-8PEnsWrUW_gA-c4IlJsxdFYrrnQzQVFNpmUP8D5oZ4Ue8pmooVbaOJ3x9WlNLAqa6L88WLMasvjMsszd46_hXeYcO5f_dh8_fDhsm1znAaP13muCTZBL8djLnQxkEiuNMhqTkQksgv9GtPif3RNiMMQ3FjbRKDmHmTL0tpOLqUub3G3vK95QcAVn78TpQNr9Q6g_vFXBYzFOJCryfTpphWizYW-IlUmAwD-6yyDqCiLIDUAM_YuDGz5AVEngPPA";

const TEAM_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBLV0J5cVgMj487PWVX-DnADDnbcB8RNF-UbN3dZMwym_CE6_8awgo6eVOsnjihbTXGrY7oWZdh_zXa8Z5cKd3L95-PrcMtzwvvYALe2SdQ6eIz5Z8IlMCwsmskG6xojikEbVKN5gYi4HWF241umNbNU6Zb8aKZYeGUVupB8T0V-BRRT9iIKxHjUXIeTz2cZR8mw1b5ghRPpBeIBiTfOfGjieV3ne0S1BTecsZvuqL-J4an4zYPhyzsgqsBHK_Dh9PYBg3b1kRHwv0";

const STORY_ITEMS = [
  {
    num: "01",
    title: "Khởi đầu",
    description:
      "Photobooth sinh ra từ một nhu cầu đơn giản: ai cũng muốn có ảnh đẹp mà không cần thiết bị hay kỹ năng phức tạp. Chúng tôi bắt đầu với một studio nhỏ và ước mơ biến công nghệ thành trải nghiệm gần gũi.",
  },
  {
    num: "02",
    title: "Tầm nhìn",
    description:
      "Chúng tôi không xem công nghệ chỉ là công cụ — đó là phương tiện vô hình giúp mọi người thể hiện bản thân qua thẩm mỹ được tuyển chọn, mang cảm giác cao cấp mà vẫn dễ tiếp cận.",
  },
  {
    num: "03",
    title: "Công nghệ",
    description:
      "Độ chính xác gặp gỡ cảm xúc. Bằng xử lý ảnh thời gian thực và bộ lọc AI, chúng tôi xây dựng nền tảng hiểu được ánh sáng, bóng đổ và từng khoảnh khắc đáng nhớ.",
  },
];

const TIMELINE = [
  {
    year: "2023",
    title: "Ý tưởng",
    description: "Photobooth được hình thành — một nơi chụp, chỉnh filter và lưu khoảnh khắc đơn giản.",
    align: "left" as const,
  },
  {
    year: "2024",
    title: "Ra mắt",
    description: "Phiên bản đầu tiên với camera trình duyệt, filter đa dạng và layout linh hoạt.",
    align: "right" as const,
  },
  {
    year: "2025+",
    title: "Mở rộng",
    description: "Tiếp tục phát triển khung ảnh cộng đồng, chia sẻ đám mây và trải nghiệm AI.",
    align: "left" as const,
  },
];

const TEAM = [
  { name: "Nguyễn Văn A", role: "Người sáng lập" },
  { name: "Trần Thị B", role: "Thiết kế sản phẩm" },
  { name: "Lê Văn C", role: "Kỹ thuật" },
  { name: "Phạm Thị D", role: "Trải nghiệm người dùng" },
];

function TimelineSection() {
  const [progress, setProgress] = useState(20);

  useEffect(() => {
    const handleScroll = () => {
      const section = document.getElementById("about-timeline");
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      const sectionHeight = section.offsetHeight;
      const scrolled = window.scrollY - sectionTop + window.innerHeight * 0.5;
      const pct = Math.min(Math.max((scrolled / sectionHeight) * 100, 10), 100);
      setProgress(pct);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section id="about-timeline" className="py-stack-lg bg-surface-container-low overflow-hidden">
      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop relative">
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-[2px] bg-outline-variant/30 hidden md:block">
          <div
            className="w-full bg-primary timeline-glow transition-all duration-300"
            style={{ height: `${progress}%` }}
          />
        </div>
        <div className="space-y-stack-lg relative">
          {TIMELINE.map((item) => (
            <div
              key={item.year}
              className={`flex ${
                item.align === "right"
                  ? "justify-end md:w-full md:pl-gutter"
                  : "justify-start md:w-1/2 md:pr-gutter"
              } group`}
            >
              <div
                className={`glass-panel p-stack-sm rounded-[32px] w-full transition-transform group-hover:scale-105 ${
                  item.align === "right" ? "md:w-1/2" : ""
                }`}
              >
                <span className="font-display text-primary text-3xl md:text-4xl">{item.year}</span>
                <h4 className="font-display text-headline-lg-mobile md:text-headline-lg mt-2 mb-2">
                  {item.title}
                </h4>
                <p className="text-on-surface-variant">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamCard({ name, role }: { name: string; role: string }) {
  return (
    <div className="relative group overflow-hidden rounded-[32px] aspect-[3/4]">
      <img
        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
        alt={name}
        src={TEAM_IMAGE}
      />
      <div className="absolute bottom-0 left-0 w-full p-stack-sm glass-panel translate-y-full group-hover:translate-y-0 transition-transform duration-500">
        <h4 className="font-display text-2xl">{name}</h4>
        <p className="text-primary font-body text-label-caps uppercase">{role}</p>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <div className="-mt-[88px] w-full">
      {/* Hero */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden pt-[88px]">
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-transparent via-background/20 to-background" />
        <div className="relative z-20 max-w-[900px] text-center px-6 md:px-margin-mobile">
          <Reveal>
            <div className="mb-stack-sm">
              <img
                alt="Trải nghiệm Photobooth"
                className="w-full aspect-video object-cover rounded-[32px] shadow-2xl"
                src={HERO_IMAGE}
              />
            </div>
            <h1 className="font-display text-headline-lg-mobile md:text-display-lg italic text-on-background">
              Mỗi khoảnh khắc đều xứng đáng một trải nghiệm đẹp.
            </h1>
            <p className="mt-6 text-body-xl text-on-surface-variant">
              Sinh ra từ một lý do riêng — đơn giản, gần gũi và đầy cảm xúc.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Brand Story */}
      <section className="max-w-container-max mx-auto px-6 md:px-margin-desktop py-stack-lg">
        <Reveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-start">
            <div className="md:sticky md:top-32">
              <span className="font-body text-label-caps text-primary uppercase mb-2 block tracking-widest">
                Hành trình của chúng tôi
              </span>
              <h2 className="font-display text-display-md text-headline-lg-mobile md:text-display-md">
                Sự tiến hóa của sự tinh tế
              </h2>
            </div>
            <div className="space-y-stack-lg">
              {STORY_ITEMS.map((item) => (
                <div key={item.num} className="group">
                  <span className="font-display text-4xl text-primary opacity-20 block mb-2 group-hover:opacity-100 transition-opacity">
                    {item.num}
                  </span>
                  <h3 className="font-display text-headline-lg-mobile md:text-headline-lg mb-2">
                    {item.title}
                  </h3>
                  <p className="text-on-surface-variant text-body-xl leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <TimelineSection />

      {/* Mission & Vision */}
      <section className="py-stack-lg max-w-container-max mx-auto px-6 md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <Reveal>
          <div className="glass-panel p-stack-md rounded-[48px] bg-gradient-to-br from-primary/5 to-tertiary/5 border border-primary/10 h-full">
            <Sparkles className="w-12 h-12 text-primary mb-stack-sm" />
            <h3 className="font-display text-headline-lg mb-stack-sm">Sứ mệnh</h3>
            <p className="text-body-xl text-on-surface-variant leading-relaxed">
              Dân chủ hóa nhiếp ảnh chuyên nghiệp qua giao diện thông minh — ưu tiên kết nối con người
              và giữ lại những khoảnh khắc đáng nhớ.
            </p>
          </div>
        </Reveal>
        <Reveal>
          <div className="glass-panel p-stack-md rounded-[48px] bg-gradient-to-br from-tertiary/5 to-primary/5 border border-tertiary/10 h-full">
            <Eye className="w-12 h-12 text-tertiary mb-stack-sm" />
            <h3 className="font-display text-headline-lg mb-stack-sm">Tầm nhìn</h3>
            <p className="text-body-xl text-on-surface-variant leading-relaxed">
              Tạo ra thế giới nơi camera không còn là rào cản, mà là cầu nối để mọi người tự do thể
              hiện bản thân qua nghệ thuật.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Core Values */}
      <section className="relative h-[500px] md:h-[600px] flex items-center justify-center bg-surface overflow-hidden">
        <div className="text-center relative z-20 px-6">
          <h2 className="font-display text-headline-lg md:text-display-md">Giá trị cốt lõi</h2>
        </div>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="orbit-item glass-panel px-stack-sm py-2 rounded-full shadow-lg flex items-center gap-2 absolute">
            <Lightbulb className="w-4 h-4 text-primary" />
            <span className="font-body text-label-caps uppercase">Đổi mới</span>
          </div>
          <div className="orbit-item-2 glass-panel px-stack-sm py-2 rounded-full shadow-lg flex items-center gap-2 absolute">
            <Palette className="w-4 h-4 text-tertiary" />
            <span className="font-body text-label-caps uppercase">Sáng tạo</span>
          </div>
          <div className="orbit-item-3 glass-panel px-stack-sm py-2 rounded-full shadow-lg flex items-center gap-2 absolute">
            <Heart className="w-4 h-4 text-secondary" />
            <span className="font-body text-label-caps uppercase">Kết nối</span>
          </div>
        </div>
      </section>

      {/* Platform Architecture */}
      <section className="py-stack-lg bg-inverse-surface text-inverse-on-surface overflow-hidden">
        <Reveal>
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop text-center mb-stack-md">
            <h2 className="font-display text-headline-lg md:text-display-md mb-2">
              Kiến trúc của phép màu
            </h2>
            <p className="text-outline-variant max-w-2xl mx-auto">
              Một cái nhìn về cách Photobooth xử lý từng pixel và lưu giữ kỷ niệm.
            </p>
          </div>
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop relative h-[320px] md:h-[400px]">
            <div className="absolute top-1/2 left-0 md:left-[5%] -translate-y-1/2 w-36 md:w-48 h-36 md:h-48 border border-primary/30 rounded-2xl flex flex-col items-center justify-center bg-surface-container-highest/5 backdrop-blur-md">
              <Cpu className="w-8 md:w-10 h-8 md:h-10 text-primary mb-2" />
              <span className="font-body text-label-caps uppercase text-sm">AI Engine</span>
            </div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 md:w-48 h-36 md:h-48 border border-tertiary/30 rounded-2xl flex flex-col items-center justify-center bg-surface-container-highest/5 backdrop-blur-md">
              <Network className="w-8 md:w-10 h-8 md:h-10 text-tertiary mb-2" />
              <span className="font-body text-label-caps uppercase text-sm">Xử lý</span>
            </div>
            <div className="absolute top-1/2 right-0 md:right-[5%] -translate-y-1/2 w-36 md:w-48 h-36 md:h-48 border border-secondary/30 rounded-2xl flex flex-col items-center justify-center bg-surface-container-highest/5 backdrop-blur-md">
              <Cloud className="w-8 md:w-10 h-8 md:h-10 text-secondary mb-2" />
              <span className="font-body text-label-caps uppercase text-sm">Đám mây</span>
            </div>
            <svg className="absolute inset-0 w-full h-full -z-0 hidden md:block" viewBox="0 0 1000 400" preserveAspectRatio="none">
              <path
                className="animate-dash"
                d="M192,200 Q500,50 500,50 M500,50 Q808,200 808,200"
                fill="none"
                stroke="url(#aboutLineGradient)"
                strokeDasharray="10,10"
                strokeWidth="2"
              />
              <defs>
                <linearGradient id="aboutLineGradient" x1="0%" x2="100%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#6b38d4" />
                  <stop offset="100%" stopColor="#b10e6b" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Reveal>
      </section>

      {/* Team */}
      <section className="py-stack-lg max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <Reveal>
          <h2 className="font-display text-headline-lg md:text-display-md mb-stack-md text-center">
            Những người đằng sau ống kính
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {TEAM.map((member) => (
              <TeamCard key={member.name} {...member} />
            ))}
          </div>
        </Reveal>
      </section>

      {/* Stats */}
      <section className="py-stack-lg border-y border-outline-variant/20">
        <Reveal>
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
            <div className="border-l-4 border-primary pl-gutter">
              <span className="font-display text-5xl md:text-6xl text-primary block">10,000+</span>
              <span className="font-body text-label-caps text-on-surface-variant uppercase tracking-widest">
                Trải nghiệm đã tạo
              </span>
            </div>
            <div className="border-l-4 border-tertiary pl-gutter">
              <span className="font-display text-5xl md:text-6xl text-tertiary block">50,000+</span>
              <span className="font-body text-label-caps text-on-surface-variant uppercase tracking-widest">
                Khoảnh khắc được lưu giữ
              </span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Workspace */}
      <section className="py-stack-lg max-w-container-max mx-auto px-6 md:px-margin-desktop">
        <Reveal>
          <div className="grid grid-cols-12 gap-gutter items-center">
            <div className="col-span-12 md:col-span-5 order-2 md:order-1">
              <h2 className="font-display text-headline-lg md:text-display-md mb-stack-sm">
                Nơi sự tinh tế được tạo nên
              </h2>
              <p className="text-body-xl text-on-surface-variant leading-relaxed">
                Không gian làm việc của chúng tôi tại Hà Nội phản ánh triết lý cốt lõi — mở, đầy ánh
                sáng và được thiết kế để những ý tưởng về công nghệ trở thành hiện thực.
              </p>
            </div>
            <div className="col-span-12 md:col-span-7 order-1 md:order-2">
              <div className="relative group">
                <img
                  className="w-full rounded-[48px] shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]"
                  alt="Không gian làm việc Photobooth"
                  src={WORKSPACE_IMAGE}
                />
                <div className="absolute -bottom-8 -right-8 w-40 md:w-48 h-40 md:h-48 bg-primary-container rounded-[32px] hidden md:flex items-center justify-center rotate-6 shadow-xl">
                  <span className="font-display text-on-primary-container text-xl text-center px-4">
                    Photobooth HQ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Philosophy */}
      <section className="py-stack-lg bg-surface-container-highest text-center px-6 md:px-margin-mobile">
        <Reveal>
          <div className="max-w-3xl mx-auto">
            <blockquote className="font-display text-headline-lg-mobile md:text-headline-lg italic mb-stack-md leading-tight">
              &ldquo;Công nghệ nên biến mất. Chỉ kỷ niệm mới ở lại.&rdquo;
            </blockquote>
            <p className="font-body text-label-caps text-primary uppercase tracking-widest">
              — Triết lý cốt lõi của chúng tôi
            </p>
          </div>
        </Reveal>
      </section>

      {/* CTA */}
      <section className="max-w-container-max mx-auto px-6 md:px-margin-desktop py-stack-lg">
        <Reveal>
          <div className="relative overflow-hidden rounded-[64px] primary-gradient p-stack-lg md:p-stack-md text-center text-on-primary">
            <div className="relative z-10">
              <h2 className="font-display text-headline-lg md:text-display-md mb-stack-md">
                Sẵn sàng tạo trải nghiệm tiếp theo?
              </h2>
              <div className="flex flex-col md:flex-row items-center justify-center gap-gutter">
                <Link
                  href="/photobooth"
                  className="bg-white text-primary px-stack-md py-stack-sm rounded-full font-bold text-body-xl hover:scale-105 transition-transform inline-block"
                >
                  Bắt đầu chụp ảnh
                </Link>
                <Link
                  href="/#pricing"
                  className="border border-white/40 text-white px-stack-md py-stack-sm rounded-full font-bold text-body-xl hover:bg-white/10 transition-colors inline-block"
                >
                  Xem bảng giá
                </Link>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          </div>
        </Reveal>
      </section>
    </div>
  );
}
