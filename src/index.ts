/**
 * Main entry point for Hardcore Economy Game
 */

import { GameState } from './game/gameState';
import { Tutorial } from './game/tutorial';
import { getMissionDefinition } from './missions/missionLibrary';
import { RouteType } from './core/types';

console.log(`
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║          HARDCORE ECONOMY GAME - MVP PROTOTYPE             ║
║                                                            ║
║  A deterministic economic survival roguelike               ║
║  where preparation and information determine victory       ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
`);

// Initialize game
const game = new GameState();
game.initializeStartingRoster();

console.log('\n' + game.displayState());

// Show starting units
console.log('\nSTARTING ROSTER:');
console.log('━'.repeat(60));
const units = game.troops.getAllUnits();
for (const unit of units) {
  console.log(`
${unit.name} (${unit.type})
  Skills: Combat ${unit.skills.combat}, Diplomacy ${unit.skills.diplomacy}, Stealth ${unit.skills.stealth}, Trade ${unit.skills.trade}
  Traits: ${unit.traits.join(', ')}
  Expected Wage: ${unit.expectedWage} gold
  Rank: ${unit.rank}, Importance: ${unit.importance}
`);
}

// Initialize tutorial
const tutorial = new Tutorial(game);

console.log('\n' + tutorial.getInstructions());
console.log('\nStarting tutorial mission...\n');

// Run tutorial mission
const missionResult = tutorial.runTutorialMission();
console.log(missionResult);

// Simulate mission completion after 30 seconds
console.log('\nSimulating 30 seconds...\n');

// Fast-forward to mission completion
setTimeout(() => {
  console.log('Mission time elapsed, resolving...\n');

  // Tick game to resolve mission
  game.tick();

  // Display results
  console.log(game.displayState());

  const outcomes = game.missions.getCompletedOutcomes();
  for (const [missionId, outcome] of outcomes.entries()) {
    console.log(`
MISSION OUTCOME:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Status: ${outcome.status}
Outcome Score: ${outcome.outcomeScore.toFixed(2)}

Rewards:
  Gold: +${outcome.rewards.gold}
  Information: +${outcome.rewards.information}
  Influence: +${outcome.rewards.influence}
  Faith: +${outcome.rewards.faith}

Casualties: ${outcome.casualties.length}
Wounded: ${outcome.wounded.length}

${outcome.message}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
  }

  // Show updated troops
  console.log('\nUPDATED ROSTER:');
  console.log('━'.repeat(60));
  const updatedUnits = game.troops.getAllUnits();
  for (const unit of updatedUnits) {
    console.log(`${unit.name}: ${unit.status}, Fatigue: ${unit.fatigue.toFixed(0)}`);
  }

  // Tutorial next step
  tutorial.nextStep();
  console.log('\n' + tutorial.getInstructions());

  // Show market prices
  console.log('\nMARKET PRICES:');
  console.log('━'.repeat(60));
  const prices = game.market.getAllPrices();
  for (const [resource, price] of Object.entries(prices)) {
    console.log(`${resource}: ${price.toFixed(2)} gold`);
  }

  const marketState = game.market.getState();
  console.log(`\nInflation Level: ${(marketState.inflationLevel * 100).toFixed(2)}%`);

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TUTORIAL COMPLETE

You now have a working prototype of the hardcore economy game.

Key Features Implemented:
✓ Deterministic combat system
✓ Squad power calculation with synergies
✓ Wage system affecting performance
✓ Political consequences (rebellion, faith, influence)
✓ Dynamic market with inflation
✓ Permanent death mechanics
✓ Mission system with parallel execution support
✓ Information-based risk visibility

Next Steps for Full Game:
- Implement UI for mobile
- Add more missions and complexity
- Implement automation systems
- Add treaty system
- Add equipment shop
- Implement route risk modifiers
- Add random events (with visible seeds)
- Victory condition: trade route domination

The foundation is solid and all core formulas are implemented.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}, 1000); // 1 second for demo purposes instead of 30
