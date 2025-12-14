// ===================================================================
// HARDCORE ECONOMY GAME - Browser Version
// ===================================================================

// ===================================================================
// ENUMS AND CONSTANTS
// ===================================================================

const UnitType = {
    SCOUT: 'SCOUT',
    TRADER: 'TRADER',
    DIPLOMAT: 'DIPLOMAT',
    ENFORCER: 'ENFORCER'
};

const TraitType = {
    VETERAN: 'VETERAN',
    GREEDY: 'GREEDY',
    LOYAL: 'LOYAL',
    COWARD: 'COWARD',
    BRAVE: 'BRAVE',
    ELOQUENT: 'ELOQUENT',
    INTIMIDATING: 'INTIMIDATING',
    QUICK: 'QUICK',
    RESILIENT: 'RESILIENT'
};

const RouteType = {
    FAST: 'FAST',
    SAFE: 'SAFE',
    BALANCED: 'BALANCED'
};

const MissionStatus = {
    PENDING: 'PENDING',
    IN_PROGRESS: 'IN_PROGRESS',
    SUCCESS: 'SUCCESS',
    PARTIAL_SUCCESS: 'PARTIAL_SUCCESS',
    FAILURE: 'FAILURE'
};

const TRAITS = {
    [TraitType.VETERAN]: { type: TraitType.VETERAN, powerModifier: 1.2, defenseBonus: 2, description: 'Vétéran +20%' },
    [TraitType.GREEDY]: { type: TraitType.GREEDY, powerModifier: 0.8, defenseBonus: -1, description: 'Avide -20%' },
    [TraitType.LOYAL]: { type: TraitType.LOYAL, powerModifier: 1.1, defenseBonus: 3, description: 'Loyal +10%' },
    [TraitType.COWARD]: { type: TraitType.COWARD, powerModifier: 0.7, defenseBonus: -2, description: 'Lâche -30%' },
    [TraitType.BRAVE]: { type: TraitType.BRAVE, powerModifier: 1.15, defenseBonus: 1, description: 'Brave +15%' },
    [TraitType.ELOQUENT]: { type: TraitType.ELOQUENT, powerModifier: 1.0, defenseBonus: 0, description: 'Éloquent' },
    [TraitType.INTIMIDATING]: { type: TraitType.INTIMIDATING, powerModifier: 1.1, defenseBonus: 1, description: 'Intimidant +10%' },
    [TraitType.QUICK]: { type: TraitType.QUICK, powerModifier: 1.05, defenseBonus: 2, description: 'Rapide +5%' },
    [TraitType.RESILIENT]: { type: TraitType.RESILIENT, powerModifier: 1.0, defenseBonus: 4, description: 'Résistant' }
};

// ===================================================================
// GAME CLASSES
// ===================================================================

class Market {
    constructor() {
        this.state = {
            information: { supply: 50, demand: 50, basePrice: 10 },
            influence: { supply: 30, demand: 40, basePrice: 20 },
            inflationLevel: 0,
            totalGoldSpent: 0
        };
    }

    getCurrentPrice(resource) {
        const resourceState = this.state[resource];
        const scarcity = resourceState.demand / Math.max(resourceState.supply, 1);
        return Math.round(resourceState.basePrice * (1 + scarcity) * (1 + this.state.inflationLevel) * 100) / 100;
    }

    buy(resource, amount) {
        const price = this.getCurrentPrice(resource);
        const totalCost = price * amount;
        this.state[resource].demand += amount * 0.1;
        this.state.totalGoldSpent += totalCost;
        this.state.inflationLevel += totalCost * 0.0001;
        return totalCost;
    }

    getState() {
        return { ...this.state };
    }
}

class ResourceManager {
    constructor() {
        this.resources = { gold: 1000, information: 10, influence: 50, faith: 100 };
    }

    add(resource, amount) {
        this.resources[resource] += amount;
    }

    spend(resource, amount) {
        if (this.resources[resource] >= amount) {
            this.resources[resource] -= amount;
            return true;
        }
        return false;
    }

    get() {
        return { ...this.resources };
    }

    getAmount(resource) {
        return this.resources[resource];
    }
}

