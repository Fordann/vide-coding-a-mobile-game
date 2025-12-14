/**
 * Core types and enums for the hardcore economy game
 */

export interface Resources {
  gold: number;
  information: number;
  influence: number;
  faith: number;
}

export enum UnitType {
  SCOUT = 'SCOUT',
  TRADER = 'TRADER',
  DIPLOMAT = 'DIPLOMAT',
  ENFORCER = 'ENFORCER'
}

export enum TraitType {
  VETERAN = 'VETERAN',
  GREEDY = 'GREEDY',
  LOYAL = 'LOYAL',
  COWARD = 'COWARD',
  BRAVE = 'BRAVE',
  ELOQUENT = 'ELOQUENT',
  INTIMIDATING = 'INTIMIDATING',
  QUICK = 'QUICK',
  RESILIENT = 'RESILIENT'
}

export enum MissionType {
  ESCORT_CONVOY = 'ESCORT_CONVOY',
  SCOUT_ROUTE = 'SCOUT_ROUTE',
  NEGOTIATE_TREATY = 'NEGOTIATE_TREATY',
  ENFORCE_TAX = 'ENFORCE_TAX',
  RAID_CARAVAN = 'RAID_CARAVAN',
  GATHER_INTELLIGENCE = 'GATHER_INTELLIGENCE'
}

export enum RouteType {
  FAST = 'FAST',
  SAFE = 'SAFE',
  BALANCED = 'BALANCED'
}

export enum MissionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  PARTIAL_SUCCESS = 'PARTIAL_SUCCESS',
  FAILURE = 'FAILURE'
}

export enum UnitStatus {
  READY = 'READY',
  ON_MISSION = 'ON_MISSION',
  WOUNDED = 'WOUNDED',
  FATIGUED = 'FATIGUED',
  DEAD = 'DEAD'
}

export interface Trait {
  type: TraitType;
  powerModifier: number;
  synergyWith?: TraitType[];
  defenseBonus?: number;
  description: string;
}

export interface Equipment {
  name: string;
  powerBonus: number;
  defenseBonus: number;
  cost: number;
}

export interface Skill {
  combat: number;
  diplomacy: number;
  stealth: number;
  trade: number;
}
