import { classesData } from "./classes";

export const buildsData = classesData.map((c) => ({
  name: `${c.name}-starter-build`,
  className: c.name,
  baseSP: 231,
  extraSP: 0,
  baseSTP: 40,
  extraSTP: 0,
  abilities: [],
  passives: [],  
  stigmas: [],   
}));
