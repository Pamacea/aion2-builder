"use client";

import { Code, Database, Gamepad2, Heart } from "lucide-react";
import Link from "next/link";

export default function HowWeMakeItPage() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-cinzel text-foreground flex items-center justify-center gap-3">
            How We Built It
          </h1>
          <p className="text-lg text-foreground/70">
            Learn about the development process and methodology behind the
            Bahion Builder
          </p>
        </div>

        {/* Section 1: Skill Ratios Calculation */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Database className="w-6 h-6" />
            1. Skill Ratios Calculation
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6 space-y-4">
            <p className="text-foreground/90">
              We calculated skill ratios for all classes at{" "}
              <strong>level 4</strong>, using the equipment provided by quests.
            </p>
            <p className="text-foreground/80">
              This baseline allows us to provide accurate damage and healing
              calculations for each skill. When we have more information
              available, we will be able to add character characteristics and
              calculate stats based on those attributes.
            </p>
            <div className="bg-blue-600/10 border border-blue-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>📊 Note:</strong> All calculations are based on quest
                gear at level 4. Future updates will include character stats and
                equipment customization for more precise calculations.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Game Data */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Gamepad2 className="w-6 h-6" />
            2. Game Data Accuracy
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6 space-y-4">
            <p className="text-foreground/90">
              All class information, skills, and ratios are based on the
              official <strong>Aion 2</strong> game data.
            </p>
            <p className="text-foreground/80">
              We strive to maintain accuracy by:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
              <li>Using official game data and documentation</li>
              <li>Testing and verifying skill values in-game</li>
              <li>Regularly updating information as the game evolves</li>
              <li>
                Ensuring all class abilities, passives, and stigmas match the
                game
              </li>
            </ul>
            <div className="bg-green-600/10 border border-green-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>✅ Commitment:</strong> Our goal is to provide the most
                accurate and up-to-date information to help you create the best
                builds for Aion 2.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Technology */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Code className="w-6 h-6" />
            3. Technology Stack
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6 space-y-4">
            <p className="text-foreground/90">
              The builder is developed using <strong>Next.js</strong>, a modern
              React framework that provides:
            </p>
            <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
              <li>Fast and responsive user interface</li>
              <li>Server-side rendering for optimal performance</li>
              <li>Real-time updates and automatic saving</li>
              <li>Seamless drag & drop functionality</li>
              <li>Modern web technologies for the best user experience</li>
            </ul>
            <p className="text-foreground/80 mt-4">
              Built by a dedicated developer passionate about Aion 2 and
              theorycrafting tools.
            </p>
          </div>
        </section>

        {/* Section 4: Support */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="w-6 h-6" />
            4. Support the Project
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6 space-y-4">
            <p className="text-foreground/90">
              This builder is a passion project created to help the Aion 2
              community. If you find it useful and would like to support its
              development, you can make a donation here:
            </p>
            <div className="flex justify-center">
              <div className="bg-primary/10 border border-primary/30 p-6 rounded-lg text-center space-y-4 max-w-md">
                <p className="text-foreground/80">
                  Your support helps maintain and improve the builder, ensuring
                  it stays up-to-date with the latest game changes.
                </p>
                <div className="space-y-2">
                  <Link
                    href="https://www.paypal.com/donate/?hosted_button_id=327SH9MHJPYC4"
                    className="inline-block px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded uppercase font-bold"
                  >
                    Make a Donation
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center space-y-4 pt-8 border-t border-foreground/20">
          <p className="text-foreground/70">
            Thank you for using Bahion Builder! We hope it helps you create
            amazing builds for Aion 2.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/howtouse"
              className="px-4 py-2 bg-background/50 border-y-2 border-foreground/30 hover:border-primary transition-colors text-foreground uppercase font-bold"
            >
              How to Use
            </Link>
            <Link
              href="/classes"
              className="px-4 py-2 bg-background/50 border-y-2 border-foreground/30 hover:border-primary transition-colors text-foreground uppercase font-bold"
            >
              Explore Classes
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
