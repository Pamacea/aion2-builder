import Link from "next/link";

export const DefaultBuildButton = ({
  starterBuildHref,
}: {
  starterBuildHref: string;
}) => {
  return (
    <Link
      href={starterBuildHref}
      className="w-60 h-full py-3 flex justify-center items-center text-md uppercase bg-background/60 text-foreground font-bold rounded-md hover:bg-primary transition border-2 border-primary"
    >
      default build
    </Link>
  );
};
