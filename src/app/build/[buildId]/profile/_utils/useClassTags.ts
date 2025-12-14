import { getClassTags } from "@/actions/classActions";
import { useBuildStore } from "@/store/useBuildEditor";
import { TagTypeBase } from "@/types/schema";
import { useEffect, useState } from "react";

export const useClassTags = () => {
  const { build } = useBuildStore();
  const [classTags, setClassTags] = useState<TagTypeBase[]>([]);

  useEffect(() => {
    if (build?.class?.name) {
      getClassTags(build.class.name).then(setClassTags);
    }
  }, [build?.class?.name]);

  return classTags;
};

