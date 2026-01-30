"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CameraViewProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  mirror?: boolean;
}

export default function CameraView({
  videoRef,
  isStreaming,
  mirror = false,
}: CameraViewProps) {
  const [videoReady, setVideoReady] = useState(false);

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
      setVideoReady(true);
      video.play().catch((err) => {
        console.error("Error playing video:", err);
      });
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

    // Try to play if stream is already set
    if (isStreaming && video.srcObject) {
      console.log("CameraView: Attempting to play video");
      video.play().catch((err) => {
        console.error("CameraView: Error playing video:", err);
      });
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("loadeddata", handleLoadedData);
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("error", handleError);
    };
  }, [videoRef, isStreaming]);

  return (
    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ minHeight: "500px", aspectRatio: "4/3" }}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover ${mirror ? "scale-x-[-1]" : ""}`}
        style={{ 
          opacity: videoReady && isStreaming ? 1 : 0,
          transition: "opacity 0.3s",
          display: "block",
          width: "100%",
          height: "100%",
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
