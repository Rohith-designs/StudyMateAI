import React from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  Sparkles,
  CheckCircle2,
  UploadCloud,
  Layers,
  ChevronRight,
  ShieldCheck,
  Server
} from 'lucide-react';

export default function Sidebar({
  activeTab,
  setActiveTab,
  systemStatus,
  mobileOpen,
  setMobileOpen
}) {
  const navItems = [
    {
      id: 'dashboard',
      label: 'Student Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'materials',
      label: 'Study Materials',
      icon: BookOpen,
      badge: systemStatus?.totalDocuments || null
    },
    {
      id: 'tutor',
      label: 'AI Study Assistant',
      icon: Sparkles,
      badge: 'Core'
    },
    {
      id: 'quizzes',
      label: 'Practice Quizzes',
      icon: CheckCircle2,
      badge: systemStatus?.totalQuizzes || null
    },
    {
      id: 'upload',
      label: 'Faculty Upload',
      icon: UploadCloud,
      badge: 'Admin'
    }
  ];

  const isLiveAI = systemStatus?.mode === 'live_rag';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  StudyMate<span className="text-blue-600">AI</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60 uppercase tracking-wider">
                  MVP
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Verified Engineering Hub</p>
            </div>
          </div>

          {/* Institutional College Tag */}
          <div className="mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200/60 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold text-slate-700 truncate">
                PVPSIT Vijayawada
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                Dept of CSE & IT • PVP20
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Academic Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-4 h-4 text-white/70" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* AI & System Status Pill */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="p-3 rounded-xl border border-slate-200/80 bg-white shadow-xs">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                RAG Engine Status
              </span>
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isLiveAI
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isLiveAI ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
                  }`}
                />
                {isLiveAI ? 'Live AI Mode' : 'Demo Mode'}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              {isLiveAI
                ? `Active LLM: ${systemStatus?.llmProvider}`
                : 'Verified grounded answers using PVPSIT curriculum notes.'}
            </p>

            <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
              <span className="flex items-center gap-1">
                <Layers className="w-3 h-3 text-slate-400" />
                {systemStatus?.totalChunks || 11} indexed chunks
              </span>
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3 text-slate-400" />
                {systemStatus?.storage === 'PostgreSQL' ? 'PostgreSQL' : 'Local Store'}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
