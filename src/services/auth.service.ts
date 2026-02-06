// Base URL backend (root, không có /api) — auth dùng /auth/*, photos dùng /api/photos/*
const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");

const TOKEN_KEY = "photobooth_token";
const TOKEN_COOKIE = "photobooth_token";
const COOKIE_MAX_AGE_DAYS = 7;

export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  role?: string; // 'user' | 'admin'
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${TOKEN_COOKIE}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  const fromStorage = localStorage.getItem(TOKEN_KEY);
  if (fromStorage) return fromStorage;
  const fromCookie = getTokenFromCookie();
  if (fromCookie) {
    localStorage.setItem(TOKEN_KEY, fromCookie);
    return fromCookie;
  }
  return null;
}

export function setToken(token: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function setTokenCookie(token: string): void {
  if (typeof document === "undefined") return;
  const maxAge = COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

export function clearToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
}

export function clearTokenCookie(): void {
  if (typeof document === "undefined") return;
  document.cookie = `${TOKEN_COOKIE}=; path=/; max-age=0`;
}

export function clearAuth(): void {
  clearToken();
  clearTokenCookie();
}

export function isAuthenticated(): boolean {
  return !!getToken();
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_ROOT}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Đăng nhập thất bại");
  }
  return res.json();
}

export async function register(
  email: string,
  password: string,
  name?: string
): Promise<{ message: string; userId: string }> {
  const res = await fetch(`${API_ROOT}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, name }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Đăng ký thất bại");
  }
  return res.json();
}

export async function verifyOtp(email: string, otp: string): Promise<AuthResponse> {
  const res = await fetch(`${API_ROOT}/auth/verify-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Mã OTP không hợp lệ");
  }
  return res.json();
}

export async function verifyToken(token: string): Promise<AuthResponse> {
  const res = await fetch(`${API_ROOT}/auth/verify-email?token=${encodeURIComponent(token)}`);
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Link xác thực không hợp lệ");
  }
  return res.json();
}

export async function resendOtp(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_ROOT}/auth/resend-otp`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.message || "Gửi lại mã thất bại");
  }
  return res.json();
}

export async function getMe(): Promise<AuthUser | null> {
  const token = getToken();
  if (!token) return null;
  const res = await fetch(`${API_ROOT}/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) return null;
  return res.json();
}

export function getGoogleLoginUrl(): string {
  return `${API_ROOT}/auth/google`;
}

export function getFacebookLoginUrl(): string {
  return `${API_ROOT}/auth/facebook`;
}
