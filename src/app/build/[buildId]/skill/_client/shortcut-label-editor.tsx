"use client";

import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";

type ShortcutLabelEditorProps = {
  label: string;
  onLabelChange: (newLabel: string) => void;
  disabled?: boolean;
  className?: string;
};

export const ShortcutLabelEditor = ({
  label,
  onLabelChange,
  disabled = false,
  className = "",
}: ShortcutLabelEditorProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleClick = () => {
    if (!disabled) {
      setIsEditing(true);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editValue !== label) {
      onLabelChange(editValue);
    } else {
      setEditValue(label);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    } else if (e.key === "Escape") {
      setEditValue(label);
      setIsEditing(false);
    }
  };

  if (isEditing && !disabled) {
    return (
      <Input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={`text-xs sm:text-sm font-semibold text-foreground/80 px-1 sm:px-2 h-auto py-0 border-foreground/50 bg-background/80 ${className}`}
        maxLength={10}
      />
    );
  }

  return (
    <div
      onClick={handleClick}
      className={`text-xs sm:text-sm font-semibold text-foreground/80 px-1 sm:px-2 cursor-pointer hover:text-foreground transition-colors ${
        disabled ? "cursor-default" : ""
      } ${className}`}
    >
      {label || " "}
    </div>
  );
};
