/**
 * Trait definitions and synergy system
 */

import { Trait, TraitType } from '../core/types';

export const TRAITS: Record<TraitType, Trait> = {
  [TraitType.VETERAN]: {
    type: TraitType.VETERAN,
    powerModifier: 1.2,
    synergyWith: [TraitType.BRAVE, TraitType.RESILIENT],
    defenseBonus: 2,
    description: 'Experienced fighter, +20% power, synergy with Brave/Resilient'
  },
  [TraitType.GREEDY]: {
    type: TraitType.GREEDY,
    powerModifier: 0.8,
    synergyWith: [TraitType.TRADER],
    defenseBonus: -1,
    description: 'Motivated by gold, -20% power unless overpaid, synergy with Trader'
  },
  [TraitType.LOYAL]: {
    type: TraitType.LOYAL,
    powerModifier: 1.1,
    synergyWith: [TraitType.BRAVE],
    defenseBonus: 3,
    description: 'Never deserts, +10% power, high defense bonus'
  },
  [TraitType.COWARD]: {
    type: TraitType.COWARD,
    powerModifier: 0.7,
    synergyWith: [],
    defenseBonus: -2,
    description: 'Flees easily, -30% power, negative defense'
  },
  [TraitType.BRAVE]: {
    type: TraitType.BRAVE,
    powerModifier: 1.15,
    synergyWith: [TraitType.VETERAN, TraitType.LOYAL],
    defenseBonus: 1,
    description: 'Courageous, +15% power, synergy with Veteran/Loyal'
  },
  [TraitType.ELOQUENT]: {
    type: TraitType.ELOQUENT,
    powerModifier: 1.0,
    synergyWith: [TraitType.DIPLOMAT],
    defenseBonus: 0,
    description: 'Persuasive, bonus to diplomatic missions'
  },
  [TraitType.INTIMIDATING]: {
    type: TraitType.INTIMIDATING,
    powerModifier: 1.1,
    synergyWith: [TraitType.ENFORCER],
    defenseBonus: 1,
    description: 'Feared, +10% power, synergy with Enforcer'
  },
  [TraitType.QUICK]: {
    type: TraitType.QUICK,
    powerModifier: 1.05,
    synergyWith: [TraitType.SCOUT],
    defenseBonus: 2,
    description: 'Fast, +5% power, high defense, synergy with Scout'
  },
  [TraitType.RESILIENT]: {
    type: TraitType.RESILIENT,
    powerModifier: 1.0,
    synergyWith: [TraitType.VETERAN],
    defenseBonus: 4,
    description: 'Tough, exceptional defense bonus'
  }
};

/**
 * Calculate synergy bonus for a group of traits
 */
export function calculateSynergyBonus(traits: TraitType[]): number {
  let bonus = 0;

  for (let i = 0; i < traits.length; i++) {
    const trait = TRAITS[traits[i]];
    if (trait.synergyWith) {
      for (let j = 0; j < traits.length; j++) {
        if (i !== j && trait.synergyWith.includes(traits[j])) {
          bonus += 0.1; // 10% bonus per synergy
        }
      }
    }
  }

  return bonus;
}

/**
 * Calculate total trait power modifier
 */
export function calculateTraitPowerModifier(traits: TraitType[]): number {
  let modifier = 1;

  for (const traitType of traits) {
    const trait = TRAITS[traitType];
    modifier *= trait.powerModifier;
  }

  return modifier;
}

/**
 * Calculate total trait defense bonus
 */
export function calculateTraitDefenseBonus(traits: TraitType[]): number {
  let bonus = 0;

  for (const traitType of traits) {
    const trait = TRAITS[traitType];
    if (trait.defenseBonus) {
      bonus += trait.defenseBonus;
    }
  }

  return bonus;
}
