"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export default function VisitorTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);

  useEffect(() => {
    // Avoid double tracking in the same component render cycle
    if (lastTrackedPath.current === pathname) return;

    const trackVisit = async () => {
      try {
        const now = Date.now();
        const dedupeKey = `tracked_paths_${pathname}`;
        const lastTrackedTime = localStorage.getItem(dedupeKey);

        // Deduplicate: If tracked in the last 24 hours (86400000 ms), skip API hit
        // This ensures "1 IP = 1 Visitor" per day per path, as requested by the user.
        if (lastTrackedTime && now - parseInt(lastTrackedTime) < 86400000) {
          console.log(`[VisitorTracker] Skipping duplicate hit for ${pathname}`);
          return;
        }

        // Generate or get session ID
        let sessionId = localStorage.getItem("visitor_session_id");
        if (!sessionId) {
          sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
          localStorage.setItem("visitor_session_id", sessionId);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/visitors/track`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer || "direct",
            session_id: sessionId,
          }),
        });

        if (response.ok) {
          lastTrackedPath.current = pathname;
          // Store tracking time for this path to prevent re-tracking on refresh/return today
          localStorage.setItem(dedupeKey, now.toString());
        }
      } catch (error) {
        console.error("Failed to track visitor:", error);
      }
    };

    // Delay post to allow other page elements to load first
    const timer = setTimeout(trackVisit, 1500);

    return () => clearTimeout(timer);
  }, [pathname]);

  return null;
}
