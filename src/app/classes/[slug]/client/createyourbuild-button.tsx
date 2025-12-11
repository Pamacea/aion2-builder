import Link from "next/link";

export function CreateYourBuildButton({ starterBuildHref }: { starterBuildHref: string }) {
  return (
    <Link 
      href={starterBuildHref} 
      className="p-6 uppercase bg-background/60 text-foreground font-bold rounded-md hover:bg-primary transition border-2 border-primary"
    >
      Créer votre build
    </Link>
  );
}