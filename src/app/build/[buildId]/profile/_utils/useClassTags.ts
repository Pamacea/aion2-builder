import { getClassTags } from "@/actions/classActions";
import { useBuildStore } from "@/store/useBuildEditor";
import { TagTypeBase } from "@/types/schema";
import { useEffect, useMemo, useState } from "react";

export const useClassTags = () => {
  const { build } = useBuildStore();
  const [classTags, setClassTags] = useState<TagTypeBase[]>([]);
  
  // Mémoriser le nom de la classe pour éviter les requêtes inutiles
  const className = useMemo(() => build?.class?.name, [build?.class?.name]);

  useEffect(() => {
    if (className) {
      getClassTags(className).then(setClassTags);
    } else {
      setClassTags([]);
    }
  }, [className]);

  return classTags;
};

