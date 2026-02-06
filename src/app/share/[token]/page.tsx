"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPhotoByShareToken, type SharedPhotoData } from "@/services/share.service";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Calendar, User, Camera, Clock } from "lucide-react";
import Logo from "@/components/Logo";

export default function SharePhotoPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;
  
  const [photo, setPhoto] = useState<SharedPhotoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ");
      setLoading(false);
      return;
    }

    loadPhoto();
  }, [token]);

  const loadPhoto = async () => {
    try {
      setLoading(true);
      setError(null);
      const photoData = await getPhotoByShareToken(token);
      setPhoto(photoData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể tải ảnh");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Đang tải ảnh...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Không thể tải ảnh</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Về trang chủ
          </button>
        </motion.div>
      </div>
    );
  }

  if (!photo) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Logo size={40} showText={true} animated={false} />
          <button
            onClick={() => router.push("/")}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Về trang chủ
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Image */}
          <div className="relative bg-black">
            <img
              src={photo.url}
              alt="Shared photo"
              className="w-full h-auto max-h-[80vh] object-contain mx-auto"
            />
          </div>

          {/* Info */}
          <div className="p-6 sm:p-8">
            {/* Photo Info */}
            <div className="mb-6 space-y-4">
              {/* User Info - Người chụp ảnh */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100"
              >
                <div className="flex-shrink-0">
                  {photo.user?.avatarUrl ? (
                    <img
                      src={photo.user.avatarUrl}
                      alt={photo.user.name || photo.user.email || "Người chụp ảnh"}
                      className="w-14 h-14 rounded-full object-cover border-2 border-purple-200 shadow-md"
                      onError={(e) => {
                        // Fallback to initial if image fails to load
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector('.avatar-fallback')) {
                          const fallback = document.createElement('div');
                          fallback.className = 'avatar-fallback w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xl shadow-md';
                          fallback.textContent = (photo.user?.name || photo.user?.email || 'U').charAt(0).toUpperCase();
                          parent.appendChild(fallback);
                        }
                      }}
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold text-xl shadow-md">
                      {(photo.user?.name || photo.user?.email || "Ẩn danh").charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Camera className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    <p className="text-xs text-gray-500 mb-1">Người chụp ảnh</p>
                  </div>
                  <p className="font-semibold text-gray-800 text-lg truncate mb-1">
                    {photo.user?.name || photo.user?.email || "Người dùng ẩn danh"}
                  </p>
                  {photo.user?.email && photo.user?.name && (
                    <p className="text-sm text-gray-600 truncate">{photo.user.email}</p>
                  )}
                  {!photo.user && (
                    <p className="text-sm text-gray-500 italic">Thông tin người chụp không khả dụng</p>
                  )}
                </div>
              </motion.div>

              {/* Photo Date */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100"
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700 mb-1">Chụp vào</p>
                  <p className="text-gray-800 font-semibold">
                    {new Date(photo.createdAt).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </motion.div>

              {/* Share Info */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-sm text-gray-600 p-3 bg-amber-50 rounded-lg border border-amber-100"
              >
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Link này sẽ hết hạn sau 2 tuần</span>
              </motion.div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  const link = photo.url;
                  const a = document.createElement("a");
                  a.href = link;
                  a.download = `photobooth-shared-${photo.id}.jpg`;
                  document.body.appendChild(a);
                  a.click();
                  document.body.removeChild(a);
                }}
                className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Camera className="w-5 h-5" />
                Tải ảnh về
              </button>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "Xem ảnh Photobooth",
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                    alert("Đã copy link!");
                  }
                }}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                Chia sẻ link
              </button>
            </div>
          </div>
        </motion.div>

        {/* Footer Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full shadow-sm border border-gray-200">
            <Camera className="w-4 h-4 text-purple-600" />
            <p className="text-sm text-gray-600">Được chia sẻ từ Photobooth</p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
