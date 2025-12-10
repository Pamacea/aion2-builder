"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const Footer = () => {
  const pathname = usePathname();
  if (pathname !== "/" && pathname !== "/classes") {
    return null;
  }
  
  const sections = [
    {
      title: "Find Us",
      links: [
        { name: "Discord community", href: "https://discord.gg/63KVm78WWU" },
      ],
    },
    {
      title: "Features",
      links: [],
    },
    {
      title: "Games",
      links: [{ name: "Aion 2", href: "https://aion2.online/en/" }],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Service", href: "/terms" },
      ],
    },
    {
      title: "Languages",
      links: [
        { name: "English", href: "#english" },
        { name: "French", href: "#french" },
      ],
    },
  ];

  return (
    <footer className="pt-8 font-sans flex justify-center border-t-2 border-background/30 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section principale avec les colonnes */}
        <div
          className="
            grid grid-cols-2 md:grid-cols-5 gap-y-8 md:gap-x-32 p-6
            mb-6
          "
        >
          {sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-sm font-bold uppercase text-foreground tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={
                        link.href.startsWith("/") ? `/` + link.href : link.href
                      }
                      className="text-sm transition duration-150 ease-in-out text-foreground/50 hover:text-foreground"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Section de la note de bas de page/disclaimer */}
        <div
          className="
            py-4 px-5 
            text-left text-xs text-foreground/50
            mb-8
          "
        >
          <p>Bahion is not affiliated with Aion 2 (NCSOFT)</p>
        </div>
      </div>
    </footer>
  );
};
