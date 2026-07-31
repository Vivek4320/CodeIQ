'use client';

import { useState, useEffect, useRef } from 'react';
import { useTheme } from './landing/ThemeContext';

const PARTICLE_COUNT = 20;
const MATRIX_CHARS = 'CodeIQ{}[]|+-*&^%$#@!0123456789';
const MATRIX_COLUMNS = 30;

function generateParticles() {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 4 + 3,
    delay: Math.random() * 3,
    opacity: Math.random() * 0.4 + 0.1,
  }));
}

function generateMatrixColumns() {
  return Array.from({ length: MATRIX_COLUMNS }, (_, i) => ({
    id: i,
    x: (i / MATRIX_COLUMNS) * 100,
    speed: Math.random() * 3 + 4,
    delay: Math.random() * 5,
    chars: Array.from({ length: 15 }, () =>
      MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)]
    ),
    opacity: Math.random() * 0.3 + 0.1,
  }));
}

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioContext();
  }
  return sharedAudioCtx;
}

function playCompletionSound() {
  try {
    const audioCtx = getAudioContext();
    // Resume in case it was suspended (browser autoplay policy)
    const play = () => {
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain1.gain.setValueAtTime(0.15, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start(audioCtx.currentTime);
      osc1.stop(audioCtx.currentTime + 0.5);

      const osc2 = audioCtx.createOscillator();
      const gain2 = audioCtx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(1320, audioCtx.currentTime + 0.1);
      gain2.gain.setValueAtTime(0, audioCtx.currentTime);
      gain2.gain.setValueAtTime(0.1, audioCtx.currentTime + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      osc2.connect(gain2);
      gain2.connect(audioCtx.destination);
      osc2.start(audioCtx.currentTime + 0.1);
      osc2.stop(audioCtx.currentTime + 0.6);
    };

    if (audioCtx.state === 'running') {
      play();
    } else {
      audioCtx.resume().then(play);
    }
  } catch {
    // Audio not supported
  }
}

export default function LoadingScreen() {
  const { theme } = useTheme();
  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [progress, setProgress] = useState(0);
  const [dotCount, setDotCount] = useState(0);
  const [particles, setParticles] = useState<ReturnType<typeof generateParticles>>([]);
  const [matrixCols, setMatrixCols] = useState<ReturnType<typeof generateMatrixColumns>>([]);
  const soundPlayed = useRef(false);

  useEffect(() => {
    setParticles(generateParticles());
    setMatrixCols(generateMatrixColumns());

    // Unlock AudioContext on first user interaction (browser autoplay policy)
    const unlock = () => {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
    document.addEventListener('click', unlock);
    document.addEventListener('keydown', unlock);
    return () => {
      document.removeEventListener('click', unlock);
      document.removeEventListener('keydown', unlock);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const increment = prev > 80 ? 8 : prev > 50 ? 4 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev + 1) % 4);
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress < 100) return;
    if (!soundPlayed.current) {
      soundPlayed.current = true;
      playCompletionSound();
    }
    const timer = setTimeout(() => setOpacity(0), 300);
    const remove = setTimeout(() => setVisible(false), 900);
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
        transition: 'opacity 0.6s ease',
        pointerEvents: opacity === 0 ? 'none' : 'auto',
        overflow: 'hidden',
      }}
    >
      {/* Matrix rain background */}
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
                  opacity: ci === 0 ? 1 : 1 - ci * 0.06,
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Animated gradient background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(ellipse at 30% 20%, ${theme.accent}08 0%, transparent 50%),
                       radial-gradient(ellipse at 70% 80%, ${theme.accent}06 0%, transparent 50%),
                       radial-gradient(ellipse at 50% 50%, ${theme.accent}04 0%, transparent 60%)`,
          animation: 'gradientShift 6s ease-in-out infinite',
        }}
      />

      {/* Background grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(${theme.border} 1px, transparent 1px), linear-gradient(90deg, ${theme.border} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          opacity: 0.15,
        }}
      />

      {/* Floating particles */}
      {particles.map((p) => (
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

      {/* Radial glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.accent}0A 0%, transparent 70%)`,
          animation: 'glowPulse 3s ease-in-out infinite',
        }}
      />

      {/* Logo + text */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '32px' }}>
        {/* Animated logo mark */}
        <div style={{ position: 'relative' }}>
          <svg
            width="80"
            height="80"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              animation: 'logoFloat 3s ease-in-out infinite',
            }}
          >
            <rect
              x="20"
              y="2"
              width="24"
              height="24"
              rx="4"
              transform="rotate(45 20 2)"
              fill={theme.accent}
              opacity="0.12"
              style={{ animation: 'logoPulse 2s ease-in-out infinite' }}
            />
            <path
              d="M16 12L10 20L16 28"
              stroke={theme.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="30"
              strokeDashoffset="30"
              style={{ animation: 'drawIn 0.8s ease forwards 0.3s' }}
            />
            <path
              d="M24 12L30 20L24 28"
              stroke={theme.accent}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="30"
              strokeDashoffset="30"
              style={{ animation: 'drawIn 0.8s ease forwards 0.6s' }}
            />
            <path
              d="M22 11L18 29"
              stroke={theme.accent}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.5"
              strokeDasharray="20"
              strokeDashoffset="20"
              style={{ animation: 'drawIn 0.6s ease forwards 0.9s' }}
            />
          </svg>

          {/* Orbiting dot */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '90px',
              height: '90px',
              marginTop: '-45px',
              marginLeft: '-45px',
              animation: 'orbit 2.5s linear infinite',
            }}
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                backgroundColor: theme.accent,
                opacity: 0.7,
                boxShadow: `0 0 8px ${theme.accent}80`,
              }}
            />
          </div>
        </div>

        {/* Brand name with glitch effect */}
        <div style={{ textAlign: 'center' }}>
          <h1
            className="font-display glitch-text"
            data-text="CodeIQ"
            style={{
              fontSize: '42px',
              fontStyle: 'italic',
              letterSpacing: '-0.02em',
              color: theme.text,
              margin: 0,
              position: 'relative',
              animation: 'fadeInUp 0.6s ease forwards 0.4s',
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
              margin: '8px 0 0',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              animation: 'fadeInUp 0.6s ease forwards 0.6s',
              opacity: 0,
            }}
          >
            Code Smarter. Run Faster.
          </p>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '200px',
            animation: 'fadeInUp 0.6s ease forwards 0.8s',
            opacity: 0,
          }}
        >
          <div
            style={{
              width: '100%',
              height: '2px',
              borderRadius: '2px',
              backgroundColor: theme.border,
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: '100%',
                backgroundColor: theme.accent,
                borderRadius: '2px',
                transition: 'width 0.1s linear',
                boxShadow: `0 0 10px ${theme.accent}40`,
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '10px',
            }}
          >
            <span
              className="font-mono"
              style={{
                fontSize: '11px',
                color: theme.faint,
              }}
            >
              Loading{'.'.repeat(dotCount)}
            </span>
            <span
              className="font-mono"
              style={{
                fontSize: '11px',
                color: theme.accent,
              }}
            >
              {progress}%
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes drawIn {
          to { stroke-dashoffset: 0; }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.12; }
          50% { opacity: 0.2; }
        }
        @keyframes orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes particleFloat {
          0% { transform: translateY(0) translateX(0); }
          100% { transform: translateY(-30px) translateX(15px); }
        }
        @keyframes glowPulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.7; }
        }
        @keyframes gradientShift {
          0%, 100% { transform: scale(1) rotate(0deg); }
          33% { transform: scale(1.1) rotate(2deg); }
          66% { transform: scale(0.95) rotate(-2deg); }
        }
        @keyframes matrixFall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }

        /* Glitch text effect */
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-size: 42px;
          font-style: italic;
          letter-spacing: -0.02em;
        }
        .glitch-text::before {
          color: ${theme.accent};
          animation: glitch1 3s infinite linear alternate-reverse;
          clip-path: inset(0 0 65% 0);
          opacity: 0.8;
        }
        .glitch-text::after {
          color: ${theme.text};
          animation: glitch2 2.5s infinite linear alternate-reverse;
          clip-path: inset(60% 0 0 0);
          opacity: 0.6;
        }
        @keyframes glitch1 {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-2px, 1px); }
          94% { transform: translate(2px, -1px); }
          96% { transform: translate(-1px, 2px); }
          98% { transform: translate(1px, -2px); }
        }
        @keyframes glitch2 {
          0%, 88%, 100% { transform: translate(0); }
          90% { transform: translate(2px, -1px); }
          93% { transform: translate(-2px, 1px); }
          95% { transform: translate(1px, 2px); }
          97% { transform: translate(-1px, -2px); }
        }
      `}</style>
    </div>
  );
}
