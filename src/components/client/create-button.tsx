import Image from "next/image";
import Link from "next/link";

export const CreateButton = () => {
  return (
    <Link
      href="/build"
      className="h-full justify-start items-center flex px-8 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-background/25"
    >
      <Image
        src="/icons/create-logo.webp"
        alt="Bahion Logo"
        width={48}
        height={48}
      />
    </Link>
  );
};
