import { ClassImage } from "@/app/classes/[slug]/_components/classImage";

export const ProfilelassBanner = ({
  classBanner,
}: {
  classBanner: string | null;
}) => {
  if (!classBanner) return null;
  return (
    <section className="w-1/2 h-72 bg-secondary flex items-center justify-center border-2 border-foreground/30">
      <ClassImage
        src={classBanner}
        alt={`${classBanner} icon`}
        className="rounded-md h-full w-full object-center object-cover"
      />
    </section>
  );
};