class Unit {
    constructor(id, name, type, skills, traits, expectedWage, rank = 1, importance = 1) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.status = 'READY';
        this.skills = skills;
        this.traits = traits;
        this.loyalty = 50;
        this.fatigue = 0;
        this.expectedWage = expectedWage;
        this.lastPaidWage = 0;
        this.equipment = [];
        this.rank = rank;
        this.importance = importance;
    }

    getSkillScore() {
        let score = 0;
        switch (this.type) {
            case UnitType.SCOUT:
                score = this.skills.stealth * 2 + this.skills.combat;
                break;
            case UnitType.TRADER:
                score = this.skills.trade * 2 + this.skills.diplomacy;
                break;
            case UnitType.DIPLOMAT:
                score = this.skills.diplomacy * 2 + this.skills.trade;
                break;
            case UnitType.ENFORCER:
                score = this.skills.combat * 2 + this.skills.stealth;
                break;
        }
        return score;
    }

    payWage(amount) {
        this.lastPaidWage = amount;
        if (amount >= this.expectedWage) {
            this.loyalty = Math.min(100, this.loyalty + 5);
        } else {
            const deficit = this.expectedWage - amount;
            this.loyalty = Math.max(0, this.loyalty - deficit * 0.5);
        }
    }

    isAvailable() {
        return this.status === 'READY' || this.status === 'FATIGUED';
    }
}

class PoliticalState {
    constructor() {
        this.rebellionRisk = 0;
        this.faith = 100;
        this.influence = 50;
        this.deathCount = 0;
    }

    handleUnitDeath(unit) {
        this.rebellionRisk += 1 + unit.importance;
        this.influence = Math.max(0, this.influence - unit.rank);
        this.faith = Math.max(0, this.faith - 0.5);
        this.deathCount++;
    }

    getStabilityScore() {
        const avgLegitimacy = (this.faith + this.influence) / 2;
        return Math.max(0, Math.min(100, avgLegitimacy - this.rebellionRisk));
    }

    getStatus() {
        const stability = this.getStabilityScore();
        if (stability > 70) return 'Stable - Le royaume est sûr et prospère';
        if (stability > 50) return 'Prudent - Quelques troubles, mais gérable';
        if (stability > 30) return 'Instable - Menaces sérieuses';
        if (stability > 10) return 'Crise - Le royaume vacille';
        return 'Catastrophique - Rébellion imminente';
    }

    checkGameOver() {
        if (this.rebellionRisk >= 100) return 'REBELLION';
        if (this.faith <= 0 && this.influence <= 0) return 'LOSS_OF_LEGITIMACY';
        if (this.rebellionRisk >= 80 && this.faith < 20) return 'ASSASSINATION';
        return null;
    }
}

class Mission {
    constructor(definition, squad, route, wagesPaid, playerInformation) {
        this.definition = definition;
        this.squad = squad;
        this.route = route;
        this.wagesPaid = wagesPaid;
        this.status = MissionStatus.PENDING;
        this.startTime = 0;
        this.playerInformation = playerInformation;
        this.id = `mission_${Date.now()}_${Math.random()}`;
    }

    calculateSquadPower() {
        let totalSkillScore = 0;
        let totalTraitPowerMod = 1;

        for (const unit of this.squad) {
            totalSkillScore += unit.getSkillScore();

            for (const traitType of unit.traits) {
                const trait = TRAITS[traitType];
                totalTraitPowerMod *= trait.powerModifier;
            }
        }

        let wageModifier = 1;
        for (const unit of this.squad) {
            const paidWage = this.wagesPaid.get(unit.id) || 0;
            const expected = unit.expectedWage;
            if (paidWage < expected) {
                wageModifier *= 1 - 0.1 * ((expected - paidWage) / expected);
            }
        }

        const avgFatigue = this.squad.reduce((sum, u) => sum + u.fatigue, 0) / this.squad.length;
        const fatigueModifier = 1 - avgFatigue * 0.05;

        let woundedModifier = 1;
        for (const unit of this.squad) {
            if (unit.status === 'WOUNDED') woundedModifier *= 0.8;
        }

        let routeModifier = 1;
        switch (this.route) {
            case RouteType.FAST: routeModifier = 0.9; break;
            case RouteType.SAFE: routeModifier = 1.1; break;
            case RouteType.BALANCED: routeModifier = 1.0; break;
        }

        return totalSkillScore * totalTraitPowerMod * wageModifier * fatigueModifier * woundedModifier * routeModifier;
    }

