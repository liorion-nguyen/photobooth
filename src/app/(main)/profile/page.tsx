"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Check, Camera, User } from "lucide-react";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [avatarError, setAvatarError] = useState(false);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-transparent"
        />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-8 max-w-sm w-full text-center"
        >
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-slate-600 mb-6">Bạn cần đăng nhập để xem hồ sơ.</p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25"
          >
            Đăng nhập
          </Link>
        </motion.div>
      </div>
    );
  }

  const initial = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();
  const showAvatar = user.avatarUrl && !avatarError;

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-50/70 via-white/80 to-indigo-50/25 backdrop-blur-sm">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative overflow-hidden rounded-2xl bg-white/85 backdrop-blur-sm shadow-xl shadow-slate-200/50 border border-slate-200/60 p-8 sm:p-10"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-100/30 rounded-full translate-y-1/2 -translate-x-1/2" />

          <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-8">
            <div className="flex-shrink-0">
              <div className="relative">
                <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 to-violet-600 p-1 shadow-lg shadow-indigo-500/20 ring-2 ring-white">
                  {showAvatar ? (
                    <img
                      src={user.avatarUrl ?? undefined}
                      alt=""
                      referrerPolicy="no-referrer"
                      onError={() => setAvatarError(true)}
                      className="w-full h-full rounded-[14px] object-cover"
                    />
                  ) : (
                    <div className="w-full h-full rounded-[14px] bg-indigo-500 flex items-center justify-center">
                      <span className="text-4xl sm:text-5xl text-white font-semibold">
                        {initial}
                      </span>
                    </div>
                  )}
                </div>
                {user.emailVerified && (
                  <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs shadow">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">
                {user.name || "Chưa đặt tên"}
              </h1>
              <p className="mt-1 text-slate-500 font-medium">{user.email}</p>
              <div className="mt-4">
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    Đã xác thực email
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-50 text-amber-700 border border-amber-200/60">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Chưa xác thực email
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Photos section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-lg font-semibold text-slate-800 mb-4">
            Ảnh của tôi
          </h2>
          <div className="rounded-2xl bg-white/90 backdrop-blur-sm shadow-xl shadow-slate-200/50 border border-slate-200/60 p-10 sm:p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-slate-600 mb-6">
              Bạn chưa có ảnh nào trong hồ sơ.
            </p>
            <Link
              href="/photobooth"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/30"
            >
              Chụp ảnh ngay
            </Link>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
