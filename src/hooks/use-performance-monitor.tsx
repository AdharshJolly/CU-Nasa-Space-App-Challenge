"use client";

import { useEffect } from "react";

export const usePerformanceMonitor = (pageName: string) => {
  useEffect(() => {
    // Measure page load time
    const startTime = performance.now();

    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      console.log(
        `[Performance] ${pageName} loaded in ${loadTime.toFixed(2)}ms`
      );

      // Log to analytics if needed
      if (typeof window !== "undefined" && "gtag" in window) {
        (window as any).gtag("event", "page_load_time", {
          custom_parameter: loadTime,
          page_title: pageName,
        });
      }
    };

    // Check if already loaded
    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      window.removeEventListener("load", handleLoad);
    };
  }, [pageName]);
};