    start() {
        this.status = MissionStatus.IN_PROGRESS;
        this.startTime = Date.now();
        for (const unit of this.squad) {
            unit.status = 'ON_MISSION';
        }
    }

    isComplete() {
        if (this.status !== MissionStatus.IN_PROGRESS) return false;
        const elapsed = (Date.now() - this.startTime) / 1000;
        let duration = this.definition.duration;

        if (this.route === RouteType.FAST) duration *= 0.7;
        else if (this.route === RouteType.SAFE) duration *= 1.3;

        return elapsed >= duration;
    }

    resolve() {
        const squadPower = this.calculateSquadPower();
        const trueRisk = this.definition.trueRiskScore;
        const outcomeScore = squadPower - trueRisk;

        const casualties = [];
        const wounded = [];
        let rewards = { ...this.definition.baseReward };
        let status;
        let message = '';

        if (outcomeScore >= 20) {
            status = MissionStatus.SUCCESS;
            rewards.gold *= 1.5;
            rewards.information = (rewards.information || 0) + 5;
            message = `Mission réussie brillamment! Score: ${outcomeScore.toFixed(1)}`;
        } else if (outcomeScore >= 0) {
            status = MissionStatus.SUCCESS;
            message = `Mission réussie. Score: ${outcomeScore.toFixed(1)}`;
        } else if (outcomeScore >= -10) {
            status = MissionStatus.PARTIAL_SUCCESS;
            rewards.gold *= 0.5;

            for (const unit of this.squad) {
                const traitDefense = unit.traits.reduce((sum, t) => sum + (TRAITS[t].defenseBonus || 0), 0);
                const survivalScore = unit.getSkillScore() + unit.loyalty + traitDefense;
                const deathRoll = Math.abs(outcomeScore) - survivalScore;

                if (deathRoll > 10) {
                    casualties.push(unit.id);
                    unit.status = 'DEAD';
                } else if (deathRoll > 0) {
                    wounded.push(unit.id);
                    unit.status = 'WOUNDED';
                }
            }
            message = `Mission partiellement réussie. ${casualties.length} morts, ${wounded.length} blessés. Score: ${outcomeScore.toFixed(1)}`;
        } else {
            status = MissionStatus.FAILURE;
            rewards = { gold: 0, information: 0, influence: 0, faith: 0 };

            for (const unit of this.squad) {
                const traitDefense = unit.traits.reduce((sum, t) => sum + (TRAITS[t].defenseBonus || 0), 0);
                const survivalScore = unit.getSkillScore() + unit.loyalty + traitDefense;
                const deathRoll = Math.abs(outcomeScore) - survivalScore;

                if (deathRoll > 5) {
                    casualties.push(unit.id);
                    unit.status = 'DEAD';
                } else {
                    wounded.push(unit.id);
                    unit.status = 'WOUNDED';
                }
            }
            message = `Mission échouée catastrophiquement. ${casualties.length} morts, ${wounded.length} blessés. Score: ${outcomeScore.toFixed(1)}`;
        }

        for (const unit of this.squad) {
            if (unit.status !== 'DEAD') {
                unit.fatigue = Math.min(100, unit.fatigue + 10);
                if (unit.status !== 'WOUNDED') unit.status = 'READY';
            }
        }

        this.status = status;

        return { status, outcomeScore, rewards, casualties, wounded, message };
    }

    getTimeRemaining() {
        if (this.status !== MissionStatus.IN_PROGRESS) return 0;
        const elapsed = (Date.now() - this.startTime) / 1000;
        let duration = this.definition.duration;

        if (this.route === RouteType.FAST) duration *= 0.7;
        else if (this.route === RouteType.SAFE) duration *= 1.3;

        return Math.max(0, duration - elapsed);
    }
}

