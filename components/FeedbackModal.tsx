"use client";

import { useState } from "react";
import { Star, X, Loader2, Check } from "lucide-react";
import { useTheme } from "@/components/landing/ThemeContext";
import { useAuth } from "@/components/AuthContext";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user?.name || "",
          email: user?.email || "",
          rating,
          comment: comment.trim(),
        }),
      });
      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => { onClose(); setIsSubmitted(false); setRating(0); setComment(""); }, 2000);
      }
    } catch {}
    setIsLoading(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(() => { setIsSubmitted(false); setRating(0); setComment(""); }, 300);
  };

  const ratingLabels = ["", "Poor", "Okay", "Good", "Great", "Excellent"];

  return (
    <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}
      onClick={handleClose}>
      <div style={{ backgroundColor: theme.panel, border: `1px solid ${theme.border}`, borderRadius: "12px", padding: "28px", width: "100%", maxWidth: "420px", margin: "16px" }}
        onClick={(e) => e.stopPropagation()}>
        {isSubmitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#34D39920", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Check size={24} style={{ color: "#34D399" }} />
            </div>
            <h3 className="font-display" style={{ fontSize: "18px", marginBottom: "4px" }}>Thank you!</h3>
            <p className="font-body" style={{ fontSize: "13px", color: theme.muted }}>Your feedback helps us improve CodeIQ.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h3 className="font-display" style={{ fontSize: "18px", fontWeight: 400 }}>Give Feedback</h3>
              <button onClick={handleClose} style={{ background: "none", border: "none", cursor: "pointer", color: theme.faint, padding: "2px" }}>
                <X size={16} />
              </button>
            </div>

            {/* Star Rating */}
            <div style={{ marginBottom: "20px" }}>
              <label className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, display: "block", marginBottom: "10px" }}>
                How was your experience?
              </label>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", transition: "transform 0.1s ease" }}
                    onMouseDown={(e) => { e.currentTarget.style.transform = "scale(1.2)"; }}
                    onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                    <Star size={24} fill={(hoverRating || rating) >= star ? "#FBBF24" : "none"} stroke={(hoverRating || rating) >= star ? "#FBBF24" : theme.faint} style={{ transition: "all 0.1s ease" }} />
                  </button>
                ))}
                {(hoverRating || rating) > 0 && (
                  <span className="font-mono" style={{ fontSize: "12px", color: theme.accent, marginLeft: "8px" }}>
                    {ratingLabels[hoverRating || rating]}
                  </span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div style={{ marginBottom: "20px" }}>
              <label className="font-mono" style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: theme.faint, display: "block", marginBottom: "6px" }}>
                Your feedback
              </label>
              <textarea value={comment} onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what you think, suggest features, or report issues..."
                rows={4} className="font-body"
                style={{ width: "100%", padding: "10px 12px", fontSize: "13px", lineHeight: 1.5, backgroundColor: theme.bg, color: theme.text, border: `1px solid ${theme.border}`, borderRadius: "8px", outline: "none", resize: "vertical", boxSizing: "border-box", transition: "border-color 0.2s ease" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = theme.accent; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = theme.border; }} />
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={rating === 0 || !comment.trim() || isLoading}
              style={{ width: "100%", padding: "10px", fontSize: "13px", fontWeight: 500, backgroundColor: rating > 0 && comment.trim() ? theme.accent : theme.faint, color: theme.bg, border: "none", borderRadius: "8px", cursor: rating > 0 && comment.trim() ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", transition: "opacity 0.2s ease" }}>
              {isLoading ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Submitting...</> : "Submit Feedback"}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
