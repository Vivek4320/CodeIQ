"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("SW registered:", reg.scope);

          // When a new SW is installed, force reload to clear old caches
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New SW is ready — reload to activate it
                  window.location.reload();
                }
              });
            }
          });
        })
        .catch((err) => {
          console.log("SW registration failed:", err);
        });
    }
  }, []);

  return null;
}
