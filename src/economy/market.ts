/**
 * Deterministic market system with supply/demand and inflation
 */

export interface MarketState {
  gold: {
    supply: number;
    demand: number;
    basePrice: number;
  };
  information: {
    supply: number;
    demand: number;
    basePrice: number;
  };
  influence: {
    supply: number;
    demand: number;
    basePrice: number;
  };
  faith: {
    supply: number;
    demand: number;
    basePrice: number;
  };
  inflationLevel: number;
  totalGoldSpent: number;
}

export class Market {
  private state: MarketState;

  constructor() {
    this.state = {
      gold: { supply: 1000, demand: 100, basePrice: 1 },
      information: { supply: 50, demand: 50, basePrice: 10 },
      influence: { supply: 30, demand: 40, basePrice: 20 },
      faith: { supply: 20, demand: 30, basePrice: 25 },
      inflationLevel: 0,
      totalGoldSpent: 0
    };
  }

  /**
   * Calculate current price using deterministic formula:
   * Scarcity = Demand / max(Supply, 1)
   * CurrentPrice = BasePrice * (1 + Scarcity) * (1 + InflationLevel)
   */
  getCurrentPrice(resource: keyof Omit<MarketState, 'inflationLevel' | 'totalGoldSpent'>): number {
    const resourceState = this.state[resource];
    const scarcity = resourceState.demand / Math.max(resourceState.supply, 1);
    const currentPrice = resourceState.basePrice * (1 + scarcity) * (1 + this.state.inflationLevel);
    return Math.round(currentPrice * 100) / 100; // Round to 2 decimals
  }

  /**
   * Buy resource from market
   * Updates demand, inflation
   */
  buy(resource: keyof Omit<MarketState, 'inflationLevel' | 'totalGoldSpent'>, amount: number): number {
    const price = this.getCurrentPrice(resource);
    const totalCost = price * amount;

    // Update demand (buying increases demand)
    this.state[resource].demand += amount * 0.1;

    // Update inflation based on gold spent
    this.state.totalGoldSpent += totalCost;
    this.state.inflationLevel += totalCost * 0.0001;

    return totalCost;
  }

  /**
   * Sell resource to market
   * Updates supply
   */
  sell(resource: keyof Omit<MarketState, 'inflationLevel' | 'totalGoldSpent'>, amount: number): number {
    const price = this.getCurrentPrice(resource);
    const totalGain = price * amount;

    // Update supply (selling increases supply)
    this.state[resource].supply += amount * 0.1;

    return totalGain;
  }

  /**
   * Get full market state for display/debugging
   */
  getState(): MarketState {
    return { ...this.state };
  }

  /**
   * Get price information for all resources
   */
  getAllPrices(): { [key: string]: number } {
    return {
      gold: this.getCurrentPrice('gold'),
      information: this.getCurrentPrice('information'),
      influence: this.getCurrentPrice('influence'),
      faith: this.getCurrentPrice('faith')
    };
  }

  /**
   * Simulate market decay over time (optional tick)
   */
  tick(): void {
    // Gradually normalize demand/supply toward equilibrium
    Object.keys(this.state).forEach(key => {
      if (key !== 'inflationLevel' && key !== 'totalGoldSpent') {
        const resource = key as keyof Omit<MarketState, 'inflationLevel' | 'totalGoldSpent'>;
        this.state[resource].demand *= 0.95;
        this.state[resource].supply *= 0.95;
      }
    });

    // Slow inflation decay
    this.state.inflationLevel *= 0.98;
  }
}
