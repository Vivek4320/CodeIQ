"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;

      // Magnetic pull effect
      const magneticElements = document.querySelectorAll("[data-magnetic]");
      magneticElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = mouseX - centerX;
        const distY = mouseY - centerY;
        const dist = Math.sqrt(distX * distX + distY * distY);
        const maxDist = 120;
        if (dist < maxDist) {
          const strength = (1 - dist / maxDist) * 0.35;
          (el as HTMLElement).style.transform = `translate(${distX * strength}px, ${distY * strength}px)`;
        } else {
          (el as HTMLElement).style.transform = "";
        }
      });
    };

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(animateRing);
    };
    const raf = requestAnimationFrame(animateRing);

    // Click ripple effect
    const createRipple = (x: number, y: number) => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    };

    const onMouseDown = (e: MouseEvent) => {
      dot.classList.add("clicking");
      ring.classList.add("clicking");
      createRipple(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      dot.classList.remove("clicking");
      ring.classList.remove("clicking");
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, label, .cm-editor")) {
        dot.classList.add("hovering");
        ring.classList.add("hovering");
        if (target.closest("input, textarea, .cm-content")) {
          dot.classList.add("text-mode");
          ring.classList.add("text-mode");
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("a, button, [role='button'], input, textarea, select, label, .cm-editor")) {
        dot.classList.remove("hovering");
        ring.classList.remove("hovering");
        dot.classList.remove("text-mode");
        ring.classList.remove("text-mode");
      }
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      // Reset magnetic elements
      document.querySelectorAll("[data-magnetic]").forEach((el) => {
        (el as HTMLElement).style.transform = "";
      });
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="custom-cursor" />
      <div ref={ringRef} className="custom-cursor-ring" />
    </>
  );
}
