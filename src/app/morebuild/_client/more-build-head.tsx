"use client";

export const MoreBuildHead = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-3 sm:gap-4 pb-4 sm:pb-6 md:pb-8 px-2 sm:px-0">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground uppercase font-cinzel text-center">Build Catalog</h1>
      <p className="text-foreground/70 text-sm sm:text-base md:text-md text-center max-w-2xl">
        Browse and discover builds created by the community. Filter by class or search by name to find the perfect build for your playstyle.
      </p>
    </div>
  );
};

