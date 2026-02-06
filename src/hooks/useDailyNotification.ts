import { useState, useEffect } from "react";
import type { DailyNotificationData } from "@/types/weather";

const NOTIFICATION_STORAGE_PREFIX = "photobooth_notifications_";
const MAX_NOTIFICATIONS_PER_DAY = 3;
const MIN_HOURS_BETWEEN = 3; // Tối thiểu 3 giờ giữa các lần nhắc

function getTodayKey(): string {
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return `${NOTIFICATION_STORAGE_PREFIX}${dateStr}`;
}

function getTodayNotificationData(): DailyNotificationData {
  const key = getTodayKey();
  
  if (typeof window === "undefined") {
    return {
      date: new Date().toISOString().split("T")[0],
      count: 0,
      lastShown: 0,
      messages: [],
    };
  }
  
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error("Error reading notification data:", error);
  }
  
  return {
    date: new Date().toISOString().split("T")[0],
    count: 0,
    lastShown: 0,
    messages: [],
  };
}

function saveTodayNotificationData(data: DailyNotificationData): void {
  if (typeof window === "undefined") return;
  
  try {
    const key = getTodayKey();
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error("Error saving notification data:", error);
  }
}

function shouldShowNotification(): boolean {
  const data = getTodayNotificationData();
  const now = Date.now();
  
  // Đã nhắc đủ số lần trong ngày thì thôi
  if (data.count >= MAX_NOTIFICATIONS_PER_DAY) {
    return false;
  }
  
  // Chưa nhắc lần nào hôm nay → hiển thị
  if (data.count === 0) {
    return true;
  }
  
  // Đã nhắc rồi: chỉ hiển thị lại nếu đã qua ít nhất MIN_HOURS_BETWEEN giờ
  const msSinceLast = now - data.lastShown;
  const hoursSinceLast = msSinceLast / (1000 * 60 * 60);
  return hoursSinceLast >= MIN_HOURS_BETWEEN;
}

export function useDailyNotification() {
  const [shouldShow, setShouldShow] = useState(false);
  const [notificationData, setNotificationData] = useState<DailyNotificationData | null>(null);
  
  useEffect(() => {
    const check = () => {
      const data = getTodayNotificationData();
      setNotificationData(data);
      
      if (shouldShowNotification()) {
        setShouldShow(true);
      }
    };
    
    // Check immediately
    check();
    
    // Check every hour
    const interval = setInterval(check, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const markAsShown = (message?: string) => {
    const data = getTodayNotificationData();
    const updated: DailyNotificationData = {
      ...data,
      count: data.count + 1,
      lastShown: Date.now(),
      messages: message ? [...data.messages, message] : data.messages,
    };
    
    saveTodayNotificationData(updated);
    setNotificationData(updated);
    setShouldShow(false);
  };
  
  const dismiss = () => {
    setShouldShow(false);
  };
  
  return {
    shouldShow,
    notificationData,
    markAsShown,
    dismiss,
  };
}
