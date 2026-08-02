"use client";

import dynamic from "next/dynamic";

const LoadingScreen = dynamic(() => import("@/components/LoadingScreen"), { ssr: false });
const ConditionalCursor = dynamic(() => import("@/components/ConditionalCursor"), { ssr: false });

export function ClientLoader() {
  return <LoadingScreen />;
}

export function ClientCursor() {
  return <ConditionalCursor />;
}
