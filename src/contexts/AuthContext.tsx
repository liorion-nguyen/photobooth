"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import type { AuthUser } from "@/services/auth.service";
import {
  getToken,
  setToken,
  clearToken,
  getMe,
  setTokenCookie,
  clearTokenCookie,
} from "@/services/auth.service";

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser, accessToken: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const me = await getMe();
      setUser(me);
    } catch {
      clearToken();
      clearTokenCookie();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((userData: AuthUser, accessToken: string) => {
    setToken(accessToken);
    setTokenCookie(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    clearTokenCookie();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