const MISSION_LIBRARY = {
    escort_convoy_tutorial: {
        id: 'escort_convoy_tutorial',
        name: 'Escorter un Convoi Marchand (Tutoriel)',
        description: 'Une mission d\'escorte simple pour apprendre les bases. Faible risque, récompense modérée.',
        trueRiskScore: 20,
        infoRequirement: 0,
        baseReward: { gold: 100, information: 2, influence: 5, faith: 0 },
        duration: 30,
        allowedRoutes: [RouteType.FAST, RouteType.SAFE, RouteType.BALANCED]
    },
    scout_mountain_pass: {
        id: 'scout_mountain_pass',
        name: 'Éclaireur du Col de Montagne',
        description: 'Reconnaissance d\'un passage dangereux. Nécessite furtivité et survie.',
        trueRiskScore: 35,
        infoRequirement: 10,
        baseReward: { gold: 50, information: 15, influence: 0, faith: 0 },
        duration: 45,
        allowedRoutes: [RouteType.SAFE, RouteType.BALANCED]
    },
    negotiate_trade_treaty: {
        id: 'negotiate_trade_treaty',
        name: 'Négocier un Traité Commercial',
        description: 'Mission diplomatique pour sécuriser des termes commerciaux favorables.',
        trueRiskScore: 25,
        infoRequirement: 5,
        baseReward: { gold: 0, information: 5, influence: 20, faith: 10 },
        duration: 60,
        allowedRoutes: [RouteType.BALANCED]
    },
    enforce_tax_collection: {
        id: 'enforce_tax_collection',
        name: 'Percevoir les Impôts',
        description: 'Forcer une ville rebelle à payer ses taxes. Haut risque de résistance.',
        trueRiskScore: 50,
        infoRequirement: 15,
        baseReward: { gold: 300, information: 0, influence: -10, faith: -5 },
        duration: 90,
        allowedRoutes: [RouteType.FAST, RouteType.BALANCED]
    }
};

// ===================================================================
// GAME STATE
// ===================================================================

class GameState {
    constructor() {
        this.market = new Market();
        this.resources = new ResourceManager();
        this.troops = new Map();
        this.activeMissions = new Map();
        this.politics = new PoliticalState();
        this.turn = 1;
        this.gameOver = false;
        this.gameEndReason = null;
        this.nextUnitId = 1;

        this.initializeStartingRoster();
    }

    initializeStartingRoster() {
        this.recruitUnit('Gareth le Scout', UnitType.SCOUT,
            { combat: 5, diplomacy: 2, stealth: 8, trade: 3 },
            [TraitType.QUICK, TraitType.BRAVE], 30, 1, 2);

        this.recruitUnit('Marcus le Marchand', UnitType.TRADER,
            { combat: 2, diplomacy: 6, stealth: 3, trade: 9 },
            [TraitType.ELOQUENT, TraitType.GREEDY], 40, 2, 3);

        this.recruitUnit('Elena la Diplomate', UnitType.DIPLOMAT,
            { combat: 1, diplomacy: 9, stealth: 4, trade: 7 },
            [TraitType.ELOQUENT, TraitType.LOYAL], 50, 3, 4);

        this.recruitUnit('Brutus l\'Exécuteur', UnitType.ENFORCER,
            { combat: 9, diplomacy: 2, stealth: 5, trade: 1 },
            [TraitType.INTIMIDATING, TraitType.VETERAN], 45, 2, 3);
    }

    recruitUnit(name, type, skills, traits, expectedWage, rank, importance) {
        const id = `unit_${this.nextUnitId++}`;
        const unit = new Unit(id, name, type, skills, traits, expectedWage, rank, importance);
        this.troops.set(id, unit);
        return unit;
    }

    launchMission(missionDef, squadIds, route, wages) {
        const squad = squadIds.map(id => this.troops.get(id)).filter(u => u);
        const wageMap = new Map(wages);

        const mission = new Mission(
            missionDef,
            squad,
            route,
            wageMap,
            this.resources.getAmount('information')
        );

        mission.start();
        this.activeMissions.set(mission.id, mission);

        // Pay wages
        for (const [unitId, wage] of wages) {
            const unit = this.troops.get(unitId);
            if (unit) {
                unit.payWage(wage);
                this.resources.spend('gold', wage);
            }
        }

        return mission;
    }

