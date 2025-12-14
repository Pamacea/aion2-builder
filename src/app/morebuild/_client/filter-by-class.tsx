"use client";

import { Button } from "@/components/ui/button";
import { ClassType } from "@/types/schema";

type FilterByClassProps = {
  classes: ClassType[];
  selectedClassId: number | null;
  onClassChange: (classId: number | null) => void;
};

// Color mapping for each class
const classColors: Record<string, { bg: string; text: string; border: string; hoverBg: string; hoverText: string }> = {
  gladiator: {
    bg: "bg-red-600/30",
    text: "text-red-400",
    border: "border-red-500/50",
    hoverBg: "hover:bg-red-600/50",
    hoverText: "hover:text-red-300",
  },
  templar: {
    bg: "bg-blue-600/30",
    text: "text-blue-400",
    border: "border-blue-500/50",
    hoverBg: "hover:bg-blue-600/50",
    hoverText: "hover:text-blue-300",
  },
  assassin: {
    bg: "bg-purple-600/30",
    text: "text-purple-400",
    border: "border-purple-500/50",
    hoverBg: "hover:bg-purple-600/50",
    hoverText: "hover:text-purple-300",
  },
  ranger: {
    bg: "bg-green-600/30",
    text: "text-green-400",
    border: "border-green-500/50",
    hoverBg: "hover:bg-green-600/50",
    hoverText: "hover:text-green-300",
  },
  sorcerer: {
    bg: "bg-orange-600/30",
    text: "text-orange-400",
    border: "border-orange-500/50",
    hoverBg: "hover:bg-orange-600/50",
    hoverText: "hover:text-orange-300",
  },
  elementalist: {
    bg: "bg-cyan-600/30",
    text: "text-cyan-400",
    border: "border-cyan-500/50",
    hoverBg: "hover:bg-cyan-600/50",
    hoverText: "hover:text-cyan-300",
  },
  chanter: {
    bg: "bg-yellow-600/30",
    text: "text-yellow-400",
    border: "border-yellow-500/50",
    hoverBg: "hover:bg-yellow-600/50",
    hoverText: "hover:text-yellow-300",
  },
  cleric: {
    bg: "bg-teal-600/30",
    text: "text-teal-400",
    border: "border-teal-500/50",
    hoverBg: "hover:bg-teal-600/50",
    hoverText: "hover:text-teal-300",
  },
};

export const FilterByClass = ({
  classes,
  selectedClassId,
  onClassChange,
}: FilterByClassProps) => {
  const getClassColors = (className: string) => {
    return classColors[className.toLowerCase()] || {
      bg: "bg-background/60",
      text: "text-foreground",
      border: "border-foreground/50",
      hoverBg: "hover:bg-background/80",
      hoverText: "hover:text-foreground",
    };
  };

  return (
    <div className="flex flex-wrap items-end gap-2">
      <span className="text-sm font-bold uppercase text-foreground/70"> FILTER BY CLASS</span>
      <Button
        onClick={() => onClassChange(null)}
        className={`text-xs bg-background/60 border-y-2 border-foreground/50 text-center font-bold uppercase px-2 py-2 hover:bg-background/80 hover:text-foreground ${
          selectedClassId === null ? "border-y-2 border-foreground" : ""
        }`}
      >
        All
      </Button>
      {classes.map((cls) => {
        const colors = getClassColors(cls.name);
        const isSelected = selectedClassId === cls.id;
        return (
          <Button
            key={cls.id}
            onClick={() => onClassChange(cls.id)}
            className={`text-xs ${colors.bg} ${colors.text} border-y-2 ${colors.border} text-center font-bold uppercase px-2 py-2 ${colors.hoverBg} ${colors.hoverText} transition-colors ${
              isSelected ? "border-y-2 border-foreground" : ""
            }`}
          >
            {cls.name}
          </Button>
        );
      })}
    </div>
  );
};

