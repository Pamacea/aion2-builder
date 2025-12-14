import { ClassType } from "@/types/schema";
import { getStarterBuildIdByClassName } from "actions/buildActions";
import { getClassByName } from "actions/classActions";

export const getClassPageData = async (
  slug: string
): Promise<{
  classData: ClassType | null;
  starterbuildId: number | null;
}> => {
  const [classData, starterbuildId] = await Promise.all([
    getClassByName(slug),
    getStarterBuildIdByClassName(slug),
  ]);

  return { classData, starterbuildId };
};

