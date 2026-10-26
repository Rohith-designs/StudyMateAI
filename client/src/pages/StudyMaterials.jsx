import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Download,
  Eye,
  FileText,
  Calendar,
  User,
  Layers,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function StudyMaterials({
  materials,
  subjects,
  selectedSubjectCode,
  setSelectedSubjectCode,
  onViewPdf,
  onAskAiWithDoc
}) {
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    'ALL',
    'Lecture Notes',
    'Syllabus',
    'Previous Question Papers',
    'Lab Manual'
  ];

  const units = ['ALL', 'Unit 1', 'Unit 2', 'Unit 3', 'Unit 4', 'Unit 5'];

  // Filter materials
  const filteredMaterials = useMemo(() => {
    return materials.filter((doc) => {
      // Subject filter
      if (selectedSubjectCode && selectedSubjectCode !== 'ALL' && doc.subjectCode !== selectedSubjectCode) {
        return false;
      }
      // Unit filter
      if (selectedUnit !== 'ALL' && doc.unitNumber !== selectedUnit) {
        return false;
      }
      // Category filter
      if (selectedCategory !== 'ALL' && doc.category !== selectedCategory) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = doc.title?.toLowerCase().includes(q);
        const matchesFilename = doc.filename?.toLowerCase().includes(q);
        const matchesSummary = doc.summary?.toLowerCase().includes(q);
        const matchesSubject = doc.subjectName?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesFilename && !matchesSummary && !matchesSubject) {
          return false;
        }
      }
      return true;
    });
  }, [materials, selectedSubjectCode, selectedUnit, selectedCategory, searchQuery]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Study Materials</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              {filteredMaterials.length} Available
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Browse verified academic resources, course blueprints, and semester question papers for PVPSIT
          </p>
        </div>

        {/* Demo Content Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 self-start sm:self-auto">
          <GraduationCap className="w-4 h-4 text-blue-600" />
          <span>Regulation: <strong>PVP20 Autonomous</strong></span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        {/* Subject Filter Pills */}
        <div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            Subject Filter
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedSubjectCode('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedSubjectCode === 'ALL' || !selectedSubjectCode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              All Subjects
            </button>
            {subjects.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectCode(s.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedSubjectCode === s.code
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {s.shortName || s.name} ({s.code})
              </button>
            ))}
          </div>
        </div>

        {/* Unit and Category Pills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Unit Filter
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {units.map((u) => (
                <button
                  key={u}
                  onClick={() => setSelectedUnit(u)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedUnit === u
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Category Filter
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setSelectedCategory(c)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === c
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Search input inside filter */}
        <div className="pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter by keyword, topic, or file name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Materials Grid */}
      {filteredMaterials.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/80 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No materials match your criteria</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your subject, unit, or category filters. You can also upload new lecture notes in the Faculty Upload section.
          </p>
          <button
            onClick={() => {
              setSelectedSubjectCode('ALL');
              setSelectedUnit('ALL');
              setSelectedCategory('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200/60">
                    {doc.subjectCode}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {doc.unitNumber}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {doc.category}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-2">
                  {doc.title}
                </h3>

                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                  {doc.summary || 'Official academic notes for comprehensive engineering semester examination preparation.'}
                </p>

                {/* Metadata strip */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-500">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[160px]">{doc.uploadedBy || 'Faculty Admin'}</span>
                    </span>
                    <span>{Math.round((doc.fileSize || 0) / 1024)} KB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </span>
                    <span className="font-semibold text-slate-600">{doc.pageCount || 1} Pages</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => onViewPdf(doc)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl text-xs font-semibold transition-all shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Note</span>
                </button>

                <a
                  href={`/api/materials/${doc.id}/download`}
                  download
                  className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </a>

                <button
                  onClick={() => onAskAiWithDoc(doc)}
                  className="p-2 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 rounded-xl transition-colors"
                  title="Ask AI regarding this document"
                >
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
