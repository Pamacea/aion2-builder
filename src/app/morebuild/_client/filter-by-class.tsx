"use client";

import { Button } from "@/components/ui/button";
import { classColors } from "@/lib/class";
import { FilterByClassProps } from "@/types/schema";

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
    <div className="flex flex-wrap items-end gap-1.5 sm:gap-2 w-full sm:w-auto">
      <span className="text-xs sm:text-sm font-bold uppercase text-foreground/70 whitespace-nowrap">FILTER BY CLASS</span>
      <Button
        onClick={() => onClassChange(null)}
        className={`text-xs bg-background/60 border-y-2 border-foreground/50 text-center font-bold uppercase px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-background/80 hover:text-foreground ${
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
            className={`text-xs ${colors.bg} ${colors.text} border-y-2 ${colors.border} text-center font-bold uppercase px-2 sm:px-3 py-1.5 sm:py-2 ${colors.hoverBg} ${colors.hoverText} transition-colors ${
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

