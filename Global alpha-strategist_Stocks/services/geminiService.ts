
import { GoogleGenAI, Type } from "@google/genai";
import { StockRecommendation, MarketSide, AnalysisResult } from "../types";

// 指數退避輔助函式
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchWithRetry = async (fn: () => Promise<any>, retries = 3, backoff = 2000): Promise<any> => {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED');
    if (isRateLimit && retries > 0) {
      console.warn(`檢測到 API 配額限制，將在 ${backoff}ms 後進行重試... (剩餘次數: ${retries})`);
      await delay(backoff);
      return fetchWithRetry(fn, retries - 1, backoff * 2);
    }
    throw error;
  }
};

export const getInstitutionalBatchUpdate = async (): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. 優先檢查快取
  const cachedData = sessionStorage.getItem('alpha_strategist_cache');
  if (cachedData) {
    const parsed = JSON.parse(cachedData);
    const age = Date.now() - new Date(parsed.lastSync).getTime();
    if (age < 300000) { // 5 分鐘內有效
      return { ...parsed, cacheStatus: 'HIT' };
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const targetUrl = "https://www.tradingview.com/markets/world-stocks/worlds-largest-companies/";
  
  const prompt = `
    你是一位擁有30年以上機構投資經驗的首席策略師。現在是 ${today}。
    
    【核心任務】：
    請訪問並根據以下 TradingView 網頁的即時數據來更新你的分析：
    URL: ${targetUrl}

    【執行步驟】：
    1. 使用 Google Search 工具檢索上述網頁的最新內容。
    2. 從該「全球最大市值公司」清單中挑選 4 檔符合以下條件的標的：
       - 市值 (Market Cap) 必須 > $10B (以該網頁數據為準)。
       - 債務/年收入比率 < 40% (需另外搜索最新財報驗證)。
       - 技術面：EMA 20/50 在 Daily 與 Weekly 時區皆維持多頭排列或金叉。
    3. **即時數據校準**：回傳的 "price" (股價) 與 "marketCap" (市值) 必須與該 TradingView 網頁上顯示的數值完全同步，禁止使用過時的記憶數據。
    
    【分析要求】：
    - 執行多週期分析 (Daily Trend & Weekly Trend)。
    - 提供專業繁體中文分析，包括機構投資邏輯 (Thesis) 與基於 ATR 的風險管理 (SL/TP)。
    - 宏觀部分請評述當前利率環境下，這些高權重藍籌股的債務防禦力。
  `;

  const apiCall = async () => {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            marketSentiment: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symbol: { type: Type.STRING },
                  name: { type: Type.STRING },
                  side: { type: Type.STRING },
                  price: { type: Type.NUMBER, description: "必須與 TradingView 網頁同步的即時股價" },
                  marketCap: { type: Type.STRING, description: "必須與 TradingView 網頁同步的最新市值" },
                  reason: { type: Type.STRING },
                  technicalAnalysis: {
                    type: Type.OBJECT,
                    properties: {
                      daily: {
                        type: Type.OBJECT,
                        properties: {
                          ema20: { type: Type.NUMBER },
                          ema50: { type: Type.NUMBER },
                          status: { type: Type.STRING },
                          rsi: { type: Type.NUMBER }
                        },
                        required: ["ema20", "ema50", "status"]
                      },
                      weekly: {
                        type: Type.OBJECT,
                        properties: {
                          ema20: { type: Type.NUMBER },
                          ema50: { type: Type.NUMBER },
                          status: { type: Type.STRING }
                        },
                        required: ["ema20", "ema50", "status"]
                      },
                      alignment: { type: Type.STRING }
                    },
                    required: ["daily", "weekly", "alignment"]
                  },
                  financialHealth: {
                    type: Type.OBJECT,
                    properties: {
                      debtToRevenueRatio: { type: Type.NUMBER },
                      cashFlowStatus: { type: Type.STRING }
                    },
                    required: ["debtToRevenueRatio", "cashFlowStatus"]
                  },
                  risk: {
                    type: Type.OBJECT,
                    properties: {
                      stopLoss: { type: Type.STRING },
                      takeProfit: { type: Type.STRING }
                    },
                    required: ["stopLoss", "takeProfit"]
                  },
                  backtest: {
                    type: Type.OBJECT,
                    properties: {
                      winRate: { type: Type.STRING },
                      profitFactor: { type: Type.STRING },
                      maxDrawdown: { type: Type.STRING },
                      period: { type: Type.STRING }
                    },
                    required: ["winRate", "profitFactor"]
                  }
                },
                required: ["symbol", "name", "price", "marketCap", "reason", "technicalAnalysis", "financialHealth"]
              }
            }
          },
          required: ["marketSentiment", "recommendations"]
        }
      }
    });

    const data = JSON.parse(response.text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .filter(chunk => chunk.web)
      .map(chunk => ({
        title: chunk.web.title || 'Market Source',
        uri: chunk.web.uri || '#'
      }));

    // 強制將 TradingView 列為首位來源
    const finalSources = [
      { title: "TradingView World's Largest Companies", uri: targetUrl },
      ...sources.slice(0, 2)
    ];

    const finalResult: AnalysisResult = {
      stocks: data.recommendations.map((s: any) => ({ ...s, sources: finalSources })),
      marketSentiment: data.marketSentiment,
      lastSync: new Date().toISOString(),
      cacheStatus: 'MISS',
      sources: finalSources
    };

    sessionStorage.setItem('alpha_strategist_cache', JSON.stringify(finalResult));
    return finalResult;
  };

  return fetchWithRetry(apiCall);
};
