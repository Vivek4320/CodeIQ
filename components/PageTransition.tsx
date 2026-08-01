"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [displayChildren, setDisplayChildren] = useState(children);
  const [transitionStage, setTransitionStage] = useState<"enter" | "idle" | "exit">("idle");
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathname !== prevPathname.current) {
      setTransitionStage("exit");

      const exitTimer = setTimeout(() => {
        setDisplayChildren(children);
        prevPathname.current = pathname;
        setTransitionStage("enter");

        const enterTimer = setTimeout(() => {
          setTransitionStage("idle");
        }, 400);

        return () => clearTimeout(enterTimer);
      }, 250);

      return () => clearTimeout(exitTimer);
    } else {
      setDisplayChildren(children);
    }
  }, [pathname, children]);

  // KEY FIX: No transform when idle ��� otherwise position:fixed breaks
  const style: React.CSSProperties =
    transitionStage === "idle"
      ? { opacity: 1 }
      : {
          opacity: transitionStage === "exit" ? 0 : 1,
          transform: transitionStage === "exit" ? "translateY(8px)" : "translateY(0)",
          transition: "opacity 0.25s ease, transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        };

  return (
    <div style={style}>
      {displayChildren}
    </div>
  );
}
