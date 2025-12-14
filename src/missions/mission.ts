/**
 * Mission system with deterministic outcomes
 */

import { MissionType, MissionStatus, RouteType, Resources } from '../core/types';
import { Unit } from '../troops/unit';
import { calculateSynergyBonus, calculateTraitPowerModifier, calculateTraitDefenseBonus } from '../troops/traits';

export interface MissionDefinition {
  id: string;
  type: MissionType;
  name: string;
  description: string;
  trueRiskScore: number; // Hidden unless player has enough information
  infoRequirement: number; // Information needed to see true risk
  baseReward: Resources;
  duration: number; // seconds
  allowedRoutes: RouteType[];
}

export interface MissionOutcome {
  status: MissionStatus;
  outcomeScore: number;
  rewards: Resources;
  casualties: string[]; // unit IDs that died
  wounded: string[]; // unit IDs that were wounded
  message: string;
}

export class Mission {
  definition: MissionDefinition;
  squad: Unit[];
  route: RouteType;
  wagesPaid: Map<string, number>; // unit ID -> wage paid
  status: MissionStatus;
  startTime: number;
  playerInformation: number;

  constructor(
    definition: MissionDefinition,
    squad: Unit[],
    route: RouteType,
    wagesPaid: Map<string, number>,
    playerInformation: number
  ) {
    this.definition = definition;
    this.squad = squad;
    this.route = route;
    this.wagesPaid = wagesPaid;
    this.status = MissionStatus.PENDING;
    this.startTime = 0;
    this.playerInformation = playerInformation;
  }

  /**
   * Get visible risk based on player information
   * VisibleRisk = TrueRiskScore ± FogOfWar
   * FogOfWar = max(0, MissionInfoRequirement - PlayerInformation)
   */
  getVisibleRisk(): { visible: number; exact: boolean } {
    const fogOfWar = Math.max(0, this.definition.infoRequirement - this.playerInformation);

    if (fogOfWar === 0) {
      return { visible: this.definition.trueRiskScore, exact: true };
    }

    // Add uncertainty range
    const uncertainty = fogOfWar * 0.5;
    return {
      visible: this.definition.trueRiskScore,
      exact: false
    };
  }

  /**
   * Calculate squad power using deterministic formula:
   * SquadPower = Σ(SkillScore) * (1 + ΣSynergyBonus + ΣTraitBonus) * WageModifier * FatigueModifier
   */
  calculateSquadPower(): number {
    let totalSkillScore = 0;
    let totalSynergyBonus = 0;
    let totalTraitPowerMod = 1;

    const allTraits = this.squad.flatMap(u => u.traits);
    totalSynergyBonus = calculateSynergyBonus(allTraits);

    for (const unit of this.squad) {
      // Skill score
      totalSkillScore += unit.getSkillScore(this.definition.type);

      // Trait power modifier
      const traitMod = calculateTraitPowerModifier(unit.traits);
      totalTraitPowerMod *= traitMod;

      // Equipment bonus
      totalSkillScore += unit.getEquipmentPowerBonus();
    }

    // Wage modifier
    let wageModifier = 1;
    for (const unit of this.squad) {
      const paidWage = this.wagesPaid.get(unit.id) || 0;
      const expected = unit.expectedWage;

      if (paidWage < expected) {
        wageModifier *= 1 - 0.1 * ((expected - paidWage) / expected);
      }
    }

    // Fatigue modifier
    const avgFatigue = this.squad.reduce((sum, u) => sum + u.fatigue, 0) / this.squad.length;
    const fatigueModifier = 1 - avgFatigue * 0.05;

    // Wounded penalty
    let woundedModifier = 1;
    for (const unit of this.squad) {
      if (unit.status === 'WOUNDED') {
        woundedModifier *= 0.8;
      }
    }

    // Route modifier
    let routeModifier = 1;
    switch (this.route) {
      case RouteType.FAST:
        routeModifier = 0.9; // -10% power but faster
        break;
      case RouteType.SAFE:
        routeModifier = 1.1; // +10% power but slower
        break;
      case RouteType.BALANCED:
        routeModifier = 1.0;
        break;
    }

    const squadPower =
      totalSkillScore *
      (1 + totalSynergyBonus) *
      totalTraitPowerMod *
      wageModifier *
      fatigueModifier *
      woundedModifier *
      routeModifier;

    return squadPower;
  }

