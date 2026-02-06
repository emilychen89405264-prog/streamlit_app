
import React, { useState, useEffect, useCallback } from 'react';
import { getInstitutionalBatchUpdate } from './services/geminiService';
import { StockRecommendation, AnalysisResult } from './types';
import StockCard from './components/StockCard';
import { 
  BarChart3, 
  RefreshCcw, 
  Zap, 
  LayoutDashboard, 
  History, 
  ShieldCheck,
  Cpu,
  Microscope,
  TrendingUp,
  Globe2,
  Landmark,
  ShieldAlert,
  Activity,
  Database,
  Layers,
  AlertTriangle,
  Clock
} from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBatchUpdate = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getInstitutionalBatchUpdate();
      setData(result);
    } catch (err: any) {
      console.error("Critical failure:", err);
      if (err?.message?.includes('429') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
        setError('API_QUOTA_EXCEEDED');
      } else {
        setError('GENERAL_ERROR');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBatchUpdate();
  }, [fetchBatchUpdate]);

  return (
    <div className="min-h-screen bg-[#050507] text-gray-300 font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-20 hidden lg:flex flex-col items-center py-10 border-r border-white/5 bg-[#08080a] z-30">
        <div className="mb-14">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
            <BarChart3 className="text-white w-6 h-6" />
          </div>
        </div>
        <nav className="flex flex-col gap-8">
          <button className="p-3 text-blue-500 bg-blue-500/10 rounded-xl transition-all"><LayoutDashboard className="w-6 h-6" /></button>
          <button className="p-3 text-gray-700 hover:text-white transition-colors"><History className="w-6 h-6" /></button>
          <button className="p-3 text-gray-700 hover:text-white transition-colors"><Globe2 className="w-6 h-6" /></button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-20 p-4 sm:p-6 lg:p-10 max-w-[1700px] mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-4xl font-black text-white tracking-tighter">Institutional <span className="text-blue-500">Alpha</span></h1>
              <div className="flex gap-2">
                <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded border text-[9px] font-black uppercase tracking-[0.1em] ${data?.cacheStatus === 'HIT' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  <Database className="w-2.5 h-2.5" />
                  Cache: {data?.cacheStatus || 'IDLE'}
                </div>
                <div className="bg-blue-500/10 text-blue-400 text-[9px] px-2 py-0.5 rounded border border-blue-500/20 font-black uppercase tracking-[0.1em] flex items-center gap-1.5">
                  <Layers className="w-2.5 h-2.5" />
                  D+W Timeframe Sync
                </div>
              </div>
            </div>
            <p className="text-gray-500 text-sm font-medium flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${loading ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              資深分析師模型現正運作中 • 即時掃描日線 (D) 與週線 (W) 指標
            </p>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="text-right hidden sm:block">
              <p className="text-[9px] uppercase font-black text-gray-700 tracking-[0.2em] mb-1">Batch Last Sync</p>
              <p className="text-sm font-mono text-blue-500 font-bold">{data ? new Date(data.lastSync).toLocaleTimeString() : '--:--:--'}</p>
            </div>
            <button 
              onClick={fetchBatchUpdate}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl flex items-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-blue-600/20 font-black"
            >
              <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span className="text-sm">重啟多週期批次掃描</span>
            </button>
          </div>
        </header>

        {/* Error Handling UI */}
        {error && (
          <div className="mb-8 p-6 rounded-[2rem] border border-rose-500/30 bg-rose-500/5 flex items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="p-3 bg-rose-500/20 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-rose-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-black text-lg mb-1">
                {error === 'API_QUOTA_EXCEEDED' ? '檢測到 API 配額限制 (429)' : '分析引擎暫時離線'}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {error === 'API_QUOTA_EXCEEDED' 
                  ? 'Gemini 免費版每分鐘有請求次數限制。系統已嘗試重試但仍未成功，請等待 60 秒後再點擊重試按鈕。' 
                  : '獲取數據時發生未知錯誤，這可能是由於網路不穩定或模型超載。請稍後再試。'}
              </p>
              <button 
                onClick={fetchBatchUpdate}
                className="mt-4 flex items-center gap-2 text-rose-400 text-xs font-black uppercase tracking-widest hover:text-rose-300 transition-colors"
              >
                <Clock className="w-3.5 h-3.5" /> 點擊此處立即重新排隊
              </button>
            </div>
          </div>
        )}

        {/* Unified Intelligence Banner */}
        <section className="bg-gradient-to-r from-[#0d0d11] to-[#08080a] border border-white/5 rounded-[2rem] p-6 mb-8 relative overflow-hidden group shadow-2xl">
          <div className="absolute -right-10 -top-10 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px]" />
          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="bg-blue-500/10 p-4 rounded-2xl border border-blue-500/20">
              <TrendingUp className="w-7 h-7 text-blue-500" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-gray-600 font-black text-[10px] uppercase tracking-[0.3em]">
                  Multi-Timeframe Logic Engine
                </h2>
                {data?.cacheStatus === 'HIT' && <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded font-black">CACHED REPORT</span>}
              </div>
              <div className="text-base md:text-lg text-gray-200 font-semibold leading-relaxed">
                {loading ? (
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <div className="w-4 h-4 bg-blue-500 rounded-full animate-ping" />
                    <span className="animate-pulse">正在進行日週線共振分析並校準 TradingView 報價...</span>
                  </div>
                ) : data?.marketSentiment || '點擊重試以開始市場掃描。'}
              </div>
            </div>
          </div>
        </section>

        {/* Main Recommendations Container */}
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8 border-l-4 border-blue-600 pl-4">
            <div>
              <h3 className="text-2xl font-black text-white flex items-center gap-3">
                <Zap className="w-6 h-6 text-blue-500 fill-blue-500" /> 多週期共振個股 (Daily+Weekly)
              </h3>
              <p className="text-[10px] font-bold text-gray-600 uppercase mt-1 tracking-widest">
                僅選擇週線大趨勢向上且日線回檔至支撐位之高勝率標的
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-[550px] bg-[#0d0d0f] border border-white/5 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
              {data && data.stocks.length > 0 ? (
                data.stocks.map((stock, idx) => (
                  <StockCard key={`${stock.symbol}-${idx}`} stock={stock} />
                ))
              ) : (
                <div className="col-span-full py-32 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-[#08080a]">
                  <ShieldAlert className="w-20 h-20 text-gray-800 mx-auto mb-6" />
                  <p className="text-gray-400 text-xl font-black">
                    {error === 'API_QUOTA_EXCEEDED' ? '分析引擎因頻率限制暫停，請稍後重試。' : '當前市場暫無符合條件的標的'}
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
