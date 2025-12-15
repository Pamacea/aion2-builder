import { BuildType } from "@/types/schema";

type FilterOptions = {
  selectedClassId: number | null;
  searchQuery: string;
  sortBy?: "likes" | "newest" | "oldest";
};

export const filterBuilds = (
  builds: BuildType[],
  options: FilterOptions
): BuildType[] => {
  let filtered = builds.filter((build) => {
    // Filter by class
    if (options.selectedClassId !== null && build.classId !== options.selectedClassId) {
      return false;
    }

    // Filter by name
    if (options.searchQuery.trim() !== "") {
      const query = options.searchQuery.toLowerCase();
      return build.name.toLowerCase().includes(query);
    }

    return true;
  });

  // Sort by likes, newest, or oldest
  if (options.sortBy === "likes") {
    filtered = filtered.sort((a, b) => {
      const likesA = a.likes?.length || 0;
      const likesB = b.likes?.length || 0;
      return likesB - likesA; // Descending order (most likes first)
    });
  } else if (options.sortBy === "oldest") {
    filtered = filtered.sort((a, b) => a.id - b.id);
  } else {
    // Default: newest first
    filtered = filtered.sort((a, b) => b.id - a.id);
  }

  return filtered;
};

