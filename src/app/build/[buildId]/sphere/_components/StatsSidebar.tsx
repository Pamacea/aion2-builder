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
      <div className="shrink-0 pb-2 sm:pb-3 lg:pb-4">
        <Input
          type="text"
          placeholder="Search for stats.."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border-b-2 border-b-secondary hover:border-foreground transition-all"
        />
      </div>

      {/* Liste des stats */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-0 pr-1 sm:pr-2">
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
                <div key={group.id} className=" bg-background/80 overflow-hidden">
                  {/* En-tête du groupe */}
                  <button
                    onClick={() => toggleGroup(group.id)}
                    className="w-full flex justify-between items-center p-1.5 sm:p-2 hover:bg-secondary/30 transition-colors border-b-2 border-b-secondary"
                  >
                    <span className="text-xs sm:text-sm font-semibold uppercase">
                      {group.label} ({itemCount})
                    </span>
                    {isExpanded ? (
                      <ChevronUpIcon className="size-3 sm:size-4 text-muted-foreground" />
                    ) : (
                      <ChevronDownIcon className="size-3 sm:size-4 text-muted-foreground" />
                    )}
                  </button>

                  {/* Contenu du groupe */}
                  {isExpanded && (
                    <div className="space-y-1 px-1.5 sm:px-2 pb-1.5 sm:pb-2">
                      {items.map((item, index) => {
                        if (item.type === "skill" && item.skill) {
                          return (
                            <div
                              key={`${item.skill.type}-${item.skill.id}-${index}`}
                              className="flex justify-between items-center p-1.5 sm:p-2 bg-muted/50"
                            >
                              <span className="text-xs sm:text-sm font-medium truncate pr-2">
                                Skill Level Up - {item.skill.name}
                              </span>
                              <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">
                                {item.skill.type === "ability" ? "Ability" : "Passive"}
                              </span>
                            </div>
                          );
                        } else if (item.type === "stat" && item.stat) {
                          return (
                            <div
                              key={item.stat.key}
                              className="flex justify-between items-center p-1.5 sm:p-2 border-b border-b-foreground/10"
                            >
                              <span className="text-xs sm:text-sm font-medium uppercase truncate pr-2">
                                {item.stat.label}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-foreground/80 shrink-0">
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
