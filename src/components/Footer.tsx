"use client";

import Link from "next/link";
import { useState } from "react";

export const Footer = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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
        { 
          name: "How We Make It", 
          href: "/howwemakeit",
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
    <footer className="w-full mt-auto pt-4 md:pt-8 font-sans border-t-2 border-primary bg-background/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton toggle pour mobile */}
        <div className="md:hidden flex justify-center items-center py-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-foreground/60 hover:text-foreground transition-colors"
            aria-label={isExpanded ? "Fermer le footer" : "Ouvrir le footer"}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isExpanded ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Section principale avec les colonnes */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 py-4 md:py-8 ${isExpanded ? 'block' : 'hidden md:grid'}`}>
          {sections.map((section, index) => (
            <div key={index} className="space-y-3 md:space-y-4">
              <h3 className="text-xs md:text-sm font-bold uppercase text-foreground tracking-wider">
                {section.title}
              </h3>
              <ul className="space-y-1.5 md:space-y-2">
                {section.links.length > 0 ? (
                  section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      {link.external ? (
                        <a
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs md:text-sm transition duration-150 ease-in-out text-foreground/60 hover:text-foreground hover:underline"
                        >
                          {link.name}
                        </a>
                      ) : (
                        <Link
                          href={link.href}
                          className="text-xs md:text-sm transition duration-150 ease-in-out text-foreground/60 hover:text-foreground hover:underline"
                        >
                          {link.name}
                        </Link>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="text-xs md:text-sm text-foreground/40">À venir</li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Section de copyright et disclaimer */}
        <div className={`py-4 md:py-6 border-t border-primary/50 ${isExpanded ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 text-xs text-foreground/50">
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
