"use client";

import CameraControls from "@/components/Camera/CameraControls";
import CameraView from "@/components/Camera/CameraView";
import FilterList from "@/components/Filters/FilterList";
import FrameSelector, { type FrameType } from "@/components/Frames/FrameSelector";
import FramedLayoutPreview from "@/components/Layouts/FramedLayoutPreview";
import LayoutPreview from "@/components/Layouts/LayoutPreview";
import LayoutPreviewCompact from "@/components/Layouts/LayoutPreviewCompact";
import LayoutProgress from "@/components/Layouts/LayoutProgress";
import LayoutSelector from "@/components/Layouts/LayoutSelector";
import Logo from "@/components/Logo";
import PreviewImage from "@/components/Preview/PreviewImage";
import ShareModal from "@/components/Share/ShareModal";
import Button from "@/components/UI/Button";
import Modal from "@/components/UI/Modal";
import { useAuth } from "@/contexts/AuthContext";
import { useCamera } from "@/hooks/useCamera";
import { useCapture } from "@/hooks/useCapture";
import { useLayout } from "@/hooks/useLayout";
import { uploadPhoto } from "@/services/upload.service";
import type { LayoutType } from "@/types/layout";
import type { CaptureResult, FilterType, UploadProgress } from "@/types/photo";
import { downloadImage } from "@/utils/downloadImage";
import { exportLayoutAsImage } from "@/utils/layoutCanvas";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, LogIn, Share2, UserPlus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type PhotoMode = "single" | "layout";
type ViewMode = "mode-select" | "layout-select" | "camera" | "preview" | "layout-preview" | "error";

type CaptureMode = "manual" | "auto";
type CaptureSettings = {
  mode: CaptureMode;
  countdown: number; // seconds
};

