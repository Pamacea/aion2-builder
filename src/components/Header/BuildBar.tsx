"use client";

import { ProfileButton, SkillButton, SphereButton } from "../client/buttons";
import { GearButton } from "../client/buttons/gear-button";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Buildbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const buildId = pathname.split("/")[2];

  const menuItems = [
    { href: `/build/${buildId}/profile`, icon: "/icons/IC_Builder_Profile.webp", label: "Profile", isActive: pathname.endsWith("/profile") },
    { href: `/build/${buildId}/skill`, icon: "/icons/IC_Builder_Skill.webp", label: "Skill", isActive: pathname.endsWith("/skill") },
    { href: `/build/${buildId}/gear`, icon: "/icons/IC_Builder_Gear.webp", label: "Gear", isActive: pathname.endsWith("/gear") },
    { href: `/build/${buildId}/sphere`, icon: "/icons/IC_Builder_Sphere.webp", label: "Daevanion", isActive: pathname.endsWith("/sphere") },
  ];

  const activeItem = menuItems.find(item => item.isActive);

  return (
    <nav className="w-full md:w-1/3 h-full flex items-center justify-center gap-2 md:gap-0 relative">
      {/* Desktop: affichage normal */}
      <div className="hidden md:flex items-center justify-center gap-2 w-full h-full">
        <ProfileButton />
        <SkillButton />
        <GearButton />
        <SphereButton />
      </div>

      {/* Mobile: menu déroulant */}
      <div className="md:hidden w-full h-full relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "h-full w-full flex items-center justify-center gap-2 px-4 border-b-2 transition-colors",
            isOpen 
              ? "border-b-foreground" 
              : "border-b-secondary hover:border-b-foreground/50"
          )}
        >
          {activeItem && (
            <>
              <Image
                src={activeItem.icon}
                alt={activeItem.label}
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span className="text-sm font-bold uppercase">{activeItem.label}</span>
            </>
          )}
          <svg
            className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Menu déroulant */}
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute top-full left-0 right-0 z-50 bg-background border-t-2 border-primary shadow-lg">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 border-b-2 transition-colors",
                    item.isActive
                      ? "border-b-foreground bg-background/50"
                      : "border-b-secondary hover:border-b-foreground/50 hover:bg-background/30"
                  )}
                >
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={24}
                    height={24}
                    className="w-6 h-6"
                  />
                  <span className="text-sm font-bold uppercase">{item.label}</span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </nav>
  );
};
