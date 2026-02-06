"use client";

import { motion } from "framer-motion";
import { Camera, Sparkles, Save } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Về Photobooth
        </h1>
        <p className="text-xl text-gray-600">
          Sinh ra từ một lý do riêng.
        </p>
      </motion.div>

      {/* Story */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Câu chuyện</h2>
        <div className="prose prose-lg max-w-none text-gray-600">
          <p className="mb-4">
            Có người muốn chụp ảnh — ý tưởng nảy ra từ đó. Photobooth là nơi 
            chụp, chỉnh filter, chọn khung và lưu lại khoảnh khắc, dành cho ai cần 
            một chỗ đơn giản để có ảnh đẹp mà không cần gì phức tạp.
          </p>
        </div>
      </motion.section>

      {/* What you can do */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mb-12"
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Bạn có thể làm gì ở đây</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Camera, title: "Chụp ảnh", desc: "Chụp ảnh trực tiếp từ camera với giao diện đơn giản" },
            { icon: Sparkles, title: "Filter & khung", desc: "Chỉnh filter, thêm khung và trang trí ảnh" },
            { icon: Save, title: "Lưu & chia sẻ", desc: "Lưu ảnh và tải về để giữ hoặc chia sẻ" },
          ].map((value, index) => {
            const IconComponent = value.icon;
            return (
            <div key={index} className="bg-gray-50 rounded-lg p-6 text-center">
              <div className="flex justify-center mb-3">
                <IconComponent className="w-10 h-10 text-gray-700" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">{value.title}</h4>
              <p className="text-sm text-gray-600">{value.desc}</p>
            </div>
            );
          })}
        </div>
      </motion.section>

      {/* Closing */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <p className="text-gray-700">
            Cảm ơn bạn đã ghé thăm. Hy vọng bạn có thêm vài khoảnh khắc đẹp.
          </p>
        </div>
      </motion.section>
    </div>
  );
}