    tick() {
        const outcomes = [];

        for (const [id, mission] of this.activeMissions.entries()) {
            if (mission.isComplete()) {
                const outcome = mission.resolve();
                outcomes.push({ mission, outcome });

                // Add rewards
                this.resources.add('gold', outcome.rewards.gold);
                this.resources.add('information', outcome.rewards.information);
                this.resources.add('influence', outcome.rewards.influence);
                this.resources.add('faith', outcome.rewards.faith);

                // Handle casualties
                for (const unitId of outcome.casualties) {
                    const unit = this.troops.get(unitId);
                    if (unit) {
                        this.politics.handleUnitDeath(unit);
                    }
                }

                this.activeMissions.delete(id);
            }
        }

        // Check game over
        const politicalEnd = this.politics.checkGameOver();
        if (politicalEnd) {
            this.gameOver = true;
            this.gameEndReason = politicalEnd;
        }

        if (this.resources.getAmount('gold') <= 0) {
            this.gameOver = true;
            this.gameEndReason = 'BANKRUPTCY';
        }

        return outcomes;
    }
}

// ===================================================================
// UI CONTROLLER
// ===================================================================

class UIController {
    constructor() {
        this.game = new GameState();
        this.selectedMission = null;
        this.selectedSquad = new Set();
        this.updateInterval = null;

        this.initializeEventListeners();
        this.startGameLoop();
        this.render();
    }

