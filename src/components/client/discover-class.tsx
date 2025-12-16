import { CLASS_PATH } from "@/constants/paths";
import { ClassType } from "@/types/schema";
import { getAllClass } from "actions/classActions";
import Image from "next/image";
import Link from "next/link";

export const DiscoverClass = async () => {
  let classes: ClassType[] = [];
  
  try {
    classes = await getAllClass();
  } catch (error) {
    console.error("Error fetching classes:", error);
    // Retourner un tableau vide en cas d'erreur pour éviter de casser la page
    return (
      <section className="h-full w-full flex flex-col items-center justify-center gap-8">
        <p className="text-red-500">Erreur de chargement des classes. Veuillez réessayer plus tard.</p>
      </section>
    );
  }

  return (
    <section className="h-full w-full flex flex-col items-center justify-center gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 justify-center">
        {classes.map((cls) => (
          <Link key={cls.id} href={`/classes/${cls.name.toLowerCase()}`} suppressHydrationWarning>
            <div className="bg-background/30 p-6 h-80 w-64 flex flex-col items-center justify-center gap-4 border-y-2 border-foreground/50 hover:border-primary hover:scale-105 transition-transform cursor-pointer">
              <Image
                src={cls.iconUrl?.startsWith("IC_") 
                  ? `${CLASS_PATH}${cls.iconUrl}` 
                  : `${CLASS_PATH}IC_Class_${cls.name.charAt(0).toUpperCase() + cls.name.slice(1)}.webp`}
                alt={`${cls.name} icon`}
                width={96}
                height={96}
                className="rounded-md"
              />
              <h2 className="uppercase font-extrabold text-2xl text-center font-cinzel">
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
