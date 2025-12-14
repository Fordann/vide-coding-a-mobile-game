/**
 * Unit class representing individual troops
 */

import { UnitType, UnitStatus, TraitType, Skill, Equipment } from '../core/types';

export class Unit {
  id: string;
  name: string;
  type: UnitType;
  status: UnitStatus;
  skills: Skill;
  traits: TraitType[];
  loyalty: number;
  fatigue: number;
  expectedWage: number;
  lastPaidWage: number;
  equipment: Equipment[];
  rank: number; // 1-5, affects political consequences
  importance: number; // 1-10, affects rebellion risk

  constructor(
    id: string,
    name: string,
    type: UnitType,
    skills: Skill,
    traits: TraitType[],
    expectedWage: number,
    rank: number = 1,
    importance: number = 1
  ) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.status = UnitStatus.READY;
    this.skills = skills;
    this.traits = traits;
    this.loyalty = 50; // 0-100
    this.fatigue = 0; // 0-100
    this.expectedWage = expectedWage;
    this.lastPaidWage = 0;
    this.equipment = [];
    this.rank = rank;
    this.importance = importance;
  }

  /**
   * Calculate total skill score for mission
   */
  getSkillScore(missionType: string): number {
    let score = 0;

    switch (this.type) {
      case UnitType.SCOUT:
        score = this.skills.stealth * 2 + this.skills.combat;
        break;
      case UnitType.TRADER:
        score = this.skills.trade * 2 + this.skills.diplomacy;
        break;
      case UnitType.DIPLOMAT:
        score = this.skills.diplomacy * 2 + this.skills.trade;
        break;
      case UnitType.ENFORCER:
        score = this.skills.combat * 2 + this.skills.stealth;
        break;
    }

    return score;
  }

  /**
   * Pay wage and update loyalty
   */
  payWage(amount: number): void {
    this.lastPaidWage = amount;

    if (amount >= this.expectedWage) {
      this.loyalty = Math.min(100, this.loyalty + 5);
    } else {
      const deficit = this.expectedWage - amount;
      this.loyalty = Math.max(0, this.loyalty - deficit * 0.5);
    }
  }

  /**
   * Add fatigue after mission
   */
  addFatigue(amount: number): void {
    this.fatigue = Math.min(100, this.fatigue + amount);
  }

  /**
   * Rest to reduce fatigue
   */
  rest(): void {
    this.fatigue = Math.max(0, this.fatigue - 20);
  }

  /**
   * Equip item
   */
  equip(equipment: Equipment): void {
    this.equipment.push(equipment);
  }

  /**
   * Get total equipment power bonus
   */
  getEquipmentPowerBonus(): number {
    return this.equipment.reduce((sum, eq) => sum + eq.powerBonus, 0);
  }

  /**
   * Get total equipment defense bonus
   */
  getEquipmentDefenseBonus(): number {
    return this.equipment.reduce((sum, eq) => sum + eq.defenseBonus, 0);
  }

  /**
   * Mark as wounded
   */
  wound(): void {
    this.status = UnitStatus.WOUNDED;
    this.fatigue = Math.min(100, this.fatigue + 30);
  }

  /**
   * Kill unit (permanent)
   */
  kill(): void {
    this.status = UnitStatus.DEAD;
  }

  /**
   * Check if available for mission
   */
  isAvailable(): boolean {
    return this.status === UnitStatus.READY || this.status === UnitStatus.FATIGUED;
  }
}
