import { ClassType } from "@/types/schema";
import { getAllClass } from "actions/classActions";
import { ExploreHead } from "../_client/explore-head";
import { ClassGrid } from "./classGrid";

export const ExploreOthersClasses = async () => {
  let classes: ClassType[] = [];
  
  try {
    classes = await getAllClass();
  } catch (error) {
    console.error("Error fetching classes:", error);
    // Retourner un message d'erreur en cas d'échec
    return (
      <main className="h-min-screen w-full flex flex-col gap-12 my-16">
        <ExploreHead />
        <section className="h-full w-full flex flex-col items-center justify-center gap-8">
          <p className="text-red-500">Erreur de chargement des classes. Veuillez réessayer plus tard.</p>
        </section>
      </main>
    );
  }
  return (
    <main className="h-min-screen w-full flex flex-col gap-12 my-16">
      <ExploreHead />
      <section className="h-full w-full flex flex-col items-center justify-center gap-8">
        <ClassGrid classes={classes} />
      </section>
    </main>
  );
};
