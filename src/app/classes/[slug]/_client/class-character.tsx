import { ClassImage } from "../_components/classImage";

export const ClassCharacter = ({
  ClassCharacter,
}: {
  ClassCharacter: string;
}) => {
  return (
    <section className="h-full">
      <ClassImage
        src={ClassCharacter}
        alt="class character"
        width={2048}
        height={2048}
        className="w-full h-full object-center object-cover"
      />
    </section>
  );
};
