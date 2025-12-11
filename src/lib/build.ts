import { BuildSchema, BuildType } from "@/types/schema";
import { prisma } from "./prisma";

export const getBuildById = async (id: number): Promise<BuildType | null> => {
  const build = await prisma.build.findUnique({
    where: { id },
    include: { class: true, abilities: true, passives: true, stigmas: true },
  });

  if (!build) return null;

  return BuildSchema.parse(build);
};
