"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseCameraReturn {
  stream: MediaStream | null;
  videoRef: React.RefObject<HTMLVideoElement>;
  isStreaming: boolean;
  error: string | null;
  facingMode: "user" | "environment";
  hasPermission: boolean | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
  switchCamera: () => void;
  requestPermission: () => Promise<boolean>;
  onStreamInactive?: (callback: () => void) => void;
}

export function useCamera(): UseCameraReturn {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const checkBrowserSupport = useCallback(() => {
    if (typeof navigator === "undefined") return false;
    return !!(
      navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia
    );
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!checkBrowserSupport()) {
      setError("Trình duyệt không hỗ trợ truy cập camera");
      return false;
    }

    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      mediaStream.getTracks().forEach((track) => track.stop());
      setHasPermission(true);
      return true;
    } catch (err) {
      setHasPermission(false);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Người dùng đã từ chối quyền truy cập camera");
        } else if (err.name === "NotFoundError") {
          setError("Không tìm thấy camera");
        } else {
          setError(`Lỗi: ${err.message}`);
        }
      }
      return false;
    }
  }, [checkBrowserSupport]);

  const startCamera = useCallback(async () => {
    if (!checkBrowserSupport()) {
      setError("Trình duyệt không hỗ trợ truy cập camera");
      return;
    }

    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      setStream(mediaStream);
      setHasPermission(true);

      console.log("useCamera: Stream obtained", {
        active: mediaStream.active,
        videoTracks: mediaStream.getVideoTracks().length,
        trackSettings: mediaStream.getVideoTracks()[0]?.getSettings(),
      });

      // Wait for video element to be ready
      if (videoRef.current) {
        const video = videoRef.current;
        video.srcObject = mediaStream;
        console.log("useCamera: srcObject set on video element");
        // Không cần gọi play() vì video có autoPlay attribute
        setIsStreaming(true);
      } else {
        console.warn("useCamera: videoRef.current is null, setting streaming anyway");
        // If video ref not ready, set streaming anyway
        setIsStreaming(true);
      }
    } catch (err) {
      setIsStreaming(false);
      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          setError("Người dùng đã từ chối quyền truy cập camera");
          setHasPermission(false);
        } else if (err.name === "NotFoundError") {
          setError("Không tìm thấy camera");
        } else {
          setError(`Lỗi khởi động camera: ${err.message}`);
        }
      }
    }
  }, [facingMode, checkBrowserSupport]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  const switchCamera = useCallback(() => {
    const newFacingMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newFacingMode);
    stopCamera();
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [facingMode, stopCamera, startCamera]);

  // Update video element when stream changes
  useEffect(() => {
    if (stream) {
      // Retry nếu video element chưa sẵn sàng
      let retries = 0;
      const maxRetries = 10;
      let isMounted = true;
      
      const trySetVideo = () => {
        if (!isMounted) return;
        
        if (videoRef.current) {
          const video = videoRef.current;
          // Chỉ set nếu srcObject khác hoặc chưa có
          if (video.srcObject !== stream) {
            // Clear srcObject cũ trước để tránh conflict
            if (video.srcObject) {
              const oldStream = video.srcObject as MediaStream;
              oldStream.getTracks().forEach(track => track.stop());
            }
            video.srcObject = stream;
            console.log("useCamera: srcObject set in useEffect");
          }
        } else if (retries < maxRetries) {
          retries++;
          setTimeout(trySetVideo, 50);
        }
      };
      trySetVideo();
      
      return () => {
        isMounted = false;
      };
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  // Monitor stream activity và tự động restart nếu stream bị inactive
  useEffect(() => {
    if (!stream) return;

    let checkInterval: NodeJS.Timeout;
    let restartAttempts = 0;
    const maxRestartAttempts = 3;
    let isRestarting = false;
    let currentStream = stream; // Capture stream reference

    const performRestart = async () => {
      if (isRestarting) return;
      
      isRestarting = true;
      restartAttempts++;

      console.warn("useCamera: Stream inactive, attempting restart...", {
        attempt: restartAttempts,
        streamActive: currentStream.active,
      });

      // Stop old stream
      currentStream.getTracks().forEach((track) => track.stop());
      setStream(null);
      setIsStreaming(false);

      // Restart camera sau delay
      setTimeout(async () => {
        try {
          // Get new stream
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: facingMode,
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: false,
          });

          setStream(mediaStream);
          setHasPermission(true);
          setIsStreaming(true);
          restartAttempts = 0; // Reset nếu restart thành công

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (error) {
          console.error("useCamera: Auto restart failed:", error);
          if (restartAttempts >= maxRestartAttempts) {
            setError("Camera đã tự động restart nhiều lần. Vui lòng thử lại thủ công.");
          }
        } finally {
          isRestarting = false;
        }
      }, 1000);
    };

    const checkStreamActivity = () => {
      if (!currentStream || isRestarting) return;

      const videoTracks = currentStream.getVideoTracks();
      const isActive = currentStream.active && videoTracks.length > 0 && videoTracks[0].readyState === "live";

      if (!isActive && restartAttempts < maxRestartAttempts) {
        performRestart();
      } else if (isActive) {
        restartAttempts = 0; // Reset counter nếu stream hoạt động tốt
      }
    };

    // Check mỗi 2 giây
    checkInterval = setInterval(checkStreamActivity, 2000);

    // Listen to track ended event
    const handleTrackEnded = () => {
      console.warn("useCamera: Video track ended");
      checkStreamActivity();
    };

    currentStream.getVideoTracks().forEach((track) => {
      track.addEventListener("ended", handleTrackEnded);
    });

    return () => {
      clearInterval(checkInterval);
      currentStream.getVideoTracks().forEach((track) => {
        track.removeEventListener("ended", handleTrackEnded);
      });
    };
  }, [stream, facingMode]);

  return {
    stream,
    videoRef,
    isStreaming,
    error,
    facingMode,
    hasPermission,
    startCamera,
    stopCamera,
    switchCamera,
    requestPermission,
  };
}
