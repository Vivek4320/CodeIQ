"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@/components/landing/ThemeContext";
import { Star } from "lucide-react";

export default function FeedbackPage() {
  const { theme } = useTheme();
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/feedback").then(r => r.json()).then(d => { setFeedbacks(d.feedbacks || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ color: theme.faint }}>Loading feedback...</p>;

  return (
    <div>
      <h1 style={{ fontSize: "24px", fontWeight: 600, marginBottom: "24px" }}>Feedback ({feedbacks.length})</h1>
      <div style={{ display: "grid", gap: "12px" }}>
        {feedbacks.length === 0 && <p style={{ color: theme.faint }}>No feedback yet</p>}
        {feedbacks.map((f: any) => (
          <div key={f.id} style={{ padding: "16px", border: `1px solid ${theme.border}`, borderRadius: "12px", backgroundColor: theme.panel }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <div>
                <span style={{ fontWeight: 500, marginRight: "8px" }}>{f.name || "Anonymous"}</span>
                <span style={{ fontSize: "12px", color: theme.faint }}>{f.email}</span>
              </div>
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} fill={i <= f.rating ? "#FBBF24" : "none"} color={i <= f.rating ? "#FBBF24" : theme.faint} />
                ))}
              </div>
            </div>
            <p style={{ fontSize: "13px", color: theme.muted, lineHeight: 1.6 }}>{f.comment}</p>
            <div style={{ fontSize: "11px", color: theme.faint, marginTop: "8px" }}>{new Date(f.created_at).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
