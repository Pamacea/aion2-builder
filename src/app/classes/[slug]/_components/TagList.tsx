import { tagColors } from "@/lib/tag";
import { TagTypeBase } from "@/types/schema";

export const TagList = ({ tags }: { tags: TagTypeBase[] }) => {

  return (
    <section className="flex flex-wrap gap-2">
      {tags.map((tag: TagTypeBase) => (
        <div key={tag.id} className={`border ${tagColors[tag.name]} px-4 py-2 uppercase text-sm font-bold rounded-sm`}>
          {tag.name}
        </div>
      ))}
    </section>
  );
};
