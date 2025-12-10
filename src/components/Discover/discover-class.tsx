import { getAllClass } from "@/lib/class";
import { ClassType } from "@/types/schema";
import Image from "next/image";
import { CLASS_PATH } from "@/constants/paths";
import Link from "next/link";

export const DiscoverClass = async () => {
  const classes: ClassType[] = await getAllClass();

  return (
    <section className="h-full w-full flex flex-col items-center justify-center gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
        {classes.map((cls) => (
          <Link key={cls.id} href={`/classes/${cls.name.toLowerCase()}`}>
            <div className="bg-background/30 p-6 rounded-xl h-80 w-64 flex flex-col items-center justify-center gap-4 border-2 border-primary hover:scale-105 transition-transform cursor-pointer">
              <Image
                src={`${CLASS_PATH}${cls.iconUrl || "default-icon.webp"}`}
                alt={`${cls.name} icon`}
                width={96}
                height={96}
                className="rounded-md"
              />
              <h2 className="uppercase font-bold text-2xl text-center">
                {cls.name}
              </h2>
              <p className="text-center text-sm font-light">
                {cls.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
