"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCamera } from "@/hooks/useCamera";
import { useCapture } from "@/hooks/useCapture";
import { useLayout } from "@/hooks/useLayout";
import CameraView from "@/components/Camera/CameraView";
import CameraControls from "@/components/Camera/CameraControls";
import PreviewImage from "@/components/Preview/PreviewImage";
import FilterList from "@/components/Filters/FilterList";
import LayoutSelector from "@/components/Layouts/LayoutSelector";
import LayoutPreview from "@/components/Layouts/LayoutPreview";
import LayoutProgress from "@/components/Layouts/LayoutProgress";
import Modal from "@/components/UI/Modal";
import Button from "@/components/UI/Button";
import { uploadPhoto } from "@/services/upload.service";
import { exportLayoutAsImage } from "@/utils/layoutCanvas";
import type { FilterType, CaptureResult, UploadProgress } from "@/types/photo";
import type { LayoutType } from "@/types/layout";

type PhotoMode = "single" | "layout";
type ViewMode = "mode-select" | "layout-select" | "camera" | "preview" | "layout-preview" | "error";

export default function Home() {
  const [photoMode, setPhotoMode] = useState<PhotoMode | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("mode-select");
  const [capturedImage, setCapturedImage] = useState<CaptureResult | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("none");
  const [isMirror, setIsMirror] = useState(true);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState(false);

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

  const { capture } = useCapture({ videoRef, mirror: isMirror });

  const {
    layoutState,
    progress: layoutProgress,
    currentSlot,
    initializeLayout,
    captureSlot,
    resetLayout,
    goToSlot,
  } = useLayout();

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

  const handleSelectLayout = useCallback((layoutType: LayoutType) => {
    initializeLayout(layoutType);
    setViewMode("camera");
  }, [initializeLayout]);

  const handleCapture = useCallback(async () => {
    const result = await capture();
    if (!result) return;

    if (photoMode === "layout" && layoutState) {
      // Layout mode: capture vào slot hiện tại
      const updatedState = captureSlot(result.dataUrl);
      if (updatedState) {
        if (!updatedState.isComplete) {
          // Chưa hoàn thành, vẫn ở camera mode để chụp tiếp
          // Không cần làm gì, component sẽ tự update
        } else {
          // Hoàn thành, chuyển sang preview layout
          setViewMode("layout-preview");
        }
      }
    } else {
      // Single mode: preview như cũ
      setCapturedImage(result);
      setViewMode("preview");
    }
  }, [capture, photoMode, layoutState, captureSlot]);

  const handleRetake = useCallback(() => {
    if (photoMode === "layout" && layoutState) {
      // Retake slot hiện tại
      setViewMode("camera");
    } else {
      // Single mode retake
      setCapturedImage(null);
      setSelectedFilter("none");
      setViewMode("camera");
    }
  }, [photoMode, layoutState]);

  const handleRetakeSlot = useCallback((slotIndex: number) => {
    if (!layoutState) return;
    goToSlot(slotIndex);
    setViewMode("camera");
  }, [layoutState, goToSlot]);

  const handleConfirm = useCallback(async () => {
    if (photoMode === "layout" && layoutState) {
      // Export và upload layout
      try {
        setUploadProgress({ loaded: 0, total: 100, percentage: 0 });
        const layoutBlob = await exportLayoutAsImage(layoutState);
        
        const result = await uploadPhoto(layoutBlob, (progress) => {
          setUploadProgress(progress);
        });

        if (result.success && result.url) {
          setUploadedUrl(result.url);
          setViewMode("mode-select");
          resetLayout();
          setPhotoMode(null);
          setUploadProgress(null);
        } else {
          alert(`Upload thất bại: ${result.error || "Unknown error"}`);
          setUploadProgress(null);
        }
      } catch (error) {
        alert(`Export thất bại: ${error instanceof Error ? error.message : "Unknown error"}`);
        setUploadProgress(null);
      }
    } else if (capturedImage) {
      // Single mode upload
      setUploadProgress({ loaded: 0, total: 100, percentage: 0 });

      try {
        const result = await uploadPhoto(capturedImage.blob, (progress) => {
          setUploadProgress(progress);
        });

        if (result.success && result.url) {
          setUploadedUrl(result.url);
          setViewMode("mode-select");
          setCapturedImage(null);
          setSelectedFilter("none");
          setPhotoMode(null);
          setUploadProgress(null);
        } else {
          alert(`Upload thất bại: ${result.error || "Unknown error"}`);
          setUploadProgress(null);
        }
      } catch (error) {
        alert(`Upload thất bại: ${error instanceof Error ? error.message : "Unknown error"}`);
        setUploadProgress(null);
      }
    }
  }, [photoMode, layoutState, capturedImage, resetLayout]);

  const handleToggleMirror = useCallback(() => {
    setIsMirror(!isMirror);
  }, [isMirror]);

  const handleBackToModeSelect = useCallback(() => {
    setViewMode("mode-select");
    setPhotoMode(null);
    if (layoutState) {
      resetLayout();
    }
    if (capturedImage) {
      setCapturedImage(null);
    }
    stopCamera();
  }, [layoutState, capturedImage, resetLayout, stopCamera]);

  // Check browser support on mount
  useEffect(() => {
    if (typeof navigator !== "undefined") {
      const hasGetUserMedia = !!(
        navigator.mediaDevices && navigator.mediaDevices.getUserMedia
      );
      if (!hasGetUserMedia) {
        setViewMode("error");
      }
    }
  }, []);

  return (
    <main className="h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 overflow-hidden flex flex-col">
      <div className="max-w-md mx-auto flex flex-col h-full">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 flex-shrink-0">
          📸 Web Photobooth
        </h1>

        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {viewMode === "mode-select" && (
              <motion.div
                key="mode-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-center">
                  Chọn chế độ chụp
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  <motion.button
                    onClick={() => handleSelectMode("single")}
                    className="p-6 rounded-lg border-2 border-blue-500 bg-blue-50 hover:bg-blue-100 transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">📷</div>
                    <div className="font-semibold text-gray-800 mb-1">
                      Chụp 1 ảnh
                    </div>
                    <div className="text-sm text-gray-600">
                      Chụp và chỉnh sửa 1 ảnh đơn lẻ
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleSelectMode("layout")}
                    className="p-6 rounded-lg border-2 border-purple-500 bg-purple-50 hover:bg-purple-100 transition-colors text-left"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="text-2xl mb-2">🖼️</div>
                    <div className="font-semibold text-gray-800 mb-1">
                      Chụp theo Layout
                    </div>
                    <div className="text-sm text-gray-600">
                      Chụp nhiều ảnh theo khung có sẵn
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === "layout-select" && (
            <motion.div
              key="layout-select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex flex-col flex-1 min-h-0"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col flex-1 min-h-0">
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <h2 className="text-2xl font-bold text-gray-800">Chọn Layout</h2>
                  <Button onClick={handleBackToModeSelect} variant="secondary" size="sm">
                    ← Quay lại
                  </Button>
                </div>
                <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
                  <LayoutSelector
                    selectedLayout={null}
                    onSelect={handleSelectLayout}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {viewMode === "camera" && (
            <motion.div
              key="camera"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-4"
            >
              {photoMode === "layout" && layoutState && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">{layoutState.config.name}</h3>
                    <Button onClick={handleBackToModeSelect} variant="secondary" size="sm">
                      ← Quay lại
                    </Button>
                  </div>
                  <LayoutProgress layoutState={layoutState} />
                  <div className="mt-4">
                    <LayoutPreview
                      layoutState={layoutState}
                      onSlotClick={handleRetakeSlot}
                    />
                  </div>
                </div>
              )}

              {!isStreaming && !cameraError && (
                <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                  <p className="text-gray-700 mb-4">
                    Nhấn nút bên dưới để bắt đầu camera
                  </p>
                  <Button onClick={handleStartCamera} size="lg">
                    Bắt đầu Camera
                  </Button>
                </div>
              )}

              {cameraError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                  <p className="font-semibold mb-2">⚠️ Lỗi Camera</p>
                  <p className="text-sm">{cameraError}</p>
                  <Button
                    onClick={handleStartCamera}
                    variant="secondary"
                    className="mt-4"
                  >
                    Thử lại
                  </Button>
                </div>
              )}

              {isStreaming && (
                <>
                  <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ minHeight: "500px" }}>
                    <CameraView
                      videoRef={videoRef}
                      isStreaming={isStreaming}
                      mirror={isMirror}
                    />
                  </div>
                  {photoMode === "layout" && layoutState && currentSlot && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
                      <p className="text-sm text-blue-700">
                        Chụp ảnh {layoutState.currentSlotIndex + 1}/{layoutState.config.totalSlots}
                      </p>
                    </div>
                  )}
                  <CameraControls
                    onCapture={handleCapture}
                    onSwitchCamera={switchCamera}
                    onToggleMirror={handleToggleMirror}
                    isMirror={isMirror}
                    isStreaming={isStreaming}
                    canSwitchCamera={true}
                  />
                </>
              )}
            </motion.div>
          )}

          {viewMode === "preview" && capturedImage && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Preview & Filter</h2>
                  <Button onClick={handleBackToModeSelect} variant="secondary" size="sm">
                    ← Quay lại
                  </Button>
                </div>
                <FilterList
                  selectedFilter={selectedFilter}
                  onFilterSelect={setSelectedFilter}
                />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4 min-h-[400px]">
                <PreviewImage
                  imageUrl={capturedImage.dataUrl}
                  filter={selectedFilter}
                  onRetake={handleRetake}
                  onConfirm={handleConfirm}
                  isUploading={!!uploadProgress}
                />
              </div>

              {uploadProgress && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress.percentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Đang upload: {uploadProgress.percentage}%
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {viewMode === "layout-preview" && layoutState && (
            <motion.div
              key="layout-preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="space-y-4"
            >
              <div className="bg-white rounded-lg shadow-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Preview Layout</h2>
                  <Button onClick={handleBackToModeSelect} variant="secondary" size="sm">
                    ← Quay lại
                  </Button>
                </div>
                <LayoutProgress layoutState={layoutState} />
              </div>

              <div className="bg-white rounded-lg shadow-lg p-4">
                <LayoutPreview
                  layoutState={layoutState}
                  onSlotClick={handleRetakeSlot}
                  showNumbers={false}
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={() => setViewMode("camera")}
                  variant="secondary"
                  className="flex-1"
                >
                  Chụp lại
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="flex-1"
                  disabled={!!uploadProgress}
                >
                  {uploadProgress ? "Đang upload..." : "Xác nhận & Upload"}
                </Button>
              </div>

              {uploadProgress && (
                <div className="bg-white rounded-lg shadow-lg p-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <motion.div
                      className="bg-blue-600 h-2.5 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress.percentage}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-2">
                    Đang upload: {uploadProgress.percentage}%
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {viewMode === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
            >
              <p className="text-red-700 font-semibold mb-2">
                ⚠️ Trình duyệt không hỗ trợ
              </p>
              <p className="text-red-600 text-sm">
                Vui lòng sử dụng Chrome, Firefox, hoặc Safari phiên bản mới nhất.
              </p>
            </motion.div>
          )}
          </AnimatePresence>
        </div>

        {uploadedUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <p className="text-green-700 font-semibold mb-2">✅ Upload thành công!</p>
            <p className="text-green-600 text-sm break-all">{uploadedUrl}</p>
          </motion.div>
        )}
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
    </main>
  );
}
