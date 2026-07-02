"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MAIN_NAV_ITEMS = [
  { label: "Về chúng tôi", href: "/about" },
  { label: "Quản lý khung", href: "/frames" },
  { label: "Chụp ảnh", href: "/photobooth" },
] as const;

interface NavigationProps {
  onNavigate?: () => void;
  className?: string;
  mobile?: boolean;
}

export default function Navigation({ onNavigate, className = "", mobile = false }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className={className}>
      <ul className={mobile ? "space-y-1" : "flex items-center gap-10"}>
        {MAIN_NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={onNavigate}
                className={
                  mobile
                    ? `block px-4 py-3 rounded-lg font-medium transition-colors ${
                        isActive
                          ? "text-primary bg-surface-container"
                          : "text-on-surface-variant hover:bg-surface-container hover:text-primary"
                      }`
                    : `font-body text-label-caps uppercase transition-colors ${
                        isActive
                          ? "text-primary font-bold border-b-2 border-primary pb-0.5"
                          : "text-on-surface-variant hover:text-primary"
                      }`
                }
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
