import React, { useState } from 'react';
import {
  UploadCloud,
  FileText,
  CheckCircle,
  AlertCircle,
  Trash2,
  Eye,
  Layers,
  GraduationCap,
  Calendar,
  Building,
  BookOpen,
  ArrowRight
} from 'lucide-react';
import { uploadMaterial, deleteMaterial } from '../services/api';

export default function FacultyUpload({
  subjects,
  materials,
  onMaterialsUpdated,
  onViewPdf
}) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [subjectCode, setSubjectCode] = useState(subjects[0]?.code || '20CS3301');
  const [regulation, setRegulation] = useState('PVP20');
  const [academicYear, setAcademicYear] = useState('2024-25');
  const [unitNumber, setUnitNumber] = useState('Unit 1');
  const [category, setCategory] = useState('Lecture Notes');

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null); // { type: 'success' | 'error', text, chunksCount }
  const [deletingId, setDeletingId] = useState(null);
  const [tableSearch, setTableSearch] = useState('');

  // Handle drag-and-drop
  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const validateAndSetFile = (selectedFile) => {
    if (!selectedFile) return;

    if (!selectedFile.name.toLowerCase().endsWith('.pdf') && selectedFile.type !== 'application/pdf') {
      setStatusMessage({
        type: 'error',
        text: 'Invalid file format. Please select a PDF document (.pdf).'
      });
      setFile(null);
      return;
    }

    if (selectedFile.size > 15 * 1024 * 1024) {
      setStatusMessage({
        type: 'error',
        text: 'File size exceeds maximum allowable limit of 15MB.'
      });
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setStatusMessage(null);
    if (!title) {
      // Auto-suggest title from filename
      const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setTitle(cleanName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatusMessage({ type: 'error', text: 'Please select a PDF file to upload.' });
      return;
    }
    if (!title.trim()) {
      setStatusMessage({ type: 'error', text: 'Please enter a document title.' });
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setStatusMessage(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('department', department);
      formData.append('subjectCode', subjectCode);
      formData.append('regulation', regulation);
      formData.append('academicYear', academicYear);
      formData.append('unitNumber', unitNumber);
      formData.append('category', category);

      // Match subject name
      const selSubject = subjects.find(s => s.code === subjectCode);
      if (selSubject) {
        formData.append('subjectName', selSubject.name);
      }

      const response = await uploadMaterial(formData, (progress) => {
        setUploadProgress(progress);
      });

      setStatusMessage({
        type: 'success',
        text: `Document "${response.material.title}" processed successfully. Extracted and indexed ${response.chunksIndexed || 0} text chunks into the RAG engine.`,
        chunksCount: response.chunksIndexed
      });

      // Reset form
      setFile(null);
      setTitle('');
      setUploadProgress(0);

      // Refresh materials in parent state
      if (onMaterialsUpdated) onMaterialsUpdated();
    } catch (err) {
      console.error('Upload error:', err);
      setStatusMessage({
        type: 'error',
        text: err.message || 'Failed to upload document. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (docId, docTitle) => {
    if (!window.confirm(`Are you sure you want to delete "${docTitle}"? This will remove its indexed chunks from the AI assistant.`)) {
      return;
    }

    setDeletingId(docId);
    try {
      await deleteMaterial(docId);
      setStatusMessage({
        type: 'success',
        text: `Document "${docTitle}" removed successfully.`
      });
      if (onMaterialsUpdated) onMaterialsUpdated();
    } catch (err) {
      setStatusMessage({
        type: 'error',
        text: 'Failed to delete material: ' + err.message
      });
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMaterials = materials.filter(m =>
    m.title?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    m.subjectCode?.toLowerCase().includes(tableSearch.toLowerCase()) ||
    m.category?.toLowerCase().includes(tableSearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Faculty & Admin Upload Portal
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
            PVPSIT Official
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          Upload semester lecture notes, syllabus blueprints, and question papers. Documents are automatically parsed, chunked, and indexed for student RAG assistance.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Dropzone */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Academic PDF Document <span className="text-rose-500">*</span>
            </label>

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                file
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
              }`}
              onClick={() => document.getElementById('facultyFileInput')?.click()}
            >
              <input
                id="facultyFileInput"
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    validateAndSetFile(e.target.files[0]);
                  }
                }}
              />

              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">{file.name}</p>
                  <p className="text-xs text-slate-500">
                    {Math.round(file.size / 1024)} KB • Ready for extraction
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold mt-1"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-bold text-slate-800">
                    Click to browse or drag & drop PDF here
                  </p>
                  <p className="text-xs text-slate-500">
                    Supports official course PDFs up to 15MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Document Title */}
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DSA Unit 2: Balanced Search Trees & AVL Rotations"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department
              </label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Computer Science & Engineering">Computer Science & Engineering (CSE)</option>
                <option value="Information Technology">Information Technology (IT)</option>
                <option value="Artificial Intelligence & Data Science">AI & Data Science (AI&DS)</option>
                <option value="Electronics & Communication">Electronics & Communication (ECE)</option>
              </select>
            </div>

            {/* Subject Code */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Subject & Course Code <span className="text-rose-500">*</span>
              </label>
              <select
                value={subjectCode}
                onChange={(e) => setSubjectCode(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.code}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Unit Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Unit Number
              </label>
              <select
                value={unitNumber}
                onChange={(e) => setUnitNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Unit 1">Unit 1</option>
                <option value="Unit 2">Unit 2</option>
                <option value="Unit 3">Unit 3</option>
                <option value="Unit 4">Unit 4</option>
                <option value="Unit 5">Unit 5</option>
                <option value="General">General / All Units</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Document Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="Lecture Notes">Lecture Notes</option>
                <option value="Syllabus">Syllabus / Course Blueprint</option>
                <option value="Previous Question Papers">Previous Question Papers</option>
                <option value="Lab Manual">Lab Manual & Solutions</option>
                <option value="Question Bank">Question Bank</option>
              </select>
            </div>

            {/* Regulation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Regulation
              </label>
              <select
                value={regulation}
                onChange={(e) => setRegulation(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="PVP20">PVP20 (Current Autonomous)</option>
                <option value="PVP19">PVP19</option>
                <option value="PVP14">PVP14</option>
              </select>
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Academic Year
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:outline-none"
              >
                <option value="2024-25">2024-25 (Current)</option>
                <option value="2023-24">2023-24</option>
                <option value="2022-23">2022-23</option>
              </select>
            </div>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="space-y-1.5 p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
                <span>Uploading & Parsing PDF text into vector chunks...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-blue-200/60 overflow-hidden">
                <div
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status Alert Banner */}
          {statusMessage && (
            <div
              className={`p-4 rounded-xl text-xs sm:text-sm flex items-start gap-3 border ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{statusMessage.text}</p>
                {statusMessage.chunksCount !== undefined && (
                  <p className="text-[11px] text-emerald-700 mt-0.5">
                    RAG Knowledge Base refreshed. The AI Study Assistant can now cite this document.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isUploading || !file}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all shadow-sm flex items-center gap-2 ${
                isUploading || !file
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
              }`}
            >
              <UploadCloud className="w-4 h-4" />
              <span>{isUploading ? 'Extracting & Indexing...' : 'Upload & Index for AI'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Document Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Department Document Repository
            </h2>
            <p className="text-xs text-slate-500">
              {materials.length} uploaded materials currently active in the RAG retrieval store
            </p>
          </div>

          <input
            type="text"
            placeholder="Search documents table..."
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Document Title</th>
                <th className="py-3 px-3">Subject & Code</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMaterials.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-800 max-w-xs truncate">
                    {doc.title}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded text-[10px]">
                      {doc.subjectCode}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-medium">{doc.unitNumber}</td>
                  <td className="py-3 px-3">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-slate-400">
                    {new Date(doc.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => onViewPdf(doc)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50"
                        title="View PDF"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        disabled={deletingId === doc.id}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
