"use client";

import { Input } from "@/components/ui/input";
import { StatsSidebarProps } from "@/types/daevanion.type";
import { organizeStatsIntoGroups, StatGroupType } from "@/utils/statsUtils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useMemo, useState } from "react";

export function StatsSidebar({ stats }: StatsSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Set<StatGroupType>>(
    new Set(["abilities", "passives", "critical", "general", "other"])
  );

  // Organiser les stats en groupes
  const { groups } = useMemo(
    () => organizeStatsIntoGroups(stats, searchQuery),
    [stats, searchQuery]
  );

  // Vérifier s'il y a des stats
  const hasStats = useMemo(() => {
    return (
      Object.entries(stats).some(([key, value]) => {
        if (key === "skillLevelUps") return false;
        return typeof value === "number" && value > 0;
      }) || stats.skillLevelUps.length > 0
    );
  }, [stats]);

  const toggleGroup = (groupId: StatGroupType) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Barre de recherche - Alignée avec les tabs */}
      <div className="shrink-0 pb-4">
        <Input
          type="text"
          placeholder="Search for stats.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-3 py-2 border-b-2 border-b-background/30 hover:border-foreground transition-all"
        />
      </div>

      {/* Liste des stats */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-2">
        {!hasStats && stats.skillLevelUps.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            None selected
          </div>
        ) : groups.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
            Not found
          </div>
        ) : (
          <div className="space-y-2 pb-2">
            {groups.map(({ group, items }) => {
              const isExpanded = expandedGroups.has(group.id);
              const itemCount = items.length;

              return (
                <div key={group.id} className="rounded-md bg-background/80 overflow-hidden">
                  {/* En-tête du groupe */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex justify-between items-center p-2 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm font-semibold uppercase">
                      {group.label} ({itemCount})
                    </span>
                    {isExpanded ? (
                      <ChevronUpIcon className="size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDownIcon className="size-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Contenu du groupe */}
                  {isExpanded && (
                    <div className="space-y-1 px-2 pb-2">
                      {items.map((item, index) => {
                        if (item.type === "skill" && item.skill) {
                          return (
                            <div
                              key={`${item.skill.type}-${item.skill.id}-${index}`}
                              className="flex justify-between items-center p-2 rounded-md bg-muted/50"
                            >
                              <span className="text-sm font-medium">
                                Skill Level Up - {item.skill.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {item.skill.type === "ability" ? "Ability" : "Passive"}
                              </span>
                            </div>
                          );
                        } else if (item.type === "stat" && item.stat) {
                          return (
                            <div
                              key={item.stat.key}
                              className="flex justify-between items-center p-2 border-b border-b-foreground/10"
                            >
                              <span className="text-sm font-medium uppercase">
                                {item.stat.label}
                              </span>
                              <span className="text-sm font-bold text-foreground/80">
                                {item.stat.value}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
