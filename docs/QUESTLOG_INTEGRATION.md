# Questlog Skillbuilder Data Integration

## Overview
This document describes the integration of Questlog API skillbuilder data into the Aion2Builder database.

## What Was Done

### 1. API Data Analysis
- Analyzed the Questlog skillbuilder API response (`questlog-api/skillbuilder.json`)
- Extracted skill data including per-level stats for all classes
- Identified data structure: abilities, passives, and stigmas with level-specific damage values

### 2. Type System Updates
Updated `src/data/classes/types.ts` to support per-level data:
- Added `SkillLevel` interface with `level`, `minValue`, and `maxValue` fields
- Added optional `levels?: SkillLevel[]` to `AbilityData`, `PassiveData`, and `StigmaData`
- Added optional `id?: string` field to match skills by Questlog ID

### 3. Data Conversion Scripts
Created three conversion scripts in `scripts/`:

#### `parse-skillbuilder.js`
Initial exploration script to understand the API data structure.

#### `convert-skillbuilder-data.js`
Main conversion script that:
- Parses the Questlog API JSON
- Extracts skills by class (gladiator, templar, assassin, ranger, sorcerer, elementalist, cleric, chanter)
- Converts skills to our data format
- Extracts per-level damage modifiers from placeholder data
- Outputs to `src/data/questlog-skills.json`

#### `merge-questlog-data.js`
Merges converted data into TypeScript class files:
- Creates `.questlog.ts` files for each class
- Preserves all level data in the `levels` array
- Ready for integration with existing class data

### 4. Generated Files
Created 8 new files in `src/data/classes/`:
- `gladiator.questlog.ts`
- `templar.questlog.ts`
- `assassin.questlog.ts`
- `ranger.questlog.ts`
- `sorcerer.questlog.ts`
- `elementalist.questlog.ts`
- `cleric.questlog.ts`
- `chanter.questlog.ts`

Each file contains:
- 12 abilities with per-level stats
- 10 passives with per-level stats
- 12 stigmas with per-level stats

### 5. Data Structure
Each skill now includes:
```typescript
{
  id: string,              // Questlog skill ID
  name: string,
  iconUrl: string,
  description: string,
  damageMin: number,       // Base damage at level 1
  damageMax: number,       // Base damage at level 1
  damageMinModifiers: number[],  // Per-level min damage
  damageMaxModifiers: number[],  // Per-level max damage
  levels: SkillLevel[],    // Full level data {level, minValue, maxValue}
  // ... other stats
}
```

## Integration Strategy

### Option 1: Direct Replacement (Fastest)
1. Copy descriptions and tags from existing class files
2. Replace current `.ts` files with `.questlog.ts` files
3. Update imports and exports

### Option 2: Gradual Migration (Safer)
1. Create utility functions to merge data by ID
2. Keep existing files as base
3. Override with Questlog data where available
4. Test incrementally

### Option 3: Parallel Storage (Most Flexible)
1. Keep existing structure
2. Add Questlog data as separate export
3. Use Questlog data when level-specific stats needed
4. Fall back to existing data for compatibility

## Benefits

1. **Per-Level Accuracy**: Every skill now has exact damage values for each level
2. **Complete Coverage**: All 8 classes with all skills documented
3. **Consistent Data**: Single source of truth from official Questlog API
4. **Type Safety**: Full TypeScript support with proper interfaces
5. **Future-Proof**: Easy to update when API changes

## Next Steps

1. **Review Generated Files**: Check `.questlog.ts` files for accuracy
2. **Add Missing Metadata**: Copy descriptions, tags from existing files
3. **Update Utilities**: Modify skill calculation utilities to use level data
4. **Test Integration**: Verify stat calculations work with new data
5. **Deploy**: Replace existing files or implement merge strategy

## Files Modified

- `src/data/classes/types.ts` - Added SkillLevel interface and levels fields
- `src/data/classes/*.questlog.ts` - 8 new class data files (generated)
- `scripts/convert-skillbuilder-data.js` - Conversion script
- `scripts/merge-questlog-data.js` - Merge script
- `scripts/parse-skillbuilder.js` - Exploration script
- `src/data/questlog-skills.json` - Intermediate JSON data

## Data Coverage

| Class | Abilities | Passives | Stigmas | Total Levels |
|-------|-----------|----------|---------|--------------|
| Gladiator | 12 | 10 | 12 | 34 skills × ~60 levels |
| Templar | 12 | 10 | 12 | 34 skills × ~60 levels |
| Assassin | 12 | 10 | 12 | 34 skills × ~60 levels |
| Ranger | 12 | 10 | 12 | 34 skills × ~60 levels |
| Sorcerer | 12 | 10 | 12 | 34 skills × ~60 levels |
| Elementalist | 12 | 10 | 12 | 34 skills × ~60 levels |
| Cleric | 12 | 10 | 12 | 34 skills × ~60 levels |
| Chanter | 12 | 10 | 12 | 34 skills × ~60 levels |

**Total: 272 skills with complete per-level statistics**
