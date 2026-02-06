"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Về chúng tôi", href: "/about" },
  { label: "Photobooth", href: "/photobooth" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-1">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link key={item.href} href={item.href}>
            <motion.div
              className={`px-4 py-2 rounded-lg transition-all relative ${
                isActive
                  ? "text-purple-600 font-semibold"
                  : "text-gray-600 hover:text-gray-900 font-medium"
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <motion.div
                  className="absolute inset-0 bg-purple-50 rounded-lg -z-0"
                  layoutId="activeTab"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.div
                  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  layoutId="activeIndicator"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}
