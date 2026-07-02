"use client";

import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "../Logo";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-surface-container-lowest py-stack-lg border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter px-6 md:px-margin-desktop max-w-container-max mx-auto">
        <div className="md:col-span-2">
          <div className="mb-6">
            <Logo size={40} showText={true} animated={false} />
          </div>
          <p className="text-on-surface-variant max-w-sm mb-8 text-sm">
            Nền tảng chụp ảnh chuyên nghiệp với filter và layout đa dạng.
            Tạo ra những khoảnh khắc đáng nhớ với công nghệ hiện đại.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.facebook.com/chungg.203"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://www.instagram.com/chungg.203/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://www.tiktok.com/@chungg.203"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
              aria-label="TikTok"
            >
              <TikTokIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-body text-label-caps text-on-surface mb-8 uppercase">Liên kết nhanh</h4>
          <ul className="space-y-4 text-sm">
            {[
              { label: "Trang chủ", href: "/" },
              { label: "Về chúng tôi", href: "/about" },
              { label: "Khung ảnh", href: "/frames" },
              { label: "Photobooth", href: "/photobooth" },
              { label: "Hồ sơ", href: "/profile" },
            ].map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-on-surface-variant hover:text-primary transition-all duration-200 hover:translate-x-1 block"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-body text-label-caps text-on-surface mb-8 uppercase">Liên hệ</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary shrink-0" />
              <a
                href="mailto:liorion.nguyen@gmail.com"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                liorion.nguyen@gmail.com
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary shrink-0" />
              <a
                href="tel:+84708200334"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                +84 708 200 334
              </a>
            </li>
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-on-surface-variant">Hà Nội, Việt Nam</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop mt-20 pt-10 border-t border-outline-variant text-center md:text-left">
        <p className="text-on-surface-variant text-sm">
          &copy; {currentYear} Photobooth. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </footer>
  );
}
