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
        
        // Ensure video plays
        try {
          await video.play();
          console.log("useCamera: Video play() successful");
          setIsStreaming(true);
        } catch (playError) {
          console.error("useCamera: Error playing video:", playError);
          // Try to set streaming anyway, browser might autoplay
          setIsStreaming(true);
        }
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
    if (stream && videoRef.current) {
      const video = videoRef.current;
      if (video.srcObject !== stream) {
        video.srcObject = stream;
        video.play().catch((err) => {
          console.error("Error playing video in useEffect:", err);
        });
      }
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

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
