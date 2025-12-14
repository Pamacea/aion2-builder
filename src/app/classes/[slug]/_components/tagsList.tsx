import { defaultTagColor, tagColors } from "@/lib/tag";
import { TagTypeBase } from "@/types/schema";

export const TagsList = ({ tags }: { tags: TagTypeBase[] }) => {
  return (
    <section className="flex flex-wrap gap-2">
      {tags.map((tag: TagTypeBase) => {
        const tagColor = tagColors[tag.name] || defaultTagColor;
        return (
          <div
            key={tag.id}
            className={`border ${tagColor} px-3 py-2 uppercase text-sm font-bold rounded-sm`}
          >
            {tag.name}
          </div>
        );
      })}
    </section>
  );
};
