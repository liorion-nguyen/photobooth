"use client";

import Button from "@/components/UI/Button";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/services/auth.service";
import {
  getAdminContributions,
  acceptContribution,
  rejectContribution,
  type ContributionItem,
} from "@/services/framer.service";
import type { LayoutType } from "@/types/layout";
import { LAYOUT_CONFIGS } from "@/utils/layout";
import { motion } from "framer-motion";
import { Check, Frame, RefreshCw, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type ContributionRow = ContributionItem & {
  userId: string;
  reviewedBy: string | null;
};

export default function AdminContributionsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [contributions, setContributions] = useState<ContributionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "">(
    "pending"
  );
  const [actingId, setActingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const list = await getAdminContributions(
        token,
        statusFilter || undefined
      );
      setContributions(list);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không tải được danh sách");
      setContributions([]);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/");
      return;
    }
    if (user?.role === "admin") load();
  }, [user, authLoading, router, load]);

  const handleAccept = async (id: string) => {
    const token = getToken();
    if (!token) return;
    setActingId(id);
    try {
      await acceptContribution(token, id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Duyệt thất bại");
    } finally {
      setActingId(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm("Từ chối yêu cầu đóng góp này?")) return;
    const token = getToken();
    if (!token) return;
    setActingId(id);
    try {
      await rejectContribution(token, id);
      await load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "Từ chối thất bại");
    } finally {
      setActingId(null);
    }
  };

  if (authLoading || loading) {
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

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-50/70 via-white/80 to-indigo-50/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/admin"
          className="text-sm text-slate-600 hover:text-indigo-600 mb-2 inline-block"
        >
          ← Quay lại quản trị
        </Link>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              Yêu cầu đóng góp khung
            </h1>
            <p className="text-slate-600 text-sm mt-1">
              Duyệt hoặc từ chối khung do người dùng gửi lên.
            </p>
          </div>
          <Button onClick={load} variant="secondary" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Làm mới
          </Button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-center gap-3">
          <span className="text-sm text-slate-600">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value as "pending" | "approved" | "rejected" | ""
              )
            }
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Tất cả</option>
            <option value="pending">Chờ duyệt</option>
            <option value="approved">Đã duyệt</option>
            <option value="rejected">Đã từ chối</option>
          </select>
        </div>

        {contributions.length === 0 ? (
          <div className="bg-white/90 rounded-2xl border border-slate-200 p-12 text-center">
            <Frame className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <p className="text-slate-600">
              {statusFilter === "pending"
                ? "Không có yêu cầu nào chờ duyệt."
                : "Không có yêu cầu nào."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions.map((c) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm"
              >
                <div className="aspect-[2/3] bg-slate-100 flex items-center justify-center p-2">
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.name}
                      className="max-w-full max-h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <span className="text-slate-400 text-sm">Không có ảnh</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 truncate">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Layout:{" "}
                    {LAYOUT_CONFIGS[c.layoutType as LayoutType]?.name ??
                      c.layoutType}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    User: {c.userId.slice(0, 8)}… •{" "}
                    {new Date(c.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                  <p className="text-xs mt-1">
                    <span
                      className={
                        c.status === "pending"
                          ? "text-amber-600"
                          : c.status === "approved"
                            ? "text-emerald-600"
                            : "text-red-600"
                      }
                    >
                      {c.status === "pending"
                        ? "Chờ duyệt"
                        : c.status === "approved"
                          ? "Đã duyệt"
                          : "Đã từ chối"}
                    </span>
                  </p>
                  {c.status === "pending" && (
                    <div className="flex gap-2 mt-3">
                      <Button
                        size="sm"
                        onClick={() => handleAccept(c.id)}
                        disabled={actingId === c.id}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Duyệt
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleReject(c.id)}
                        disabled={actingId === c.id}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Từ chối
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
