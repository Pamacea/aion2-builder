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
    "w-full h-full py-3 flex justify-center items-center text-md uppercase bg-secondary/25 text-foreground font-bold hover:bg-primary/10 transition border-x-2 border-secondary hover:border-primary";

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

