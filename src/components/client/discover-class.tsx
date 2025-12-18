import { ClassType } from "@/types/schema";
import { getAllClass } from "actions/classActions";
import { ClassCard } from "./buttons/class-card";

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
    <section className="h-full w-full flex flex-col items-center justify-center py-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-4">
        {classes.map((cls) => (
          <ClassCard key={cls.id} classData={cls} />
        ))}
      </div>
    </section>
  );
};
