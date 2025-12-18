"use client";

import Image from "next/image";
import Link from "next/link";

export const Bahion = () => {
  return (
    <div className="h-full w-auto md:w-1/3 justify-start items-center flex shrink-0">
      <Link
        href="/"
        className="h-full justify-start items-center flex px-2 md:px-4 hover:border-b-2 hover:border-b-foreground border-b-2 border-b-secondary"
        suppressHydrationWarning
      >
        <Image
          src="/LO_Bahion.webp"
          alt="Bahion Logo"
          width={100}
          height={100}
          priority
          className="h-8 w-auto md:h-auto md:w-auto"
        />
      </Link>
    </div>
  );
};
