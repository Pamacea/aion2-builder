import Link from "next/link";

export const DefaultBuildButton = ({
  starterBuildHref,
}: {
  starterBuildHref: string;
}) => {
  return (
    <Link
      href={starterBuildHref}
      className="w-60 h-full py-3 flex justify-center items-center text-md uppercase bg-background/60 text-foreground font-bold hover:bg-background/90 transition border-y-2 border-foreground/50 hover:border-primary"
    >
      default build
    </Link>
  );
};
