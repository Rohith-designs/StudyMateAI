import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  BookOpen,
  FileText,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  Layers,
  GraduationCap,
  MessageSquare
} from 'lucide-react';
import { askRAG } from '../services/api';

export default function AITutor({
  subjects,
  materials,
  systemStatus,
  prefillQuery,
  onOpenSourceModal,
  onOpenModeInfo
}) {
  const [selectedSubjectCode, setSelectedSubjectCode] = useState('ALL');
  const [selectedUnit, setSelectedUnit] = useState('ALL');
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeStepText, setActiveStepText] = useState('');

  // Initial welcome message in chat
  const [messages, setMessages] = useState([
    {
      id: 'msg-welcome',
      role: 'assistant',
      text: `Hello! I am **StudyMateAI**, your academic study assistant grounded in verified **PVPSIT** engineering course materials.

How I assist your examination preparation:
- 📖 Retrieve relevant notes & syllabus chapters for **DSA, DBMS, COA, and OS**.
- 🔍 Cite precise course document names, units, and page numbers.
- ⚖️ Explicitly state when required reference material is not found, without fabricating facts.

Select your subject above or try one of the suggested engineering questions below!`,
      sources: [],
      mode: 'system'
    }
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle prefill query if passed from Dashboard
  useEffect(() => {
    if (prefillQuery) {
      if (prefillQuery.prompt) setInputQuery(prefillQuery.prompt);
      if (prefillQuery.subjectCode) setSelectedSubjectCode(prefillQuery.subjectCode);
      if (prefillQuery.unitNumber) setSelectedUnit(prefillQuery.unitNumber);
    }
  }, [prefillQuery]);

  const sampleQuestions = [
    {
      label: 'AVL Tree Balance & Rotations (DSA)',
      subjectCode: '20CS3301',
      unitNumber: 'Unit 2',
      query: 'Explain AVL tree balance factors and all four rotation cases (LL, RR, LR, RL) with an example.'
    },
    {
      label: 'ACID Properties (DBMS)',
      subjectCode: '20CS3402',
      unitNumber: 'Unit 4',
      query: 'What are the ACID properties in DBMS? Explain how atomicity and durability are maintained.'
    },
    {
      label: 'Addressing Modes (COA)',
      subjectCode: '20CS3303',
      unitNumber: 'Unit 1',
      query: 'Describe the primary addressing modes in Computer Organization and how the effective address is computed.'
    },
    {
      label: 'Demand Paging & Belady Anomaly (OS)',
      subjectCode: '20CS3404',
      unitNumber: 'Unit 4',
      query: 'Explain the page fault handling sequence in Operating Systems and why Belady anomaly occurs in FIFO.'
    },
    {
      label: 'Out-of-Scope Test (Quantum Physics)',
      subjectCode: '20CS3301',
      unitNumber: 'Unit 2',
      query: 'Explain quantum entanglement and quantum teleportation algorithms.'
    }
  ];

  const handleSend = async (queryToSend = inputQuery) => {
    const q = (queryToSend || '').trim();
    if (!q || isLoading) return;

    const userMessage = {
      id: `msg-user-${Date.now()}`,
      role: 'user',
      text: q,
      subjectCode: selectedSubjectCode !== 'ALL' ? selectedSubjectCode : null,
      unitNumber: selectedUnit !== 'ALL' ? selectedUnit : null
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    // Simulated RAG retrieval step indicator
    setActiveStepText('Retrieving relevant course chunks via vector similarity...');
    const stepTimer = setTimeout(() => {
      setActiveStepText('Filtering top matching syllabus passages & verifying citations...');
    }, 600);

    try {
      const response = await askRAG({
        query: q,
        subjectCode: selectedSubjectCode !== 'ALL' ? selectedSubjectCode : null,
        unitNumber: selectedUnit !== 'ALL' ? selectedUnit : null
      });

      const assistantMessage = {
        id: `msg-ai-${Date.now()}`,
        role: 'assistant',
        text: response.data.answer,
        sources: response.data.sources || [],
        mode: response.data.mode,
        isGrounded: response.data.isGrounded,
        llmProvider: response.data.llmProvider
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          id: `msg-err-${Date.now()}`,
          role: 'assistant',
          text: `⚠️ **Service Notice:** Unable to complete RAG retrieval: ${err.message}. Please verify the backend server is reachable.`,
          sources: [],
          isError: true
        }
      ]);
    } finally {
      clearTimeout(stepTimer);
      setIsLoading(false);
      setActiveStepText('');
    }
  };

  const isLiveAI = systemStatus?.mode === 'live_rag';

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-h-[920px] bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Top Context & Filter Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Grounded Academic Study Assistant
              </h2>
              <span
                onClick={onOpenModeInfo}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full cursor-pointer transition-colors ${
                  isLiveAI
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {isLiveAI ? 'Live RAG Active' : 'Transparent Demo Mode'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Grounded strictly in uploaded PVPSIT department lecture notes
            </p>
          </div>
        </div>

        {/* Course and Unit Filters */}
        <div className="flex items-center gap-2">
          {/* Subject Filter */}
          <select
            value={selectedSubjectCode}
            onChange={(e) => setSelectedSubjectCode(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium text-slate-700"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map(s => (
              <option key={s.id} value={s.code}>
                {s.shortName || s.name} ({s.code})
              </option>
            ))}
          </select>

          {/* Unit Filter */}
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium text-slate-700"
          >
            <option value="ALL">All Units</option>
            <option value="Unit 1">Unit 1</option>
            <option value="Unit 2">Unit 2</option>
            <option value="Unit 3">Unit 3</option>
            <option value="Unit 4">Unit 4</option>
            <option value="Unit 5">Unit 5</option>
          </select>
        </div>
      </div>

      {/* Mode Transparency Banner */}
      <div className={`px-4 py-2 border-b text-xs flex items-center justify-between ${
        isLiveAI
          ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
          : 'bg-amber-50/50 border-amber-100 text-amber-800'
      }`}>
        <div className="flex items-center gap-2">
          <ShieldCheck className={`w-4 h-4 ${isLiveAI ? 'text-emerald-600' : 'text-amber-600'}`} />
          <span>
            {isLiveAI
              ? `Live RAG Engine connected (${systemStatus?.llmProvider}). Responses cite verified course notes.`
              : `Demo Mode Active: Pre-indexed PVPSIT curriculum notes with cosine vector similarity. No simulated hallucinations.`}
          </span>
        </div>
        <button
          onClick={onOpenModeInfo}
          className="underline font-semibold text-[11px] hover:opacity-80"
        >
          View Setup
        </button>
      </div>

      {/* Chat Thread */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-3xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
                  isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 border border-slate-200 text-blue-600'
                }`}
              >
                {isUser ? 'You' : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`rounded-2xl p-4 sm:p-5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-tr-xs'
                    : 'bg-slate-50 border border-slate-200/90 text-slate-800 rounded-tl-xs space-y-3'
                }`}
              >
                {/* Content */}
                <div className="whitespace-pre-line font-sans">
                  {msg.text}
                </div>

                {/* Grounded Source Citations (for Assistant) */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-3 border-t border-slate-200/80 space-y-2">
                    <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                      Supporting Course Sources ({msg.sources.length})
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {msg.sources.map((src, i) => (
                        <button
                          key={i}
                          onClick={() => onOpenSourceModal(src)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] font-semibold text-slate-700 hover:text-blue-700 transition-colors shadow-2xs group"
                          title="Click to view verified source text"
                        >
                          <FileText className="w-3.5 h-3.5 text-blue-500 group-hover:text-blue-600" />
                          <span className="truncate max-w-[170px]">{src.documentTitle}</span>
                          <span className="text-slate-400">p.{src.pageNumber || 1}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-500" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex gap-3 max-w-xl">
            <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-blue-600 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2 font-semibold text-blue-700">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                <span>{activeStepText || 'Processing request...'}</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Grounded retrieval ensures facts and formulas are matched directly against course materials.
              </p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Strip (Quick Action Pills) */}
      <div className="px-4 py-2.5 bg-slate-50/60 border-t border-slate-200 overflow-x-auto flex items-center gap-2">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3 h-3" /> Quick Questions:
        </span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setSelectedSubjectCode(q.subjectCode);
              setSelectedUnit(q.unitNumber);
              handleSend(q.query);
            }}
            className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-[11px] text-slate-700 font-medium transition-colors"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-3 sm:p-4 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask a question about course concepts, algorithms, proofs, or exam topics..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none"
          />

          <button
            type="submit"
            disabled={isLoading || !inputQuery.trim()}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white transition-all flex items-center gap-1.5 shadow-sm ${
              isLoading || !inputQuery.trim()
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
            }`}
          >
            <span>Ask</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <p className="text-[10px] text-slate-400 mt-2 text-center">
          StudyMateAI answers strictly using retrieved PVPSIT course documents. Citations reflect authentic indexed notes.
        </p>
      </div>
    </div>
  );
}
