"use client";

import Link from "next/link";

export const Footer = () => {

  const sections = [
    {
      title: "Community",
      links: [
        { 
          name: "Discord", 
          href: "https://discord.gg/QKkZYhrYs3",
          external: true 
        },
      ],
    },
    {
      title: "Game",
      links: [
        { 
          name: "Aion 2", 
          href: "https://aion2.online/en/",
          external: true 
        },
      ],
    },
    {
      title: "BUILDER",
      links: [
        { 
          name: "How to Use", 
          href: "/howtouse",
          external: false 
        },
      ],
    },
    {
      title: "Legal",
      links: [
        { 
          name: "Privacy Policy", 
          href: "/privacypolicy",
          external: false 
        },
        { 
          name: "Terms of Service", 
          href: "/termsofservice",
          external: false 
        },
      ],
    },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full mt-auto pt-8 font-sans border-t-2 border-background/30 bg-background/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section principale avec les colonnes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-8">
          {sections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-sm font-bold uppercase text-foreground tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.length > 0 ? (
                  section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm transition duration-150 ease-in-out text-foreground/60 hover:text-foreground hover:underline"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-sm transition duration-150 ease-in-out text-foreground/60 hover:text-foreground hover:underline"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-foreground/40">À venir</li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Section de copyright et disclaimer */}
        <div className="py-6 border-t border-background/20">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-foreground/50">
            <p className="text-center sm:text-left">
              © {currentYear} Bahion. all rights reserved.
            </p>
            <p className="text-center sm:text-right">
              Bahion is not affiliated with Aion 2 (NCSOFT)
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
