"use client";

import { useEffect, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import EditorPageContent from "@/components/editor/EditorPageContent";

function buildPreview(html: string, css: string) {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}</body></html>`;
}

export default function EditorPage() {
  const [isWeb, setIsWeb] = useState(false);
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const lastHtmlRef = useRef("");
  const lastCssRef = useRef("");

  useEffect(() => {
    const root = document.querySelector("#codeiq-editor-root");
    if (!root) return;

    const readEditors = () => {
      const editorElements = Array.from(root.querySelectorAll(".cm-editor")) as HTMLElement[];
      const views = editorElements
        .map((element) => EditorView.findFromDOM(element))
        .filter((view): view is EditorView => Boolean(view));

      if (views.length >= 2) {
        // Always read the complete CodeMirror document state.
        // Never read .cm-content text, because scrolling can change the
        // visible DOM without changing the actual editor document.
        const nextHtml = views[0].state.doc.toString();
        const nextCss = views[1].state.doc.toString();

        setIsWeb(true);

        // Only update React state when the source actually changed.
        // This makes the iframe refresh immediately after typing while
        // avoiding unnecessary renders during the polling interval.
        if (nextHtml !== lastHtmlRef.current) {
          lastHtmlRef.current = nextHtml;
          setHtml(nextHtml);
        }
        if (nextCss !== lastCssRef.current) {
          lastCssRef.current = nextCss;
          setCss(nextCss);
        }
      } else {
        setIsWeb(false);
      }
    };

    readEditors();

    // CodeMirror changes its document state without necessarily changing
    // the DOM tree, so MutationObserver alone cannot detect typing. Poll
    // the CodeMirror state at a short interval and update only on changes.
    const interval = window.setInterval(readEditors, 100);

    // Re-discover editors if CodeMirror mounts/recreates their DOM nodes.
    const observer = new MutationObserver(readEditors);
    observer.observe(root, { subtree: true, childList: true });

    return () => {
      window.clearInterval(interval);
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const originalOpen = window.open;
    window.open = ((url?: string | URL, ...args: any[]) => {
      if (typeof url === "string" && url.startsWith("/preview/")) {
        return null;
      }
      return originalOpen.call(window, url, ...args);
    }) as typeof window.open;

    return () => {
      window.open = originalOpen;
    };
  }, []);

  return (
    <div id="codeiq-editor-root" style={{ height: "100vh", position: "relative", overflow: "hidden" }}>
      <EditorPageContent />

      {isWeb && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            bottom: 0,
            width: "42%",
            zIndex: 20,
            background: "#fff",
            borderLeft: "1px solid #d1d5db",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div
            style={{
              height: 38,
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              padding: "0 12px",
              borderBottom: "1px solid #e5e7eb",
              fontFamily: "monospace",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: ".08em",
              color: "#6b7280",
            }}
          >
            LIVE PREVIEW
            <span style={{ marginLeft: 8, width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
          </div>
          <iframe
            title="CodeIQ Live Preview"
            srcDoc={buildPreview(html, css)}
            sandbox="allow-scripts"
            style={{ flex: 1, width: "100%", border: 0, background: "#fff" }}
          />
        </div>
      )}

      <style>{`
        @media (min-width: 769px) {
          #codeiq-editor-root > div:first-child {
            width: ${isWeb ? "58%" : "100%"} !important;
          }
        }

        @media (max-width: 768px) {
          #codeiq-editor-root > div:first-child {
            width: 100% !important;
          }
        }
      `}</style>
    </div>
  );
}
