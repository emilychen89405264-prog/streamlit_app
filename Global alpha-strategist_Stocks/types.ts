
export enum MarketSide {
  LONG = 'LONG',
  SHORT = 'SHORT'
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface RiskManagement {
  stopLoss: string;
  takeProfit: string;
  atrValue: number;
  atrMultiplierSL: number;
  atrMultiplierTP: number;
}

export interface BacktestData {
  winRate: string;
  profitFactor: string;
  maxDrawdown: string;
  period: string;
}

export interface FinancialHealth {
  debtToRevenueRatio: number;
  cashFlowStatus: string;
  debtVsRevenueAnalysis: string;
}

export interface TechnicalTimeframe {
  ema20: number;
  ema50: number;
  status: string; // e.g., "Bullish", "Consolidating", "Golden Cross"
  rsi?: number;
}

export interface StockRecommendation {
  symbol: string;
  name: string;
  side: MarketSide;
  price: number;
  marketCap: string;
  reason: string;
  technicalAnalysis: {
    daily: TechnicalTimeframe;
    weekly: TechnicalTimeframe;
    alignment: 'HIGH' | 'MEDIUM' | 'LOW'; // 週期同步程度
  };
  financialHealth: FinancialHealth;
  risk: RiskManagement;
  backtest: BacktestData;
  sources: GroundingSource[];
}

export interface AnalysisResult {
  stocks: StockRecommendation[];
  marketSentiment: string;
  lastSync: string;
  cacheStatus: 'HIT' | 'MISS' | 'SYNCING';
  sources: GroundingSource[];
}
