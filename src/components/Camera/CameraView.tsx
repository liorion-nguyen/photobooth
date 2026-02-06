"use client";

import { useEffect, useRef, useState } from "react";

import type { FilterType } from "@/types/photo";
import { getFilterCSS } from "@/utils/filterCSS";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  mirror?: boolean;
  onRestartCamera?: () => void;
  filter?: FilterType;
}

export default function CameraView({
  videoRef,
  isStreaming,
  mirror = false,
  onRestartCamera,
  filter = "none",
}: CameraViewProps) {
  const [videoReady, setVideoReady] = useState(false);
  const videoReadyTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset videoReady khi isStreaming thay đổi
  useEffect(() => {
    if (!isStreaming) {
      setVideoReady(false);
      if (videoReadyTimeoutRef.current) {
        clearTimeout(videoReadyTimeoutRef.current);
        videoReadyTimeoutRef.current = null;
      }
    }
  }, [isStreaming]);

  // Monitor video ready state và tự động restart nếu video không ready sau một thời gian
  useEffect(() => {
    if (!isStreaming || !onRestartCamera) return;

    // Clear timeout cũ nếu có
    if (videoReadyTimeoutRef.current) {
      clearTimeout(videoReadyTimeoutRef.current);
    }

    // Nếu video không ready sau 5 giây, restart camera
    videoReadyTimeoutRef.current = setTimeout(() => {
      const video = videoRef.current;
      if (
        video &&
        isStreaming &&
        !videoReady &&
        (!video.srcObject || video.readyState < 2) // readyState < 2 = không có data
      ) {
        console.warn("CameraView: Video not ready after timeout, restarting camera...");
        onRestartCamera();
      }
    }, 5000);

    return () => {
      if (videoReadyTimeoutRef.current) {
        clearTimeout(videoReadyTimeoutRef.current);
        videoReadyTimeoutRef.current = null;
      }
    };
  }, [isStreaming, videoReady, onRestartCamera, videoRef]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      console.log("CameraView: Video ref not available");
      return;
    }

    console.log("CameraView: Setting up video", {
      isStreaming,
      hasSrcObject: !!video.srcObject,
      videoWidth: video.videoWidth,
      videoHeight: video.videoHeight,
    });

    const handleLoadedMetadata = () => {
      console.log("CameraView: Video metadata loaded", {
        videoWidth: video.videoWidth,
        videoHeight: video.videoHeight,
      });
      // Không cần gọi play() vì video có autoPlay attribute
    };

    const handlePlay = () => {
      console.log("CameraView: Video playing");
      setVideoReady(true);
    };

    const handleError = (e: Event) => {
      console.error("CameraView: Video error:", e);
      setVideoReady(false);
    };

    const handleLoadedData = () => {
      console.log("CameraView: Video data loaded");
      setVideoReady(true);
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("loadeddata", handleLoadedData);
    video.addEventListener("play", handlePlay);
    video.addEventListener("error", handleError);
    video.addEventListener("playing", () => {
      console.log("CameraView: Video is playing");
      setVideoReady(true);
    });

    // Không cần gọi play() vì video có autoPlay attribute
    // Video sẽ tự động play khi srcObject được set

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("error", handleError);
    };
  }, [videoRef, isStreaming]);

  return (
    <div className="relative w-full h-full bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${mirror ? "scale-x-[-1]" : ""}`}
        style={{ 
          opacity: videoReady && isStreaming ? 1 : 0,
          transition: "opacity 0.3s, filter 0.3s",
          display: "block",
          width: "100%",
          height: "100%",
          filter: getFilterCSS(filter),
        }}
      />
      {(!isStreaming || !videoReady) && (
        <div className="absolute inset-0 flex items-center justify-center text-white z-10 bg-black bg-opacity-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>{isStreaming ? "Đang tải video..." : "Đang khởi động camera..."}</p>
            {process.env.NODE_ENV === "development" && (
              <p className="text-xs mt-2 opacity-75">
                Debug: isStreaming={isStreaming.toString()}, videoReady={videoReady.toString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
