"use client";

import { useAuth } from "@/contexts/AuthContext";
import { AnimatePresence, motion } from "framer-motion";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "../Logo";
import Button from "../UI/Button";
import Navigation from "./Navigation";

function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
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

  const [avatarError, setAvatarError] = useState(false);
  const showAvatar = user.avatarUrl && !avatarError;

  return (
    <div className="relative" ref={ref}>
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
        aria-label="Menu tài khoản"
      >
        {showAvatar ? (
          <img
            src={user.avatarUrl!}
            alt=""
            referrerPolicy="no-referrer"
            onError={() => setAvatarError(true)}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-200 shadow-md hover:border-purple-400 transition-colors"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center text-sm font-semibold shadow-md">
            {initial}
          </div>
        )}
      </motion.button>
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
              className="absolute right-0 mt-3 w-56 py-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden"
            >
              <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-pink-50">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-gray-600 truncate mt-0.5">{user.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-purple-50 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <User className="w-4 h-4" />
                  Hồ sơ
                </Link>
                {user.role === "admin" && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-600 hover:bg-purple-50 font-medium transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Quản trị
                  </Link>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const authButtons = (
    <div className="flex items-center gap-3">
      <Link href="/login">
        <Button variant="secondary" size="sm" className="font-medium">
          Đăng nhập
        </Button>
      </Link>
      <Link href="/register">
        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-medium shadow-md">
          Đăng ký
        </Button>
      </Link>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-3"
            >
              <Logo size={44} showText={true} animated={true} />
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 justify-center">
            <Navigation />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center">
              {!loading && (user ? <UserMenu /> : authButtons)}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden overflow-hidden border-t border-gray-100"
            >
              <div className="py-4 space-y-1">
                <Link
                  href="/"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trang chủ
                </Link>
                <Link
                  href="/about"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Về chúng tôi
                </Link>
                <Link
                  href="/photobooth"
                  className="block px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Photobooth
                </Link>
                <div className="pt-3 mt-3 border-t border-gray-100 space-y-2">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-700 hover:bg-purple-50 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4" />
                        Hồ sơ
                      </Link>
                      {user.role === "admin" && (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-4 py-3 rounded-lg text-purple-600 hover:bg-purple-50 font-medium transition-colors"
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
                        className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="secondary" size="sm" className="w-full font-medium">
                          Đăng nhập
                        </Button>
                      </Link>
                      <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 font-medium">
                          Đăng ký
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
