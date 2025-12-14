
// Structure: 20 slots (4x5) pour "Cast" à gauche, 10 slots (2x5) au milieu, 5 slots (1x5) à droite, 12 slots en bas
export const LEFT_SLOTS_COUNT = 20; // 4x5 grid
export const MIDDLE_SLOTS_COUNT = 10; // 2x5 grid
export const RIGHT_SLOTS_COUNT = 5; // 1x5 grid
export const BOTTOM_SLOTS_COUNT = 12; // 1x12 row
// Slot 11 (index 10) of Main Bar is reserved for the first ability
export const RESERVED_SLOT_ID = LEFT_SLOTS_COUNT + 10; // Slot 30 (index 10 of Main Bar)
// Slots 5-8 (indices 4-7) of Main Bar are reserved for stigmas only
export const STIGMA_SLOT_START = LEFT_SLOTS_COUNT + 4; // Slot 24 (index 4 of Main Bar)
export const STIGMA_SLOT_END = LEFT_SLOTS_COUNT + 7; // Slot 27 (index 7 of Main Bar)


