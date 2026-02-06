"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { setToken, setTokenCookie, getMe } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { login: authLogin } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Thiếu token. Vui lòng đăng nhập lại.");
      return;
    }
    setToken(token);
    setTokenCookie(token);
    getMe().then((me) => {
      if (me) authLogin(me, token);
      router.replace("/");
      router.refresh();
    }).catch(() => {
      setError("Không thể tải thông tin tài khoản.");
    });
  }, [token, router, authLogin]);

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-xl p-8 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <a href="/login" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </a>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 text-center">
      <div className="text-4xl mb-4">✅</div>
      <h1 className="text-xl font-bold text-gray-800 mb-2">Đăng nhập thành công</h1>
      <p className="text-gray-600">Đang chuyển hướng...</p>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Đang xử lý...</p>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
