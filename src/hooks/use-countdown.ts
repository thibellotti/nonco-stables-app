"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseCountdownReturn {
  timeLeft: number;
  isExpired: boolean;
  isUrgent: boolean; // < 10 seconds remaining
  formatted: string; // "0:28" format
  progress: number; // 0 to 1 (for circular progress)
  reset: () => void;
  start: (seconds?: number) => void;
}

export function useCountdown(initialSeconds: number = 30): UseCountdownReturn {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const totalRef = useRef(initialSeconds);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback((seconds?: number) => {
    cleanup();
    const total = seconds ?? totalRef.current;
    totalRef.current = total;
    setTimeLeft(total);
    setIsRunning(true);
  }, [cleanup]);

  const reset = useCallback(() => {
    start(totalRef.current);
  }, [start]);

  useEffect(() => {
    if (!isRunning || timeLeft <= 0) {
      if (timeLeft <= 0) setIsRunning(false);
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          cleanup();
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return cleanup;
  }, [isRunning, timeLeft <= 0, cleanup]);

  const isExpired = timeLeft <= 0 && !isRunning;
  const isUrgent = timeLeft > 0 && timeLeft <= 10;
  const progress = totalRef.current > 0 ? timeLeft / totalRef.current : 0;
  const formatted = `0:${timeLeft.toString().padStart(2, "0")}`;

  return { timeLeft, isExpired, isUrgent, formatted, progress, reset, start };
}
