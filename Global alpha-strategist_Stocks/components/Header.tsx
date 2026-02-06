
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-slate-900/50 backdrop-blur-md sticky top-0 z-50 border-b border-slate-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none">WealthVision <span className="text-blue-500">Pro</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Veteran Analytics AI</p>
          </div>
        </div>
        
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-300">
          <a href="#" className="hover:text-blue-400 transition-colors">Market Pulse</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Screener</a>
          <a href="#" className="hover:text-blue-400 transition-colors">Portfolios</a>
          <a href="#" className="hover:text-blue-400 transition-colors">News Feed</a>
        </nav>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800/50">
            Live Analysis Active
          </span>
          <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 w-8 h-8 rounded-full flex items-center justify-center transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
