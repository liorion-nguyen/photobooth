"use client";

import Button from "@/components/UI/Button";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Camera,
  Palette,
  Image as ImageIcon,
  Cloud,
  Smartphone,
  Zap,
  Users,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  Play,
} from "lucide-react";

export default function LandingPage() {
  const { user } = useAuth();
  const stats = [
    { value: "10K+", label: "Người dùng", icon: Users },
    { value: "50K+", label: "Ảnh đã chụp", icon: Camera },
    { value: "4.9/5", label: "Đánh giá", icon: Star },
    { value: "99%", label: "Hài lòng", icon: Award },
  ];

  const steps = [
    {
      number: "01",
      title: "Chọn chế độ",
      description: "Chọn chụp ảnh đơn hoặc layout nhiều ảnh",
      icon: Camera,
    },
    {
      number: "02",
      title: "Chụp ảnh",
      description: "Sử dụng camera trực tiếp trên trình duyệt",
      icon: Sparkles,
    },
    {
      number: "03",
      title: "Chỉnh sửa",
      description: "Áp dụng filter và khung ảnh theo ý thích",
      icon: Palette,
    },
    {
      number: "04",
      title: "Lưu & Chia sẻ",
      description: "Lưu ảnh vào đám mây và tải về máy",
      icon: Cloud,
    },
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Photographer",
      content: "Photobooth giúp tôi tạo ra những bức ảnh chuyên nghiệp một cách dễ dàng. Filter và layout rất đa dạng!",
      rating: 5,
      avatar: "A",
    },
    {
      name: "Trần Thị B",
      role: "Event Organizer",
      content: "Dịch vụ tuyệt vời! Khách hàng rất thích tính năng chụp ảnh và lưu trữ tự động.",
      rating: 5,
      avatar: "B",
    },
    {
      name: "Lê Văn C",
      role: "Content Creator",
      content: "Giao diện đẹp, dễ sử dụng. Tôi có thể tạo ra nhiều style ảnh khác nhau chỉ trong vài phút.",
      rating: 5,
      avatar: "C",
    },
  ];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" style={{ background: 'linear-gradient(to bottom right, rgba(79, 70, 229, 0.5), rgba(147, 51, 234, 0.5), rgba(219, 39, 119, 0.5))', backdropFilter: 'blur(0.5px)' }}>
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-block mb-6"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 mx-auto bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl">
                <Camera className="w-12 h-12 md:w-16 md:h-16 text-white" />
              </div>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white leading-tight">
              Chụp Ảnh
              <br />
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Chuyên Nghiệp
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto leading-relaxed">
              Tạo ra những khoảnh khắc đáng nhớ với filter và layout đa dạng.
              <br />
              Công nghệ hiện đại, giao diện đẹp mắt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/photobooth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl text-lg px-8 py-4 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                  >
                    Bắt đầu chụp ảnh
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </button>
                </motion.div>
              </Link>
              <Link href="/about">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    className="bg-white/20 backdrop-blur-md text-white border-2 border-white/50 hover:bg-white/30 hover:border-white/70 text-lg px-8 py-4 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                  >
                    <Play className="w-5 h-5 mr-2 inline" />
                    Tìm hiểu thêm
                  </button>
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center"
          >
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-b from-white/80 to-gray-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white mb-4 shadow-lg">
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <div className="text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Tính năng nổi bật
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Mọi thứ bạn cần để tạo ra những bức ảnh tuyệt vời
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Camera,
                title: "Chụp ảnh chất lượng cao",
                description: "Sử dụng camera trực tiếp trên trình duyệt với chất lượng HD",
                gradient: "from-blue-500 to-cyan-500",
              },
              {
                icon: Palette,
                title: "Filter đa dạng",
                description: "Hơn 10 filter chuyên nghiệp để tạo phong cách riêng",
                gradient: "from-purple-500 to-pink-500",
              },
              {
                icon: ImageIcon,
                title: "Layout linh hoạt",
                description: "Nhiều layout khác nhau cho ảnh đơn hoặc ảnh ghép",
                gradient: "from-pink-500 to-rose-500",
              },
              {
                icon: Cloud,
                title: "Lưu trữ đám mây",
                description: "Lưu tất cả ảnh của bạn an toàn và truy cập mọi lúc",
                gradient: "from-indigo-500 to-purple-500",
              },
              {
                icon: Smartphone,
                title: "Responsive",
                description: "Hoạt động mượt mà trên mọi thiết bị, từ điện thoại đến máy tính",
                gradient: "from-green-500 to-emerald-500",
              },
              {
                icon: Zap,
                title: "Nhanh chóng",
                description: "Xử lý và upload ảnh nhanh chóng với công nghệ hiện đại",
                gradient: "from-yellow-500 to-orange-500",
              },
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
                >
                  <div
                    className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50/80 to-purple-50/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Cách thức hoạt động
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chỉ cần 4 bước đơn giản để có những bức ảnh đẹp
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100 h-full">
                    <div className="text-6xl font-bold text-purple-100 mb-4">{step.number}</div>
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white mb-6 shadow-lg">
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-8 h-8 text-purple-300" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Khách hàng nói gì về chúng tôi
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hàng nghìn người dùng đã tin tưởng và sử dụng dịch vụ của chúng tôi
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600/85 via-purple-600/85 to-pink-600/85 backdrop-blur-sm text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sẵn sàng bắt đầu?
            </h2>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Tham gia ngay để tạo ra những bức ảnh tuyệt vời và lưu giữ khoảnh khắc đáng nhớ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/photobooth">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-xl text-lg px-8 py-4 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                  >
                    Bắt đầu miễn phí
                    <ArrowRight className="w-5 h-5 ml-2 inline" />
                  </button>
                </motion.div>
              </Link>
              {!user && (
                <Link href="/register">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <button
                      className="bg-white/20 backdrop-blur-md text-white border-2 border-white/50 hover:bg-white/30 hover:border-white/70 text-lg px-8 py-4 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-purple-600"
                    >
                      Tạo tài khoản
                    </button>
                  </motion.div>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
