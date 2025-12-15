
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