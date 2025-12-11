import { CLASS_PATH } from "@/constants/paths";
import { getAllClass } from "@/lib/class";
import { ClassType } from "@/types/schema";
import Image from "next/image";
import Link from "next/link";
import { ExploreHead } from "../client/explore-head";

export const ExploreOthersClasses = async () => {
  const classes: ClassType[] = await getAllClass();
  return (
    <main className="h-min-screen w-full flex flex-col gap-12 my-16">
      <ExploreHead />

      <section className="h-full w-full flex flex-col items-center justify-center gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-8 justify-center">
          {classes.map((cls) => (
            <Link key={cls.id} href={`/classes/${cls.name.toLowerCase()}`}>
              <div className="p-6 rounded-xl h-40 w-40 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform cursor-pointer">
                <Image
                  src={`${CLASS_PATH}${cls.iconUrl || "default-icon.webp"}`}
                  alt={`${cls.name} icon`}
                  width={64}
                  height={64}
                  className="rounded-md"
                />
                <h2 className="font-serif text-lg text-center uppercase font-medium">
                  {cls.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};
