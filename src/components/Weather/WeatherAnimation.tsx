"use client";

import { useEffect, useRef } from "react";
import { useWeather } from "@/contexts/WeatherContext";
import { motion, AnimatePresence } from "framer-motion";

export default function WeatherAnimation() {
  const { animationConfig, weather, loading } = useWeather();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  // Debug log - Always call hooks first
  useEffect(() => {
    if (weather) {
      console.log("🌤️ Weather Animation Active:", {
        weatherType: animationConfig.type,
        particles: animationConfig.particles,
        gradient: animationConfig.gradient,
        intensity: animationConfig.intensity,
        weather,
      });
    } else if (!loading) {
      console.warn("Weather data not available, using default Clear animation");
    }
  }, [weather, animationConfig, loading]);

  // Canvas animation effect - Always call hooks
  useEffect(() => {
    if (loading || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      rotation?: number;
      rotationSpeed?: number;
    }> = [];

    // Initialize particles based on weather type
    const particleCount = 
      animationConfig.particles === "none" ? 0 :
      animationConfig.particles === "drops" ? 
        (animationConfig.type === "Thunderstorm" ? 200 : 120) : // More rain for storm, normal for regular rain
      animationConfig.particles === "snowflakes" ? 150 : 
      animationConfig.intensity === "high" ? 250 : 
      animationConfig.intensity === "medium" ? 150 : 80;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: animationConfig.particles === "drops" ? -10 : Math.random() * canvas.height,
        vx: animationConfig.particles === "wind" ? (Math.random() - 0.3) * 4 : 
            animationConfig.particles === "drops" ? 
              (animationConfig.type === "Thunderstorm" ? (Math.random() - 0.2) * 3 : (Math.random() - 0.5) * 0.5) : // Windy rain for storm
            (Math.random() - 0.5) * 1,
        vy: animationConfig.particles === "drops" ? 
              (animationConfig.type === "Thunderstorm" ? Math.random() * 12 + 10 : Math.random() * 8 + 6) : // Faster rain for storm
            animationConfig.particles === "snowflakes" ? Math.random() * 4 + 3 : 
            (Math.random() - 0.5) * 0.8,
        size: animationConfig.particles === "drops" ? 
              (animationConfig.type === "Thunderstorm" ? Math.random() * 2.5 + 1.5 : Math.random() * 1.5 + 1) : // Normal size for rain, slightly bigger for storm
              animationConfig.particles === "snowflakes" ? Math.random() * 6 + 4 : 
              Math.random() * 3 + 2,
        opacity: animationConfig.particles === "drops" ? Math.random() * 0.3 + 0.7 : // More visible rain
                 animationConfig.particles === "snowflakes" ? Math.random() * 0.2 + 0.8 : // More visible snow
                 Math.random() * 0.4 + 0.6,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: animationConfig.particles === "snowflakes" ? (Math.random() - 0.5) * 0.02 : 0,
      });
    }

    let lastTime = Date.now();

    function animate() {
      if (!ctx) return;
      
      const currentTime = Date.now();
      const deltaTime = (currentTime - lastTime) / 16; // Normalize to 60fps
      lastTime = currentTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Update position
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;

        // Update rotation for snowflakes
        if (particle.rotation !== undefined && particle.rotationSpeed !== undefined) {
          particle.rotation += particle.rotationSpeed * deltaTime;
        }

        // Wrap around edges or reset for rain
        if (animationConfig.particles === "drops") {
          if (particle.y > canvas.height) {
            particle.y = -10;
            particle.x = Math.random() * canvas.width;
          }
        } else {
          if (particle.x < 0) particle.x = canvas.width;
          if (particle.x > canvas.width) particle.x = 0;
          if (particle.y < 0) particle.y = canvas.height;
          if (particle.y > canvas.height) particle.y = 0;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        if (animationConfig.particles === "drops") {
          // Rain drops - normal size, angled for storm
          const isStorm = animationConfig.type === "Thunderstorm";
          const angle = isStorm ? Math.atan2(particle.vy, particle.vx) : Math.PI / 2; // Angled for storm
          const dropLength = particle.size * (isStorm ? 10 : 6);
          
          ctx.strokeStyle = isStorm ? "rgba(150, 180, 220, 0.9)" : "rgba(100, 180, 255, 0.8)";
          ctx.lineWidth = particle.size * (isStorm ? 1.1 : 0.9);
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(
            particle.x + Math.cos(angle) * dropLength,
            particle.y + Math.sin(angle) * dropLength
          );
          ctx.stroke();
          
          // Add trail effect
          ctx.strokeStyle = isStorm ? "rgba(150, 180, 220, 0.4)" : "rgba(135, 206, 250, 0.4)";
          ctx.lineWidth = particle.size * 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x - Math.cos(angle) * 5, particle.y - Math.sin(angle) * 5);
          ctx.lineTo(particle.x, particle.y);
          ctx.stroke();
          
          // Add splash at bottom for storm
          if (isStorm && particle.y > canvas.height - 20) {
            ctx.fillStyle = "rgba(150, 180, 220, 0.3)";
            ctx.beginPath();
            ctx.arc(particle.x, canvas.height, particle.size * 1.5, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (animationConfig.particles === "snowflakes") {
          // Snowflakes - star shape with rotation - More visible
          ctx.translate(particle.x, particle.y);
          if (particle.rotation !== undefined) {
            ctx.rotate(particle.rotation);
          }
          ctx.fillStyle = "rgba(255, 255, 255, 1)"; // Fully opaque
          ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
          ctx.lineWidth = 2; // Thicker lines
          
          // Draw snowflake (6-pointed star) - Bigger
          const spikes = 6;
          const outerRadius = particle.size * 1.2;
          const innerRadius = particle.size * 0.5;
          ctx.beginPath();
          for (let j = 0; j < spikes * 2; j++) {
            const radius = j % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * j) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          
          // Add glow effect
          ctx.shadowBlur = 5;
          ctx.shadowColor = "rgba(255, 255, 255, 0.8)";
        } else if (animationConfig.particles === "wind") {
          // Wind particles - horizontal streaks
          ctx.strokeStyle = "rgba(200, 200, 200, 0.7)";
          ctx.lineWidth = particle.size;
          ctx.lineCap = "round";
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(particle.x + particle.size * 4, particle.y);
          ctx.stroke();
        } else if (animationConfig.particles === "warm") {
          // Warm particles (sparkles) - animated stars
          const time = Date.now() * 0.001;
          const sparkleSize = particle.size * (1 + Math.sin(time + particle.x * 0.01) * 0.4);
          ctx.translate(particle.x, particle.y);
          ctx.rotate(time * 0.5 + particle.x * 0.01);
          ctx.fillStyle = `rgba(255, ${220 + Math.sin(time * 2) * 30}, ${120 + Math.cos(time * 2) * 30}, 0.8)`;
          
          // Draw sparkle (4-pointed star)
          const spikes = 4;
          const outerRadius = sparkleSize;
          const innerRadius = sparkleSize * 0.5;
          ctx.beginPath();
          for (let j = 0; j < spikes * 2; j++) {
            const radius = j % 2 === 0 ? outerRadius : innerRadius;
            const angle = (Math.PI * j) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (j === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.closePath();
          ctx.fill();
        }
        
        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animationConfig, loading]);

  // Early return only after all hooks are called
  if (loading) {
    return null;
  }

  // Cloud animation for Clouds weather and Thunderstorm
  const renderClouds = () => {
    if (animationConfig.type !== "Clouds" && animationConfig.type !== "Clear" && animationConfig.type !== "Thunderstorm") return null;

    const isStorm = animationConfig.type === "Thunderstorm";
    const cloudCount = isStorm ? 10 : (animationConfig.type === "Clear" ? 5 : 8);

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(cloudCount)].map((_, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full blur-2xl ${
              isStorm 
                ? "bg-gray-800/70" // Dark clouds for storm
                : animationConfig.type === "Clear" 
                ? "bg-white/50" 
                : "bg-gray-300/60"
            }`}
            style={{
              width: `${isStorm ? 150 + i * 50 : 120 + i * 40}px`,
              height: `${isStorm ? 80 + i * 30 : 60 + i * 20}px`,
              zIndex: 0,
            }}
            initial={{
              x: -300,
              y: isStorm ? 20 + i * 80 : 50 + i * 100,
            }}
            animate={{
              x: typeof window !== "undefined" ? window.innerWidth + 300 : 1600,
              y: isStorm ? 20 + i * 80 + Math.sin(i * 0.3) * 40 : 50 + i * 100 + Math.sin(i * 0.5) * 60,
            }}
            transition={{
              duration: isStorm ? 15 + i * 2 : (animationConfig.type === "Clear" ? 30 + i * 3 : 20 + i * 4),
              repeat: Infinity,
              ease: "linear",
              delay: i * (isStorm ? 0.8 : 1.5),
            }}
          />
        ))}
      </div>
    );
  };

  // Lightning for Thunderstorm - Enhanced with multiple lightning bolts
  const renderLightning = () => {
    if (animationConfig.type !== "Thunderstorm") return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Full screen flash */}
        <AnimatePresence>
          {[...Array(2)].map((_, i) => (
            <motion.div
              key={`flash-${i}`}
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.95, 0],
              }}
              transition={{
                duration: 0.1,
                repeat: Infinity,
                repeatDelay: 3 + Math.random() * 4,
                delay: i * 1.5,
              }}
            />
          ))}
        </AnimatePresence>
        
        {/* Lightning bolts */}
        {[...Array(4)].map((_, i) => (
          <motion.svg
            key={`bolt-${i}`}
            className="absolute"
            style={{
              left: `${20 + i * 20}%`,
              top: 0,
              width: "100px",
              height: "100%",
              zIndex: 10,
            }}
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatDelay: 2 + Math.random() * 5,
              delay: i * 0.8,
            }}
          >
            <path
              d={`M 50 0 Q ${30 + Math.random() * 40} ${100 + Math.random() * 200} ${40 + Math.random() * 20} ${200 + Math.random() * 300} T ${50 + (Math.random() - 0.5) * 30} 1000`}
              stroke="rgba(255, 255, 200, 0.9)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
            />
            <path
              d={`M 50 0 Q ${30 + Math.random() * 40} ${100 + Math.random() * 200} ${40 + Math.random() * 20} ${200 + Math.random() * 300} T ${50 + (Math.random() - 0.5) * 30} 1000`}
              stroke="rgba(200, 220, 255, 1)"
              strokeWidth="1"
              fill="none"
              strokeLinecap="round"
            />
          </motion.svg>
        ))}
      </div>
    );
  };

  // Fog overlay for Fog/Mist
  const renderFog = () => {
    if (animationConfig.type !== "Fog" && animationConfig.type !== "Mist") return null;

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-gray-300/40 rounded-full blur-3xl"
            style={{
              width: `${400 + i * 100}px`,
              height: `${200 + i * 50}px`,
              left: `${i * 30}%`,
              top: `${20 + i * 25}%`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 2,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0, position: 'fixed' }}>
      {/* Gradient Background - More visible */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${animationConfig.gradient}`}
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: animationConfig.type === "Clear" ? 0.35 : 
                   animationConfig.type === "Rain" ? 0.6 : 
                   animationConfig.type === "Thunderstorm" ? 0.85 : // Darker for storm
                   animationConfig.type === "Snow" ? 0.5 : 
                   animationConfig.type === "Fog" ? 0.5 : 0.4 
        }}
        transition={{ duration: 1 }}
        style={{ 
          mixBlendMode: animationConfig.type === "Clear" ? "normal" : "multiply",
          zIndex: 0,
        }}
      />

      {/* Particle Canvas - Always render for smooth animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ 
          mixBlendMode: animationConfig.particles === "drops" ? "normal" : 
                       animationConfig.particles === "warm" ? "screen" : 
                       animationConfig.particles === "snowflakes" ? "screen" : "normal",
          opacity: animationConfig.particles === "none" ? 0 : 
                   animationConfig.particles === "drops" ? 1 : // Full opacity for rain
                   animationConfig.particles === "snowflakes" ? 1 : // Full opacity for snow
                   animationConfig.intensity === "high" ? 1 : 
                   animationConfig.intensity === "medium" ? 0.95 : 0.85,
          zIndex: 1,
        }}
      />

      {/* Cloud Animation - For Clouds and Clear */}
      {renderClouds()}

      {/* Lightning Effect */}
      {renderLightning()}

      {/* Fog Effect */}
      {renderFog()}

      {/* Sun for Clear weather - Enhanced */}
      {animationConfig.type === "Clear" && (
        <>
          {/* Sun core with glow */}
          <div className="absolute top-10 right-10">
            <motion.div
              className="w-28 h-28 bg-gradient-to-br from-yellow-300 via-orange-400 to-yellow-500 rounded-full shadow-2xl relative z-10"
              animate={{
                scale: [1, 1.15, 1],
                rotate: [0, 360],
              }}
              transition={{
                scale: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
              }}
            />
            {/* Sun glow */}
            <motion.div
              className="absolute top-1/2 left-1/2 w-40 h-40 bg-yellow-300/40 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.4, 0.7, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Sun rays - 8 rays */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={`ray-${i}`}
                className="absolute top-1/2 left-1/2 w-1 h-20 bg-gradient-to-b from-yellow-300 to-transparent origin-top"
                style={{
                  transform: `translate(-50%, -100%) rotate(${i * 45}deg)`,
                  transformOrigin: "50% 100%",
                }}
                animate={{
                  opacity: [0.5, 0.9, 0.5],
                  scaleY: [1, 1.3, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* Warm light rays from sun spreading across screen - More visible */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={`light-ray-${i}`}
              className="absolute top-0 right-0 h-full bg-gradient-to-b from-yellow-300/60 via-yellow-200/30 to-transparent"
              style={{
                transform: `rotate(${-40 + i * 7}deg)`,
                transformOrigin: "top right",
                width: "400px",
                zIndex: 0,
              }}
              animate={{
                opacity: [0.3, 0.7, 0.3],
                x: [0, Math.sin(i) * 20, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                delay: i * 0.15,
                ease: "easeInOut",
              }}
            />
          ))}
          
          {/* Additional moving sunbeams */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`sunbeam-${i}`}
              className="absolute top-0 right-0 w-2 h-full bg-gradient-to-b from-yellow-400/50 to-transparent"
              style={{
                transform: `rotate(${-20 + i * 15}deg)`,
                transformOrigin: "top right",
                width: "500px",
                zIndex: 0,
              }}
              animate={{
                opacity: [0.2, 0.6, 0.2],
                x: [0, 50, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}