export default function PhotoboothPage() {
  const { user } = useAuth();
  const [photoMode, setPhotoMode] = useState<PhotoMode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("layout-select");
  const [capturedImage, setCapturedImage] = useState<CaptureResult | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [isMirror, setIsMirror] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadedPhotoId, setUploadedPhotoId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [captureSettings, setCaptureSettings] = useState<CaptureSettings>({
    mode: "manual",
    countdown: 3,
  });
  const [countdown, setCountdown] = useState<number | null>(null);
  const [autoCaptureTimer, setAutoCaptureTimer] = useState<NodeJS.Timeout | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<FrameType>("none");

  const {
    videoRef,
    isStreaming,
    error: cameraError,
    hasPermission,
    startCamera,
    stopCamera,
    switchCamera,
    requestPermission,
  } = useCamera();

  const {
    layoutState,
    progress: layoutProgress,
    currentSlot,
    initializeLayout,
    captureSlot,
    resetLayout,
    goToSlot,
  } = useLayout();

  const { capture } = useCapture({ 
    videoRef, 
    mirror: isMirror,
    layoutRows: layoutState?.config.rows,
    layoutCols: layoutState?.config.cols,
    filter: selectedFilter,
  });

  const handleRequestPermission = useCallback(async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionModal(false);
      await startCamera();
    }
  }, [requestPermission, startCamera]);

  const handleStartCamera = useCallback(async () => {
    if (hasPermission === false) {
      setShowPermissionModal(true);
      return;
    }
    await startCamera();
  }, [hasPermission, startCamera]);

  const handleSelectMode = useCallback((mode: PhotoMode) => {
    setPhotoMode(mode);
    if (mode === "layout") {
      setViewMode("layout-select");
    } else {
      setViewMode("camera");
    }
  }, []);

  // Auto set photoMode to layout when selecting layout
  useEffect(() => {
    if (viewMode === "layout-select" && !photoMode) {
      setPhotoMode("layout");
    }
  }, [viewMode, photoMode]);

  const handleSelectLayout = useCallback(async (layoutType: LayoutType, settings?: CaptureSettings) => {
    initializeLayout(layoutType);
    setPhotoMode("layout");
    setSelectedFrame("none"); // Reset frame khi chọn layout mới
    setSelectedFilter("none"); // Reset filter khi chọn layout mới
    if (settings) {
      setCaptureSettings(settings);
    }
    // Chuyển về camera view trước để video element được render
    setViewMode("camera");
    // Start camera nếu chưa streaming (delay để video element render xong)
    if (!isStreaming) {
      setTimeout(async () => {
        await handleStartCamera();
      }, 300);
    }
  }, [initializeLayout, isStreaming, handleStartCamera]);

  // performCapture - không có dependency với startAutoCapture
  const performCapture = useCallback(async () => {
    const result = await capture();
    if (!result) return;

    if (photoMode === "layout" && layoutState) {
      // Layout mode: tự động lưu vào slot luôn
      const updatedState = captureSlot(result.dataUrl);
      if (updatedState) {
        if (!updatedState.isComplete) {
          // Chưa hoàn thành, vẫn ở camera mode để chụp slot tiếp theo
          // Nếu là auto mode, set flag để useEffect trigger auto capture tiếp theo
          if (captureSettings.mode === "auto" && isStreaming) {
            // Set một flag để useEffect biết cần start auto capture tiếp theo
            setCountdown(-1); // -1 là flag để trigger auto capture
          }
        } else {
          // Hoàn thành, chuyển sang preview layout
          setViewMode("layout-preview");
          // Clear auto capture
          setAutoCaptureTimer((prevTimer) => {
            if (prevTimer) {
              clearInterval(prevTimer);
            }
            return null;
          });
          setCountdown(null);
        }
      }
    } else {
      // Single mode: preview như cũ
      setCapturedImage(result);
      setViewMode("preview");
      // Clear auto capture
      setAutoCaptureTimer((prevTimer) => {
        if (prevTimer) {
          clearInterval(prevTimer);
        }
        return null;
      });
      setCountdown(null);
    }
  }, [capture, photoMode, layoutState, captureSlot, captureSettings.mode, isStreaming]);

  const startAutoCapture = useCallback(() => {
    console.log("startAutoCapture called");
    
    // Clear timer cũ nếu có
    setAutoCaptureTimer((prevTimer) => {
      if (prevTimer) {
        console.log("Clearing previous timer");
        clearInterval(prevTimer);
      }
      return null;
    });

    // Bắt đầu countdown
    const currentCountdown = captureSettings.countdown;
    console.log("Starting countdown with value:", currentCountdown);
    setCountdown(currentCountdown);

    // Sử dụng biến local để track countdown
    let countdownValue = currentCountdown;

    const countdownInterval = setInterval(() => {
      countdownValue--;
      console.log("Countdown tick:", countdownValue);
      
      if (countdownValue > 0) {
        setCountdown(countdownValue);
      } else {
        console.log("Countdown finished, capturing...");
        clearInterval(countdownInterval);
        setCountdown(null);
        setAutoCaptureTimer(null);
        // Chụp ảnh
        performCapture();
      }
    }, 1000);

    console.log("Countdown interval set:", countdownInterval);
    setAutoCaptureTimer(countdownInterval as any);
  }, [captureSettings.countdown, performCapture]);

  const handleCapture = useCallback(() => {
    // Nếu đang countdown, không cho chụp manual
    if (countdown !== null) {
      return;
    }
    performCapture();
  }, [countdown, performCapture]);

  const handleRetake = useCallback(() => {
    // Chỉ dùng cho single mode
    setCapturedImage(null);
    setSelectedFilter("none");
    setViewMode("camera");
  }, []);

  const handleRetakeSlot = useCallback((slotIndex: number) => {
    if (!layoutState) return;
    goToSlot(slotIndex);
    setViewMode("camera");
    // Camera sẽ tự động start bởi useEffect
  }, [layoutState, goToSlot]);

  const handleRetakeAll = useCallback(() => {
    if (!layoutState) return;
    // Reset layout nhưng giữ layout type
    const layoutType = layoutState.config.type;
    resetLayout();
    initializeLayout(layoutType);
    setSelectedFrame("none"); // Reset frame
    setSelectedFilter("none"); // Reset filter
    setViewMode("camera");
    // Camera sẽ tự động start bởi useEffect
  }, [layoutState, resetLayout, initializeLayout]);

  const handleConfirm = useCallback(async () => {
    if (photoMode === "layout" && layoutState) {
      // Export layout
      try {
        setUploadProgress({ loaded: 0, total: 100, percentage: 0 });
        const layoutBlob = await exportLayoutAsImage(layoutState, selectedFrame);
        
        // Upload lên server
        setUploadProgress({ loaded: 10, total: 100, percentage: 10 });
        const uploadResult = await uploadPhoto(layoutBlob, (progress) => {
          // Map upload progress từ 10% đến 90%
          setUploadProgress({
            loaded: 10 + (progress.percentage * 0.8),
            total: 100,
            percentage: Math.round(10 + (progress.percentage * 0.8)),
          });
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload thất bại");
        }

        // Save photo ID for sharing
        if (uploadResult.id) {
          setUploadedPhotoId(uploadResult.id);
        }

        // Download ảnh về máy
        setUploadProgress({ loaded: 90, total: 100, percentage: 90 });
        const frameName = selectedFrame !== "none" ? selectedFrame : "no-frame";
        const layoutName = layoutState.config.name.toLowerCase().replace(/\s+/g, "-");
        downloadImage(layoutBlob, `photobooth-${layoutName}-${frameName}`);
        
        setUploadProgress({ loaded: 100, total: 100, percentage: 100 });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Giữ lại view mode để hiển thị nút share
        // Không reset ngay, để user có thể share ảnh
        setUploadProgress({ loaded: 100, total: 100, percentage: 100 });
      } catch (error) {
        alert(`Lưu ảnh thất bại: ${error instanceof Error ? error.message : "Unknown error"}`);
        setUploadProgress(null);
      }
    } else if (capturedImage) {
      // Single mode: upload và download
      try {
        setUploadProgress({ loaded: 0, total: 100, percentage: 0 });
        
        // Upload lên server
        const uploadResult = await uploadPhoto(capturedImage.blob, (progress) => {
          // Map upload progress từ 0% đến 80%
          setUploadProgress({
            loaded: progress.loaded,
            total: progress.total,
            percentage: Math.round(progress.percentage * 0.8),
          });
        });

        if (!uploadResult.success) {
          throw new Error(uploadResult.error || "Upload thất bại");
        }

        // Save photo ID for sharing
        if (uploadResult.id) {
          setUploadedPhotoId(uploadResult.id);
        }

        // Download ảnh về máy
        setUploadProgress({ loaded: 80, total: 100, percentage: 80 });
        downloadImage(capturedImage.blob, "photobooth-single");
        
        setUploadProgress({ loaded: 100, total: 100, percentage: 100 });
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Giữ lại view mode để hiển thị nút share
        // Không reset ngay, để user có thể share ảnh
        setUploadProgress({ loaded: 100, total: 100, percentage: 100 });
      } catch (error) {
        alert(`Lưu ảnh thất bại: ${error instanceof Error ? error.message : "Unknown error"}`);
        setUploadProgress(null);
      }
    }
  }, [photoMode, layoutState, capturedImage, selectedFrame, resetLayout]);

  const handleToggleMirror = useCallback(() => {
    setIsMirror(!isMirror);
  }, [isMirror]);

  const handleBackToModeSelect = useCallback(() => {
    setViewMode("layout-select");
    setPhotoMode(null);
    if (layoutState) {
      resetLayout();
    }
    if (capturedImage) {
      setCapturedImage(null);
    }
    // Reset upload state
    setUploadProgress(null);
    setUploadedPhotoId(null);
    setShowShareModal(false);
    // Không stop camera, chỉ ẩn đi
    // stopCamera();
  }, [layoutState, capturedImage, resetLayout]);

  // Check browser support và tự động bật camera khi mount
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const hasGetUserMedia = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );
      if (!hasGetUserMedia) {
        setViewMode("error");
        return;
      }
      
      // Tự động bật camera khi vào trang
      const initCamera = async () => {
        try {
          // Request permission nếu chưa có
          if (hasPermission === null) {
            await requestPermission();
          }
          // Start camera
          if (hasPermission !== false) {
            await startCamera();
          }
        } catch (error) {
          console.error("Error initializing camera:", error);
        }
      };
      
      // Delay một chút để component render xong
      const timer = setTimeout(initCamera, 500);
      return () => clearTimeout(timer);
    }
  }, [hasPermission, requestPermission, startCamera]);

  // Cleanup: Stop camera khi component unmount
  useEffect(() => {
    return () => {
      stopCamera();
      // Cleanup timer khi unmount
      setAutoCaptureTimer((prevTimer) => {
        if (prevTimer) {
          clearInterval(prevTimer);
        }
        return null;
      });
    };
  }, [stopCamera]);

  // Đảm bảo camera đang streaming khi vào camera view
  useEffect(() => {
    if (viewMode === "camera" && !isStreaming && !cameraError && hasPermission !== false) {
      console.log("Camera view: Starting camera...");
      // Sử dụng một flag để tránh multiple calls
      let mounted = true;
      const timer = setTimeout(async () => {
        if (mounted && !isStreaming) {
          await handleStartCamera();
        }
      }, 500); // Tăng delay để tránh conflict
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }
  }, [viewMode, isStreaming, cameraError, hasPermission, handleStartCamera]);

  // Auto start capture khi vào camera view với auto mode
  useEffect(() => {
    if (
      viewMode === "camera" &&
      captureSettings.mode === "auto" &&
      isStreaming &&
      photoMode === "layout" &&
      layoutState &&
      !layoutState.isComplete &&
      countdown === null &&
      !autoCaptureTimer
    ) {
      console.log("Auto capture: Starting countdown...");
      // Delay một chút để camera sẵn sàng
      const timer = setTimeout(() => {
        console.log("Auto capture: Calling startAutoCapture");
        startAutoCapture();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [viewMode, captureSettings.mode, isStreaming, photoMode, layoutState, countdown, autoCaptureTimer, startAutoCapture]);

  // Trigger auto capture tiếp theo khi countdown = -1 (flag từ performCapture)
  useEffect(() => {
    if (
      countdown === -1 &&
      captureSettings.mode === "auto" &&
      isStreaming &&
      photoMode === "layout" &&
      layoutState &&
      !layoutState.isComplete
    ) {
      console.log("Auto capture: Triggering next countdown...");
      // Reset countdown trước
      setCountdown(null);
      // Delay một chút trước khi start countdown tiếp theo
      const timer = setTimeout(() => {
        console.log("Auto capture: Starting next countdown");
        startAutoCapture();
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [countdown, captureSettings.mode, isStreaming, photoMode, layoutState, startAutoCapture]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 to-purple-50/80 backdrop-blur-sm py-8 relative">
      {/* Modal yêu cầu đăng nhập khi chưa đăng nhập */}
      <AnimatePresence>
        {!user && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
              style={{ pointerEvents: "auto" }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 pointer-events-none"
            >
              <div className="pointer-events-auto bg-white rounded-xl sm:rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6 md:p-8 max-w-md w-full text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-amber-100 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-amber-600" />
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">
                  Cần đăng nhập
                </h2>
                <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
                  Bạn cần đăng nhập để sử dụng chức năng chụp ảnh. Hãy đăng nhập hoặc tạo tài khoản để tiếp tục.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Link href="/login" className="flex-1 sm:flex-none">
                    <Button className="w-full sm:w-auto gap-2 text-sm sm:text-base" size="lg">
                      <LogIn className="w-4 h-4 sm:w-5 sm:h-5" />
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link href="/register" className="flex-1 sm:flex-none">
                    <Button variant="secondary" className="w-full sm:w-auto gap-2 text-sm sm:text-base" size="lg">
                      <UserPlus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Đăng ký
                    </Button>
                  </Link>
                </div>
                <Link href="/" className="inline-block mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500 hover:text-gray-700">
                  ← Quay lại trang chủ
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 min-h-[calc(100vh-2rem)] sm:min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex justify-center mb-3 sm:mb-6 flex-shrink-0">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-800 flex items-center gap-2 sm:gap-3">
            <Logo size={32} className="sm:!w-10 sm:!h-10 md:!w-12 md:!h-12" showText={false} animated={false} />
            <span className="hidden xs:inline">PHOTOBOOTH</span>
            <span className="xs:hidden">PHOTOBOOTH</span>
          </h1>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-3 sm:p-4 md:p-6 flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {viewMode === "layout-select" && (
              <motion.div
                key="layout-select"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex flex-col h-full min-h-0"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-4 flex-shrink-0">
                  <Button onClick={handleBackToModeSelect} variant="secondary" size="sm" className="text-xs sm:text-sm">
                    ← Quay lại
                  </Button>
                </div>
                <div className="flex-1 min-h-0">
                  <LayoutSelector
                    selectedLayout={null}
                    onSelect={handleSelectLayout}
                  />
                </div>
              </motion.div>
            )}

            {/* Camera View - Luôn render để giữ video element, chỉ ẩn khi không cần */}
            <div 
              className={`flex flex-col h-full min-h-0 ${viewMode === "camera" ? "" : "hidden"}`}
              style={viewMode !== "camera" ? { position: "absolute", visibility: "hidden", pointerEvents: "none" } : {}}
            >
              {!isStreaming && !cameraError && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 text-center">
                    <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-gray-600 mx-auto mb-3 sm:mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                      Đang khởi động camera...
                    </p>
                    {hasPermission === false && (
                      <Button onClick={handleStartCamera} size="lg" className="mt-3 sm:mt-4 text-sm sm:text-base">
                        Cho phép truy cập Camera
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {cameraError && (
                <div className="flex-1 flex items-center justify-center">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-red-700">
                    <p className="font-semibold mb-2 flex items-center gap-2 text-sm sm:text-base">
                      <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Lỗi Camera
                    </p>
                    <p className="text-xs sm:text-sm mb-3 sm:mb-4">{cameraError}</p>
                    <Button
                      onClick={handleStartCamera}
                      variant="secondary"
                      className="mt-2 sm:mt-4 text-sm sm:text-base"
                    >
                      Thử lại
                    </Button>
                  </div>
                </div>
              )}

              {isStreaming && (
                <div className="flex-1 flex flex-col lg:flex-row gap-2 sm:gap-3 md:gap-4 lg:items-start">
                  {/* Camera View - Main Area */}
                  <div className="flex-1 flex flex-col">
                    {/* Header with back button */}
                    {photoMode === "layout" && layoutState && (
                      <div className="flex items-center justify-between mb-2 sm:mb-3 flex-shrink-0">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-800 text-sm sm:text-base truncate">{layoutState.config.name}</h3>
                          <p className="text-xs text-gray-600">
                            Ảnh {layoutState.slots.filter((s) => s.captured).length}/{layoutState.config.totalSlots}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Filter Selector */}
                    <div className="mb-2 sm:mb-3 flex-shrink-0 overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                      <FilterList
                        selectedFilter={selectedFilter}
                        onFilterSelect={setSelectedFilter}
                      />
                    </div>

                    {/* Camera Feed - Luôn render để giữ stream */}
                    <div className="flex-1 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden relative p-2">
                      <div className="w-full relative flex-shrink-0" style={{ aspectRatio: "4/3" }}>
                        <CameraView
                          videoRef={videoRef}
                          isStreaming={isStreaming}
                          mirror={isMirror}
                          onRestartCamera={handleStartCamera}
                          filter={selectedFilter}
                        />
                        {/* Countdown Overlay */}
                        {countdown !== null && countdown > 0 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 pointer-events-none rounded-lg">
                            <motion.div
                              key={countdown}
                              initial={{ scale: 0.5, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 1.5, opacity: 0 }}
                              className="text-white text-6xl sm:text-7xl md:text-9xl font-bold"
                            >
                              {countdown}
                            </motion.div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Progress indicator */}
                    {photoMode === "layout" && layoutState && currentSlot && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-1.5 sm:p-2 text-center flex-shrink-0 mt-2 sm:mt-3">
                        <p className="text-xs text-blue-700">
                          Chụp ảnh {layoutState.currentSlotIndex + 1}/{layoutState.config.totalSlots}
                        </p>
                      </div>
                    )}

                    {/* Camera Controls */}
                    <div className="flex-shrink-0 mt-2 sm:mt-3">
                      <CameraControls
                        onCapture={handleCapture}
                        onSwitchCamera={switchCamera}
                        onToggleMirror={handleToggleMirror}
                        isMirror={isMirror}
                        isStreaming={isStreaming}
                        canSwitchCamera={true}
                        disabled={countdown !== null || captureSettings.mode === "auto"}
                      />
                    </div>
                  </div>

                  {/* Layout Preview - Right Side (Desktop) / Bottom (Mobile) */}
                  {photoMode === "layout" && layoutState && (
                    <div className="w-full lg:w-64 flex-shrink-0 order-first lg:order-last">
                      <LayoutPreviewCompact
                        layoutState={layoutState}
                        onSlotClick={handleRetakeSlot}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {viewMode === "preview" && capturedImage && (
              <motion.div
                key="preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-2 sm:space-y-4"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Preview & Filter</h2>
                  <Button onClick={handleBackToModeSelect} variant="secondary" size="sm" className="text-xs sm:text-sm">
                    ← Quay lại
                  </Button>
                </div>
                <div className="overflow-x-auto -mx-3 sm:mx-0 px-3 sm:px-0">
                  <FilterList
                    selectedFilter={selectedFilter}
                    onFilterSelect={setSelectedFilter}
                  />
                </div>
                <div className="min-h-[300px] sm:min-h-[400px]">
                  <PreviewImage
                    imageUrl={capturedImage.dataUrl}
                    filter={selectedFilter}
                    onRetake={handleRetake}
                    onConfirm={handleConfirm}
                    isUploading={!!uploadProgress}
                  />
                </div>

                {uploadProgress && (
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5">
                      <motion.div
                        className="bg-blue-600 h-2 sm:h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress.percentage}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-center text-xs sm:text-sm text-gray-600 mt-2">
                      Đang lưu: {uploadProgress.percentage}%
                    </p>
                  </div>
                )}

                {uploadProgress && uploadProgress.percentage === 100 && uploadedPhotoId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Button
                      onClick={() => setShowShareModal(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Chia sẻ ảnh
                    </Button>
                  </motion.div>
                )}

                {uploadProgress && uploadProgress.percentage === 100 && uploadedPhotoId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Button
                      onClick={() => setShowShareModal(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Chia sẻ ảnh
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Share Modal */}
            {uploadedPhotoId && (
              <ShareModal
                isOpen={showShareModal}
                onClose={() => {
                  setShowShareModal(false);
                  // Không reset uploadedPhotoId ngay, để user có thể mở lại
                }}
                photoId={uploadedPhotoId}
              />
            )}

            {viewMode === "layout-preview" && layoutState && (
              <motion.div
                key="layout-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="max-w-6xl mx-auto"
              >
                <div className="flex items-center justify-between mb-2 sm:mb-4">
                  <h2 className="text-lg sm:text-xl font-semibold">Preview Layout</h2>
                </div>
                <div className="mb-2 sm:mb-4">
                  <LayoutProgress layoutState={layoutState} />
                </div>
                
                {/* Main Content: Preview và Frame Selector side by side */}
                <div className="flex flex-col lg:flex-row gap-3 sm:gap-4 lg:items-start">
                  {/* Left: Preview */}
                  <div className="flex-1 min-w-0 order-2 lg:order-1">
                    {layoutState.isComplete ? (
                      <FramedLayoutPreview
                        layoutState={layoutState}
                        frameType={selectedFrame}
                        onSlotClick={handleRetakeSlot}
                      />
                    ) : (
                      <LayoutPreview
                        layoutState={layoutState}
                        onSlotClick={handleRetakeSlot}
                        showNumbers={false}
                      />
                    )}
                    
                    {/* Action Buttons */}
                    <div className="space-y-2 sm:space-y-3 mt-3 sm:mt-4">
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Button
                          onClick={handleRetakeAll}
                          variant="secondary"
                          className="flex-1 text-sm sm:text-base"
                        >
                          Chụp lại từ đầu
                        </Button>
                        <Button
                          onClick={handleConfirm}
                          className="flex-1 text-sm sm:text-base"
                          disabled={!!uploadProgress}
                        >
                          {uploadProgress ? "Đang lưu..." : "Lưu ảnh"}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 text-center px-2">
                        💡 Click vào ảnh để chụp lại từng ảnh riêng lẻ
                      </p>
                    </div>
                  </div>
                  
                  {/* Right: Frame Selector - Sticky trên desktop */}
                  <div className="w-full lg:w-80 lg:sticky lg:top-4 flex-shrink-0 order-1 lg:order-2">
                    <div className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto">
                      <FrameSelector
                        selectedFrame={selectedFrame}
                        onSelect={setSelectedFrame}
                      />
                    </div>
                  </div>
                </div>

                {uploadProgress && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <motion.div
                        className="bg-blue-600 h-2.5 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress.percentage}%` }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Đang lưu: {uploadProgress.percentage}%
                    </p>
                  </div>
                )}

                {uploadProgress && uploadProgress.percentage === 100 && uploadedPhotoId && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4"
                  >
                    <Button
                      onClick={() => setShowShareModal(true)}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Chia sẻ ảnh
                    </Button>
                    <Button
                      onClick={() => {
                        setViewMode("layout-select");
                        resetLayout();
                        setPhotoMode(null);
                        setSelectedFrame("none");
                        setUploadProgress(null);
                        setUploadedPhotoId(null);
                      }}
                      variant="secondary"
                      className="w-full mt-2"
                    >
                      Quay lại chọn layout
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            )}

            {viewMode === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center"
              >
                <p className="text-red-700 font-semibold mb-2 flex items-center justify-center gap-2 text-sm sm:text-base">
                  <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
                  Trình duyệt không hỗ trợ
                </p>
                <p className="text-red-600 text-xs sm:text-sm">
                  Vui lòng sử dụng Chrome, Firefox, hoặc Safari phiên bản mới nhất.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      <Modal
        isOpen={showPermissionModal}
        onClose={() => setShowPermissionModal(false)}
        title="Yêu cầu quyền truy cập Camera"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Ứng dụng cần quyền truy cập camera để chụp ảnh. Vui lòng cấp quyền trong
            cài đặt trình duyệt.
          </p>
          <div className="flex gap-2">
            <Button onClick={handleRequestPermission} className="flex-1">
              Cấp quyền
            </Button>
            <Button
              onClick={() => setShowPermissionModal(false)}
              variant="secondary"
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
