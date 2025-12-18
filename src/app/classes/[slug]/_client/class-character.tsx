import { ClassImage } from "../_components/classImage";

export const ClassCharacter = ({
  ClassCharacter,
}: {
  ClassCharacter: string;
}) => {
  return (
    <section className="w-full h-full min-h-[200px] md:min-h-[400px] overflow-hidden ">
      <ClassImage
        src={ClassCharacter}
        alt="class character"
        width={2048}
        height={2048}
        className="w-full h-full max-w-full max-h-full object-contain object-center"
      />
    </section>
  );
};
