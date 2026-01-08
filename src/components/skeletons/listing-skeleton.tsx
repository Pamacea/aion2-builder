import { cn } from "@/lib/utils";

interface ListingCardSkeletonProps {
  className?: string;
  count?: number;
}

export const ListingCardSkeleton = ({ className, count = 1 }: ListingCardSkeletonProps) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "animate-pulse bg-muted rounded-lg overflow-hidden",
            "w-full h-96",
            className
          )}
          aria-hidden="true"
        >
          {/* Image placeholder */}
          <div className="animate-pulse bg-muted/50 w-full h-48" />

          {/* Content placeholder */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="animate-pulse bg-muted/50 h-6 w-3/4 rounded" />

            {/* Description */}
            <div className="space-y-2">
              <div className="animate-pulse bg-muted/50 h-4 w-full rounded" />
              <div className="animate-pulse bg-muted/50 h-4 w-5/6 rounded" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="animate-pulse bg-muted/50 h-6 w-16 rounded-full" />
              <div className="animate-pulse bg-muted/50 h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

interface ListingGridSkeletonProps {
  className?: string;
  count?: number;
}

export const ListingGridSkeleton = ({ className, count = 6 }: ListingGridSkeletonProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-muted rounded-lg overflow-hidden h-96"
          aria-hidden="true"
        >
          {/* Image placeholder */}
          <div className="animate-pulse bg-muted/50 w-full h-48" />

          {/* Content placeholder */}
          <div className="p-4 space-y-3">
            {/* Title */}
            <div className="animate-pulse bg-muted/50 h-6 w-3/4 rounded" />

            {/* Description */}
            <div className="space-y-2">
              <div className="animate-pulse bg-muted/50 h-4 w-full rounded" />
              <div className="animate-pulse bg-muted/50 h-4 w-5/6 rounded" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="animate-pulse bg-muted/50 h-6 w-16 rounded-full" />
              <div className="animate-pulse bg-muted/50 h-6 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

interface FilterSkeletonProps {
  className?: string;
}

export const FilterSkeleton = ({ className }: FilterSkeletonProps) => {
  return (
    <div className={cn("flex items-center gap-4", className)} aria-hidden="true">
      <div className="animate-pulse bg-muted h-10 w-48 rounded-md" />
      <div className="animate-pulse bg-muted h-10 w-32 rounded-md" />
    </div>
  );
};
