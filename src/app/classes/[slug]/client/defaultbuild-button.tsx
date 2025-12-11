import { Button } from "@/components/ui/button";

export const DefaultBuildButton = () => {
  return (
    <Button className="w-60 p-6 uppercase bg-background/60 text-foreground font-bold rounded-md hover:bg-primary transition border-2 border-primary">
      default build
    </Button>
  );
};