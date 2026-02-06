"use client";

import { motion } from "framer-motion";

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  animated?: boolean;
}

export default function Logo({ size = 40, showText = true, className = "", animated = true }: LogoProps) {
  const iconSize = size;
  const viewBoxSize = 400;
  
  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      {animated ? (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          className="flex-shrink-0"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            width={iconSize}
            height={iconSize}
            className="object-contain"
          >
            <defs>
              <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#FF40C6", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#8F00FF", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#FF69B4", stopOpacity: 1 }} />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="4" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#mainGradient)" opacity="0.1" />
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="url(#mainGradient)"
              strokeWidth="4"
              strokeDasharray="20,15"
              opacity="0.6"
              transform="rotate(-20 200 200)"
            />
            <g transform="rotate(-10 200 200)" filter="url(#softShadow)">
              <g transform="translate(0, -60)">
                <rect x="165" y="80" width="70" height="120" rx="5" fill="#FFFFFF" stroke="url(#mainGradient)" strokeWidth="3" />
                <rect x="175" y="90" width="50" height="30" rx="2" fill="#FFB6E6" />
                <rect x="175" y="125" width="50" height="30" rx="2" fill="#D49EFF" />
                <rect x="175" y="160" width="50" height="30" rx="2" fill="#FFB6E6">
                  <path d="M200,185 C200,185 195,180 190,180 C185,180 185,185 190,190 L200,198 L210,190 C215,185 215,180 210,180 C205,180 200,185 200,185 Z" fill="#FFFFFF" />
                </rect>
              </g>
              <rect x="100" y="160" width="200" height="140" rx="25" ry="25" fill="url(#mainGradient)" />
              <circle cx="200" cy="230" r="55" fill="#FFFFFF" opacity="0.2" />
              <circle cx="200" cy="230" r="45" fill="#4A0080" stroke="#FFFFFF" strokeWidth="4" />
              <circle cx="200" cy="230" r="20" fill="url(#energyGradient)" />
              <circle cx="210" cy="220" r="8" fill="#FFFFFF" opacity="0.8" />
              <circle cx="260" cy="190" r="15" fill="#FFFFFF" />
              <rect x="130" y="150" width="40" height="10" rx="5" fill="#FF8CE0" />
            </g>
            <g transform="translate(260, 140)">
              <path d="M0,0 L20,-15 L10,5 L30,10 L5,20 L15,40 L-5,25 Z" fill="url(#energyGradient)" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="10" cy="10" r="30" fill="none" stroke="url(#energyGradient)" strokeWidth="2" opacity="0.5" strokeDasharray="5,5" />
            </g>
          </svg>
        </motion.div>
      ) : (
        <div className="flex-shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            width={iconSize}
            height={iconSize}
            className="object-contain"
          >
            <defs>
              <linearGradient id="mainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#FF40C6", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#8F00FF", stopOpacity: 1 }} />
              </linearGradient>
              <linearGradient id="energyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: "#FFD700", stopOpacity: 1 }} />
                <stop offset="100%" style={{ stopColor: "#FF69B4", stopOpacity: 1 }} />
              </linearGradient>
              <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                <feOffset dx="2" dy="4" result="offsetblur" />
                <feComponentTransfer>
                  <feFuncA type="linear" slope="0.3" />
                </feComponentTransfer>
                <feMerge>
                  <feMergeNode />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <circle cx="200" cy="200" r="180" fill="url(#mainGradient)" opacity="0.1" />
            <circle
              cx="200"
              cy="200"
              r="160"
              fill="none"
              stroke="url(#mainGradient)"
              strokeWidth="4"
              strokeDasharray="20,15"
              opacity="0.6"
              transform="rotate(-20 200 200)"
            />
            <g transform="rotate(-10 200 200)" filter="url(#softShadow)">
              <g transform="translate(0, -60)">
                <rect x="165" y="80" width="70" height="120" rx="5" fill="#FFFFFF" stroke="url(#mainGradient)" strokeWidth="3" />
                <rect x="175" y="90" width="50" height="30" rx="2" fill="#FFB6E6" />
                <rect x="175" y="125" width="50" height="30" rx="2" fill="#D49EFF" />
                <rect x="175" y="160" width="50" height="30" rx="2" fill="#FFB6E6">
                  <path d="M200,185 C200,185 195,180 190,180 C185,180 185,185 190,190 L200,198 L210,190 C215,185 215,180 210,180 C205,180 200,185 200,185 Z" fill="#FFFFFF" />
                </rect>
              </g>
              <rect x="100" y="160" width="200" height="140" rx="25" ry="25" fill="url(#mainGradient)" />
              <circle cx="200" cy="230" r="55" fill="#FFFFFF" opacity="0.2" />
              <circle cx="200" cy="230" r="45" fill="#4A0080" stroke="#FFFFFF" strokeWidth="4" />
              <circle cx="200" cy="230" r="20" fill="url(#energyGradient)" />
              <circle cx="210" cy="220" r="8" fill="#FFFFFF" opacity="0.8" />
              <circle cx="260" cy="190" r="15" fill="#FFFFFF" />
              <rect x="130" y="150" width="40" height="10" rx="5" fill="#FF8CE0" />
            </g>
            <g transform="translate(260, 140)">
              <path d="M0,0 L20,-15 L10,5 L30,10 L5,20 L15,40 L-5,25 Z" fill="url(#energyGradient)" stroke="#FFFFFF" strokeWidth="2" />
              <circle cx="10" cy="10" r="30" fill="none" stroke="url(#energyGradient)" strokeWidth="2" opacity="0.5" strokeDasharray="5,5" />
            </g>
          </svg>
        </div>
      )}
      {showText && (
        <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Photobooth
        </span>
      )}
    </div>
  );

  return logoContent;
}
