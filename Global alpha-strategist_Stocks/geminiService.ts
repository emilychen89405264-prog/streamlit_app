
import { GoogleGenAI } from "@google/genai";
import { AnalysisResult, GroundingSource } from "./types";

export const analyzeMarket = async (userPrompt: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    You are a world-class senior financial analyst and investor with over 30 years of experience. 
    Your goal is to provide actionable stock recommendations based on specific criteria.
    
    CRITERIA:
    1. Market Cap: Must be > $1 Billion USD.
    2. Trend Indicators: Focus on EMA 20/50 crossovers and ATR (Average True Range) volatility.
    3. Financial Health: Debt must not exceed 40% (2/5) of annual revenue. Cash flow must be positive.
    4. Sectors: Prioritize Energy/Infrastructure (AI power needs) and Med-Tech (GLP-1 drugs).
    5. Risk Management: Provide dynamic Take Profit (TP) and Stop Loss (SL) based on ATR multiples.

    FORMAT:
    Identify at least 3 stocks that meet these criteria TODAY.
    For each stock, provide:
    - Ticker & Name
    - Recommendation (Long/Short)
    - Current estimated Entry, TP, and SL
    - Market Cap & Debt/Revenue Ratio
    - Technical Analysis (EMA/ATR context)
    - Fundamental Reasoning

    IMPORTANT: Use Google Search to get real-time stock prices and the latest financial data. 
    You MUST provide your reasoning in a clear, professional tone.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: [{ role: 'user', parts: [{ text: userPrompt || "Identify 2026-ready high-conviction stock entries in Energy and GLP-1 MedTech." }] }],
      config: {
        systemInstruction: systemInstruction,
        tools: [{ googleSearch: {} }],
        temperature: 0.7
      }
    });

    const text = response.text || "No analysis available.";
    
    const rawChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: GroundingSource[] = rawChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || 'Market Reference',
        uri: chunk.web.uri || '#'
      }));

    // Fixed return object to include missing required properties from AnalysisResult interface
    return {
      stocks: [],
      marketSentiment: text,
      lastSync: new Date().toISOString(),
      cacheStatus: 'MISS',
      sources: sources
    };
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};
