"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface ImmersiveModeContextValue {
  isImmersive: boolean;
  setImmersive: (value: boolean) => void;
}

const ImmersiveModeContext = createContext<ImmersiveModeContextValue | null>(null);

export function ImmersiveModeProvider({ children }: { children: React.ReactNode }) {
  const [isImmersive, setImmersiveState] = useState(false);
  const setImmersive = useCallback((value: boolean) => {
    setImmersiveState(value);
  }, []);

  useEffect(() => {
    if (isImmersive) {
      document.body.style.overflow = "hidden";
      document.documentElement.classList.add("photobooth-immersive");
    } else {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("photobooth-immersive");
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.classList.remove("photobooth-immersive");
    };
  }, [isImmersive]);

  const value = useMemo(
    () => ({ isImmersive, setImmersive }),
    [isImmersive, setImmersive]
  );

  return (
    <ImmersiveModeContext.Provider value={value}>{children}</ImmersiveModeContext.Provider>
  );
}

export function useImmersiveMode() {
  const ctx = useContext(ImmersiveModeContext);
  if (!ctx) {
    throw new Error("useImmersiveMode must be used within ImmersiveModeProvider");
  }
  return ctx;
}
