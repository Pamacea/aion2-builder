"use client";

import { MousePointerClick, Move, Save, Share2, Sparkles, Target, Zap } from "lucide-react";
import Link from "next/link";

export default function HowToUsePage() {
  return (
    <main className="w-full min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-4xl flex flex-col gap-8">
        {/* Header */}
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold font-cinzel text-foreground flex items-center justify-center gap-3">
            Builder Usage Guide
          </h1>
          <p className="text-lg text-foreground/70">
            Learn how to create and optimize your builds for Aion 2
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-background/50 border-y-2 border-foreground/30 p-6 ">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Table of Contents</h2>
          <ul className="space-y-2 text-foreground/80">
            <li><a href="#introduction" className="hover:text-primary transition-colors">1. Introduction</a></li>
            <li><a href="#navigation" className="hover:text-primary transition-colors">2. Navigation and Structure</a></li>
            <li><a href="#profile" className="hover:text-primary transition-colors">3. Profile Page</a></li>
            <li><a href="#skills" className="hover:text-primary transition-colors">4. Skills Page</a></li>
            <li><a href="#shortcuts" className="hover:text-primary transition-colors">5. Shortcut Bar</a></li>
            <li><a href="#drag-drop" className="hover:text-primary transition-colors">6. Drag & Drop</a></li>
            <li><a href="#specialties" className="hover:text-primary transition-colors">7. Specialties</a></li>
            <li><a href="#chain-skills" className="hover:text-primary transition-colors">8. Chain Skills</a></li>
            <li><a href="#saving" className="hover:text-primary transition-colors">9. Saving</a></li>
            <li><a href="#sharing" className="hover:text-primary transition-colors">10. Sharing</a></li>
            <li><a href="#tips" className="hover:text-primary transition-colors">11. Tips and Shortcuts</a></li>
          </ul>
        </div>

        {/* Section 1: Introduction */}
        <section id="introduction" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            1. Introduction
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <p className="text-foreground/90">
              Welcome to the <strong>Bahion Builder</strong>! This tool allows you to create, test, and share your skill configurations for Aion 2.
            </p>
            <div className="space-y-2">
              <h3 className="font-semibold text-foreground">Current Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                <li>Complete skill management (Abilities, Passives, Stigmas)</li>
                <li>Customizable shortcut bar with drag & drop</li>
                <li>Specialty system to customize your skills</li>
                <li>Chain Skills to create combos</li>
                <li>Automatic saving of your changes</li>
                <li>Build sharing with the community</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Section 2: Navigation */}
        <section id="navigation" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6" />
            2. Navigation and Structure
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <p className="text-foreground/90">
              Each build is organized into several pages accessible via the navigation bar:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-background/50 p-4 rounded border border-foreground/20">
                <h3 className="font-semibold text-primary mb-2">📋 Profile</h3>
                <p className="text-sm text-foreground/80">
                  Configure your build name, select the class, and view associated tags.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded border border-foreground/20">
                <h3 className="font-semibold text-primary mb-2">⚔️ Skills</h3>
                <p className="text-sm text-foreground/80">
                  Manage your active skills, passives, stigmas, and organize your shortcut bar.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded border border-foreground/20">
                <h3 className="font-semibold text-primary mb-2">🛡️ Gear<span className="text-xs text-foreground/50">(Coming Soon)</span></h3>
                <p className="text-sm text-foreground/80">
                  Configure your equipment and view your build statistics.
                </p>
              </div>
              <div className="bg-background/50 p-4 rounded border border-foreground/20">
                <h3 className="font-semibold text-primary mb-2">🔮 Sphere<span className="text-xs text-foreground/50">(Coming Soon)</span></h3>
                <p className="text-sm text-foreground/80">
                  Manage your skill sphere and optimize your specialization points.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: Profile */}
        <section id="profile" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Target className="w-6 h-6" />
            3. Profile Page
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Build Name</h3>
              <p className="text-foreground/80">
                Click on the build name to modify it. Choose a descriptive name that reflects the playstyle or purpose of the build.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Class Selection</h3>
              <p className="text-foreground/80">
                Use the dropdown menu to change your build&apos;s class. <strong>Warning:</strong> Changing classes will reset all your skills.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Tags</h3>
              <p className="text-foreground/80">
                Tags display the main characteristics of the selected class (e.g., DPS, Tank, Heal, etc.).
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Skills */}
        <section id="skills" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6" />
            4. Skills Page
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-6">
            <p className="text-foreground/90">
              The Skills page is divided into three main panels:
            </p>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-lg">4.1 Left Panel: Skill Details</h3>
              <p className="text-foreground/80">
                Click on a skill to see its complete details:
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                <li>Name and description</li>
                <li>Cooldown and cast duration</li>
                <li>Mana cost</li>
                <li>Range and area of effect</li>
                <li>Damage and healing</li>
                <li>Tags and conditions</li>
                <li>Available specialties</li>
                <li>Chain Skills</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-lg">4.2 Center Panel: Shortcut Bar</h3>
              <p className="text-foreground/80">
                Organize your skills in a U-shaped shortcut bar:
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                <li><strong>Reserved Slot (11):</strong> Automatically contains your first skill (auto-attack)</li>
                <li><strong>Slots 1-10:</strong> Main combat skills</li>
                <li><strong>Slots 12-19:</strong> Additional skills</li>
                <li><strong>Slots 20-23:</strong> Support skills</li>
              </ul>
              <p className="text-foreground/80 mt-2">
                Use the reset button to clear all slots (except the reserved slot).
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-foreground text-lg">4.3 Right Panel: Skill List</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Active Skills (Abilities)</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                    <li>Up to 12 skills per class</li>
                    <li>Levels 1 to 10</li>
                    <li>Use the <span className="bg-green-600/50 px-2 py-1 rounded text-xs">+</span> and <span className="bg-red-600/50 px-2 py-1 rounded text-xs">-</span> buttons to adjust the level</li>
                    <li>The <span className="bg-background/80 px-2 py-1 rounded text-xs border border-foreground/50">Reset</span> button removes the skill from the build</li>
                    <li>Locked skills (level 0) cannot be used</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Passive Skills (Passives)</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                    <li>Up to 10 passives per class</li>
                    <li>Levels 1 to 10</li>
                    <li>Same management system as active skills</li>
                    <li>Passives improve your base statistics</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-foreground mb-2">Stigmas</h4>
                  <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                    <li>Up to 4 active stigmas</li>
                    <li>Levels 1 to 20</li>
                    <li>Cost in Stigma Points (STP)</li>
                    <li>Stigmas offer powerful bonuses</li>
                    <li>Manage your STP budget carefully</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>💡 Tip:</strong> Monitor your Skill Points (SP) and Stigma Points (STP) counter at the top of the right panel. 
                You have a limited budget to allocate among all your skills.
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Shortcuts */}
        <section id="shortcuts" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <MousePointerClick className="w-6 h-6" />
            5. Shortcut Bar
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <p className="text-foreground/90">
              The shortcut bar allows you to organize your skills for quick access during gameplay.
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">How to add a skill to the bar:</h3>
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 ml-4">
                <li>Click once on a skill to see its details</li>
                <li>Click a second time on the same skill to select it</li>
                <li>Click on an empty slot in the shortcut bar to place the skill</li>
                <li>Or use drag &amp; drop (see next section)</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">How to remove a skill:</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                <li>Click on the slot containing the skill to remove it</li>
                <li>Or drag another skill onto the slot to replace it</li>
              </ul>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>⚠️ Important:</strong> The reserved slot (11) always contains your first skill (auto-attack) and cannot be modified.
              </p>
            </div>
          </div>
        </section>

        {/* Section 6: Drag & Drop */}
        <section id="drag-drop" className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Move className="w-6 h-6" />
            6. Drag &amp; Drop
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <p className="text-foreground/90">
              The drag &amp; drop system makes organizing your shortcut bar intuitive and fast.
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">How to use drag &amp; drop:</h3>
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 ml-4">
                <li>Click and hold on a skill in the right list</li>
                <li>Drag it to a slot in the shortcut bar</li>
                <li>Release to place the skill</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Reorganize skills:</h3>
              <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                <li>Drag a skill from one slot to another to move it</li>
                <li>Drag a skill onto another to swap them</li>
                <li>Drag a skill outside the bar to remove it</li>
              </ul>
            </div>

            <div className="bg-blue-600/10 border border-blue-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>💡 Tip:</strong> Only skills added to the build (level &gt; 0) can be dragged. 
                Locked skills cannot be moved.
              </p>
            </div>
          </div>
        </section>

        {/* Section 7: Specialties */}
        <section id="specialties" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            7. Specialties (Specialty Choices)
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <p className="text-foreground/90">
              Specialties allow you to customize your skills with additional enhancements.
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Types of specialties:</h3>
              <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
                <li>
                  <strong>🔒 Locked:</strong> Require a minimum skill level to be unlocked
                  <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                    <li>The required level is displayed on the icon</li>
                    <li>You must reach this level to activate the specialty</li>
                  </ul>
                </li>
                <li>
                  <strong>✅ Available:</strong> Unlocked but not activated
                  <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                    <li>Click to activate the specialty</li>
                  </ul>
                </li>
                <li>
                  <strong>⭐ Active:</strong> Currently activated on your skill
                  <ul className="list-circle list-inside ml-6 mt-1 text-sm">
                    <li>Click to deactivate</li>
                    <li>Some skills have activation limits</li>
                  </ul>
                </li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">How to activate a specialty:</h3>
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 ml-4">
                <li>Add the skill to your build and level it to the required level</li>
                <li>Click on the skill to see its details</li>
                <li>In the left panel, find the &quot;Specialties&quot; section</li>
                <li>Click on an available specialty to activate it</li>
              </ol>
            </div>

            <div className="bg-purple-600/10 border border-purple-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>💡 Tip:</strong> Specialties can significantly modify a skill&apos;s behavior. 
                Experiment with different combinations to find the one that matches your playstyle.
              </p>
            </div>
          </div>
        </section>

        {/* Section 8: Chain Skills */}
        <section id="chain-skills" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Zap className="w-6 h-6" />
            8. Chain Skills
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <p className="text-foreground/90">
              Chain Skills allow you to create skill combos to optimize your rotation.
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">How to configure a Chain Skill:</h3>
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 ml-4">
                <li>Select a skill from the list</li>
                <li>In the details panel, find the &quot;Chain Skills&quot; section</li>
                <li>Select up to 2 skills that can be chained</li>
                <li>Chain Skills will automatically appear after using the main skill</li>
              </ol>
            </div>

            <div className="bg-green-600/10 border border-green-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>💡 Tip:</strong> Chain Skills allow you to optimize your combat rotation. 
                Plan your combos to maximize your damage or efficiency.
              </p>
            </div>
          </div>
        </section>

        {/* Section 9: Saving */}
        <section id="saving" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Save className="w-6 h-6" />
            9. Saving
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Automatic Saving</h3>
              <p className="text-foreground/80">
                All your changes are automatically saved after each modification. 
                You don&apos;t need to click a &quot;Save&quot; button.
              </p>
              <ul className="list-disc list-inside space-y-1 text-foreground/80 ml-4">
                <li>Build name modification</li>
                <li>Adding/removing skills</li>
                <li>Level changes</li>
                <li>Shortcut bar configuration</li>
                <li>Specialty activation</li>
                <li>Chain Skill configuration</li>
              </ul>
            </div>

            <div className="bg-green-600/10 border border-green-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>✅ Note:</strong> Saving happens in the background. You can continue working while your changes are being saved.
              </p>
            </div>

            <div className="bg-yellow-600/10 border border-yellow-600/30 p-4 rounded">
              <p className="text-sm text-foreground/90">
                <strong>⚠️ Important:</strong> Reference builds (Starter Builds) cannot be modified. 
                You must create your own build or &quot;fork&quot; an existing build to customize it.
              </p>
            </div>
          </div>
        </section>

        {/* Section 10: Sharing */}
        <section id="sharing" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Share2 className="w-6 h-6" />
            10. Build Sharing
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6  space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Share your build</h3>
              <p className="text-foreground/80">
                Once your build is created and optimized, you can share it with the community:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 ml-4">
                <li>Your build is automatically visible on the &quot;More Builds&quot; page</li>
                <li>Other players can see your build and &quot;fork&quot; (copy) it to customize</li>
                <li>You can like builds that interest you</li>
              </ol>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-foreground">Fork a build</h3>
              <p className="text-foreground/80">
                To use a build created by another player as a base:
              </p>
              <ol className="list-decimal list-inside space-y-2 text-foreground/80 ml-4">
                <li>Go to the &quot;More Builds&quot; page</li>
                <li>Browse available builds</li>
                <li>Click &quot;Fork Build&quot; to create a copy you can modify</li>
                <li>Customize the build according to your preferences</li>
              </ol>
            </div>
          </div>
        </section>

        {/* Section 11: Tips */}
        <section id="tips" className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            11. Tips and Shortcuts
          </h2>
          <div className="bg-background/50 border-y-2 border-foreground/20 p-6 space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-foreground mb-2">💡 General Tips</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
                  <li><strong>Manage your budget:</strong> Monitor your Skill Points and Stigma Points to avoid exceeding your limit</li>
                  <li><strong>Experiment:</strong> Test different combinations of skills and specialties</li>
                  <li><strong>Organize your bar:</strong> Place your most-used skills in easily accessible slots</li>
                  <li><strong>Read the details:</strong> Always check a skill&apos;s details before adding it to your build</li>
                  <li><strong>Plan your Chain Skills:</strong> Create logical combos to optimize your rotation</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">⌨️ Shortcuts and Interactions</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
                  <li><strong>Double-click:</strong> Click twice on a skill to quickly select it for the shortcut bar</li>
                  <li><strong>Drag &amp; Drop:</strong> Drag and drop to quickly organize your bar</li>
                  <li><strong>+/- Buttons:</strong> Use the green (+) and red (-) buttons to quickly adjust levels</li>
                  <li><strong>Reset:</strong> The Reset button completely removes a skill from the build</li>
                  <li><strong>Reset Shortcuts:</strong> Clears the entire shortcut bar (except the reserved slot)</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">🎯 Best Practices</h3>
                <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4">
                  <li>Start by adding your main skills before configuring specialties</li>
                  <li>Check level requirements before activating a specialty</li>
                  <li>Organize your shortcut bar logically (combat skills together, etc.)</li>
                  <li>Test different builds to find the one that matches your playstyle</li>
                  <li>Share your successful builds with the community</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center space-y-4 pt-8 border-t border-foreground/20">
          <p className="text-foreground/70">
            Need additional help? Feel free to check out other community builds for inspiration!
          </p>
          <div className="flex gap-4 justify-center">
            <Link 
              href="/classes" 
              className="px-4 py-2 bg-background/50 border-y-2 border-foreground/30 hover:border-primary transition-colors text-foreground uppercase font-bold"
            >
              Explore Classes
            </Link>
            <Link 
              href="/morebuild" 
              className="px-4 py-2 bg-background/50 border-y-2 border-foreground/30 hover:border-primary transition-colors text-foreground uppercase font-bold"
            >
              View Builds
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
