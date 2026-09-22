"use client";

import { useEffect } from "react";

export default function PWARegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    let cancelled = false;
    navigator.serviceWorker
      .register("/sw", { scope: "/" })
      .then((registration) => {
        if (!cancelled) void registration.update();
      })
      .catch((error) => {
        console.warn("CYG service worker could not register:", error);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
