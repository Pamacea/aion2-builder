import { BuildType } from "@/types/schema";

type FilterOptions = {
  selectedClassId: number | null;
  searchQuery: string;
};

export const filterBuilds = (
  builds: BuildType[],
  options: FilterOptions
): BuildType[] => {
  return builds.filter((build) => {
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
};

