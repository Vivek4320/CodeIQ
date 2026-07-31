"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import FeedbackModal from "@/components/FeedbackModal";

export default function FeedbackTrigger() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const prev = prevPath.current;
    prevPath.current = pathname;

    // Only trigger when leaving /editor to another page
    if (prev?.startsWith("/editor") && !pathname.startsWith("/editor")) {
      // Check if user already gave feedback today (avoid spam)
      const lastFeedback = localStorage.getItem("codeiq_feedback_date");
      const today = new Date().toDateString();
      if (lastFeedback === today) return;

      // Small delay so transition feels natural
      const timer = setTimeout(() => setShowFeedback(true), 800);
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const handleClose = () => {
    setShowFeedback(false);
    localStorage.setItem("codeiq_feedback_date", new Date().toDateString());
  };

  return <FeedbackModal isOpen={showFeedback} onClose={handleClose} />;
}
