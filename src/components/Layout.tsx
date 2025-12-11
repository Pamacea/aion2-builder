import { Footer } from "./Footer";
import { Header } from "./Header";

export const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className=" py-16 px-4 flex flex-col gap-4">
        {children}
      </main>
      <Footer />
    </>
  );
};
