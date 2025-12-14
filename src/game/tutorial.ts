/**
 * Tutorial mission - Escort Convoy
 */

import { GameState } from './gameState';
import { getMissionDefinition } from '../missions/missionLibrary';
import { RouteType } from '../core/types';

export class Tutorial {
  private game: GameState;
  private tutorialStep: number;
  private tutorialCompleted: boolean;

  constructor(game: GameState) {
    this.game = game;
    this.tutorialStep = 0;
    this.tutorialCompleted = false;
  }

  /**
   * Get tutorial instructions for current step
   */
  getInstructions(): string {
    const steps = [
      `
╔════════════════════════════════════════════════════════════╗
║              WELCOME, YOUR MAJESTY                         ║
╚════════════════════════════════════════════════════════════╝

You are the King. You do not fight. You decide.

Every decision has consequences. Every loss is permanent.
Every victory is earned through preparation and information.

Your first mission: Escort a merchant convoy to a nearby town.

KEY CONCEPTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. SQUAD COMPOSITION
   - You have 4 units available
   - Each has unique skills and traits
   - Synergies between traits boost power

2. WAGES
   - Units expect to be paid their expected wage
   - Underpaying reduces performance and loyalty
   - Repeated underpayment causes rebellion

3. INFORMATION
   - Your Information resource reveals true mission risk
   - Without enough info, you're gambling
   - Scouts and spies gather information

4. DETERMINISM
   - No hidden RNG
   - SquadPower - RiskScore = Outcome
   - Preparation determines success

MISSION DETAILS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Mission: Escort Merchant Convoy (Tutorial)
True Risk: 20 (visible because info requirement is 0)
Reward: 100 gold, 2 info, 5 influence
Duration: 30 seconds

RECOMMENDED SQUAD:
- Gareth the Scout (Quick + Brave synergy)
- Marcus the Trader (Good for escort missions)

Total Expected Wages: 70 gold

ROUTES AVAILABLE:
- FAST: -10% power, 30% faster
- BALANCED: Normal power, normal time
- SAFE: +10% power, 30% slower

Your goal: Achieve SquadPower > 20 to guarantee success.

Press any key to continue...
`,

      `
CALCULATING SQUAD POWER:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Formula:
SquadPower = Σ(SkillScore) × (1 + SynergyBonus) × WageModifier × FatigueModifier

For this tutorial mission:

GARETH THE SCOUT:
- Type: Scout → Combat×1 + Stealth×2 = 5 + 16 = 21
- Traits: Quick + Brave
  - Quick: +5% power, synergy with Scout
  - Brave: +15% power, no synergy here
  - Combined modifier: 1.05 × 1.15 = 1.21
- Expected wage: 30 gold
- Status: Fresh (no fatigue)

MARCUS THE TRADER:
- Type: Trader → Trade×2 + Diplomacy×1 = 18 + 6 = 24
- Traits: Eloquent + Greedy
  - Eloquent: 1.0× power
  - Greedy: 0.8× power (unless overpaid)
  - Combined modifier: 0.8
- Expected wage: 40 gold
- Status: Fresh

SYNERGY CHECK:
- No synergies between these two units' traits

If you pay full wages (70 gold):
  WageModifier = 1.0

Base Power = (21 × 1.21) + (24 × 0.8) = 25.41 + 19.2 = 44.61

Choose BALANCED route (1.0×):
  Final SquadPower = 44.61

OutcomeScore = 44.61 - 20 = 24.61 → GREAT SUCCESS

TIPS:
- Underpaying by 10 gold reduces power by ~10%
- Marcus is GREEDY - underpaying him hurts more
- Fatigue accumulates after missions
- Wounded units have 0.8× power penalty

Ready to launch? Press any key...
`,

      `
POST-MISSION ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Mission Complete!

Review the outcome to understand the deterministic system:

1. Check the OutcomeScore
   - Positive = Success
   - Negative = Casualties likely

2. Political Consequences
   - Any deaths increase Rebellion Risk
   - Deaths reduce Faith and Influence
   - RebellionRisk = 100 → Game Over

3. Economic Feedback
   - Rewards added to resources
   - Market prices updated
   - Inflation from spending

4. Unit Status
   - Fatigue added to all participants
   - Wounded units need rest
   - Dead units are PERMANENT

NEXT STEPS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You now understand the core loop:

1. Gather Information → See true risks
2. Manage Economy → Buy/sell resources
3. Prepare Squad → Synergies, wages, equipment
4. Choose Route → Risk vs speed tradeoff
5. Execute Mission → Deterministic outcome
6. Handle Consequences → Deaths, rebellion, rewards

The game scales in difficulty:
- More complex missions require more information
- Parallel missions (up to 3 simultaneous)
- Deeper trait synergies
- Political management becomes critical

Master these systems to dominate all trade routes
and achieve victory in 10 minutes or less.

Tutorial complete. The realm awaits your command.
`
    ];

    if (this.tutorialStep < steps.length) {
      return steps[this.tutorialStep];
    }

    return 'Tutorial completed.';
  }

  /**
   * Advance tutorial
   */
  nextStep(): void {
    this.tutorialStep++;
    if (this.tutorialStep >= 3) {
      this.tutorialCompleted = true;
    }
  }

  /**
   * Check if tutorial is complete
   */
  isCompleted(): boolean {
    return this.tutorialCompleted;
  }

  /**
   * Run automated tutorial mission demonstration
   */
  runTutorialMission(): string {
    const mission = getMissionDefinition('escort_convoy_tutorial');
    if (!mission) {
      return 'Tutorial mission not found!';
    }

    // Get units
    const units = this.game.troops.getAllUnits();
    const gareth = units.find(u => u.name.includes('Gareth'));
    const marcus = units.find(u => u.name.includes('Marcus'));

    if (!gareth || !marcus) {
      return 'Tutorial units not found!';
    }

    const squad = [gareth, marcus];

    // Pay full wages
    const wages = new Map<string, number>();
    wages.set(gareth.id, gareth.expectedWage);
    wages.set(marcus.id, marcus.expectedWage);

    // Spend wages
    const totalWages = gareth.expectedWage + marcus.expectedWage;
    this.game.resources.spend('gold', totalWages);

    // Create mission
    const missionId = this.game.missions.createMission(
      mission,
      squad,
      RouteType.BALANCED,
      wages,
      this.game.resources.getAmount('information')
    );

    const createdMission = this.game.missions.getMission(missionId);
    if (!createdMission) {
      return 'Failed to create mission!';
    }

    // Calculate power for display
    const squadPower = createdMission.calculateSquadPower();
    const outcomeScore = squadPower - mission.trueRiskScore;

    return `
MISSION LAUNCHED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Squad: Gareth the Scout, Marcus the Trader
Route: BALANCED
Wages Paid: ${totalWages} gold

Squad Power: ${squadPower.toFixed(2)}
Mission Risk: ${mission.trueRiskScore}
Expected Outcome: ${outcomeScore.toFixed(2)}

Status: ${outcomeScore > 0 ? 'SUCCESS LIKELY' : 'FAILURE LIKELY'}

Mission in progress... (30 seconds)
`;
  }
}
