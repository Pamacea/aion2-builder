# Structure modulaire des classes

Ce dossier contient les données de chaque classe dans des fichiers séparés pour faciliter la maintenance et éviter un fichier monolithique.

## Structure

```
src/data/classes/
├── index.ts          # Export central de toutes les classes
├── types.ts          # Définitions TypeScript pour les données de classe
├── cleric.ts         # Données de la classe Cleric
├── gladiator.ts      # Données de la classe Gladiator
├── templar.ts        # Données de la classe Templar
├── assassin.ts       # Données de la classe Assassin
├── ranger.ts         # Données de la classe Ranger
├── sorcerer.ts       # Données de la classe Sorcerer
├── elementalist.ts   # Données de la classe Elementalist
└── chanter.ts        # Données de la classe Chanter
```

## Ajouter une nouvelle classe

1. Créer un nouveau fichier `src/data/classes/nom-classe.ts`
2. Importer le type `ClassData` depuis `./types`
3. Exporter une constante `nomClasseData: ClassData`
4. Ajouter l'import et l'export dans `index.ts`

Exemple :

```typescript
// src/data/classes/nouvelle-classe.ts
import type { ClassData } from "./types";

export const nouvelleClasseData: ClassData = {
  name: "nouvelle-classe",
  iconUrl: "nouvelle-classe-icon.webp",
  bannerUrl: "nouvelle-classe-banner.webp",
  characterURL: "nouvelle-classe-character.webp",
  description: "Description de la classe",
  tags: ["tag1", "tag2"],
  abilities: [
    // ... vos abilities
  ],
  passives: [
    // ... vos passives
  ],
  stigmas: [
    // ... vos stigmas
  ],
};
```

Puis dans `index.ts` :

```typescript
import { nouvelleClasseData } from "./nouvelle-classe";

export const classesData = [
  // ... autres classes
  nouvelleClasseData,
];

export {
  // ... autres exports
  nouvelleClasseData,
};
```

## Utilisation

Le fichier `src/data/classes.ts` réexporte `classesData` pour maintenir la compatibilité avec le code existant :

```typescript
import { classesData } from "data/classes";
// ou
import { classesData } from "data/classes/index";
// ou pour une classe spécifique
import { clericData } from "data/classes/index";
```

## Avantages

- ✅ **Maintenabilité** : Chaque classe dans son propre fichier
- ✅ **Organisation** : Structure claire et modulaire
- ✅ **Évolutivité** : Facile d'ajouter de nouvelles classes
- ✅ **Compatibilité** : L'ancien import `from "data/classes"` fonctionne toujours
- ✅ **Type safety** : Types TypeScript pour toutes les structures de données

