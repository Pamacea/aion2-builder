import { CLASS_PATH } from "@/constants/paths";
import Image from "next/image";

export const ClassCharacter = ({ClassCharacter}: {ClassCharacter: string}) => {
  return (
    <section className="h-full">
      <Image
          src={`${CLASS_PATH}${ClassCharacter.toLowerCase()}`}
        alt="class character"
        width={2048}
        height={2048}
        className="w-full h-full object-center object-cover"
        priority
        loading="eager"
      />
    </section>
  );
};
