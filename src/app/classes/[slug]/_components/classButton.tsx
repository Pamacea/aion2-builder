import { Button } from "@/components/ui/button";
import { ClassButtonProps } from "@/types/class.type";
import Link from "next/link";

export const ClassButton = ({
  href,
  children,
  className = "",
  asButton = false,
}: ClassButtonProps) => {
  const baseClassName =
    "w-full h-full py-3 flex justify-center items-center text-md uppercase bg-background/60 text-foreground font-bold hover:bg-background/90 transition border-y-2 border-foreground/50 hover:border-primary";

  if (asButton) {
    return (
      <Link href={href}>
        <Button className={`${baseClassName} ${className}`}>
          {children}
        </Button>
      </Link>
    );
  }

  return (
    <Link href={href} className={`${baseClassName} ${className}`}>
      {children}
    </Link>
  );
};

