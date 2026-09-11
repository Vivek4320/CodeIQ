"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

function buildPreviewHtml(html: string, css: string) {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 16px; }
  ${css}
</style>
</head>
<body>
${html}
</body>
</html>`;
}

function readOpenerEditors() {
  try {
    if (!window.opener || window.opener.closed) return null;

    const openerDocument = window.opener.document;
    const editors = Array.from(openerDocument.querySelectorAll(".cm-editor .cm-content"));

    if (editors.length >= 2) {
      return {
        html: (editors[0] as HTMLElement).innerText || "",
        css: (editors[1] as HTMLElement).innerText || "",
      };
    }

    if (editors.length === 1) {
      const editor = editors[0] as HTMLElement;
      const text = editor.innerText || "";
      const pageText = openerDocument.body?.innerText || "";

      if (/STYLE\.CSS/i.test(pageText) && !/INDEX\.HTML/i.test(pageText)) {
        return { html: "", css: text };
      }

      return { html: text, css: "" };
    }
  } catch {
    // The preview can still work from the persisted snapshot when opener access
    // is unavailable or the editor has been closed.
  }

  return null;
}

export default function PreviewPage() {
  const params = useParams();
  const previewId = params.id as string;
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const lastLiveCodeRef = useRef("");

  useEffect(() => {
    if (!previewId) return;

    fetch(`/api/preview?id=${previewId}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (data.format === "codeiq-web") {
          setHtml(data.html?.code || "");
          setCss(data.css?.code || "");
        } else if (data.html_code !== undefined) {
          setHtml(data.html_code || "");
          setCss(data.css_code || "");
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [previewId]);

  // When opened from the CodeIQ editor, keep this preview synchronized with
  // the editor without requiring another Preview/Run click. The editor uses
  // CodeMirror, so its current HTML/CSS is available in the same-origin opener.
  useEffect(() => {
    if (!previewId) return;

    const syncFromEditor = () => {
      const liveCode = readOpenerEditors();
      if (!liveCode) return;

      const signature = `${liveCode.html}\u0000${liveCode.css}`;
      if (signature === lastLiveCodeRef.current) return;
      lastLiveCodeRef.current = signature;

      setHtml(liveCode.html);
      setCss(liveCode.css);
      setError(false);
      setLoading(false);
    };

    syncFromEditor();
    const intervalId = window.setInterval(syncFromEditor, 250);

    return () => window.clearInterval(intervalId);
  }, [previewId]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui", color: "#94a3b8" }}>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", fontFamily: "system-ui", color: "#94a3b8" }}>
        Preview not found
      </div>
    );
  }

  const fullHtml = buildPreviewHtml(html, css);

  return (
    <iframe
      key={fullHtml}
      srcDoc={fullHtml}
      style={{ width: "100vw", height: "100vh", border: "none" }}
      title="Preview"
    />
  );
}
