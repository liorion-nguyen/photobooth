"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import Logo from "../Logo";

// TikTok Icon Component
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
    <footer className="relative bg-gradient-to-br from-gray-900/90 via-purple-900/90 to-gray-900/90 backdrop-blur-sm text-gray-300 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500 rounded-full blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <Logo size={40} showText={true} animated={false} className="[&_span]:text-white" />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Nền tảng chụp ảnh chuyên nghiệp với filter và layout đa dạng. 
              Tạo ra những khoảnh khắc đáng nhớ với công nghệ hiện đại.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="https://www.facebook.com/chungg.203"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.instagram.com/chungg.203/"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@chungg.203"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 transition-all"
                aria-label="TikTok"
              >
                <TikTokIcon className="w-5 h-5" />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link href="/photobooth" className="hover:text-white transition-colors">
                  Photobooth
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-white transition-colors">
                  Hồ sơ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-400" />
                <a href="mailto:liorion.nguyen@gmail.com" className="hover:text-white transition-colors">
                  liorion.nguyen@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-400" />
                <a href="tel:+84708200334" className="hover:text-white transition-colors">
                  +84 708 200 334
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-purple-400 mt-1" />
                <span className="hover:text-white transition-colors">
                  Hà Nội, Việt Nam
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-gray-400"
          >
            &copy; {currentYear} Photobooth. Tất cả quyền được bảo lưu.
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
