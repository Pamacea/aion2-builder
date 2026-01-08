import { cn } from "@/lib/utils";
import Image from "next/image";

interface BuildCardSkeletonProps {
  className?: string;
  count?: number;
}

export const BuildCardSkeleton = ({ className, count = 1 }: BuildCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-muted rounded-lg",
            "w-full h-48 sm:h-56",
            className
          )}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

interface BuildGridSkeletonProps {
  className?: string;
  count?: number;
}

export const BuildGridSkeleton = ({ className, count = 8 }: BuildGridSkeletonProps) => {
  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-muted rounded-lg h-48 sm:h-56"
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

interface ClassCardSkeletonProps {
  className?: string;
}

export const ClassCardSkeleton = ({ className }: ClassCardSkeletonProps) => {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted rounded-lg",
        "w-full h-64 sm:h-72",
        className
      )}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center justify-center h-full gap-4">
        {/* Class Icon Placeholder */}
        <div className="animate-pulse bg-muted/50 rounded-full w-24 h-24" />

        {/* Class Name Placeholder */}
        <div className="animate-pulse bg-muted/50 h-6 w-32 rounded" />

        {/* Build Count Placeholder */}
        <div className="animate-pulse bg-muted/50 h-4 w-24 rounded" />
      </div>
    </div>
  );
};
