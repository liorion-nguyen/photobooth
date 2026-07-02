"use client";

import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { getMe, setToken, setTokenCookie } from "@/services/auth.service";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type CallbackStatus = "loading" | "success" | "error";

function AuthCallbackCard({
  status,
  message,
}: {
  status: CallbackStatus;
  message?: string;
}) {
  return (
    <div className="frames-glass-card rounded-[32px] p-8 md:p-10 text-center shadow-xl">
      <div className="flex justify-center mb-6">
        <Logo size={56} showText={false} animated={false} />
      </div>

      {status === "loading" && (
        <>
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-primary animate-spin" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-on-surface mb-2">
            Đang xử lý đăng nhập
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Vui lòng đợi trong giây lát...
          </p>
        </>
      )}

      {status === "success" && (
        <>
          <div className="mx-auto mb-5 w-14 h-14 rounded-full primary-gradient flex items-center justify-center shadow-lg shadow-primary/20">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-on-surface mb-2">
            Đăng nhập thành công
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base">
            Đang chuyển bạn về trang chủ...
          </p>
          <div className="mt-6 h-1 w-full max-w-xs mx-auto rounded-full bg-surface-container-high overflow-hidden">
            <div className="h-full w-1/2 primary-gradient rounded-full animate-pulse" />
          </div>
        </>
      )}

      {status === "error" && (
        <>
          <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-error-container/30 flex items-center justify-center">
            <AlertCircle className="w-7 h-7 text-error" />
          </div>
          <h1 className="font-display text-2xl md:text-3xl text-on-surface mb-2">
            Không thể đăng nhập
          </h1>
          <p className="text-on-surface-variant text-sm md:text-base mb-6">
            {message ?? "Đã xảy ra lỗi. Vui lòng thử lại."}
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center primary-glow-button text-white px-8 py-3 rounded-full font-semibold text-sm"
          >
            Quay lại đăng nhập
          </Link>
        </>
      )}

      <p className="mt-8 text-[11px] tracking-widest uppercase text-on-surface-variant/60">
        Photobooth · Secure sign-in
      </p>
    </div>
  );
}

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { login: authLogin } = useAuth();
  const [status, setStatus] = useState<CallbackStatus>("loading");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setErrorMessage("Thiếu token. Vui lòng đăng nhập lại.");
      return;
    }

    setToken(token);
    setTokenCookie(token);

    getMe()
      .then((me) => {
        if (me) authLogin(me, token);
        setStatus("success");
        router.replace("/");
        router.refresh();
      })
      .catch(() => {
        setStatus("error");
        setErrorMessage("Không thể tải thông tin tài khoản.");
      });
  }, [token, router, authLogin]);

  return (
    <AuthCallbackCard
      status={status}
      message={status === "error" ? errorMessage : undefined}
    />
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackCard status="loading" />}>
      <CallbackContent />
    </Suspense>
  );
}
