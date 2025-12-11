import { CLASS_PATH } from "@/constants/paths";
import Image from "next/image";

export const ClassBanner = ({ classBanner }: { classBanner: string }) => {
  return (
    <section className="w-md h-40 bg-secondary flex items-center justify-center border-2 border-foreground/30">
      <Image
        src={`${CLASS_PATH}${classBanner.toLowerCase()}`}
        alt={`${classBanner} icon`}
        width={1000}
        height={1000}
        className="rounded-md h-full w-full object-center object-cover"
        priority
        loading="eager"
      />
    </section>
  );
};
