"use client";

import { useState, useEffect, createContext, useContext, useCallback, type ReactNode } from "react";
import { Check, X, AlertCircle, Info } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <ToastContainer toasts={toasts} remove={remove} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  const { theme } = useTheme();

  const icons: Record<ToastType, ReactNode> = {
    success: <Check size={16} />,
    error: <AlertCircle size={16} />,
    info: <Info size={16} />,
  };

  const colors: Record<ToastType, { bg: string; border: string; text: string; icon: string }> = {
    success: { bg: "#065F46", border: "#10B981", text: "#D1FAE5", icon: "#34D399" },
    error: { bg: "#7F1D1D", border: "#EF4444", text: "#FEE2E2", icon: "#F87171" },
    info: { bg: "#1E3A5F", border: "#3B82F6", text: "#DBEAFE", icon: "#60A5FA" },
  };

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 1000, display: "flex", flexDirection: "column", gap: "8px" }}>
      {toasts.map((t) => {
        const c = colors[t.type];
        return (
          <div
            key={t.id}
            style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 16px", borderRadius: "10px",
              backgroundColor: c.bg, border: `1px solid ${c.border}`,
              color: c.text, fontSize: "13px", fontWeight: 500,
              boxShadow: `0 8px 30px -5px ${c.border}40`,
              animation: "slideIn 0.3s ease",
              minWidth: "250px",
            }}
          >
            <span style={{ color: c.icon, flexShrink: 0 }}>{icons[t.type]}</span>
            <span className="font-body" style={{ flex: 1 }}>{t.message}</span>
            <button
              onClick={() => remove(t.id)}
              style={{ background: "none", border: "none", cursor: "pointer", color: c.text, opacity: 0.6, padding: "2px", flexShrink: 0 }}
              onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; }}
              onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; }}
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}
