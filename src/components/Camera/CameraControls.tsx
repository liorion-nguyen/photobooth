"use client";

import { motion } from "framer-motion";
import Button from "@/components/UI/Button";

interface CameraControlsProps {
  onCapture: () => void;
  onSwitchCamera?: () => void;
  onToggleMirror?: () => void;
  isMirror?: boolean;
  isStreaming: boolean;
  canSwitchCamera?: boolean;
  disabled?: boolean;
}

export default function CameraControls({
  onCapture,
  onSwitchCamera,
  onToggleMirror,
  isMirror = false,
  isStreaming,
  canSwitchCamera = false,
  disabled = false,
}: CameraControlsProps) {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      {canSwitchCamera && onSwitchCamera && (
        <motion.button
          onClick={onSwitchCamera}
          className="p-3 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Chuyển camera"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </motion.button>
      )}

      <motion.button
        onClick={onCapture}
        disabled={!isStreaming || disabled}
        className="w-20 h-20 rounded-full bg-white border-4 border-gray-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        whileHover={isStreaming && !disabled ? { scale: 1.1 } : {}}
        whileTap={isStreaming && !disabled ? { scale: 0.9 } : {}}
        aria-label="Chụp ảnh"
      >
        <div className="w-full h-full rounded-full bg-white"></div>
      </motion.button>

      {onToggleMirror && (
        <motion.button
          onClick={onToggleMirror}
          className={`p-3 rounded-full transition-colors ${
            isMirror ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
          }`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label="Bật/tắt gương"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </motion.button>
      )}
    </div>
  );
}
