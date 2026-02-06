
import React from 'react';
import { StockRecommendation, MarketSide } from '../types';
import { 
  Globe, 
  Activity, 
  Landmark, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  Zap, 
  Calendar,
  Clock,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface StockCardProps {
  stock: StockRecommendation;
}

const StockCard: React.FC<StockCardProps> = ({ stock }) => {
  const isLong = stock.side === MarketSide.LONG;
  const debtRatio = (stock.financialHealth.debtToRevenueRatio * 100).toFixed(2);
  const alignColor = stock.technicalAnalysis.alignment === 'HIGH' ? 'text-blue-400 bg-blue-500/10 border-blue-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30';

  return (
    <div className="bg-[#0f0f12] border border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-300 shadow-2xl flex flex-col h-full group">
      {/* Status Indicators */}
      <div className="flex justify-between items-center p-4 pb-0">
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 border border-blue-500/20 rounded-md">
          <CheckCircle2 className="w-3 h-3 text-blue-400" />
          <span className="text-[8px] font-black text-blue-400 uppercase tracking-tighter">TV Global Sync</span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest ${alignColor}`}>
          <Layers className="w-3 h-3" />
          {stock.technicalAnalysis.alignment === 'HIGH' ? 'Strong Sync' : 'Mixed Trend'}
        </div>
      </div>

      <div className="p-5 flex-1 space-y-5">
        {/* Symbol & Price Header */}
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-black text-white tracking-tighter font-mono group-hover:text-blue-400 transition-colors">
                {stock.symbol}
              </span>
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${isLong ? 'bg-emerald-500 text-black' : 'bg-rose-500 text-white'}`}>
                {stock.side}
              </span>
            </div>
            <h3 className="text-gray-500 text-[10px] font-bold uppercase truncate max-w-[140px] tracking-tight">
              {stock.name}
            </h3>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-2xl font-mono font-bold text-white tabular-nums">
              {isLong ? <ArrowUpRight className="w-5 h-5 text-emerald-500" /> : <ArrowDownRight className="w-5 h-5 text-rose-500" />}
              {stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[9px] text-gray-600 font-bold uppercase mt-1">
              {stock.marketCap} <span className="text-gray-800 ml-1">|</span> <span className="text-blue-400 ml-1 animate-pulse">Live TV Feed</span>
            </div>
          </div>
        </div>

        {/* Multi-Timeframe Technical Block */}
        <div className="bg-black/40 rounded-2xl border border-gray-800/50 overflow-hidden">
          <div className="grid grid-cols-2">
            <div className="p-3 border-r border-gray-800/50">
              <div className="flex items-center gap-1 text-[8px] font-black text-gray-600 uppercase mb-2">
                <Clock className="w-2.5 h-2.5" /> Daily Trend
              </div>
              <div className={`text-[10px] font-bold mb-2 ${stock.technicalAnalysis.daily.status.toLowerCase().includes('bull') ? 'text-emerald-400' : 'text-amber-400'}`}>
                {stock.technicalAnalysis.daily.status}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-gray-600">EMA20</span>
                  <span className="text-gray-300">${stock.technicalAnalysis.daily.ema20.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-gray-600">EMA50</span>
                  <span className="text-gray-300">${stock.technicalAnalysis.daily.ema50.toFixed(2)}</span>
                </div>
                {stock.technicalAnalysis.daily.rsi && (
                  <div className="flex justify-between text-[9px] font-mono pt-1.5 border-t border-gray-800/30">
                    <span className="text-gray-600">RSI14</span>
                    <span className="text-blue-400 font-bold">{stock.technicalAnalysis.daily.rsi.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3">
              <div className="flex items-center gap-1 text-[8px] font-black text-gray-600 uppercase mb-2">
                <Calendar className="w-2.5 h-2.5" /> Weekly Trend
              </div>
              <div className={`text-[10px] font-bold mb-2 ${stock.technicalAnalysis.weekly.status.toLowerCase().includes('bull') ? 'text-emerald-400' : 'text-blue-400'}`}>
                {stock.technicalAnalysis.weekly.status}
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-gray-600">EMA20</span>
                  <span className="text-gray-300">${stock.technicalAnalysis.weekly.ema20.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[9px] font-mono">
                  <span className="text-gray-600">EMA50</span>
                  <span className="text-gray-300">${stock.technicalAnalysis.weekly.ema50.toFixed(2)}</span>
                </div>
                {stock.technicalAnalysis.weekly.rsi && (
                  <div className="flex justify-between text-[9px] font-mono pt-1.5 border-t border-gray-800/30">
                    <span className="text-gray-600">RSI14</span>
                    <span className="text-blue-400 font-bold">{stock.technicalAnalysis.weekly.rsi.toFixed(1)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Financial & Debt Filter */}
        <div className="bg-[#16161a] rounded-xl p-3 border border-gray-800/50 flex items-center justify-between group-hover:bg-[#1a1a20] transition-colors">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-emerald-500" />
            <div>
              <div className="text-[8px] text-gray-600 font-black uppercase">Debt / Rev Ratio</div>
              <div className="text-xs font-mono font-black text-white">{debtRatio}% <span className="text-[8px] text-gray-700 font-normal">MAX 40%</span></div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[8px] text-gray-600 font-black uppercase">CF Status</div>
            <div className="text-[9px] font-bold text-emerald-400 tracking-tight">{stock.financialHealth.cashFlowStatus}</div>
          </div>
        </div>

        {/* Thesis & Risk */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-[9px] font-black text-blue-500 uppercase tracking-[0.2em]">
            <Zap className="w-3 h-3 fill-blue-500/20" /> Institutional Thesis
          </div>
          <p className="text-gray-300 text-[11px] leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
            {stock.reason}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          <div className="bg-rose-500/5 border border-rose-500/20 rounded-xl p-2.5 hover:bg-rose-500/10 transition-colors">
            <div className="text-[8px] font-black text-rose-500 uppercase mb-0.5">STOP LOSS (ATR)</div>
            <div className="text-xs font-mono font-bold text-rose-400">{stock.risk.stopLoss}</div>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-2.5 hover:bg-emerald-500/10 transition-colors">
            <div className="text-[8px] font-black text-emerald-500 uppercase mb-0.5">TARGET (TP)</div>
            <div className="text-xs font-mono font-bold text-emerald-400">{stock.risk.takeProfit}</div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="px-5 py-3 bg-[#08080a] border-t border-gray-800 flex items-center justify-between">
        <div className="flex gap-2">
          {stock.sources.map((src, idx) => (
            <a key={idx} href={src.uri} title={src.title} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-blue-400 transition-colors">
              {idx === 0 ? <ExternalLink className="w-3.5 h-3.5" /> : <Globe className="w-3.5 h-3.5" />}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-1 text-[8px] font-black text-gray-800 uppercase tracking-widest">
          <Activity className="w-2.5 h-2.5 text-blue-500" /> TV INDEX SYNCED
        </div>
      </div>
    </div>
  );
};

export default StockCard;
