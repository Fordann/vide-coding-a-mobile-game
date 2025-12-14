/**
 * Troop roster management
 */

import { Unit } from './unit';
import { UnitType, UnitStatus, TraitType, Skill } from '../core/types';

export class TroopRoster {
  private units: Map<string, Unit>;
  private nextId: number;

  constructor() {
    this.units = new Map();
    this.nextId = 1;
  }

  /**
   * Recruit new unit
   */
  recruit(
    name: string,
    type: UnitType,
    skills: Skill,
    traits: TraitType[],
    expectedWage: number,
    rank: number = 1,
    importance: number = 1
  ): Unit {
    const id = `unit_${this.nextId++}`;
    const unit = new Unit(id, name, type, skills, traits, expectedWage, rank, importance);
    this.units.set(id, unit);
    return unit;
  }

  /**
   * Get unit by ID
   */
  getUnit(id: string): Unit | undefined {
    return this.units.get(id);
  }

  /**
   * Get all units
   */
  getAllUnits(): Unit[] {
    return Array.from(this.units.values());
  }

  /**
   * Get available units (not on mission, not dead)
   */
  getAvailableUnits(): Unit[] {
    return this.getAllUnits().filter(u => u.isAvailable());
  }

  /**
   * Get units by type
   */
  getUnitsByType(type: UnitType): Unit[] {
    return this.getAllUnits().filter(u => u.type === type);
  }

  /**
   * Get living units
   */
  getLivingUnits(): Unit[] {
    return this.getAllUnits().filter(u => u.status !== UnitStatus.DEAD);
  }

  /**
   * Get dead units
   */
  getDeadUnits(): Unit[] {
    return this.getAllUnits().filter(u => u.status === UnitStatus.DEAD);
  }

  /**
   * Remove dead units from roster (permanent)
   */
  removeDeadUnits(): void {
    for (const [id, unit] of this.units.entries()) {
      if (unit.status === UnitStatus.DEAD) {
        this.units.delete(id);
      }
    }
  }

  /**
   * Get total roster size
   */
  getTotalCount(): number {
    return this.units.size;
  }

  /**
   * Get count of living units
   */
  getLivingCount(): number {
    return this.getLivingUnits().length;
  }
}
