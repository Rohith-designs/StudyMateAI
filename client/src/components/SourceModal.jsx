import React from 'react';
import { X, FileText, BookOpen, ExternalLink, Download, Layers, ShieldCheck } from 'lucide-react';

export default function SourceModal({ source, isOpen, onClose }) {
  if (!isOpen || !source) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-blue-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  {source.subjectCode}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  {source.unitNumber}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mt-0.5 leading-snug line-clamp-1">
                {source.documentTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {/* Metadata Bar */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
            <div className="flex items-center gap-1.5 text-slate-600">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Reference: <strong>Page ~{source.pageNumber || 1}</strong></span>
            </div>
            {source.similarityScore !== undefined && (
              <div className="flex items-center gap-1.5 text-slate-600">
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Relevance: <strong>{Math.round(source.similarityScore * 100)}% match</strong></span>
              </div>
            )}
          </div>

          {/* Retrieved Grounded Excerpt */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified Retrieved Course Material Passage
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-sans whitespace-pre-line border-l-4 border-l-blue-600">
              {source.snippet || source.content || 'Excerpt unavailable.'}
            </div>
          </div>

          <p className="text-[11px] text-slate-500 italic">
            * This passage was indexed from the official uploaded PVPSIT department notes and retrieved based on your inquiry.
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Prasad V. Potluri Siddhartha Institute of Technology
          </span>
          <div className="flex items-center gap-2">
            {source.documentId && (
              <a
                href={`/api/materials/${source.documentId}/download`}
                download
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </a>
            )}
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
