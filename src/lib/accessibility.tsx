import React from "react";
import { clsx, type ClassValue } from "clsx";
import { cn } from "@/lib/utils";

/**
 * Screen reader only utility class
 * Hides content visually but keeps it accessible to screen readers
 */
export const srOnly = cn(
  "absolute w-px h-px p-0 -m-px overflow-hidden",
  "whitespace-nowrap border-0",
  "clip-path-[inset(50%)]",
  "[&_::-webkit-scrollbar]:hidden"
);

/**
 * Generates a unique ID for accessibility attributes
 */
export function generateAriaId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Creates aria-label for icon-only buttons
 */
export function createIconButtonLabel(action: string, target?: string): string {
  return target ? `${action} ${target}` : action;
}

/**
 * ARIA live region utilities
 */
export const liveRegionRoles = {
  polite: "status",
  assertive: "alert",
} as const;

export type LiveRegionRole = keyof typeof liveRegionRoles;

/**
 * Props for live region components
 */
export interface LiveRegionProps {
  role?: "status" | "alert";
  ariaLive?: "polite" | "assertive" | "off";
  ariaAtomic?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * Live region component for dynamic content announcements
 */
export function LiveRegion({
  role = "status",
  ariaLive = "polite",
  ariaAtomic = true,
  className,
  children,
}: LiveRegionProps) {
  return (
    <div
      role={role}
      aria-live={ariaLive}
      aria-atomic={ariaAtomic}
      className={srOnly}
    >
      {children}
    </div>
  );
}

/**
 * Keyboard interaction utilities
 */
export const keyboardKeys = {
  ENTER: "Enter",
  SPACE: " ",
  ESCAPE: "Escape",
  TAB: "Tab",
  ARROW_UP: "ArrowUp",
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  HOME: "Home",
  END: "End",
} as const;

/**
 * Check if key is an activation key (Enter or Space)
 */
export function isActivationKey(key: string): boolean {
  return key === keyboardKeys.ENTER || key === keyboardKeys.SPACE;
}

/**
 * Check if key is an arrow key
 */
export function isArrowKey(key: string): boolean {
  return [
    keyboardKeys.ARROW_UP,
    keyboardKeys.ARROW_DOWN,
    keyboardKeys.ARROW_LEFT,
    keyboardKeys.ARROW_RIGHT,
  ].includes(key as any);
}

/**
 * Check if key is an escape key
 */
export function isEscapeKey(key: string): boolean {
  return key === keyboardKeys.ESCAPE;
}

/**
 * Focus management utilities
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== keyboardKeys.TAB) return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  element.addEventListener("keydown", handleTabKey);

  // Return cleanup function
  return () => {
    element.removeEventListener("keydown", handleTabKey);
  };
}

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: "polite" | "assertive" = "polite"): void {
  const announcement = document.createElement("div");
  announcement.setAttribute("role", priority === "assertive" ? "alert" : "status");
  announcement.setAttribute("aria-live", priority);
  announcement.setAttribute("aria-atomic", "true");
  announcement.className = srOnly;
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}
