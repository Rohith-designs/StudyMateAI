import React from 'react';
import { X, Download, FileText, Calendar, User, BookOpen } from 'lucide-react';

export default function PdfViewerModal({ material, isOpen, onClose }) {
  if (!isOpen || !material) return null;

  const pdfUrl = material.filePath
    ? `/${material.filePath.replace(/^\/+/, '')}`
    : `/api/materials/${material.id}/download`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] border border-slate-200 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-slate-900 text-sm truncate">
                {material.title}
              </h3>
              <p className="text-xs text-slate-500 truncate">
                {material.subjectName} ({material.subjectCode}) • {material.unitNumber} • {material.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <a
              href={`/api/materials/${material.id}/download`}
              download
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Info Strip */}
        <div className="px-5 py-2.5 bg-blue-50/50 border-b border-slate-100 flex flex-wrap items-center gap-4 text-xs text-slate-600">
          <span className="flex items-center gap-1.5 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-blue-600" />
            Reg: <strong>{material.regulation || 'PVP20'}</strong>
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <User className="w-3.5 h-3.5 text-blue-600" />
            {material.uploadedBy || 'Faculty Admin'}
          </span>
          <span className="flex items-center gap-1.5 font-medium">
            <Calendar className="w-3.5 h-3.5 text-blue-600" />
            {new Date(material.createdAt).toLocaleDateString()}
          </span>
          <span className="font-medium text-slate-500 ml-auto">
            {material.pageCount || 1} Pages • {Math.round((material.fileSize || 0) / 1024)} KB
          </span>
        </div>

        {/* Embedded PDF Viewer or fallback */}
        <div className="flex-1 bg-slate-100 relative">
          <iframe
            src={pdfUrl}
            title={material.title}
            className="w-full h-full border-none"
          />
        </div>
      </div>
    </div>
  );
}
