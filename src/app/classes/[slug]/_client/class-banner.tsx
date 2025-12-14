import { ClassImage } from "../_components/classImage";

export const ClassBanner = ({ classBanner }: { classBanner: string }) => {
  return (
    <section className="w-full h-40 bg-secondary flex items-center justify-center border-y-2 border-foreground/30 hover:border-primary transition-all">
      <ClassImage
        src={classBanner}
        alt={`${classBanner} icon`}
        className="rounded-md h-full w-full object-center object-cover opacity-90 group-hover:opacity-100 transition-opacity"
      />
    </section>
  );
};
