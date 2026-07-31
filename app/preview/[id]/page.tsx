"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function PreviewPage() {
  const params = useParams();
  const previewId = params.id as string;
  const [html, setHtml] = useState("");
  const [css, setCss] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!previewId) return;
    fetch(`/api/preview?id=${previewId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.format === "codeiq-web") {
          setHtml(data.html?.code || "");
          setCss(data.css?.code || "");
        } else if (data.html_code !== undefined) {
          setHtml(data.html_code);
          setCss(data.css_code);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
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

  const fullHtml = `<!DOCTYPE html>
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

  return (
    <iframe
      srcDoc={fullHtml}
      style={{ width: "100vw", height: "100vh", border: "none" }}
      title="Preview"
    />
  );
}
