import React from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Download,
  Eye,
  ArrowRight,
  Clock,
  FileText,
  Search,
  Layers,
  Award,
  ChevronRight
} from 'lucide-react';

export default function Dashboard({
  subjects,
  materials,
  quizzes,
  systemStatus,
  onNavigate,
  onSelectSubject,
  onSelectQuiz,
  onQuickPrompt,
  onViewPdf
}) {
  const isLiveAI = systemStatus?.mode === 'live_rag';

  const quickPrompts = [
    {
      topic: 'AVL Tree Rotations',
      subjectCode: '20CS3301',
      unitNumber: 'Unit 2',
      prompt: 'Explain AVL tree balance factors and all four rotation cases (LL, RR, LR, RL) with an example.'
    },
    {
      topic: 'DBMS ACID Properties',
      subjectCode: '20CS3402',
      unitNumber: 'Unit 4',
      prompt: 'What are the ACID properties in DBMS? Explain how atomicity and durability are maintained.'
    },
    {
      topic: 'CPU Addressing Modes',
      subjectCode: '20CS3303',
      unitNumber: 'Unit 1',
      prompt: 'Describe the primary addressing modes in Computer Organization and how the effective address is computed.'
    },
    {
      topic: 'Virtual Memory & Paging',
      subjectCode: '20CS3404',
      unitNumber: 'Unit 4',
      prompt: 'Explain the page fault handling sequence in Operating Systems and why Belady anomaly occurs in FIFO.'
    }
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl shadow-blue-500/10">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide border border-white/20">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>PVPSIT Academic Semester Prep • PVP20 Regulation</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back to StudyMate<span className="text-blue-200">AI</span>
          </h1>

          <p className="text-sm sm:text-base text-blue-100 font-normal leading-relaxed max-w-2xl">
            Access organized department notes, practice exam-style quizzes, and ask questions grounded strictly in official PVPSIT engineering curriculum materials.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('tutor')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-700 hover:bg-blue-50 text-xs sm:text-sm font-bold shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4 text-blue-600" />
              Ask AI Study Assistant
            </button>

            <button
              onClick={() => onNavigate('materials')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-800/60 hover:bg-blue-800/80 text-white border border-blue-400/30 text-xs sm:text-sm font-semibold transition-all"
            >
              <BookOpen className="w-4 h-4" />
              Browse Study Materials ({materials.length})
            </button>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 rounded-full bg-white/5 blur-2xl pointer-events-none" />
      </div>

      {/* Core Subjects Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Core Engineering Subjects</h2>
            <p className="text-xs text-slate-500">II B.Tech CSE & IT Curriculum with verified syllabi</p>
          </div>
          <button
            onClick={() => onNavigate('materials')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {subjects.map((sub) => {
            const subjectMaterialsCount = materials.filter(m => m.subjectCode === sub.code).length;
            const subjectQuizzes = quizzes.filter(q => q.subjectCode === sub.code);

            return (
              <div
                key={sub.id}
                className="group bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200/60">
                      {sub.code}
                    </span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {sub.semester}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                    {sub.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {sub.description}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-medium">
                      <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                      {subjectMaterialsCount} Notes
                    </span>
                    <span className="flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {subjectQuizzes.length} Quizzes
                    </span>
                    <span className="text-slate-400">5 Units</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectSubject(sub.code);
                      onNavigate('materials');
                    }}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 rounded-lg text-xs font-semibold text-center transition-colors"
                  >
                    Notes
                  </button>

                  <button
                    onClick={() => {
                      onQuickPrompt({
                        prompt: `Summarize key examination concepts for ${sub.name} (${sub.code}).`,
                        subjectCode: sub.code
                      });
                      onNavigate('tutor');
                    }}
                    className="py-1.5 px-2.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-600 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                    title="Ask AI about this subject"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>

                  {subjectQuizzes[0] && (
                    <button
                      onClick={() => {
                        onSelectQuiz(subjectQuizzes[0].id);
                        onNavigate('quizzes');
                      }}
                      className="py-1.5 px-2.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                      title="Practice Quiz"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* AI Tutor Quick Shortcut & Prompts */}
      <section className="bg-gradient-to-br from-blue-50/70 via-indigo-50/40 to-slate-50 rounded-2xl border border-blue-200/80 p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                Grounded AI Study Assistant
              </h2>
              <p className="text-xs text-slate-600">
                Ask questions answered strictly from verified PVPSIT course materials
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('tutor')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            <span>Open Full AI Tutor</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
          Suggested Engineering Exam Inquiries:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onQuickPrompt(item);
                onNavigate('tutor');
              }}
              className="text-left p-3 rounded-xl bg-white hover:bg-blue-600 hover:text-white border border-slate-200/80 text-slate-700 text-xs font-medium transition-all group shadow-2xs hover:shadow-sm"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400 group-hover:text-blue-100 mb-1">
                <span>{item.subjectCode}</span>
                <span>{item.unitNumber}</span>
              </div>
              <p className="font-semibold text-slate-900 group-hover:text-white line-clamp-1">
                {item.topic}
              </p>
              <p className="text-[11px] text-slate-500 group-hover:text-blue-100 line-clamp-2 mt-0.5">
                {item.prompt}
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* Two Column Layout: Recent Materials & Practice Quizzes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Study Materials (2 columns) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Recent Study Materials</h2>
              <p className="text-xs text-slate-500">Official syllabus notes, blueprints, and question papers</p>
            </div>
            <button
              onClick={() => onNavigate('materials')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Browse All</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {materials.slice(0, 4).map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-all shadow-2xs hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-slate-900 text-sm truncate">
                      {doc.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-slate-500">
                      <span className="font-semibold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                        {doc.subjectCode}
                      </span>
                      <span>{doc.unitNumber}</span>
                      <span>•</span>
                      <span className="text-slate-600">{doc.category}</span>
                      <span>•</span>
                      <span>{Math.round((doc.fileSize || 0) / 1024)} KB</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <button
                    onClick={() => onViewPdf(doc)}
                    className="p-2 rounded-xl text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                    title="View Document"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <a
                    href={`/api/materials/${doc.id}/download`}
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Practice Quizzes Card (1 column) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Practice Quizzes</h2>
              <p className="text-xs text-slate-500">Exam-style multiple-choice questions</p>
            </div>
            <button
              onClick={() => onNavigate('quizzes')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>All Quizzes</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {quizzes.slice(0, 3).map((q) => (
              <div
                key={q.id}
                className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 transition-all shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {q.subjectCode} • {q.unitNumber}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {q.questionCount || 5} Questions
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-1">
                    {q.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    {q.description}
                  </p>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Passing: 60%
                  </span>
                  <button
                    onClick={() => {
                      onSelectQuiz(q.id);
                      onNavigate('quizzes');
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                  >
                    <span>Start Quiz</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Notice about PVPSIT testbed */}
          <div className="p-3.5 rounded-xl bg-slate-100/70 border border-slate-200/80 text-xs text-slate-600 space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              Verified Demonstration Content
            </p>
            <p className="text-[11px] leading-relaxed text-slate-500">
              Initial testbed for Prasad V. Potluri Siddhartha Institute of Technology (PVPSIT). All sample materials follow the PVP20 autonomous curriculum.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