  /**
   * Start mission
   */
  start(): void {
    this.status = MissionStatus.IN_PROGRESS;
    this.startTime = Date.now();

    for (const unit of this.squad) {
      unit.status = 'ON_MISSION';
    }
  }

  /**
   * Resolve mission with deterministic outcomes
   */
  resolve(): MissionOutcome {
    const squadPower = this.calculateSquadPower();
    const trueRisk = this.definition.trueRiskScore;

    // OutcomeScore = SquadPower - TrueRiskScore
    const outcomeScore = squadPower - trueRisk;

    const casualties: string[] = [];
    const wounded: string[] = [];
    let rewards = { ...this.definition.baseReward };
    let status: MissionStatus;
    let message = '';

    // Determine outcome
    if (outcomeScore >= 20) {
      // Great success
      status = MissionStatus.SUCCESS;
      rewards.gold *= 1.5;
      rewards.information = (rewards.information || 0) + 5;
      message = `Mission succeeded brilliantly! Outcome: ${outcomeScore.toFixed(1)}`;
    } else if (outcomeScore >= 0) {
      // Success
      status = MissionStatus.SUCCESS;
      message = `Mission succeeded. Outcome: ${outcomeScore.toFixed(1)}`;
    } else if (outcomeScore >= -10) {
      // Partial success with casualties
      status = MissionStatus.PARTIAL_SUCCESS;
      rewards.gold *= 0.5;

      // Determine casualties
      for (const unit of this.squad) {
        const unitDefense = calculateTraitDefenseBonus(unit.traits) + unit.getEquipmentDefenseBonus();
        const survivalScore = unit.getSkillScore(this.definition.type) + unit.loyalty + unitDefense;

        // DeathThreshold = OutcomeScore vs UnitSkill + Loyalty + TraitDefense
        const deathRoll = Math.abs(outcomeScore) - survivalScore;

        if (deathRoll > 10) {
          casualties.push(unit.id);
          unit.kill();
        } else if (deathRoll > 0) {
          wounded.push(unit.id);
          unit.wound();
        }
      }

      message = `Mission partially succeeded. ${casualties.length} died, ${wounded.length} wounded. Outcome: ${outcomeScore.toFixed(1)}`;
    } else {
      // Failure with heavy casualties
      status = MissionStatus.FAILURE;
      rewards = { gold: 0, information: 0, influence: 0, faith: 0 };

      // Heavy casualties
      for (const unit of this.squad) {
        const unitDefense = calculateTraitDefenseBonus(unit.traits) + unit.getEquipmentDefenseBonus();
        const survivalScore = unit.getSkillScore(this.definition.type) + unit.loyalty + unitDefense;

        const deathRoll = Math.abs(outcomeScore) - survivalScore;

        if (deathRoll > 5) {
          casualties.push(unit.id);
          unit.kill();
        } else {
          wounded.push(unit.id);
          unit.wound();
        }
      }

      message = `Mission failed catastrophically. ${casualties.length} died, ${wounded.length} wounded. Outcome: ${outcomeScore.toFixed(1)}`;
    }

    // Add fatigue to survivors
    for (const unit of this.squad) {
      if (unit.status !== 'DEAD') {
        unit.addFatigue(10);
        unit.status = unit.status === 'WOUNDED' ? 'WOUNDED' : 'READY';
      }
    }

    this.status = status;

    return {
      status,
      outcomeScore,
      rewards,
      casualties,
      wounded,
      message
    };
  }

  /**
   * Check if mission is complete (based on duration)
   */
  isComplete(): boolean {
    if (this.status !== MissionStatus.IN_PROGRESS) {
      return false;
    }

    const elapsed = (Date.now() - this.startTime) / 1000;
    let duration = this.definition.duration;

    // Route affects duration
    if (this.route === RouteType.FAST) {
      duration *= 0.7;
    } else if (this.route === RouteType.SAFE) {
      duration *= 1.3;
    }

    return elapsed >= duration;
  }
}
