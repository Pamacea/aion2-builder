"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const isBuildPage = pathname?.startsWith("/build");
  const isMyProfilePage = pathname?.startsWith("/myprofile");

  return (
    <>
      <Header />
      <main className=" py-12 px-4 flex flex-col gap-4">{children}</main>
      {!isBuildPage && !isMyProfilePage && <Footer />}
    </>
  );
};
