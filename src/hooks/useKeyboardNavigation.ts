"use client";

import { useEffect, useRef } from "react";
import { isActivationKey, isArrowKey, isEscapeKey } from "@/lib/accessibility";

interface KeyboardNavigationOptions {
  onSelect?: () => void;
  onCancel?: () => void;
  onNavigate?: (direction: "up" | "down" | "left" | "right") => void;
  isEnabled?: boolean;
}

interface UseKeyboardNavigationReturn {
  keyboardProps: {
    tabIndex: number;
    role: string;
    onKeyDown: (e: React.KeyboardEvent) => void;
  };
}

/**
 * Hook for comprehensive keyboard navigation
 *
 * Provides keyboard navigation for interactive elements with:
 * - Enter/Space for activation
 * - Escape for cancellation
 * - Arrow keys for navigation
 * - Tab order management
 *
 * @example
 * ```tsx
 * const { keyboardProps } = useKeyboardNavigation({
 *   onSelect: () => console.log('Selected'),
 *   onCancel: () => console.log('Cancelled'),
 *   onNavigate: (dir) => console.log('Navigated', dir),
 * });
 *
 * return <div {...keyboardProps}>Interactive Element</div>
 * ```
 */
export const useKeyboardNavigation = ({
  onSelect,
  onCancel,
  onNavigate,
  isEnabled = true,
}: KeyboardNavigationOptions = {}): UseKeyboardNavigationReturn => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEnabled || !ref.current) return;

    const element = ref.current;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isEnabled) return;

      // Handle activation
      if (isActivationKey(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        onSelect?.();
        return;
      }

      // Handle cancellation
      if (isEscapeKey(e.key)) {
        e.preventDefault();
        e.stopPropagation();
        onCancel?.();
        return;
      }

      // Handle navigation
      if (isArrowKey(e.key)) {
        e.preventDefault();
        e.stopPropagation();

        const directionMap = {
          ArrowUp: "up",
          ArrowDown: "down",
          ArrowLeft: "left",
          ArrowRight: "right",
        } as const;

        onNavigate?.(directionMap[e.key as keyof typeof directionMap]);
        return;
      }
    };

    element.addEventListener("keydown", handleKeyDown);

    return () => {
      element.removeEventListener("keydown", handleKeyDown);
    };
  }, [isEnabled, onSelect, onCancel, onNavigate]);

  const keyboardProps = {
    tabIndex: isEnabled ? 0 : -1,
    role: "button",
    onKeyDown: (e: React.KeyboardEvent) => {
      // React handles synthetic events, but we also have native listeners
      // This ensures both work correctly
      if (isActivationKey(e.key)) {
        e.preventDefault();
        onSelect?.();
      } else if (isEscapeKey(e.key)) {
        e.preventDefault();
        onCancel?.();
      } else if (isArrowKey(e.key)) {
        e.preventDefault();

        const directionMap = {
          ArrowUp: "up" as const,
          ArrowDown: "down" as const,
          ArrowLeft: "left" as const,
          ArrowRight: "right" as const,
        };

        onNavigate?.(directionMap[e.key as keyof typeof directionMap]);
      }
    },
  };

  return { keyboardProps };
};

/**
 * Hook for managing focus trap in modals and dialogs
 *
 * @example
 * ```tsx
 * const modalRef = useFocusTrap(isOpen);
 *
 * return <dialog ref={modalRef}>Modal Content</dialog>
 * ```
 */
export const useFocusTrap = (isActive: boolean) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;

    // Find all focusable elements
    const focusableElements = element.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    // Focus first element on mount
    firstElement?.focus();

    element.addEventListener("keydown", handleTabKey);

    return () => {
      element.removeEventListener("keydown", handleTabKey);
    };
  }, [isActive]);

  return ref;
};

/**
 * Hook for managing arrow key navigation in lists/grids
 *
 * @example
 * ```tsx
 * const { getItemProps } = useArrowKeyNavigation({
 *   itemCount: items.length,
 *   onSelect: (index) => console.log('Selected', items[index]),
 * });
 *
 * return items.map((item, index) => (
 *   <div key={index} {...getItemProps(index)}>{item}</div>
 * ));
 * ```
 */
export const useArrowKeyNavigation = (options: {
  itemCount: number;
  onSelect?: (index: number) => void;
  orientation?: "horizontal" | "vertical" | "both";
  loop?: boolean;
}) => {
  const { itemCount, onSelect, orientation = "both", loop = true } = options;
  const [selectedIndex, setSelectedIndex] = React.useState(-1);

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent) => {
    let newIndex = index;

    switch (e.key) {
      case "ArrowDown":
        if (orientation === "vertical" || orientation === "both") {
          e.preventDefault();
          newIndex = index + 1;
          if (loop && newIndex >= itemCount) {
            newIndex = 0;
          } else if (newIndex >= itemCount) {
            newIndex = itemCount - 1;
          }
        }
        break;

      case "ArrowUp":
        if (orientation === "vertical" || orientation === "both") {
          e.preventDefault();
          newIndex = index - 1;
          if (loop && newIndex < 0) {
            newIndex = itemCount - 1;
          } else if (newIndex < 0) {
            newIndex = 0;
          }
        }
        break;

      case "ArrowRight":
        if (orientation === "horizontal" || orientation === "both") {
          e.preventDefault();
          newIndex = index + 1;
          if (loop && newIndex >= itemCount) {
            newIndex = 0;
          } else if (newIndex >= itemCount) {
            newIndex = itemCount - 1;
          }
        }
        break;

      case "ArrowLeft":
        if (orientation === "horizontal" || orientation === "both") {
          e.preventDefault();
          newIndex = index - 1;
          if (loop && newIndex < 0) {
            newIndex = itemCount - 1;
          } else if (newIndex < 0) {
            newIndex = 0;
          }
        }
        break;

      case "Enter":
      case " ":
        e.preventDefault();
        if (index >= 0 && index < itemCount) {
          onSelect?.(index);
        }
        return;

      default:
        return;
    }

    if (newIndex !== index) {
      setSelectedIndex(newIndex);
      // Focus the new element
      const elements = document.querySelectorAll('[data-arrow-nav-item]');
      (elements[newIndex] as HTMLElement)?.focus();
    }
  };

  const getItemProps = (index: number) => ({
    "data-arrow-nav-item": "true",
    tabIndex: selectedIndex === index ? 0 : -1,
    onKeyDown: handleKeyDown(index),
    onClick: () => onSelect?.(index),
  });

  return { getItemProps, selectedIndex, setSelectedIndex };
};

import React from "react";
