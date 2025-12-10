import { prisma } from "./prisma";
import { ClassType } from "@/types/schema";

export const getAllClass = async (): Promise<ClassType[]> => {
    const classes = await prisma.class.findMany();
    return classes as ClassType[]; 
};

export const getClassByName = async (name: string): Promise<ClassType | null> => {
    const cls = await prisma.class.findUnique({
        where: { name },
    });
    return cls as ClassType | null;
};

