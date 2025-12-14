# Hardcore Economy Game - Design Document

## Executive Summary

A deterministic economic survival roguelike mobile game where you play as a king who never fights directly but makes all strategic decisions. Victory depends entirely on preparation, information gathering, and strategic planning.

## Core Philosophy

### Hardcore But Fair
- **No Hidden RNG**: Every outcome is calculable if you have enough information
- **Permanent Consequences**: Dead units stay dead, rebellion can end your reign
- **Information is Power**: Gathering intel reveals true risks and enables perfect planning
- **Skill-Based**: Mastery of systems allows completing the game in ~10 minutes

### Deterministic Formulas

All game mechanics use transparent, deterministic formulas:

#### Market Pricing
```
Scarcity = Demand / max(Supply, 1)
CurrentPrice = BasePrice × (1 + Scarcity) × (1 + InflationLevel)
InflationLevel += TotalGoldSpent × 0.0001
```

#### Squad Power
```
SquadPower = Σ(SkillScore) × (1 + SynergyBonus) × TraitModifier × WageModifier × FatigueModifier × RouteModifier

Where:
- WageModifier = 1 if fully paid, else 1 - 0.1×((Expected - Paid)/Expected)
- FatigueModifier = 1 - AverageFatigue × 0.05
- Wounded units: ×0.8 penalty
```

#### Mission Outcome
```
OutcomeScore = SquadPower - TrueRiskScore

OutcomeScore >= 20: Great Success (1.5× rewards)
OutcomeScore >= 0: Success
OutcomeScore >= -10: Partial Success (casualties possible)
OutcomeScore < -10: Failure (heavy casualties)
```

#### Death Determination
```
DeathThreshold = |OutcomeScore| - (UnitSkill + Loyalty + TraitDefense + EquipmentDefense)

DeathThreshold > 10: Unit dies
DeathThreshold > 0: Unit wounded
DeathThreshold <= 0: Unit survives unharmed
```

#### Political Consequences
```
On Unit Death:
- RebellionRisk += 1 + UnitImportance
- Influence -= UnitRank
- Faith -= 0.5

On Underpayment:
- RebellionRisk += (ExpectedWage - PaidWage) × 0.2

Game Over Conditions:
- RebellionRisk >= 100
- Faith <= 0 AND Influence <= 0
- RebellionRisk >= 80 AND Faith < 20 (Assassination)
```

#### Information & Risk Visibility
```
FogOfWar = max(0, MissionInfoRequirement - PlayerInformation)
VisibleRisk = TrueRiskScore ± FogOfWar

When FogOfWar = 0: Player sees exact risk
When FogOfWar > 0: Risk is uncertain by ±(FogOfWar × 0.5)
```

## Resources

### Core Resources

1. **Gold (G)**
   - Used for: Wages, equipment, market purchases
   - Gained from: Successful missions, trade
   - Critical for: Maintaining troop loyalty

2. **Information (I)**
   - Used for: Revealing true mission risks
   - Gained from: Scout missions, spies, informants
   - Critical for: Risk-free planning

3. **Influence (INF)**
   - Used for: Political maneuvering, recruiting elite units
   - Gained from: Successful missions, diplomacy
   - Critical for: Stability and expansion

4. **Faith (F)**
   - Used for: Preventing rebellion, legitimacy
   - Gained from: Religious missions, moral actions
   - Critical for: Long-term stability

## Unit System

### Unit Types

1. **Scout**
   - Skill Focus: Stealth × 2 + Combat
   - Best For: Reconnaissance, information gathering
   - Synergies: Quick trait

2. **Trader**
   - Skill Focus: Trade × 2 + Diplomacy
   - Best For: Escort missions, economic tasks
   - Synergies: Greedy, Eloquent traits

3. **Diplomat**
   - Skill Focus: Diplomacy × 2 + Trade
   - Best For: Negotiations, treaties
   - Synergies: Eloquent trait

4. **Enforcer**
   - Skill Focus: Combat × 2 + Stealth
   - Best For: Tax collection, hostile missions
   - Synergies: Intimidating, Veteran traits

### Trait System

**Power Modifying Traits:**
- Veteran: 1.2× power, +2 defense
- Brave: 1.15× power, +1 defense
- Loyal: 1.1× power, +3 defense
- Intimidating: 1.1× power, +1 defense
- Quick: 1.05× power, +2 defense
- Greedy: 0.8× power (unless overpaid)
- Coward: 0.7× power, -2 defense

**Synergy Bonuses:**
- Matching synergies: +10% power per match
- Examples:
  - Veteran + Brave = +10%
  - Quick + Scout type = +10%
  - Eloquent + Diplomat type = +10%

### Unit Status

- **Ready**: Available for missions
- **On Mission**: Currently deployed
- **Fatigued**: -5% power per 10 fatigue
- **Wounded**: -20% power, needs rest
- **Dead**: Permanent removal, political consequences

## Mission System

### Mission Structure

Each mission has:
- **Type**: Determines which skills are valued
- **True Risk Score**: Hidden unless you have enough information
- **Info Requirement**: How much information needed to see true risk
- **Rewards**: Gold, Information, Influence, Faith
- **Duration**: Real-time (30s - 3min)
- **Allowed Routes**: Fast/Safe/Balanced

### Route Modifiers

