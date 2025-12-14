/**
 * Resource management for player
 */

import { Resources } from '../core/types';

export class ResourceManager {
  private resources: Resources;

  constructor(initial: Resources = { gold: 1000, information: 10, influence: 50, faith: 100 }) {
    this.resources = { ...initial };
  }

  /**
   * Add resources
   */
  add(resource: keyof Resources, amount: number): void {
    this.resources[resource] += amount;
  }

  /**
   * Remove resources (returns true if successful, false if insufficient)
   */
  spend(resource: keyof Resources, amount: number): boolean {
    if (this.resources[resource] >= amount) {
      this.resources[resource] -= amount;
      return true;
    }
    return false;
  }

  /**
   * Check if can afford
   */
  canAfford(resource: keyof Resources, amount: number): boolean {
    return this.resources[resource] >= amount;
  }

  /**
   * Get current resources
   */
  get(): Resources {
    return { ...this.resources };
  }

  /**
   * Get specific resource amount
   */
  getAmount(resource: keyof Resources): number {
    return this.resources[resource];
  }

  /**
   * Set resource to specific value
   */
  set(resource: keyof Resources, amount: number): void {
    this.resources[resource] = amount;
  }

  /**
   * Check if bankrupt (no gold and cannot recover)
   */
  isBankrupt(): boolean {
    return this.resources.gold <= 0;
  }
}
