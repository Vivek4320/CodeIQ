"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useTheme } from "@/components/landing/ThemeContext";

declare global {
  interface Window {
    google?: any;
  }
}

interface GoogleSignInProps {
  onSuccess: (credential: string) => void;
  text?: string;
}

export default function GoogleSignIn({ onSuccess, text = "Continue with Google" }: GoogleSignInProps) {
  const { theme } = useTheme();
  const buttonRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  const renderButton = useCallback(() => {
    if (!window.google?.accounts?.id || !buttonRef.current) return;

    // Clear any existing button
    buttonRef.current.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: "1098781764912-2n733kra4t7rq7s7udpp0mc8cdqc0ema.apps.googleusercontent.com",
      callback: (response: any) => {
        if (response.credential) {
          onSuccess(response.credential);
        }
      },
    });

    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: "outline",
      size: "large",
      width: buttonRef.current.offsetWidth || 350,
      text: "continue_with",
    });

    setReady(true);
  }, [onSuccess]);

  useEffect(() => {
    // Check if Google script is already loaded
    if (window.google?.accounts?.id) {
      renderButton();
      return;
    }

    // Load script
    const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
    if (existingScript) {
      // Script exists, wait for it
      const checkReady = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkReady);
          renderButton();
        }
      }, 100);
      return () => clearInterval(checkReady);
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      // Wait a bit for the library to initialize
      const checkReady = setInterval(() => {
        if (window.google?.accounts?.id) {
          clearInterval(checkReady);
          renderButton();
        }
      }, 100);
    };
    document.head.appendChild(script);

    return () => {};
  }, [renderButton]);

  return (
    <div style={{ width: "100%" }}>
      <div ref={buttonRef} style={{ width: "100%", minHeight: "44px" }} />
      {!ready && (
        <div
          style={{
            width: "100%", fontWeight: 500, fontSize: "14px",
            backgroundColor: "transparent", color: theme.faint,
            padding: "12px 24px", borderRadius: "8px",
            border: `1px solid ${theme.border}`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Loading Google...
        </div>
      )}
    </div>
  );
}
