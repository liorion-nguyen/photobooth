"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "../Logo";
import Navigation from "./Navigation";

function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    router.push("/");
  };

  if (!user) return null;

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const showAvatar = user.avatarUrl && !avatarError;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-all"
        aria-label="Menu tài khoản"
      >
        {showAvatar ? (
          <img
            src={user.avatarUrl ?? undefined}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setAvatarError(true)}
            className="w-10 h-10 rounded-full object-cover border-2 border-outline-variant shadow-md hover:border-primary transition-colors"
          />
        ) : (
          <div className="w-10 h-10 rounded-full primary-gradient text-white flex items-center justify-center text-sm font-semibold shadow-md">
            {initial}
          </div>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute right-0 mt-3 w-56 py-2 glass-card rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low">
                <p className="text-sm font-semibold text-on-surface truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-on-surface-variant truncate mt-0.5">{user.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-on-surface hover:bg-surface-container transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Hồ sơ
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary hover:bg-surface-container font-medium transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Quản trị
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-error hover:bg-error-container/30 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, logout } = useAuth();

  return (
    <header className="fixed top-0 w-full z-50 bg-surface/60 backdrop-blur-md shadow-sm">
      <nav className="flex justify-between items-center px-6 md:px-16 py-4 max-w-container-max mx-auto">
        <Link href="/" className="flex items-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Logo size={44} showText={true} animated={true} />
          </motion.div>
        </Link>

        <div className="hidden md:flex items-center gap-10">
          <Navigation />
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6">
            {!loading && (
              user ? (
                <UserMenu />
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-on-surface-variant hover:text-primary font-semibold transition-colors"
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/register"
                    className="primary-gradient text-white px-8 py-3 rounded-full font-semibold hover:scale-105 transition-transform duration-300 ease-out active:scale-95 shadow-lg"
                  >
                    Bắt đầu
                  </Link>
                </>
              )
            )}
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-outline-variant bg-surface/95 backdrop-blur-md"
          >
            <div className="px-6 py-4">
              <Navigation mobile onNavigate={() => setIsMobileMenuOpen(false)} />
              <div className="pt-3 mt-3 border-t border-outline-variant space-y-2">
                {user ? (
                  <>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-4 py-3 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Hồ sơ
                    </Link>
                    {user.role === "admin" && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-primary hover:bg-surface-container font-medium transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Settings className="w-4 h-4" />
                        Quản trị
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-left text-error hover:bg-error-container/30 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Đăng xuất
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="block w-full py-3 text-center rounded-full border border-outline text-on-surface font-semibold">
                        Đăng nhập
                      </span>
                    </Link>
                    <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                      <span className="block w-full py-3 text-center rounded-full primary-gradient text-white font-semibold shadow-lg">
                        Bắt đầu
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
