
import React from 'react';
import { AnalysisResult } from '../types';

interface AnalysisDisplayProps {
  result: AnalysisResult | null;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result }) => {
  if (!result) return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
      <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 className="text-xl font-medium text-slate-300">Awaiting Market Scan</h3>
      <p className="text-slate-500 mt-2">Click the scan button to begin veteran-level financial analysis.</p>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
             <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
          </svg>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></div>
          <h2 className="text-2xl font-bold">Comprehensive Analysis Report</h2>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 space-y-6">
          {result.marketSentiment.split('\n').map((line, i) => {
            if (line.startsWith('###')) {
              return <h3 key={i} className="text-xl font-bold text-blue-400 mt-8 mb-4 border-b border-slate-800 pb-2">{line.replace('###', '')}</h3>;
            }
            if (line.startsWith('##')) {
              return <h2 key={i} className="text-2xl font-bold text-white mt-10 mb-6 flex items-center gap-2">
                <span className="w-1 h-8 bg-blue-600 rounded-full inline-block"></span>
                {line.replace('##', '')}
              </h2>;
            }
            if (line.trim().startsWith('-')) {
              return <li key={i} className="ml-4 list-disc marker:text-blue-500">{line.replace('-', '').trim()}</li>;
            }
            return <p key={i} className="leading-relaxed">{line}</p>;
          })}
        </div>

        {result.sources.length > 0 && (
          <div className="mt-12 pt-6 border-t border-slate-800">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">Grounding Sources</h4>
            <div className="flex flex-wrap gap-2">
              {result.sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-blue-300 rounded-full flex items-center gap-2 transition-colors"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                  </svg>
                  {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisDisplay;
