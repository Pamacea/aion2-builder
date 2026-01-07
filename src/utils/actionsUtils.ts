
// ======================================
// PRISMA INCLUDE HELPERS
// ======================================
export const classWithTags = { include: { tags: true } };

export const chainAbilityInclude = {
  include: {
    chainAbility: {
      include: {
        class: classWithTags,
        spellTag: true,
      },
    },
  },
};

export const chainStigmaInclude = {
  include: {
    chainStigma: {
      include: {
        spellTag: true,
        classes: classWithTags,
      },
    },
  },
};

export const abilityInclude = {
  include: {
    class: classWithTags,
    spellTag: true,
    specialtyChoices: true,
    parentAbilities: chainAbilityInclude,
  },
};

export const passiveInclude = {
  include: {
    class: classWithTags,
    spellTag: true,
  },
};

export const stigmaInclude = {
  include: {
    spellTag: true,
    specialtyChoices: true,
    parentStigmas: chainStigmaInclude,
  },
};

export const classInclude = {
  include: {
    tags: true,
    abilities: abilityInclude,
    passives: passiveInclude,
    stigmas: stigmaInclude,
  },
};

export const buildAbilityInclude = {
  include: {
    ability: {
      include: {
        class: classWithTags,
        spellTag: true,
        specialtyChoices: true,
        parentAbilities: chainAbilityInclude,
      },
    },
  },
};

export const buildPassiveInclude = {
  include: {
    passive: {
      include: {
        class: classWithTags,
        spellTag: true,
      },
    },
  },
};

export const buildStigmaInclude = {
  include: {
    stigma: {
      include: {
        spellTag: true,
        specialtyChoices: true,
        classes: classWithTags,
        chainSkills: chainStigmaInclude,
      },
    },
  },
};

export const fullBuildInclude = {
  class: classInclude,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  abilities: buildAbilityInclude,
  passives: buildPassiveInclude,
  stigmas: buildStigmaInclude,
  daevanion: true,
  likes: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  },
};

// ======================================
// OPTIMIZED BUILD INCLUDES
// ======================================
// Lightweight include for build listings (cards, tables)
// Only fetches essential fields for display
export const buildListingInclude = {
  class: {
    select: {
      id: true,
      name: true,
      icon: true,
    },
  },
  user: {
    select: {
      id: true,
      name: true,
      image: true,
    },
  },
  daevanion: true,
  _count: {
    select: {
      likes: true,
    },
  },
};

// Medium-weight include for build detail pages
// Fetches full skill data but not all users who liked
export const buildDetailInclude = {
  class: classInclude,
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  },
  abilities: buildAbilityInclude,
  passives: buildPassiveInclude,
  stigmas: buildStigmaInclude,
  daevanion: true,
  _count: {
    select: {
      likes: true,
    },
  },
};