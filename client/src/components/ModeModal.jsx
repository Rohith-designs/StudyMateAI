import React from 'react';
import { X, ShieldAlert, CheckCircle, Info, Key, Database, Sparkles, Cpu } from 'lucide-react';

export default function ModeModal({ isOpen, onClose, systemStatus }) {
  if (!isOpen) return null;

  const isLive = systemStatus?.mode === 'live_rag';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">System Configuration & Transparency</h3>
              <p className="text-xs text-slate-500">Live AI vs Demo Mode Breakdown</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-sm text-slate-600">
          {/* Current Status Pill */}
          <div className={`p-4 rounded-xl border ${
            isLive
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2 font-bold mb-1">
              {isLive ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <Info className="w-4 h-4 text-amber-600" />}
              <span>{isLive ? 'Live AI Mode Active' : 'Transparent Demo Mode Active'}</span>
            </div>
            <p className="text-xs leading-relaxed">
              {isLive
                ? `Connected to ${systemStatus?.llmProvider}. Course passages are retrieved via vector search and fed into the live LLM with grounded academic constraints.`
                : 'No external LLM API key is configured. StudyMateAI uses verified course syllabus notes with cosine vector similarity and clearly labels answers as demo responses.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                LLM Provider
              </span>
              <p className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-600" />
                {systemStatus?.llmProvider || 'Demo Engine'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Data Storage
              </span>
              <p className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-indigo-600" />
                {systemStatus?.storage || 'Resilient Local Store'}
              </p>
            </div>
          </div>

          {/* Instructions to toggle Live AI */}
          <div className="p-4 rounded-xl bg-slate-100/70 border border-slate-200 text-xs space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-blue-600" />
              How to enable Live AI Mode:
            </p>
            <p className="text-slate-600 leading-relaxed">
              Open <code className="px-1.5 py-0.5 bg-white rounded border border-slate-300 font-mono text-[11px]">server/.env</code> and add your API key:
            </p>
            <div className="bg-slate-900 text-slate-100 p-2.5 rounded-lg font-mono text-[11px] space-y-1">
              <p className="text-emerald-400"># Either Google Gemini or OpenAI:</p>
              <p>GEMINI_API_KEY=your_gemini_api_key</p>
              <p># or</p>
              <p>OPENAI_API_KEY=your_openai_api_key</p>
            </div>
            <p className="text-[11px] text-slate-500">
              Restart the backend server after updating <code className="text-slate-700">.env</code> to activate live synthesis.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold transition-colors"
          >
            Understood
          </button>
        </div>
      </div>
    </div>
  );
}
