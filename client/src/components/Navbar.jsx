import React from 'react';
import {
  Menu,
  Search,
  Sparkles,
  Info,
  User,
  GraduationCap
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  systemStatus,
  setMobileOpen,
  onOpenModeInfo
}) {
  const isLiveAI = systemStatus?.mode === 'live_rag';

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4">
      {/* Mobile Toggle & Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 lg:hidden focus:outline-none"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <GraduationCap className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-base text-slate-900">
            StudyMate<span className="text-blue-600">AI</span>
          </span>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="flex-1 max-w-xl mx-auto">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (onSearchSubmit) onSearchSubmit(searchTerm);
          }}
          className="relative"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search notes, algorithms, syllabus, topics (e.g. AVL tree, BCNF, Paging)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-sm text-slate-800 rounded-xl border border-transparent focus:border-blue-400 focus:ring-3 focus:ring-blue-100 transition-all outline-none"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 hover:bg-slate-300 rounded-full w-4 h-4 flex items-center justify-center"
            >
              ×
            </button>
          )}
        </form>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* Mode Indicator Pill with Info Click */}
        <button
          onClick={onOpenModeInfo}
          className={`hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            isLiveAI
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
              : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
          }`}
          title="Click to view AI & storage configuration details"
        >
          <span className={`w-2 h-2 rounded-full ${isLiveAI ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          <span>{isLiveAI ? 'Live RAG Active' : 'Demo Mode Active'}</span>
          <Info className="w-3.5 h-3.5 opacity-70" />
        </button>

        {/* Student Profile Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs">
            PV
          </div>
          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-slate-800 leading-tight">Engineering Student</p>
            <p className="text-[10px] text-slate-500 leading-tight">PVPSIT • CSE II B.Tech</p>
          </div>
        </div>
      </div>
    </header>
  );
}
