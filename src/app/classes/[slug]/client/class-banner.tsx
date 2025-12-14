import { CLASS_PATH } from "@/constants/paths";
import Image from "next/image";

export const ClassBanner = ({ classBanner }: { classBanner: string }) => {
  return (
    <section className="w-full h-40 bg-secondary flex items-center justify-center border-y-2 border-foreground/30 hover:border-primary transition-all">
      <Image
        src={`${CLASS_PATH}${classBanner.toLowerCase()}`}
        alt={`${classBanner} icon`}
        width={1000}
        height={1000}
        className="rounded-md h-full w-full object-center object-cover opacity-90 group-hover:opacity-100 transition-opacity"
        priority
        loading="eager"
      />
    </section>
  );
};
