import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import ModeModal from './components/ModeModal';
import SourceModal from './components/SourceModal';
import PdfViewerModal from './components/PdfViewerModal';
import Dashboard from './pages/Dashboard';
import StudyMaterials from './pages/StudyMaterials';
import FacultyUpload from './pages/FacultyUpload';
import AITutor from './pages/AITutor';
import QuizHub from './pages/QuizHub';
import {
  fetchSystemStatus,
  fetchSubjects,
  fetchMaterials,
  fetchQuizzes
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  // Global Academic Data
  const [subjects, setSubjects] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [systemStatus, setSystemStatus] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Search & Navigation Filters
  const [globalSearch, setGlobalSearch] = useState('');
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('ALL');
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [tutorPrefill, setTutorPrefill] = useState(null);

  // Modals
  const [isModeModalOpen, setIsModeModalOpen] = useState(false);
  const [activeSourceModal, setActiveSourceModal] = useState(null);
  const [activePdfModal, setActivePdfModal] = useState(null);

  // Load all initial state
  const loadData = async () => {
    try {
      const [statusRes, subjectsRes, materialsRes, quizzesRes] = await Promise.all([
        fetchSystemStatus().catch(() => null),
        fetchSubjects().catch(() => ({ subjects: [] })),
        fetchMaterials().catch(() => ({ materials: [] })),
        fetchQuizzes().catch(() => ({ quizzes: [] }))
      ]);

      if (statusRes) setSystemStatus(statusRes);
      if (subjectsRes?.subjects) setSubjects(subjectsRes.subjects);
      if (materialsRes?.materials) setMaterials(materialsRes.materials);
      if (quizzesRes?.quizzes) setQuizzes(quizzesRes.quizzes);
    } catch (err) {
      console.error('Failed to load application data:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Global search submit -> jumps to Study Materials with search filter
  const handleGlobalSearch = (term) => {
    if (term.trim()) {
      setActiveTab('materials');
    }
  };

  // Shortcut handlers
  const handleSelectSubject = (code) => {
    setSelectedSubjectCode(code);
    setActiveTab('materials');
  };

  const handleSelectQuiz = (quizId) => {
    setActiveQuizId(quizId);
    setActiveTab('quizzes');
  };

  const handleQuickPrompt = (promptItem) => {
    setTutorPrefill(promptItem);
    setActiveTab('tutor');
  };

  const handleAskAiWithDoc = (doc) => {
    setTutorPrefill({
      prompt: `Please explain the key exam topics covered in "${doc.title}" for ${doc.unitNumber}.`,
      subjectCode: doc.subjectCode,
      unitNumber: doc.unitNumber
    });
    setActiveTab('tutor');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        systemStatus={systemStatus}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72">
        {/* Navbar Header */}
        <Navbar
          searchTerm={globalSearch}
          setSearchTerm={setGlobalSearch}
          onSearchSubmit={handleGlobalSearch}
          systemStatus={systemStatus}
          setMobileOpen={setMobileOpen}
          onOpenModeInfo={() => setIsModeModalOpen(true)}
        />

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {loadingInitial ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
              <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-semibold text-slate-500">
                Loading StudyMateAI PVPSIT Hub...
              </p>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && (
                <Dashboard
                  subjects={subjects}
                  materials={materials}
                  quizzes={quizzes}
                  systemStatus={systemStatus}
                  onNavigate={setActiveTab}
                  onSelectSubject={handleSelectSubject}
                  onSelectQuiz={handleSelectQuiz}
                  onQuickPrompt={handleQuickPrompt}
                  onViewPdf={(doc) => setActivePdfModal(doc)}
                />
              )}

              {activeTab === 'materials' && (
                <StudyMaterials
                  materials={materials}
                  subjects={subjects}
                  selectedSubjectCode={selectedSubjectCode}
                  setSelectedSubjectCode={setSelectedSubjectCode}
                  onViewPdf={(doc) => setActivePdfModal(doc)}
                  onAskAiWithDoc={handleAskAiWithDoc}
                />
              )}

              {activeTab === 'tutor' && (
                <AITutor
                  subjects={subjects}
                  materials={materials}
                  systemStatus={systemStatus}
                  prefillQuery={tutorPrefill}
                  onOpenSourceModal={(src) => setActiveSourceModal(src)}
                  onOpenModeInfo={() => setIsModeModalOpen(true)}
                />
              )}

              {activeTab === 'quizzes' && (
                <QuizHub
                  quizzes={quizzes}
                  subjects={subjects}
                  activeQuizId={activeQuizId}
                  setActiveQuizId={setActiveQuizId}
                  onAskAiTopic={(topic, code) => handleQuickPrompt({ prompt: topic, subjectCode: code })}
                />
              )}

              {activeTab === 'upload' && (
                <FacultyUpload
                  subjects={subjects}
                  materials={materials}
                  onMaterialsUpdated={loadData}
                  onViewPdf={(doc) => setActivePdfModal(doc)}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Modals & Overlays */}
      <ModeModal
        isOpen={isModeModalOpen}
        onClose={() => setIsModeModalOpen(false)}
        systemStatus={systemStatus}
      />

      <SourceModal
        source={activeSourceModal}
        isOpen={Boolean(activeSourceModal)}
        onClose={() => setActiveSourceModal(null)}
      />

      <PdfViewerModal
        material={activePdfModal}
        isOpen={Boolean(activePdfModal)}
        onClose={() => setActivePdfModal(null)}
      />
    </div>
  );
}
