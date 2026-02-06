"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, X, Share2, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { createShareLink, getShareLink, type ShareLinkResponse } from "@/services/share.service";
import Modal from "../UI/Modal";

// Simple QR Code generator using canvas (no external library needed)
function QRCodeCanvas({ value, size = 200 }: { value: string; size?: number }) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    // Use a simple QR code API service (free, no API key needed)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(value)}`;
    setQrDataUrl(qrUrl);
  }, [value, size]);

  if (!qrDataUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <img
      src={qrDataUrl}
      alt="QR Code"
      className="w-full h-full object-contain rounded-lg border-2 border-gray-200"
    />
  );
}

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoId: string;
}

export default function ShareModal({ isOpen, onClose, photoId }: ShareModalProps) {
  const [shareLink, setShareLink] = useState<ShareLinkResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && photoId) {
      loadShareLink();
    }
  }, [isOpen, photoId]);

  const loadShareLink = async () => {
    setLoading(true);
    setError(null);
    try {
      // Get current origin for share URL
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
      
      // Try to get existing share link first
      const existing = await getShareLink(photoId);
      if (existing) {
        // Always use current origin for share URL (more reliable)
        const shareLinkData: ShareLinkResponse = {
          ...existing,
          shareUrl: `${currentOrigin}/share/${existing.token}`,
        };
        setShareLink(shareLinkData);
      } else {
        // Create new share link
        const newShare = await createShareLink(photoId);
        // Always use current origin for share URL
        const shareLinkData: ShareLinkResponse = {
          ...newShare,
          shareUrl: `${currentOrigin}/share/${newShare.token}`,
        };
        setShareLink(shareLinkData);
      }
    } catch (err) {
      console.error("Share link error:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Không thể tạo share link. Vui lòng thử lại sau.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shareLink) return;

    try {
      await navigator.clipboard.writeText(shareLink.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatExpiryDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Chia sẻ ảnh">
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
            <p className="text-gray-600">Đang tạo link chia sẻ...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadShareLink}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Thử lại
            </button>
          </div>
        ) : shareLink ? (
          <>
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2 flex items-center justify-center gap-2">
                <Share2 className="w-5 h-5" />
                Link chia sẻ
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Link này sẽ hết hạn sau 2 tuần
              </p>
            </div>

            {/* QR Code */}
            <div className="flex justify-center">
              <div className="w-48 h-48 bg-white p-2 rounded-lg shadow-md">
                <QRCodeCanvas value={shareLink.shareUrl} size={200} />
              </div>
            </div>

            {/* Share URL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Link chia sẻ:</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareLink.shareUrl}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
                />
                <motion.button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Đã copy
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy
                    </>
                  )}
                </motion.button>
              </div>
            </div>

            {/* Expiry Date */}
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span>Hết hạn: {formatExpiryDate(shareLink.expiresAt)}</span>
            </div>

            {/* Instructions */}
            <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
              <p className="font-medium mb-2">Hướng dẫn:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Quét QR code bằng điện thoại để mở link</li>
                <li>Hoặc copy link và gửi cho bạn bè</li>
                <li>Link sẽ tự động hết hạn sau 2 tuần</li>
              </ul>
            </div>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
