# Hardcore Economy Game

A hardcore economic survival roguelike mobile game where you play as a king managing troops, economy, and diplomatic relations.

## Core Philosophy

- **Deterministic**: No hidden RNG, every outcome is calculable
- **Hardcore**: Permadeath, permanent consequences, unforgiving but fair
- **Information-based**: Success depends on preparation and intel gathering
- **Mobile-friendly**: 10-minute mastered sessions possible

## Key Features

### Economy System
- Dynamic market with supply/demand
- Inflation mechanics based on spending
- 4 core resources: Gold, Information, Influence, Faith

### Troop Management
- Unique units with skills, traits, and synergies
- Wage system affecting performance
- Fatigue and injury mechanics
- Permanent death with political consequences

### Mission System
- Parallel mission execution (up to 3 simultaneous)
- Deterministic outcomes based on preparation
- Route choices (fast vs safe)
- Treaty compliance mechanics

### Political System
- Rebellion risk from deaths and mistreatment
- Faith and Influence management
- Diplomatic consequences

## Victory & Defeat

- **Victory**: Dominate all trade routes
- **Defeat**: Rebellion, bankruptcy, loss of legitimacy, or assassination

## Getting Started

```bash
npm install
npm start
```

## Project Structure

```
src/
├── core/           # Core game systems
├── economy/        # Market and resources
├── troops/         # Unit management
├── missions/       # Mission system
├── politics/       # Political mechanics
├── game/           # Main game loop
└── index.ts        # Entry point
```
