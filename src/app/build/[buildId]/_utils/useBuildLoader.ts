import { useBuildStore } from "@/store/useBuildEditor";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export const useBuildLoader = () => {
  const params = useParams();
  const buildId = params?.buildId as string;
  const { build, loadBuild, loading } = useBuildStore();

  useEffect(() => {
    if (buildId) {
      const numericBuildId = Number(buildId);
      if (!isNaN(numericBuildId)) {
        loadBuild(numericBuildId);
      }
    }
  }, [buildId, loadBuild]);

  return { build, loading };
};

