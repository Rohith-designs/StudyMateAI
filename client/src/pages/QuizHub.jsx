import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  HelpCircle,
  Award,
  RotateCcw,
  BookOpen,
  ArrowRight,
  AlertCircle,
  FileText,
  Clock,
  Sparkles,
  ChevronLeft
} from 'lucide-react';
import { fetchQuizById, submitQuizAnswers } from '../services/api';

export default function QuizHub({
  quizzes,
  subjects,
  activeQuizId,
  setActiveQuizId,
  onAskAiTopic
}) {
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('ALL');
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [qId]: optionIndex }
  const [quizResults, setQuizResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load active quiz when activeQuizId is set
  useEffect(() => {
    if (activeQuizId) {
      loadQuiz(activeQuizId);
    }
  }, [activeQuizId]);

  const loadQuiz = async (id) => {
    setIsLoading(true);
    setError(null);
    setQuizResults(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);

    try {
      const response = await fetchQuizById(id);
      setCurrentQuiz(response.quiz);
    } catch (err) {
      console.error('Failed to load quiz:', err);
      setError('Could not load quiz questions: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    if (quizResults) return; // Prevent change after submit
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (!currentQuiz) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await submitQuizAnswers(currentQuiz.id, userAnswers);
      setQuizResults(response.results);
    } catch (err) {
      setError('Failed to submit quiz: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setUserAnswers({});
    setQuizResults(null);
    setCurrentQuestionIndex(0);
  };

  const handleBackToList = () => {
    setCurrentQuiz(null);
    setQuizResults(null);
    setUserAnswers({});
    setActiveQuizId(null);
  };

  const filteredQuizzes = quizzes.filter(q =>
    selectedSubjectCode === 'ALL' || q.subjectCode === selectedSubjectCode
  );

  // View: Taking or Reviewing a Quiz
  if (currentQuiz) {
    const questions = currentQuiz.questions || [];
    const currentQ = questions[currentQuestionIndex];
    const answeredCount = Object.keys(userAnswers).length;

    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-12">
        {/* Back and Title Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={handleBackToList}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Practice Quizzes</span>
          </button>

          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {currentQuiz.subjectCode} • {currentQuiz.unitNumber}
          </span>
        </div>

        {/* Results Screen */}
        {quizResults ? (
          <div className="space-y-6">
            {/* Score Summary Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-blue-500/20">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assessment Completed
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  {quizResults.score} / {quizResults.total} Correct
                </h2>
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold">
                  <span>Score: {quizResults.percentage}%</span>
                  <span>•</span>
                  <span>{quizResults.grade}</span>
                </div>
              </div>

              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Review each question below to inspect correct answers and explanations verified against the PVPSIT syllabus.
              </p>

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleRetry}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>

                <button
                  onClick={handleBackToList}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                >
                  Return to Quizzes
                </button>
              </div>
            </div>

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                Question Explanations & Syllabi Grounds:
              </h3>

              {quizResults.review.map((item, idx) => (
                <div
                  key={item.questionId}
                  className={`p-5 rounded-2xl border bg-white space-y-3 ${
                    item.isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-xs font-bold text-slate-400">
                      Question {idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {item.isCorrect ? 'Correct (+1)' : 'Incorrect'}
                    </span>
                  </div>

                  <p className="font-bold text-slate-900 text-sm">{item.question}</p>

                  {/* Options List */}
                  <div className="space-y-1.5">
                    {item.options.map((opt, optIdx) => {
                      const isUserChosen = item.selectedAnswer === optIdx;
                      const isRightOption = item.correctAnswer === optIdx;

                      let optStyle = 'bg-slate-50 border-slate-200 text-slate-700';
                      if (isRightOption) {
                        optStyle = 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold';
                      } else if (isUserChosen && !isRightOption) {
                        optStyle = 'bg-rose-50 border-rose-300 text-rose-900 line-through';
                      }

                      return (
                        <div
                          key={optIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${optStyle}`}
                        >
                          <span>{opt}</span>
                          {isRightOption && (
                            <span className="text-[10px] text-emerald-700 font-bold uppercase">
                              Correct Answer
                            </span>
                          )}
                          {isUserChosen && !isRightOption && (
                            <span className="text-[10px] text-rose-700 font-bold uppercase">
                              Your Choice
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Grounded Explanation */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-700 space-y-1">
                    <p className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Grounded Syllabus Explanation ({item.referenceUnit})
                    </p>
                    <p className="leading-relaxed text-slate-600">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Active Quiz Taking Interface */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
            {/* Quiz Info Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                <span>
                  Question <strong>{currentQuestionIndex + 1}</strong> of <strong>{questions.length}</strong>
                </span>
                <span>
                  {answeredCount} of {questions.length} Answered
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            {currentQ && (
              <div className="space-y-4">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                  {currentQ.question}
                </h2>

                {/* Options */}
                <div className="space-y-2.5">
                  {currentQ.options.map((opt, optIndex) => {
                    const isSelected = userAnswers[currentQ.id] === optIndex;

                    return (
                      <button
                        key={optIndex}
                        onClick={() => handleSelectOption(currentQ.id, optIndex)}
                        className={`w-full text-left p-3.5 rounded-2xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-2xs font-semibold'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${
                              isSelected
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </span>
                          <span>{opt}</span>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Navigation & Submit Controls */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
                className={`px-4 py-2 rounded-xl text-xs font-semibold ${
                  currentQuestionIndex === 0
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Previous
              </button>

              <div className="flex items-center gap-2">
                {currentQuestionIndex < questions.length - 1 ? (
                  <button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Next Question
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
                  >
                    {isLoading ? 'Grading...' : 'Submit Assessment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // View: Quizzes List / Gallery
  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Practice Quizzes</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Exam Preparation
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Test your grasp of core engineering topics with questions grounded in PVPSIT curriculum notes
          </p>
        </div>

        {/* PVPSIT tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-600 self-start sm:self-auto">
          <BookOpen className="w-4 h-4 text-blue-600" />
          <span>Curriculum: <strong>Autonomous PVP20</strong></span>
        </div>
      </div>

      {/* Subject Filter Pills */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-xs flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedSubjectCode('ALL')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            selectedSubjectCode === 'ALL'
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

      {/* Quiz Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredQuizzes.map((q) => (
          <div
            key={q.id}
            className="bg-white rounded-2xl border border-slate-200/90 hover:border-blue-300 p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  {q.subjectCode} • {q.unitNumber}
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {q.questionCount || 5} Questions
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors">
                {q.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed line-clamp-2">
                {q.description}
              </p>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Passing Grade: 60%</span>
                <span className="text-slate-500 font-medium">MCQ Exam Format</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 italic">
                Demonstration Content
              </span>

              <button
                onClick={() => loadQuiz(q.id)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                <span>Start Practice</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
