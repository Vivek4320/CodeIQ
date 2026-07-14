"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  loginWithGoogle: (credential: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  login: async () => false,
  signup: async () => false,
  loginWithGoogle: async () => false,
  logout: () => {},
});

const PUBLIC_PAGES = ["/", "/login", "/signup"];
const PROTECTED_PAGES = ["/features", "/docs", "/dashboard", "/editor"];

// Decode Google JWT token (no verification for demo — in production use a library)
function decodeGoogleJWT(token: string) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name || "",
      email: payload.email || "",
      image: payload.picture || "",
    };
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if user is logged in on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("codeiq_email");
    if (storedEmail) {
      fetch("/api/auth/me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: storedEmail }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) setUser(data.user);
          else localStorage.removeItem("codeiq_email");
        })
        .catch(() => localStorage.removeItem("codeiq_email"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Redirect if accessing protected page without auth
  useEffect(() => {
    if (loading) return;
    if (!user && PROTECTED_PAGES.includes(pathname)) {
      router.push("/signup");
    }
  }, [user, loading, pathname, router]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Signup failed"); return false; }
    localStorage.setItem("codeiq_email", email);
    setUser(data.user);
    router.push("/");
    return true;
  }, [router]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) { alert(data.error || "Login failed"); return false; }
    localStorage.setItem("codeiq_email", email);
    setUser(data.user);
    router.push("/");
    return true;
  }, [router]);

  // Google sign-in — receives JWT credential from Google
  const loginWithGoogle = useCallback(async (credential: string) => {
    const userData = decodeGoogleJWT(credential);
    if (!userData || !userData.email) {
      alert("Google sign-in failed. Please try again.");
      return false;
    }

    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Google sign-in failed");
        return false;
      }

      localStorage.setItem("codeiq_email", userData.email);
      setUser(data.user);
      router.push("/");
      return true;
    } catch {
      alert("Google sign-in failed. Please try again.");
      return false;
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem("codeiq_email");
    // Clear Google sign-in state
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    setUser(null);
    router.push("/");
  }, [router]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#000", color: "#fff" }}>
        <span className="font-mono" style={{ fontSize: "13px", opacity: 0.5 }}>Loading...</span>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
