"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type AnimationType = "fadeUp" | "fadeIn" | "scaleUp" | "slideLeft" | "slideRight" | "blur";

interface AnimateInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  slideUp?: number;
  type?: AnimationType;
  className?: string;
  style?: React.CSSProperties;
}

const animationStyles: Record<AnimationType, { hidden: (slide: number) => string; visible: string }> = {
  fadeUp: {
    hidden: (s) => `translateY(${s}px)`,
    visible: "translateY(0)",
  },
  fadeIn: {
    hidden: () => "scale(0.98)",
    visible: "scale(1)",
  },
  scaleUp: {
    hidden: () => "scale(0.92)",
    visible: "scale(1)",
  },
  slideLeft: {
    hidden: (s) => `translateX(${s}px)`,
    visible: "translateX(0)",
  },
  slideRight: {
    hidden: (s) => `translateX(-${s}px)`,
    visible: "translateX(0)",
  },
  blur: {
    hidden: (s) => `translateY(${s * 0.5}px)`,
    visible: "translateY(0)",
  },
};

export default function AnimateIn({
  children,
  delay = 0,
  duration = 0.6,
  slideUp = 30,
  type = "fadeUp",
  className,
  style,
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const anim = animationStyles[type];

  return (
    <div
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: type === "blur" ? (isVisible ? 1 : 0) : (isVisible ? 1 : 0),
        filter: type === "blur" ? (isVisible ? "blur(0px)" : "blur(8px)") : undefined,
        transform: isVisible ? anim.visible : anim.hidden(slideUp),
        transition: `opacity ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s, transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s${type === "blur" ? `, filter ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` : ""}`,
      }}
    >
      {children}
    </div>
  );
}

// Stagger container — animates children one by one
interface StaggerProps {
  children: ReactNode;
  stagger?: number;
  type?: AnimationType;
  className?: string;
  style?: React.CSSProperties;
}

export function Stagger({ children, stagger = 0.08, type = "fadeUp", className, style }: StaggerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const anim = animationStyles[type];

  return (
    <div ref={ref} className={className} style={style}>
      {Array.isArray(children)
        ? children.map((child, i) => (
            <div
              key={i}
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? anim.visible : anim.hidden(25),
                transition: `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}s`,
              }}
            >
              {child}
            </div>
          ))
        : children}
    </div>
  );
}
