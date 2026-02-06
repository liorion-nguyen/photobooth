"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Button from "@/components/UI/Button";
import { useAuth } from "@/contexts/AuthContext";
import { verifyOtp, verifyToken, resendOtp } from "@/services/auth.service";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get("email");
  const tokenFromQuery = searchParams.get("token");
  const { login: authLogin } = useAuth();

  const [email, setEmail] = useState(emailFromQuery || "");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Nếu có token trong URL (từ link email), gọi verify ngay
  useEffect(() => {
    if (!tokenFromQuery) return;
    setError("");
    (async () => {
      try {
        const res = await verifyToken(tokenFromQuery);
        authLogin(res.user, res.accessToken);
        router.replace("/");
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Link xác thực không hợp lệ");
      }
    })();
  }, [tokenFromQuery, router, authLogin]);

  const handleSubmitOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }
    setError("");
    setIsLoading(true);
    try {
      const res = await verifyOtp(email.trim(), otp);
      authLogin(res.user, res.accessToken);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Mã OTP không hợp lệ");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email.trim() || resendCooldown > 0) return;
    setError("");
    try {
      await resendOtp(email.trim());
      setSuccess("Đã gửi lại mã OTP vào email.");
      setResendCooldown(60);
      const t = setInterval(() => {
        setResendCooldown((c) => {
          if (c <= 1) {
            clearInterval(t);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gửi lại mã thất bại");
    }
  };

  if (tokenFromQuery) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-xl p-8 text-center"
      >
        <div className="text-4xl mb-4">📧</div>
        <h1 className="text-xl font-bold text-gray-800 mb-2">Đang xác thực...</h1>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">📧</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Xác thực email</h1>
        <p className="text-gray-600">
          Nhập mã OTP 6 số đã gửi đến email của bạn, hoặc bấm link trong thư.
        </p>
      </div>

      <form onSubmit={handleSubmitOtp} className="space-y-6">
        {error && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>
        )}
        {success && (
          <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">{success}</div>
        )}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-2">
            Mã OTP
          </label>
          <input
            id="otp"
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
            placeholder="000000"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          size="lg"
          disabled={isLoading || otp.length !== 6}
        >
          {isLoading ? "Đang xác thực..." : "Xác thực"}
        </Button>
        <div className="text-center">
          <button
            type="button"
            onClick={handleResend}
            disabled={resendCooldown > 0}
            className="text-sm text-blue-600 hover:text-blue-700 disabled:text-gray-400"
          >
            {resendCooldown > 0
              ? `Gửi lại mã sau ${resendCooldown}s`
              : "Gửi lại mã OTP"}
          </button>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Quay lại{" "}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
            Đăng nhập
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-xl shadow-xl p-8 text-center">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
