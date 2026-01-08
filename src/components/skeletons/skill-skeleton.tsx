import { cn } from "@/lib/utils";

interface SkillSkeletonProps {
  className?: string;
  count?: number;
}

export const SkillSkeleton = ({ className, count = 1 }: SkillSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-muted rounded-lg",
            "w-16 h-16 sm:w-20 sm:h-20",
            className
          )}
          aria-hidden="true"
        />
      ))}
    </>
  );
};

interface SkillDetailSkeletonProps {
  className?: string;
}

export const SkillDetailSkeleton = ({ className }: SkillDetailSkeletonProps) => {
  return (
    <div className={cn("flex flex-col gap-4 p-4", className)} aria-hidden="true">
      {/* Skill Name */}
      <div className="animate-pulse bg-muted h-8 w-3/4 rounded" />

      {/* Tags */}
      <div className="flex gap-2">
        <div className="animate-pulse bg-muted h-6 w-16 rounded-full" />
        <div className="animate-pulse bg-muted h-6 w-20 rounded-full" />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="animate-pulse bg-muted h-4 w-full rounded" />
        <div className="animate-pulse bg-muted h-4 w-5/6 rounded" />
        <div className="animate-pulse bg-muted h-4 w-4/6 rounded" />
      </div>

      {/* Stats */}
      <div className="space-y-2 pt-4 border-t">
        <div className="animate-pulse bg-muted h-4 w-1/2 rounded" />
        <div className="animate-pulse bg-muted h-4 w-1/3 rounded" />
        <div className="animate-pulse bg-muted h-4 w-2/5 rounded" />
      </div>
    </div>
  );
};
