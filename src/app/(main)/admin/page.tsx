"use client";

import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { getToken } from "@/services/auth.service";
import { AnimatePresence, motion } from "framer-motion";
import { Camera, Check, Download, Eye, Frame, RefreshCw, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const API_ROOT = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000").replace(/\/api\/?$/, "");

interface UserItem {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  role: string;
  provider: string | null;
  createdAt: string;
  updatedAt: string;
  photoCount: number;
}

interface PhotoItem {
  id: string;
  url: string;
  createdAt: string;
  user: {
    id: string;
    email: string;
    name: string | null;
    avatarUrl: string | null;
  } | null;
  metadata: {
    width: number | null;
    height: number | null;
    bytes: number | null;
    format: string | null;
  };
}

type TabType = "users" | "photos" | "frames";

export default function AdminPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("users");
  const [users, setUsers] = useState<UserItem[]>([]);
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [allPhotos, setAllPhotos] = useState<PhotoItem[]>([]); // Lưu tất cả ảnh để filter
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [filterDate, setFilterDate] = useState<string>(""); // Format: YYYY-MM-DD
  const [viewingPhoto, setViewingPhoto] = useState<PhotoItem | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (!authLoading && user && user.role !== "admin") {
      router.push("/");
      return;
    }
    if (user?.role === "admin") {
      if (activeTab === "users") {
        fetchUsers();
      } else {
        fetchPhotos(selectedUserId || undefined);
      }
    }
  }, [user, authLoading, router, activeTab, selectedUserId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      if (!token) {
        setError("Chưa đăng nhập");
        return;
      }

      const res = await fetch(`${API_ROOT}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError("Bạn không có quyền admin");
        } else {
          setError("Không thể tải danh sách người dùng");
        }
        return;
      }

      const data = await res.json();
      setUsers(data.users || []);
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const fetchPhotos = async (userId?: string) => {
    try {
      setLoading(true);
      setError("");
      const token = getToken();
      if (!token) {
        setError("Chưa đăng nhập");
        return;
      }

      const url = userId
        ? `${API_ROOT}/api/admin/photos?userId=${userId}`
        : `${API_ROOT}/api/admin/photos`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        if (res.status === 403) {
          setError("Bạn không có quyền admin");
        } else {
          setError("Không thể tải danh sách ảnh");
        }
        return;
      }

      const data = await res.json();
      setAllPhotos(data.photos || []);
      // Apply filters
      applyFilters(data.photos || []);
    } catch (err) {
      setError("Lỗi kết nối");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (photoList: PhotoItem[]) => {
    let filtered = [...photoList];

    // Filter theo user
    if (selectedUserId) {
      filtered = filtered.filter((p) => p.user?.id === selectedUserId);
    }

    // Filter theo ngày
    if (filterDate) {
      const filterDateObj = new Date(filterDate);
      filterDateObj.setHours(0, 0, 0, 0);
      const nextDay = new Date(filterDateObj);
      nextDay.setDate(nextDay.getDate() + 1);

      filtered = filtered.filter((p) => {
        const photoDate = new Date(p.createdAt);
        return photoDate >= filterDateObj && photoDate < nextDay;
      });
    }

    setPhotos(filtered);
  };

  useEffect(() => {
    if (allPhotos.length > 0) {
      applyFilters(allPhotos);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId, filterDate]);

  const handleDownloadPhoto = async (photo: PhotoItem) => {
    try {
      const response = await fetch(photo.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const dateStr = new Date(photo.createdAt).toISOString().split("T")[0];
      const userStr = photo.user?.email?.split("@")[0] || "unknown";
      link.download = `photobooth-${userStr}-${dateStr}-${photo.id.slice(0, 8)}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("Tải xuống thất bại");
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!confirm(`Bạn có chắc muốn đổi role thành "${newRole}"?`)) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_ROOT}/api/admin/users/${userId}/role`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) {
        await fetchUsers();
      } else {
        alert("Cập nhật role thất bại");
      }
    } catch (err) {
      alert("Lỗi khi cập nhật role");
    }
  };

  const handleDeleteUser = async (userId: string, email: string) => {
    if (!confirm(`Bạn có chắc muốn xóa user "${email}"? Tất cả ảnh của user này cũng sẽ bị xóa.`)) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_ROOT}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchUsers();
        if (selectedUserId === userId) {
          setSelectedUserId(null);
          await fetchPhotos();
        }
      } else {
        alert("Xóa user thất bại");
      }
    } catch (err) {
      alert("Lỗi khi xóa user");
    }
  };

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;
    try {
      const token = getToken();
      const res = await fetch(`${API_ROOT}/api/admin/photos/${photoId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        await fetchPhotos(selectedUserId || undefined);
      } else {
        alert("Xóa ảnh thất bại");
      }
    } catch (err) {
      alert("Lỗi khi xóa ảnh");
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

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[60vh] bg-gradient-to-b from-slate-50/70 via-white/80 to-indigo-50/25 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Quản trị hệ thống</h1>
          <p className="text-slate-600">Quản lý người dùng và ảnh</p>
        </motion.div>

        {/* Tabs */}
        <div className="bg-white/85 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-6 mb-6">
          <div className="flex gap-2 border-b border-slate-200">
            <button
              onClick={() => {
                setActiveTab("users");
                setSelectedUserId(null);
              }}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === "users"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Người dùng
              {activeTab === "users" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <button
              onClick={() => {
                setActiveTab("photos");
                setSelectedUserId(null);
              }}
              className={`px-4 py-2 font-medium transition-colors relative ${
                activeTab === "photos"
                  ? "text-indigo-600"
                  : "text-slate-600 hover:text-slate-800"
              }`}
            >
              Ảnh
              {activeTab === "photos" && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
            <a
              href="/admin/frames"
              className="px-4 py-2 font-medium transition-colors relative text-slate-600 hover:text-slate-800 flex items-center gap-1"
            >
              <Frame className="w-4 h-4" />
              Khung ảnh
            </a>
            <a
              href="/admin/contributions"
              className="px-4 py-2 font-medium transition-colors relative text-slate-600 hover:text-slate-800 flex items-center gap-1"
            >
              Yêu cầu đóng góp
            </a>
          </div>
        </div>

        {/* Users Tab */}
        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <motion.div
              key="users"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden">
                <div className="p-6 border-b border-slate-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-slate-800">
                      Danh sách người dùng ({users.length})
                    </h2>
                    <Button onClick={fetchUsers} size="sm" variant="secondary">
                      <RefreshCw className="w-4 h-4 inline mr-1" />
                      Làm mới
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Ảnh
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Đăng ký
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              {user.avatarUrl ? (
                                <img
                                  src={user.avatarUrl ?? undefined}
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-semibold">
                                  {user.email.charAt(0).toUpperCase()}
                                </div>
                              )}
                              <div>
                                <p className="text-sm font-medium text-slate-800">
                                  {user.name || "Chưa đặt tên"}
                                </p>
                                <p className="text-xs text-slate-500">
                                  {user.provider || "Email"}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <p className="text-sm text-slate-800">{user.email}</p>
                            {user.emailVerified ? (
                              <span className="text-xs text-emerald-600 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Đã xác thực
                              </span>
                            ) : (
                              <span className="text-xs text-amber-600">Chưa xác thực</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                              className="text-sm border border-slate-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-600">{user.photoCount}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setActiveTab("photos");
                                  setSelectedUserId(user.id);
                                }}
                                className="text-xs text-indigo-600 hover:text-indigo-700"
                              >
                                Xem ảnh
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id, user.email)}
                                className="text-xs text-red-600 hover:text-red-700"
                              >
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {/* Photos Tab */}
          {activeTab === "photos" && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {/* Filters */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lọc theo người chụp
                    </label>
                    <select
                      value={selectedUserId || ""}
                      onChange={(e) => setSelectedUserId(e.target.value || null)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    >
                      <option value="">Tất cả người dùng</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name || user.email} ({user.photoCount} ảnh)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Lọc theo ngày chụp
                    </label>
                    <input
                      type="date"
                      value={filterDate}
                      onChange={(e) => setFilterDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                    />
                  </div>
                  <div className="flex items-end">
                    {(selectedUserId || filterDate) && (
                      <Button
                        onClick={() => {
                          setSelectedUserId(null);
                          setFilterDate("");
                        }}
                        variant="secondary"
                        size="sm"
                        className="w-full"
                      >
                        <X className="w-4 h-4 inline mr-1" />
                        Xóa bộ lọc
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                  Danh sách ảnh ({photos.length})
                </h2>
                <Button onClick={() => fetchPhotos()} size="sm" variant="secondary">
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Làm mới
                </Button>
              </div>

              {photos.length === 0 ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-200/60 p-12 text-center">
                  <Camera className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600">
                    {selectedUserId ? "User này chưa có ảnh nào" : "Chưa có ảnh nào được lưu"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photos.map((photo, index) => (
                    <motion.div
                      key={photo.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200/60 overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="aspect-square bg-slate-100 relative overflow-hidden group cursor-pointer">
                        <img
                          src={photo.url}
                          alt=""
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onClick={() => setViewingPhoto(photo)}
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingPhoto(photo);
                            }}
                            className="px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" />
                            Xem
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDownloadPhoto(photo);
                            }}
                            className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm flex items-center gap-1"
                          >
                            <Download className="w-4 h-4" />
                            Tải
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeletePhoto(photo.id);
                            }}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </button>
                        </div>
                      </div>
                      <div className="p-4">
                        {photo.user ? (
                          <div className="flex items-center gap-3 mb-3">
                            {photo.user.avatarUrl ? (
                              <img
                                src={photo.user.avatarUrl}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                                {photo.user.email.charAt(0).toUpperCase()}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 truncate">
                                {photo.user.name || "Chưa đặt tên"}
                              </p>
                              <p className="text-xs text-slate-500 truncate">
                                {photo.user.email}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-500 mb-3">Người dùng không xác định</p>
                        )}
                        <div className="text-xs text-slate-500 space-y-1">
                          <p>
                            {new Date(photo.createdAt).toLocaleString("vi-VN", {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                          {photo.metadata.width && photo.metadata.height && (
                            <p>
                              {photo.metadata.width} × {photo.metadata.height}
                              {photo.metadata.bytes && (
                                <span className="ml-2">
                                  ({(photo.metadata.bytes / 1024).toFixed(1)} KB)
                                </span>
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Photo View Modal */}
        <Modal
          isOpen={!!viewingPhoto}
          onClose={() => setViewingPhoto(null)}
          title={
            viewingPhoto
              ? `Ảnh của ${
                  viewingPhoto.user?.name || viewingPhoto.user?.email || "Người dùng không xác định"
                }`
              : undefined
          }
        >
          {viewingPhoto && (
            <div className="space-y-4">
              <div className="relative bg-slate-100 rounded-lg overflow-hidden">
                <img
                  src={viewingPhoto.url}
                  alt=""
                  className="w-full h-auto max-h-[70vh] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">Người chụp:</span>
                  <span className="font-medium">
                    {viewingPhoto.user?.name || viewingPhoto.user?.email || "Không xác định"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Ngày chụp:</span>
                  <span className="font-medium">
                    {new Date(viewingPhoto.createdAt).toLocaleString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {viewingPhoto.metadata.width && viewingPhoto.metadata.height && (
                  <div className="flex justify-between">
                    <span className="text-slate-600">Kích thước:</span>
                    <span className="font-medium">
                      {viewingPhoto.metadata.width} × {viewingPhoto.metadata.height}
                      {viewingPhoto.metadata.bytes && (
                        <span className="ml-2 text-slate-500">
                          ({(viewingPhoto.metadata.bytes / 1024).toFixed(1)} KB)
                        </span>
                      )}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={() => {
                    if (viewingPhoto) handleDownloadPhoto(viewingPhoto);
                  }}
                  className="flex-1"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  Tải xuống
                </Button>
                <Button
                  onClick={() => {
                    if (viewingPhoto) {
                      handleDeletePhoto(viewingPhoto.id);
                      setViewingPhoto(null);
                    }
                  }}
                  variant="danger"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 inline mr-1" />
                  Xóa
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
}
