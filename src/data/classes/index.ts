// Central export file for all class data
// This allows easy addition of new classes without modifying the main classes.ts file

import { assassinData } from "./assassin";
import { chanterData } from "./chanter";
import { clericData } from "./cleric";
import { elementalistData } from "./elementalist";
import { gladiatorData } from "./gladiator";
import { rangerData } from "./ranger";
import { sorcererData } from "./sorcerer";
import { templarData } from "./templar";

export const classesData = [
  gladiatorData,
  templarData,
  assassinData,
  rangerData,
  sorcererData,
  elementalistData,
  clericData,
  chanterData,
];

// Export individual class data for direct imports if needed
export {
    assassinData,
    chanterData,
    clericData,
    elementalistData,
    gladiatorData,
    rangerData,
    sorcererData,
    templarData
};

