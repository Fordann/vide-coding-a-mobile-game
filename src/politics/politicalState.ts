/**
 * Political system - Rebellion, Faith, Influence
 */

import { Unit } from '../troops/unit';

export enum GameEndReason {
  REBELLION = 'REBELLION',
  BANKRUPTCY = 'BANKRUPTCY',
  LOSS_OF_LEGITIMACY = 'LOSS_OF_LEGITIMACY',
  ASSASSINATION = 'ASSASSINATION',
  VICTORY = 'VICTORY'
}

export class PoliticalState {
  rebellionRisk: number; // 0-100, game over at 100
  faith: number; // 0-100
  influence: number; // 0-100

  private deathCount: number;
  private underPaymentCount: number;

  constructor(initialFaith: number = 100, initialInfluence: number = 50) {
    this.rebellionRisk = 0;
    this.faith = initialFaith;
    this.influence = initialInfluence;
    this.deathCount = 0;
    this.underPaymentCount = 0;
  }

  /**
   * Apply consequences of unit death
   * Formula:
   * RebellionRisk += 1 + UnitImportance
   * Influence -= UnitRank
   * Faith -= 0.5
   */
  handleUnitDeath(unit: Unit): void {
    this.rebellionRisk += 1 + unit.importance;
    this.influence = Math.max(0, this.influence - unit.rank);
    this.faith = Math.max(0, this.faith - 0.5);
    this.deathCount++;

    // Additional rebellion risk if too many deaths
    if (this.deathCount > 10) {
      this.rebellionRisk += (this.deathCount - 10) * 0.5;
    }
  }

  /**
   * Apply consequences of under-payment
   * Formula:
   * RebellionRisk += (ExpectedWage - WagePaid) * 0.2
   */
  handleUnderPayment(expectedWage: number, paidWage: number): void {
    if (paidWage < expectedWage) {
      const deficit = expectedWage - paidWage;
      this.rebellionRisk += deficit * 0.2;
      this.underPaymentCount++;

      // Repeated under-payment is worse
      if (this.underPaymentCount > 5) {
        this.rebellionRisk += (this.underPaymentCount - 5) * 0.5;
      }
    }
  }

  /**
   * Apply mission success/failure consequences
   */
  applyMissionOutcome(faithChange: number, influenceChange: number): void {
    this.faith = Math.max(0, Math.min(100, this.faith + faithChange));
    this.influence = Math.max(0, Math.min(100, this.influence + influenceChange));

    // Low faith increases rebellion risk
    if (this.faith < 30) {
      this.rebellionRisk += 0.5;
    }

    // Low influence increases rebellion risk
    if (this.influence < 20) {
      this.rebellionRisk += 1;
    }
  }

  /**
   * Reduce rebellion risk (through diplomatic actions, successful missions, etc.)
   */
  reduceRebellionRisk(amount: number): void {
    this.rebellionRisk = Math.max(0, this.rebellionRisk - amount);
  }

  /**
   * Increase faith (through religious missions, moral actions)
   */
  increaseFaith(amount: number): void {
    this.faith = Math.min(100, this.faith + amount);
  }

  /**
   * Increase influence (through successful diplomacy, shows of strength)
   */
  increaseInfluence(amount: number): void {
    this.influence = Math.min(100, this.influence + amount);
  }

  /**
   * Check if game is lost
   */
  checkGameOver(): GameEndReason | null {
    // Rebellion
    if (this.rebellionRisk >= 100) {
      return GameEndReason.REBELLION;
    }

    // Loss of legitimacy (both faith and influence too low)
    if (this.faith <= 0 && this.influence <= 0) {
      return GameEndReason.LOSS_OF_LEGITIMACY;
    }

    // Assassination risk (very high rebellion + low faith)
    if (this.rebellionRisk >= 80 && this.faith < 20) {
      return GameEndReason.ASSASSINATION;
    }

    return null;
  }

  /**
   * Get political stability score (0-100)
   */
  getStabilityScore(): number {
    const avgLegitimacy = (this.faith + this.influence) / 2;
    const stability = avgLegitimacy - this.rebellionRisk;
    return Math.max(0, Math.min(100, stability));
  }

  /**
   * Get status description
   */
  getStatus(): string {
    const stability = this.getStabilityScore();

    if (stability > 70) {
      return 'Stable - The realm is secure and prosperous';
    } else if (stability > 50) {
      return 'Cautious - Some unrest, but manageable';
    } else if (stability > 30) {
      return 'Unstable - Serious threats to your rule';
    } else if (stability > 10) {
      return 'Crisis - The realm teeters on the brink';
    } else {
      return 'Catastrophic - Rebellion imminent';
    }
  }

  /**
   * Get full state
   */
  getState(): {
    rebellionRisk: number;
    faith: number;
    influence: number;
    stability: number;
    status: string;
    deathCount: number;
  } {
    return {
      rebellionRisk: this.rebellionRisk,
      faith: this.faith,
      influence: this.influence,
      stability: this.getStabilityScore(),
      status: this.getStatus(),
      deathCount: this.deathCount
    };
  }
}