1. **Fast Route**
   - Power: ×0.9 (10% reduction)
   - Duration: ×0.7 (30% faster)
   - Use when: Power is sufficient, speed matters

2. **Balanced Route**
   - Power: ×1.0 (no change)
   - Duration: ×1.0 (normal)
   - Use when: Standard approach

3. **Safe Route**
   - Power: ×1.1 (10% bonus)
   - Duration: ×1.3 (30% slower)
   - Use when: Need extra power, time available

### Parallel Missions

- Maximum 3 simultaneous missions
- Each mission runs independently
- Allows expert players to maximize efficiency
- Increases complexity and planning depth

## Political System

### Rebellion Mechanics

Rebellion Risk accumulates from:
- Unit deaths (especially important units)
- Underpaying wages repeatedly
- Low Faith + Low Influence
- Failed missions

**Game Over Triggers:**
- Rebellion Risk >= 100
- Combined Faith + Influence collapse
- Assassination (high rebellion + low faith)

### Stability Management

**Stability Score = (Faith + Influence)/2 - RebellionRisk**

- 70+: Stable realm
- 50-70: Cautious state
- 30-50: Unstable
- 10-30: Crisis
- <10: Catastrophic

## Economic System

### Dynamic Market

Market prices fluctuate based on:
- Supply and demand
- Player purchases/sales
- Inflation from gold spending

**Strategic Implications:**
- Hoarding causes price spikes
- Selling floods market, crashes prices
- Timing matters for profit
- Information becomes more expensive when scarce

### Inflation

Every gold spent increases global inflation:
```
InflationLevel += GoldSpent × 0.0001
```

This creates economic pressure and prevents infinite gold accumulation.

## Gameplay Loop

1. **Gather Information**
   - Scout missions
   - Buy intelligence
   - Review past mission outcomes

2. **Manage Economy**
   - Buy/sell resources
   - Manage inflation
   - Track market prices

3. **Prepare Squad**
   - Select units with synergies
   - Assign equipment
   - Decide on wages
   - Choose route

4. **Execute Missions**
   - Launch (up to 3 parallel)
   - Wait for completion
   - Real-time duration

5. **Handle Consequences**
   - Process rewards
   - Manage casualties
   - Address political fallout
   - Rest wounded units

6. **Repeat Under Pressure**
   - Increasing difficulty
   - More complex missions
   - Deeper strategy required

## Victory & Defeat

### Victory Condition
Dominate all trade routes by achieving:
- 1000+ Influence
- 80+ Faith
- 5000+ Gold
- Control of all key routes

Expert players can achieve this in ~10 minutes.

### Defeat Conditions
- Total Rebellion (Risk >= 100)
- Bankruptcy (Gold <= 0, no recovery)
- Loss of Legitimacy (Faith + Influence = 0)
- Assassination (Rebellion >= 80, Faith < 20)

## MVP Features (Implemented)

✓ Deterministic combat system
✓ Squad power calculation with synergies
✓ Wage system affecting performance
✓ Political consequences (rebellion, faith, influence)
✓ Dynamic market with inflation
✓ Permanent death mechanics
✓ Mission system with parallel execution support
✓ Information-based risk visibility
✓ Tutorial mission
✓ Complete sprite sheet (25 sprites, 1024×1024)

## Future Expansion

### Automation System
Once a mission type is mastered (10+ perfect runs):
- Auto-execute with saved parameters
- Free attention for harder challenges
- Scales difficulty organically

### Advanced Features
- Treaty system (violation consequences)
- Equipment shop and crafting
- Random events (deterministic with visible seed)
- Additional unit types
- Elite units with unique abilities
- Seasonal effects on trade
- Rival kingdoms and diplomacy

### Mobile Optimization
- Touch-friendly UI
- Session save/resume
- Quick decision interfaces
- Visual feedback for all calculations
- Offline mission completion

## Design Principles

1. **Transparency**: All mechanics are visible and calculable
2. **Mastery**: Skill should always triumph over luck
3. **Consequences**: Every decision has weight and permanence
4. **Information**: Knowledge is the ultimate resource
5. **Respect Player Time**: 10-minute mastered sessions possible
6. **Depth Over Complexity**: Simple rules, deep interactions
7. **Fair Difficulty**: Hard but never unfair
8. **No Grind**: Efficiency, not time investment, leads to victory

## Technical Architecture

### Core Systems

- **Economy**: `src/economy/` - Market, resources, inflation
- **Troops**: `src/troops/` - Units, traits, roster management
- **Missions**: `src/missions/` - Mission system, outcomes, library
- **Politics**: `src/politics/` - Rebellion, faith, influence
- **Game**: `src/game/` - Game state orchestration, tutorial

### Data Flow

```
Player Decision
    ↓
Game State Update
    ↓
Deterministic Calculation
    ↓
Outcome
    ↓
Political/Economic Consequences
    ↓
New Game State
```

All intermediate steps are traceable and visible to the player.

## Balancing Philosophy

- Perfect information + perfect execution = guaranteed success
- Underpaying by 50% ≈ 20-30% power reduction
- One death ≈ 1-5 rebellion risk (based on importance)
- 10 deaths without mitigation ≈ game over
- Information costs scale with scarcity
- Mission difficulty increases faster than power scaling

This creates constant tension and meaningful choices.