    initializeEventListeners() {
        // Tabs
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Start game button
        document.getElementById('start-game-btn').addEventListener('click', () => {
            document.getElementById('tutorial-modal').classList.remove('active');
        });

        // Mission modal close
        document.querySelector('#mission-modal .close').addEventListener('click', () => {
            this.closeMissionModal();
        });

        // Launch mission button
        document.getElementById('launch-mission-btn').addEventListener('click', () => {
            this.launchSelectedMission();
        });
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

        document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-panel`).classList.add('active');
    }

    render() {
        this.renderResources();
        this.renderPoliticalState();
        this.renderTroops();
        this.renderMissions();
        this.renderMarket();
        this.checkGameOver();
    }

    renderResources() {
        const res = this.game.resources.get();
        document.getElementById('gold').textContent = Math.floor(res.gold);
        document.getElementById('information').textContent = Math.floor(res.information);
        document.getElementById('influence').textContent = Math.floor(res.influence);
        document.getElementById('faith').textContent = Math.floor(res.faith);
        document.getElementById('turn').textContent = this.game.turn;
    }

    renderPoliticalState() {
        const pol = this.game.politics;
        const stability = pol.getStabilityScore();

        document.getElementById('stability-bar').style.width = `${stability}%`;
        document.getElementById('stability-value').textContent = stability.toFixed(0);
        document.getElementById('rebellion-bar').style.width = `${pol.rebellionRisk}%`;
        document.getElementById('rebellion-value').textContent = pol.rebellionRisk.toFixed(0);
        document.getElementById('political-status').textContent = pol.getStatus();
    }

    renderTroops() {
        const container = document.getElementById('troops-list');
        container.innerHTML = '';

        for (const [id, unit] of this.game.troops) {
            if (unit.status === 'DEAD') continue;

            const card = document.createElement('div');
            card.className = 'troop-card';
            card.innerHTML = `
                <div class="troop-header">
                    <div class="troop-name">${unit.name}</div>
                    <div class="troop-type">${unit.type}</div>
                </div>
                <div class="troop-status ${unit.status.toLowerCase()}">${unit.status}</div>
                <div class="troop-skills">
                    <div class="skill"><span>⚔️ Combat:</span> <span>${unit.skills.combat}</span></div>
                    <div class="skill"><span>🗨️ Diplomacy:</span> <span>${unit.skills.diplomacy}</span></div>
                    <div class="skill"><span>👁️ Stealth:</span> <span>${unit.skills.stealth}</span></div>
                    <div class="skill"><span>⚖️ Trade:</span> <span>${unit.skills.trade}</span></div>
                </div>
                <div class="troop-traits">
                    ${unit.traits.map(t => `<span class="trait-badge">${TRAITS[t].description}</span>`).join('')}
                </div>
                <div class="troop-wage">
                    <span>Salaire attendu:</span>
                    <span>${unit.expectedWage} 💰</span>
                </div>
                ${unit.fatigue > 0 ? `<div style="margin-top: 0.5rem; font-size: 0.85rem; color: #ff9800;">Fatigue: ${unit.fatigue.toFixed(0)}</div>` : ''}
            `;
            container.appendChild(card);
        }
    }

    renderMissions() {
        // Active missions
        const activeContainer = document.getElementById('active-missions-list');
        const activeCount = this.game.activeMissions.size;
        document.getElementById('active-count').textContent = activeCount;

        if (activeCount === 0) {
            activeContainer.innerHTML = '<p class="empty-state">Aucune mission en cours</p>';
        } else {
            activeContainer.innerHTML = '';
            for (const [id, mission] of this.game.activeMissions) {
                const card = this.createActiveMissionCard(mission);
                activeContainer.appendChild(card);
            }
        }

        // Available missions
        const availableContainer = document.getElementById('available-missions-list');
        availableContainer.innerHTML = '';

        for (const [id, missionDef] of Object.entries(MISSION_LIBRARY)) {
            const card = this.createAvailableMissionCard(missionDef);
            availableContainer.appendChild(card);
        }
    }

    createActiveMissionCard(mission) {
        const card = document.createElement('div');
        card.className = 'mission-card';
        const timeRemaining = mission.getTimeRemaining();

        card.innerHTML = `
            <div class="mission-header">
                <div class="mission-name">${mission.definition.name}</div>
            </div>
            <div class="mission-progress">
                <div class="mission-timer">
                    <span>⏱️ Temps restant:</span>
                    <span>${timeRemaining.toFixed(0)}s</span>
                </div>
                <div style="margin-top: 0.5rem;">
                    <strong>Escouade:</strong> ${mission.squad.map(u => u.name).join(', ')}
                </div>
                <div><strong>Route:</strong> ${mission.route}</div>
            </div>
        `;
        return card;
    }

    createAvailableMissionCard(missionDef) {
        const card = document.createElement('div');
        card.className = 'mission-card';
        const canStart = this.game.activeMissions.size < 3;

        card.innerHTML = `
            <div class="mission-header">
                <div class="mission-name">${missionDef.name}</div>
            </div>
            <div class="mission-description">${missionDef.description}</div>
            <div class="mission-stats">
                <div class="mission-stat">
                    <span>Risque:</span>
                    <span>${missionDef.trueRiskScore}</span>
                </div>
                <div class="mission-stat">
                    <span>Durée:</span>
                    <span>${missionDef.duration}s</span>
                </div>
                <div class="mission-stat">
                    <span>Info requise:</span>
                    <span>${missionDef.infoRequirement}</span>
                </div>
            </div>
            <div class="mission-rewards">
                <h4>Récompenses:</h4>
                <div class="rewards-list">
                    ${missionDef.baseReward.gold > 0 ? `<span class="reward-item">💰 ${missionDef.baseReward.gold}</span>` : ''}
                    ${missionDef.baseReward.information > 0 ? `<span class="reward-item">ℹ️ ${missionDef.baseReward.information}</span>` : ''}
                    ${missionDef.baseReward.influence != 0 ? `<span class="reward-item">👑 ${missionDef.baseReward.influence}</span>` : ''}
                    ${missionDef.baseReward.faith != 0 ? `<span class="reward-item">✝️ ${missionDef.baseReward.faith}</span>` : ''}
                </div>
            </div>
            <button class="btn-primary btn-small" ${!canStart ? 'disabled' : ''}>
                ${canStart ? 'Préparer Mission' : 'Maximum atteint (3/3)'}
            </button>
        `;

        if (canStart) {
            card.querySelector('button').addEventListener('click', () => {
                this.openMissionModal(missionDef);
            });
        }

        return card;
    }

    renderMarket() {
        const container = document.getElementById('market-list');
        const marketState = this.game.market.getState();
        document.getElementById('inflation').textContent = (marketState.inflationLevel * 100).toFixed(2);

        container.innerHTML = '';

        const resources = ['information', 'influence'];
        for (const resource of resources) {
            const price = this.game.market.getCurrentPrice(resource);
            const card = document.createElement('div');
            card.className = 'market-item';

            const icons = { information: 'ℹ️', influence: '👑' };
            const names = { information: 'Information', influence: 'Influence' };

            card.innerHTML = `
                <div class="market-item-header">
                    <div class="market-item-name">${icons[resource]} ${names[resource]}</div>
                    <div class="market-item-price">${price.toFixed(1)} 💰</div>
                </div>
                <div class="market-actions">
                    <input type="number" class="market-input" min="1" value="1" id="amount-${resource}">
                    <button class="btn-primary btn-small">Acheter</button>
                </div>
            `;

            card.querySelector('button').addEventListener('click', () => {
                const amount = parseInt(document.getElementById(`amount-${resource}`).value) || 1;
                const cost = this.game.market.buy(resource, amount);

                if (this.game.resources.spend('gold', cost)) {
                    this.game.resources.add(resource, amount);
                    this.showNotification(`Acheté ${amount} ${names[resource]} pour ${cost.toFixed(0)} or`, 'success');
                    this.render();
                } else {
                    this.showNotification('Pas assez d\'or!', 'error');
                }
            });

            container.appendChild(card);
        }
    }

    openMissionModal(missionDef) {
        this.selectedMission = missionDef;
        this.selectedSquad.clear();

        document.getElementById('modal-mission-name').textContent = missionDef.name;
        document.getElementById('modal-mission-details').innerHTML = `
            <p>${missionDef.description}</p>
            <div style="margin-top: 1rem;">
                <strong>Risque:</strong> ${missionDef.trueRiskScore} |
                <strong>Durée:</strong> ${missionDef.duration}s
            </div>
        `;

        this.renderSquadSelection();
        document.getElementById('mission-modal').classList.add('active');
    }

    closeMissionModal() {
        document.getElementById('mission-modal').classList.remove('active');
        this.selectedMission = null;
        this.selectedSquad.clear();
    }

    renderSquadSelection() {
        const container = document.getElementById('squad-selection');
        container.innerHTML = '';

        for (const [id, unit] of this.game.troops) {
            if (!unit.isAvailable() || unit.status === 'DEAD') continue;

            const card = document.createElement('div');
            card.className = `unit-select-card ${this.selectedSquad.has(id) ? 'selected' : ''}`;
            card.innerHTML = `
                <div><strong>${unit.name}</strong></div>
                <div style="font-size: 0.8rem; color: #aaa;">${unit.type}</div>
                <div style="margin-top: 0.5rem; font-size: 0.85rem;">
                    Salaire: ${unit.expectedWage} 💰
                </div>
            `;

            card.addEventListener('click', () => {
                if (this.selectedSquad.has(id)) {
                    this.selectedSquad.delete(id);
                } else {
                    this.selectedSquad.add(id);
                }
                this.renderSquadSelection();
                this.updateMissionPrediction();
            });

            container.appendChild(card);
        }

        this.renderSelectedSquad();
        this.updateMissionPrediction();
    }

    renderSelectedSquad() {
        const container = document.getElementById('selected-units');
        if (this.selectedSquad.size === 0) {
            container.innerHTML = '<p class="empty-state">Aucune unité sélectionnée</p>';
        } else {
            container.innerHTML = Array.from(this.selectedSquad)
                .map(id => {
                    const unit = this.game.troops.get(id);
                    return `<div style="padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 5px; margin-bottom: 0.5rem;">
                        ${unit.name} (${unit.type}) - ${unit.expectedWage} 💰
                    </div>`;
                })
                .join('');
        }
    }

    updateMissionPrediction() {
        const btn = document.getElementById('launch-mission-btn');
        const container = document.getElementById('mission-prediction-details');

        if (this.selectedSquad.size === 0) {
            container.innerHTML = '<p>Sélectionnez une escouade pour voir la prédiction</p>';
            btn.disabled = true;
            return;
        }

        const route = document.querySelector('input[name="route"]:checked').value;
        const squad = Array.from(this.selectedSquad).map(id => this.game.troops.get(id));
        const wages = new Map(Array.from(this.selectedSquad).map(id => {
            const unit = this.game.troops.get(id);
            return [id, unit.expectedWage];
        }));

        const tempMission = new Mission(
            this.selectedMission,
            squad,
            route,
            wages,
            this.game.resources.getAmount('information')
        );

        const power = tempMission.calculateSquadPower();
        const outcome = power - this.selectedMission.trueRiskScore;
        const totalWages = Array.from(wages.values()).reduce((sum, w) => sum + w, 0);

        let prediction = '';
        if (outcome >= 20) prediction = '✅ GRAND SUCCÈS PRÉDIT';
        else if (outcome >= 0) prediction = '✅ SUCCÈS PRÉDIT';
        else if (outcome >= -10) prediction = '⚠️ SUCCÈS PARTIEL - PERTES POSSIBLES';
        else prediction = '❌ ÉCHEC PRÉDIT - PERTES LOURDES';

        container.innerHTML = `
            <div style="padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 5px;">
                <div><strong>Puissance d'Escouade:</strong> ${power.toFixed(1)}</div>
                <div><strong>Risque de Mission:</strong> ${this.selectedMission.trueRiskScore}</div>
                <div><strong>Score de Résultat:</strong> ${outcome.toFixed(1)}</div>
                <div style="margin-top: 1rem; font-size: 1.1rem;"><strong>${prediction}</strong></div>
                <div style="margin-top: 1rem;"><strong>Coût Total (Salaires):</strong> ${totalWages} 💰</div>
            </div>
        `;

        btn.disabled = this.game.resources.getAmount('gold') < totalWages;
    }

    launchSelectedMission() {
        const route = document.querySelector('input[name="route"]:checked').value;
        const wages = Array.from(this.selectedSquad).map(id => {
            const unit = this.game.troops.get(id);
            return [id, unit.expectedWage];
        });

        this.game.launchMission(
            this.selectedMission,
            Array.from(this.selectedSquad),
            route,
            wages
        );

        this.showNotification(`Mission "${this.selectedMission.name}" lancée!`, 'success');
        this.closeMissionModal();
        this.render();
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notifications');
        const notif = document.createElement('div');
        notif.className = `notification ${type}`;
        notif.textContent = message;

        container.appendChild(notif);

        setTimeout(() => {
            notif.style.opacity = '0';
            setTimeout(() => notif.remove(), 300);
        }, 3000);
    }

    checkGameOver() {
        if (this.game.gameOver) {
            const modal = document.getElementById('gameover-modal');
            const content = document.getElementById('gameover-content');

            let reason = '';
            switch (this.game.gameEndReason) {
                case 'REBELLION':
                    reason = 'Votre royaume s\'est rebellé contre vous!';
                    break;
                case 'BANKRUPTCY':
                    reason = 'Vous êtes en faillite!';
                    break;
                case 'LOSS_OF_LEGITIMACY':
                    reason = 'Vous avez perdu toute légitimité!';
                    break;
                case 'ASSASSINATION':
                    reason = 'Vous avez été assassiné!';
                    break;
            }

            content.innerHTML = `<p style="font-size: 1.2rem; text-align: center;">${reason}</p>`;
            modal.classList.add('active');

            document.getElementById('restart-btn').addEventListener('click', () => {
                location.reload();
            });
        }
    }

    startGameLoop() {
        this.updateInterval = setInterval(() => {
            const outcomes = this.game.tick();

            for (const { mission, outcome } of outcomes) {
                this.showNotification(outcome.message, outcome.status === 'SUCCESS' ? 'success' : 'error');
            }

            if (outcomes.length > 0) {
                this.game.turn++;
            }

            this.render();
        }, 1000);
    }
}

// ===================================================================
// INITIALIZE GAME
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    window.gameUI = new UIController();
});
