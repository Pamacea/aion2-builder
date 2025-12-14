import { ClassType } from "@/types/schema";
import { FilterByClass } from "../_client/filter-by-class";
import { FilterByName } from "../_client/filter-by-name";

type FiltersSectionProps = {
  classes: ClassType[];
  selectedClassId: number | null;
  searchQuery: string;
  onClassChange: (classId: number | null) => void;
  onSearchChange: (query: string) => void;
};

export const FiltersSection = ({
  classes,
  selectedClassId,
  searchQuery,
  onClassChange,
  onSearchChange,
}: FiltersSectionProps) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pb-4 border-b-2 border-background/20">
      <FilterByClass
        classes={classes}
        selectedClassId={selectedClassId}
        onClassChange={onClassChange}
      />
      <div className="flex-1 w-full sm:w-auto">
        <FilterByName searchQuery={searchQuery} onSearchChange={onSearchChange} />
      </div>
    </div>
  );
};

