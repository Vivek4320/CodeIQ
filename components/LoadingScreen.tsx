'use client';

import { useState, useEffect } from 'react';
import { useTheme } from './landing/ThemeContext';

const PARTICLE_COUNT = 12;
const MATRIX_CHARS = 'CodeIQ{}[]|+-*&^%$#@!0123456789';
const MATRIX_COLUMNS = 20;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
    opacity: Math.random() * 0.3 + 0.1,
  }));
}

function generateMatrixColumns() {
  return Array.from({ length: MATRIX_COLUMNS }, (_, i) => ({
    id: i,
    x: (i / MATRIX_COLUMNS) * 100,
    speed: Math.random() * 3 + 4,
    delay: Math.random() * 5,
    chars: Array.from({ length: 10 }, () =>
      MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    ),
    opacity: Math.random() * 0.25 + 0.05,
  }));
}

export default function LoadingScreen() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([]);
  const [matrixCols, setMatrixCols] = useState<ReturnType<typeof generateMatrixColumns>>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    setParticles(generateParticles());
    setMatrixCols(generateMatrixColumns());
  }, []);

  // Progress reaches 100% in ~650ms, total loader = ~1.2s
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev > 70 ? 9 : prev > 40 ? 6 : 3;
        return Math.min(prev + increment, 100);
      });
    }, 30);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 300);
    return () => clearInterval(interval);
  }, []);

  // Faster fade-out — 150ms delay + 400ms fade
  useEffect(() => {
    if (progress < 100) return;
    const timer = setTimeout(() => setOpacity(0), 150);
    const remove = setTimeout(() => setVisible(false), 500);
    return () => {
      clearTimeout(timer);
      clearTimeout(remove);
    };
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.bg,
        opacity,
        transition: 'opacity 0.4s ease',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Matrix rain — lighter on mobile */}
      {!isMobile && (
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
          {matrixCols.map((col) => (
            <div
              key={col.id}
              style={{
                position: 'absolute',
                left: `${col.x}%`,
                top: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                opacity: col.opacity,
                animation: `matrixFall ${col.speed}s linear ${col.delay}s infinite`,
                transform: 'translateY(-100%)',
              }}
            >
              {col.chars.map((ch, ci) => (
                <span
                  key={ci}
                  className="font-mono"
                  style={{
                    fontSize: '12px',
                    color: theme.accent,
                    lineHeight: '16px',
                    textShadow: `0 0 6px ${theme.accent}60`,
                    opacity: ci === 0 ? 1 : 1 - ci * 0.08,
                  }}
                >
                  {ch}
                </span>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 50% 50%, ${theme.accent}08 0%, transparent 60%)`,
        }}
      />

      {/* Grid pattern — lighter on mobile */}
      {!isMobile && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            opacity: 0.1,
          }}
        />
      )}

      {/* Floating particles — fewer on mobile */}
      {particles.slice(0, isMobile ? 6 : 12).map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            backgroundColor: theme.accent,
            opacity: p.opacity,
            boxShadow: `0 0 ${p.size * 3}px ${theme.accent}60`,
            animation: `particleFloat ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
          }}
        />
      ))}

      {/* Logo + text */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: isMobile ? '24px' : '32px' }}>
        {/* Animated logo mark */}
        <div style={{ position: 'relative' }}>
          <svg
            width={isMobile ? 60 : 80}
            height={isMobile ? 60 : 80}
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ animation: 'logoFloat 3s ease-in-out infinite' }}
          >
            <rect
              x="20" y="2" width="24" height="24" rx="4"
              transform="rotate(45 20 2)"
              fill={theme.accent} opacity="0.12"
              style={{ animation: 'logoPulse 2s ease-in-out infinite' }}
            />
            <path
              d="M16 12L10 20L16 28"
              stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="22" strokeDashoffset="22"
              style={{ animation: 'drawIn 0.6s ease forwards 0.2s' }}
            />
            <path
              d="M24 12L30 20L24 28"
              stroke={theme.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="22" strokeDashoffset="22"
              style={{ animation: 'drawIn 0.6s ease forwards 0.4s' }}
            />
            <path
              d="M22 11L18 29"
              stroke={theme.accent} strokeWidth="2" strokeLinecap="round" opacity="0.5"
              strokeDasharray="19" strokeDashoffset="19"
              style={{ animation: 'drawIn 0.5s ease forwards 0.6s' }}
            />
          </svg>

          {/* Orbiting dot */}
          {!isMobile && (
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              width: '90px', height: '90px', marginTop: '-45px', marginLeft: '-45px',
              animation: 'orbit 2.5s linear infinite',
            }}>
              <div style={{
                width: '5px', height: '5px', borderRadius: '50%',
                backgroundColor: theme.accent, opacity: 0.7,
                boxShadow: `0 0 8px ${theme.accent}80`,
              }} />
            </div>
          )}
        </div>

        {/* Brand name */}
        <div style={{ textAlign: 'center' }}>
          <h1
            className="font-display"
            style={{
              fontSize: isMobile ? '32px' : '42px',
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              color: theme.text,
              margin: 0,
              animation: 'fadeInUp 0.5s ease forwards 0.3s',
              opacity: 0,
            }}
          >
            Code<span style={{ color: theme.accent }}>IQ</span>
          </h1>
          <p
            className="font-mono"
            style={{
              fontSize: '12px',
              color: theme.faint,
              margin: '6px 0 0',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              animation: 'fadeInUp 0.5s ease forwards 0.5s',
              opacity: 0,
            }}
          >
            Code Smarter. Run Faster.
          </p>
        </div>

        {/* Progress bar */}
        <div style={{
          width: isMobile ? '160px' : '200px',
          animation: 'fadeInUp 0.5s ease forwards 0.6s',
          opacity: 0,
        }}>
          <div style={{
            width: '100%', height: '2px', borderRadius: '2px',
            backgroundColor: theme.border, overflow: 'hidden',
          }}>
            <div style={{
              width: `${progress}%`, height: '100%',
              backgroundColor: theme.accent, borderRadius: '2px',
              transition: 'width 0.08s linear',
              boxShadow: `0 0 10px ${theme.accent}40`,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
            <span className="font-mono" style={{ fontSize: '11px', color: theme.faint }}>
              Loading{'.'.repeat(dotCount)}
            </span>
            <span className="font-mono" style={{ fontSize: '11px', color: theme.accent }}>
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawIn { to { stroke-dashoffset: 0; } }
        @keyframes logoFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes logoPulse { 0%, 100% { opacity: 0.12; } 50% { opacity: 0.2; } }
        @keyframes orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes particleFloat { 0% { transform: translateY(0) translateX(0); } 100% { transform: translateY(-30px) translateX(15px); } }
        @keyframes matrixFall { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
      `}</style>
    </div>
  );
}
