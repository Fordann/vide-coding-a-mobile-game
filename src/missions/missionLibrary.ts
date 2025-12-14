/**
 * Predefined missions for the game
 */

import { MissionDefinition } from './mission';
import { MissionType, RouteType } from '../core/types';

export const MISSION_LIBRARY: Record<string, MissionDefinition> = {
  escort_convoy_tutorial: {
    id: 'escort_convoy_tutorial',
    type: MissionType.ESCORT_CONVOY,
    name: 'Escort Merchant Convoy (Tutorial)',
    description: 'A simple escort mission to learn the basics. Low risk, moderate reward.',
    trueRiskScore: 20,
    infoRequirement: 0,
    baseReward: {
      gold: 100,
      information: 2,
      influence: 5,
      faith: 0
    },
    duration: 30,
    allowedRoutes: [RouteType.FAST, RouteType.SAFE, RouteType.BALANCED]
  },

  scout_mountain_pass: {
    id: 'scout_mountain_pass',
    type: MissionType.SCOUT_ROUTE,
    name: 'Scout Mountain Pass',
    description: 'Scout a dangerous mountain pass. Requires stealth and survival skills.',
    trueRiskScore: 35,
    infoRequirement: 10,
    baseReward: {
      gold: 50,
      information: 15,
      influence: 0,
      faith: 0
    },
    duration: 45,
    allowedRoutes: [RouteType.SAFE, RouteType.BALANCED]
  },

  negotiate_trade_treaty: {
    id: 'negotiate_trade_treaty',
    type: MissionType.NEGOTIATE_TREATY,
    name: 'Negotiate Trade Treaty',
    description: 'Diplomatic mission to secure favorable trade terms.',
    trueRiskScore: 25,
    infoRequirement: 5,
    baseReward: {
      gold: 0,
      information: 5,
      influence: 20,
      faith: 10
    },
    duration: 60,
    allowedRoutes: [RouteType.BALANCED]
  },

  enforce_tax_collection: {
    id: 'enforce_tax_collection',
    type: MissionType.ENFORCE_TAX,
    name: 'Enforce Tax Collection',
    description: 'Force a rebellious town to pay taxes. High risk of resistance.',
    trueRiskScore: 50,
    infoRequirement: 15,
    baseReward: {
      gold: 300,
      information: 0,
      influence: -10,
      faith: -5
    },
    duration: 90,
    allowedRoutes: [RouteType.FAST, RouteType.BALANCED]
  },

  raid_rival_caravan: {
    id: 'raid_rival_caravan',
    type: MissionType.RAID_CARAVAN,
    name: 'Raid Rival Caravan',
    description: 'Ambush and plunder a rival merchant convoy. Very risky, high reward.',
    trueRiskScore: 65,
    infoRequirement: 20,
    baseReward: {
      gold: 500,
      information: 0,
      influence: -20,
      faith: -15
    },
    duration: 120,
    allowedRoutes: [RouteType.FAST, RouteType.BALANCED]
  },

  gather_intelligence_network: {
    id: 'gather_intelligence_network',
    type: MissionType.GATHER_INTELLIGENCE,
    name: 'Establish Spy Network',
    description: 'Infiltrate enemy territory to gather intelligence.',
    trueRiskScore: 40,
    infoRequirement: 8,
    baseReward: {
      gold: 0,
      information: 30,
      influence: 5,
      faith: 0
    },
    duration: 180,
    allowedRoutes: [RouteType.SAFE, RouteType.BALANCED]
  },

  protect_pilgrimage: {
    id: 'protect_pilgrimage',
    type: MissionType.ESCORT_CONVOY,
    name: 'Protect Sacred Pilgrimage',
    description: 'Escort pilgrims to holy site. Boosts faith significantly.',
    trueRiskScore: 30,
    infoRequirement: 5,
    baseReward: {
      gold: 50,
      information: 0,
      influence: 10,
      faith: 25
    },
    duration: 75,
    allowedRoutes: [RouteType.SAFE, RouteType.BALANCED]
  }
};

/**
 * Get mission by ID
 */
export function getMissionDefinition(id: string): MissionDefinition | undefined {
  return MISSION_LIBRARY[id];
}

/**
 * Get all available missions
 */
export function getAllMissions(): MissionDefinition[] {
  return Object.values(MISSION_LIBRARY);
}

/**
 * Get missions by type
 */
export function getMissionsByType(type: MissionType): MissionDefinition[] {
  return Object.values(MISSION_LIBRARY).filter(m => m.type === type);
}
