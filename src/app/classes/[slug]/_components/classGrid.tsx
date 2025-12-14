import { CLASS_PATH } from "@/constants/paths";
import { ClassGridProps } from "@/types/schema";
import Image from "next/image";
import Link from "next/link";

export const ClassGrid = ({ classes }: ClassGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-8 justify-center">
      {classes.map((cls) => (
        <Link key={cls.id} href={`/classes/${cls.name.toLowerCase()}`}>
          <div className="p-6 rounded-xl h-40 w-40 flex flex-col items-center justify-center gap-4 hover:scale-105 transition-transform cursor-pointer text-foreground/70 hover:text-foreground">
            <Image
              src={`${CLASS_PATH}${cls.iconUrl || "default-icon.webp"}`}
              alt={`${cls.name} icon`}
              width={64}
              height={64}
              className="rounded-md"
            />
            <h2 className="text-lg text-center uppercase font-medium">
              {cls.name}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
};

