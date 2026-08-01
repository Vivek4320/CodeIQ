"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let mouseX = 0, mouseY = 0;
    let ringX = 0, ringY = 0;
    let currentMode = ""; // "", "hovering", "editor-mode", "text-mode"
    const trailDots: HTMLDivElement[] = [];
    const trailPos: { x: number; y: number }[] = [];
    const TRAIL_COUNT = 6;

    // Create trailing data particles
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const dot = document.createElement("div");
      dot.className = "cursor-particle";
      document.body.appendChild(dot);
      trailDots.push(dot);
      trailPos.push({ x: 0, y: 0 });
    }

    const setMode = (mode: string) => {
      if (mode === currentMode) return;
      // Remove old mode
      if (currentMode) cursor.classList.remove(currentMode);
      if (currentMode) ring.classList.remove(currentMode);
      // Set new mode
      currentMode = mode;
      if (mode) cursor.classList.add(mode);
      if (mode) ring.classList.add(mode);
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;

      // Determine cursor mode based on what's under the mouse
      const target = document.elementFromPoint(mouseX, mouseY) as HTMLElement | null;
      if (!target) return;

      if (target.closest(".cm-editor")) {
        // Inside code editor — check if over text or gutter
        if (target.closest(".cm-content")) {
          setMode("text-mode");
        } else if (target.closest(".cm-gutters")) {
          setMode("editor-mode");
        } else {
          setMode("editor-mode");
        }
      } else if (target.closest("a, button, [role='button'], input, textarea, select, label")) {
        setMode("hovering");
      } else {
        setMode("");
      }
    };

    const animate = () => {
      // Ring follows with smooth lag
      ringX += (mouseX - ringX) * 0.1;
      ringY += (mouseY - ringY) * 0.1;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;

      // Trail particles with increasing delay
      for (let i = 0; i < TRAIL_COUNT; i++) {
        const target = i === 0 ? { x: ringX, y: ringY } : trailPos[i - 1];
        trailPos[i].x += (target.x - trailPos[i].x) * (0.13 - i * 0.015);
        trailPos[i].y += (target.y - trailPos[i].y) * (0.13 - i * 0.015);
        trailDots[i].style.left = `${trailPos[i].x}px`;
        trailDots[i].style.top = `${trailPos[i].y}px`;
      }

      requestAnimationFrame(animate);
    };
    const raf = requestAnimationFrame(animate);

    // Click burst — code particles scatter outward
    const createBurst = (x: number, y: number) => {
      const chars = ["{", "}", "<", ">", "/", ";", "=", "0", "1"];
      for (let i = 0; i < 8; i++) {
        const p = document.createElement("div");
        p.className = "cursor-code-particle";
        p.textContent = chars[i % chars.length];
        p.style.left = `${x}px`;
        p.style.top = `${y}px`;
        const angle = (i / 8) * Math.PI * 2;
        const dist = 30 + Math.random() * 30;
        p.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
        p.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
        p.style.setProperty("--rot", `${Math.random() * 360}deg`);
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 600);
      }
    };

    const onMouseDown = (e: MouseEvent) => {
      cursor.classList.add("clicking");
      ring.classList.add("clicking");
      const target = e.target as HTMLElement;
      if (!target.closest(".cm-editor")) {
        createBurst(e.clientX, e.clientY);
      }
    };
    const onMouseUp = () => {
      cursor.classList.remove("clicking");
      ring.classList.remove("clicking");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("mouseup", onMouseUp);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("mouseup", onMouseUp);
      trailDots.forEach((el) => el.remove());
    };
  }, []);

  return (
    <>
      {/* Main cursor — < > code brackets */}
      <div ref={cursorRef} className="custom-cursor">
        <span className="cursor-bracket cursor-bracket-left">&lt;</span>
        <span className="cursor-bracket cursor-bracket-right">&gt;</span>
        <span className="cursor-dot-center" />
      </div>
      {/* AI orbit ring with dots */}
      <div ref={ringRef} className="custom-cursor-ring">
        <span className="ring-dot ring-dot-1" />
        <span className="ring-dot ring-dot-2" />
        <span className="ring-dot ring-dot-3" />
      </div>
    </>
  );
}
