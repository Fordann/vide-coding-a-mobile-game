/**
 * Main game state orchestrating all systems
 */

import { Market } from '../economy/market';
import { ResourceManager } from '../economy/resources';
import { TroopRoster } from '../troops/roster';
import { MissionManager } from '../missions/missionManager';
import { PoliticalState, GameEndReason } from '../politics/politicalState';
import { UnitType, TraitType } from '../core/types';

export class GameState {
  market: Market;
  resources: ResourceManager;
  troops: TroopRoster;
  missions: MissionManager;
  politics: PoliticalState;

  turn: number;
  gameOver: boolean;
  gameEndReason: GameEndReason | null;
  victoryConditionMet: boolean;

  constructor() {
    this.market = new Market();
    this.resources = new ResourceManager();
    this.troops = new TroopRoster();
    this.missions = new MissionManager();
    this.politics = new PoliticalState();

    this.turn = 0;
    this.gameOver = false;
    this.gameEndReason = null;
    this.victoryConditionMet = false;
  }

  /**
   * Initialize game with starting units
   */
  initializeStartingRoster(): void {
    // Starting units for tutorial
    this.troops.recruit(
      'Gareth the Scout',
      UnitType.SCOUT,
      { combat: 5, diplomacy: 2, stealth: 8, trade: 3 },
      [TraitType.QUICK, TraitType.BRAVE],
      30,
      1,
      2
    );

    this.troops.recruit(
      'Marcus the Trader',
      UnitType.TRADER,
      { combat: 2, diplomacy: 6, stealth: 3, trade: 9 },
      [TraitType.ELOQUENT, TraitType.GREEDY],
      40,
      2,
      3
    );

    this.troops.recruit(
      'Elena the Diplomat',
      UnitType.DIPLOMAT,
      { combat: 1, diplomacy: 9, stealth: 4, trade: 7 },
      [TraitType.ELOQUENT, TraitType.LOYAL],
      50,
      3,
      4
    );

    this.troops.recruit(
      'Brutus the Enforcer',
      UnitType.ENFORCER,
      { combat: 9, diplomacy: 2, stealth: 5, trade: 1 },
      [TraitType.INTIMIDATING, TraitType.VETERAN],
      45,
      2,
      3
    );
  }

  /**
   * Game tick - update all systems
   */
  tick(): void {
    if (this.gameOver) {
      return;
    }

    this.turn++;

    // Update market
    this.market.tick();

    // Check for completed missions
    const outcomes = this.missions.tick();

    // Process mission outcomes
    for (const outcome of outcomes) {
      // Add rewards
      this.resources.add('gold', outcome.rewards.gold);
      this.resources.add('information', outcome.rewards.information);
      this.resources.add('influence', outcome.rewards.influence);
      this.resources.add('faith', outcome.rewards.faith);

      // Handle casualties
      for (const unitId of outcome.casualties) {
        const unit = this.troops.getUnit(unitId);
        if (unit) {
          this.politics.handleUnitDeath(unit);
        }
      }

      // Apply political changes from mission
      this.politics.applyMissionOutcome(outcome.rewards.faith, outcome.rewards.influence);
    }

    // Check bankruptcy
    if (this.resources.isBankrupt()) {
      this.gameOver = true;
      this.gameEndReason = GameEndReason.BANKRUPTCY;
      return;
    }

    // Check political game over
    const politicalEnd = this.politics.checkGameOver();
    if (politicalEnd) {
      this.gameOver = true;
      this.gameEndReason = politicalEnd;
      return;
    }

    // Check victory condition (placeholder - dominate all trade routes)
    // In full implementation, this would check trade route domination
    if (this.checkVictoryCondition()) {
      this.gameOver = true;
      this.gameEndReason = GameEndReason.VICTORY;
      this.victoryConditionMet = true;
    }
  }

  /**
   * Check victory condition
   */
  private checkVictoryCondition(): boolean {
    // Simplified victory: 1000+ influence, 80+ faith, 5000+ gold
    const res = this.resources.get();
    return res.influence >= 1000 && this.politics.faith >= 80 && res.gold >= 5000;
  }

  /**
   * Get game state summary
   */
  getSummary(): {
    turn: number;
    resources: any;
    politics: any;
    troops: { total: number; alive: number; dead: number };
    missions: { active: number };
    gameOver: boolean;
    gameEndReason: GameEndReason | null;
  } {
    return {
      turn: this.turn,
      resources: this.resources.get(),
      politics: this.politics.getState(),
      troops: {
        total: this.troops.getTotalCount(),
        alive: this.troops.getLivingCount(),
        dead: this.troops.getDeadUnits().length
      },
      missions: {
        active: this.missions.getActiveMissionCount()
      },
      gameOver: this.gameOver,
      gameEndReason: this.gameEndReason
    };
  }

  /**
   * Display game state (for CLI)
   */
  displayState(): string {
    const summary = this.getSummary();
    const lines = [
      '='.repeat(60),
      `TURN ${summary.turn}`,
      '='.repeat(60),
      '',
      'RESOURCES:',
      `  Gold: ${summary.resources.gold}`,
      `  Information: ${summary.resources.information}`,
      `  Influence: ${summary.resources.influence}`,
      `  Faith: ${summary.resources.faith}`,
      '',
      'POLITICAL STATE:',
      `  Status: ${summary.politics.status}`,
      `  Stability: ${summary.politics.stability.toFixed(1)}`,
      `  Rebellion Risk: ${summary.politics.rebellionRisk.toFixed(1)}`,
      `  Faith: ${summary.politics.faith.toFixed(1)}`,
      `  Influence: ${summary.politics.influence.toFixed(1)}`,
      '',
      'TROOPS:',
      `  Total: ${summary.troops.total}`,
      `  Alive: ${summary.troops.alive}`,
      `  Dead: ${summary.troops.dead}`,
      '',
      'MISSIONS:',
      `  Active: ${summary.missions.active}/3`,
      ''
    ];

    if (this.gameOver) {
      lines.push('='.repeat(60));
      lines.push('GAME OVER');
      lines.push(`Reason: ${this.gameEndReason}`);
      lines.push('='.repeat(60));
    }

    return lines.join('\n');
  }
}
