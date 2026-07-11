"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, Check } from "lucide-react";

const BASE_CODE = `function checkPrime(n: number) {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {`;

const GHOST_SUGGESTION = `
    if (n % i === 0) return false;
  }
  return true;
}`;

export default function EditorMockup() {
  const [typedBase, setTypedBase] = useState("");
  const [showGhost, setShowGhost] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const indexRef = useRef(0);

  useEffect(() => {
    const timer = setInterval(() => {
      indexRef.current += 1;
      setTypedBase(BASE_CODE.slice(0, indexRef.current));
      if (indexRef.current >= BASE_CODE.length) {
        clearInterval(timer);
        setTimeout(() => setShowGhost(true), 400);
      }
    }, 18);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!showGhost) return;
    const t = setTimeout(() => setAccepted(true), 1400);
    return () => clearTimeout(t);
  }, [showGhost]);

  return (
    <div className="rounded-2xl border border-[#E3E6EC] bg-white shadow-[0_20px_60px_-15px_rgba(15,20,32,0.12)] overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#E3E6EC] bg-[#FAFBFC]">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#E3E6EC]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E3E6EC]" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#E3E6EC]" />
        </div>
        <span className="font-mono text-xs text-[#8A93A3]">prime.ts</span>
        <div className="w-14" />
      </div>
      <div className="p-6 font-mono text-[13px] leading-[1.7] min-h-[240px]">
        <pre className="whitespace-pre-wrap text-[#1B2436]">
          {typedBase}
          {showGhost && <span className="text-[#B3B9C4]">{GHOST_SUGGESTION}</span>}
          {!accepted && (
            <span className="inline-block w-[2px] h-[15px] bg-[#1B3A6B] align-middle ml-[1px] animate-pulse" />
          )}
        </pre>
        {showGhost && !accepted && (
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#8A93A3] font-body">
            <Sparkles size={13} className="text-[#E1A72E]" />
            <span>CodeIQ suggests a completion</span>
            <kbd className="ml-1 px-1.5 py-0.5 rounded border border-[#E3E6EC] bg-[#FAFBFC] text-[11px]">Tab</kbd>
            <span>to accept</span>
          </div>
        )}
        {accepted && (
          <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#0F9D6E] font-body">
            <Check size={13} />
            <span>Accepted — 6 lines completed in 1 suggestion</span>
          </div>
        )}
      </div>
    </div>
  );
}