"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface LiveRegionProps {
  message?: string;
  role?: "status" | "alert";
  ariaLive?: "polite" | "assertive" | "off";
  className?: string;
}

/**
 * Live region component for announcing dynamic content changes to screen readers
 *
 * @example
 * ```tsx
 * <LiveRegion message="Build saved successfully" role="status" />
 * <LiveRegion message="Error loading build" role="alert" ariaLive="assertive" />
 * ```
 */
export const LiveRegion = ({
  message,
  role = "status",
  ariaLive = "polite",
  className,
}: LiveRegionProps) => {
  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic="true"
      className={cn("sr-only", className)}
    >
      {message}
    </div>
  );
};

/**
 * Hook to announce messages to screen readers
 *
 * @example
 * ```tsx
 * const announce = useLiveRegion();
 *
 * const handleSave = async () => {
 *   await saveBuild();
 *   announce("Build saved successfully", "status");
 * };
 * ```
 */
export const useLiveRegion = () => {
  const [messages, setMessages] = useState<
    Array<{ id: number; message: string; role: "status" | "alert" }>
  >([]);

  const announceRef = useRef(0);

  useEffect(() => {
    // Cleanup function to remove old messages
    const timer = setTimeout(() => {
      if (messages.length > 0) {
        setMessages((prev) => prev.slice(1));
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [messages]);

  const announce = (message: string, role: "status" | "alert" = "status") => {
    const id = announceRef.current++;
    setMessages((prev) => [...prev, { id, message, role }]);
  };

  const LiveRegionComponent = () => (
    <>
      {messages.map((msg) => (
        <LiveRegion key={msg.id} message={msg.message} role={msg.role} />
      ))}
    </>
  );

  return { announce, LiveRegionComponent };
};
