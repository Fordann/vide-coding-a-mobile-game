/**
 * Mission manager - handles multiple simultaneous missions
 */

import { Mission, MissionDefinition, MissionOutcome } from './mission';
import { Unit } from '../troops/unit';
import { RouteType, MissionStatus } from '../core/types';

export class MissionManager {
  private missions: Map<string, Mission>;
  private completedMissions: Map<string, MissionOutcome>;
  private nextMissionId: number;

  constructor() {
    this.missions = new Map();
    this.completedMissions = new Map();
    this.nextMissionId = 1;
  }

  /**
   * Create and start a new mission
   */
  createMission(
    definition: MissionDefinition,
    squad: Unit[],
    route: RouteType,
    wagesPaid: Map<string, number>,
    playerInformation: number
  ): string {
    const id = `mission_${this.nextMissionId++}`;
    const mission = new Mission(definition, squad, route, wagesPaid, playerInformation);
    mission.start();
    this.missions.set(id, mission);
    return id;
  }

  /**
   * Get active missions
   */
  getActiveMissions(): Mission[] {
    return Array.from(this.missions.values()).filter(
      m => m.status === MissionStatus.IN_PROGRESS || m.status === MissionStatus.PENDING
    );
  }

  /**
   * Get mission by ID
   */
  getMission(id: string): Mission | undefined {
    return this.missions.get(id);
  }

  /**
   * Update all missions (check for completion)
   */
  tick(): MissionOutcome[] {
    const outcomes: MissionOutcome[] = [];

    for (const [id, mission] of this.missions.entries()) {
      if (mission.status === MissionStatus.IN_PROGRESS && mission.isComplete()) {
        const outcome = mission.resolve();
        this.completedMissions.set(id, outcome);
        outcomes.push(outcome);
      }
    }

    return outcomes;
  }

  /**
   * Get count of active missions
   */
  getActiveMissionCount(): number {
    return this.getActiveMissions().length;
  }

  /**
   * Check if can start more missions (max 3 simultaneous)
   */
  canStartMission(): boolean {
    return this.getActiveMissionCount() < 3;
  }

  /**
   * Get completed mission outcomes
   */
  getCompletedOutcomes(): Map<string, MissionOutcome> {
    return new Map(this.completedMissions);
  }

  /**
   * Clear completed missions history
   */
  clearCompleted(): void {
    this.completedMissions.clear();
  }
}
