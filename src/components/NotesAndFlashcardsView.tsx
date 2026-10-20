import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Pin, 
  RotateCw, 
  Award, 
  Zap, 
  CheckCircle, 
  HelpCircle,
  Sparkles,
  Bot,
  Send,
  MessageSquare,
  Key,
  X,
  Search,
  Filter,
  Eye,
  Edit3,
  Play,
  Layers,
  ArrowRight
} from 'lucide-react';
import { MultiNote, FlashcardDeck, Flashcard } from '../types/rpg';
import { rpgStore } from '../utils/rpgStore';
import { audioEngine } from '../utils/audioEngine';
import { aiService, AIChatMessage, GeneratedCardDraft } from '../utils/aiService';

interface NotesAndFlashcardsViewProps {
  onStartFocusSession?: (subject: string, noteTitle: string) => void;
}

export const NotesAndFlashcardsView: React.FC<NotesAndFlashcardsViewProps> = ({
  onStartFocusSession,
}) => {
  const [activeTab, setActiveTab] = useState<'NOTES' | 'FLASHCARDS'>('NOTES');

  // Notes state
  const [notes, setNotes] = useState<MultiNote[]>(rpgStore.getNotes());
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [saveStatus, setSaveStatus] = useState<'SAVED' | 'SAVING'>('SAVED');
  const [copiedNote, setCopiedNote] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Search & Filter state for notes
  const [noteSearch, setNoteSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');

  // AI Assistant Panel State
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [aiContextNoteId, setAiContextNoteId] = useState<string>(selectedNoteId);
  const [chatHistory, setChatHistory] = useState<AIChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: 'Greetings, scholar! I am your AI Study Companion. Ask me to summarize your notes, explain difficult concepts in simple terms, or generate revision flashcards from your active material.',
      timestamp: Date.now(),
      sourceType: aiService.hasLiveApiKey() ? 'LIVE_API' : 'LOCAL_ENGINE',
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copiedAnswerId, setCopiedAnswerId] = useState<string | null>(null);

  // API Key Config Modal
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(() => aiService.getConfig().apiKey || '');
  const [apiModelInput, setApiModelInput] = useState(() => aiService.getConfig().model || 'gemini-1.5-flash');

  // Draft Flashcards Approval Modal
  const [draftCards, setDraftCards] = useState<GeneratedCardDraft[]>([]);
  const [showDraftModal, setShowDraftModal] = useState(false);
  const [targetDeckId, setTargetDeckId] = useState<string>('');

  // Flashcards state
  const [decks, setDecks] = useState<FlashcardDeck[]>(rpgStore.getDecks());
  const [cards, setCards] = useState<Flashcard[]>(rpgStore.getFlashcards());
  const [selectedDeckId, setSelectedDeckId] = useState<string>(decks[0]?.id || '');

  // Review mode state
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewCardIndex, setReviewCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [reviewCompleted, setReviewCompleted] = useState(false);
  const [reviewedCount, setReviewedCount] = useState(0);

  // New deck / new card modals
  const [showNewDeckModal, setShowNewDeckModal] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [newDeckSubject, setNewDeckSubject] = useState('');

  const [showNewCardModal, setShowNewCardModal] = useState(false);
  const [newCardQuestion, setNewCardQuestion] = useState('');
  const [newCardAnswer, setNewCardAnswer] = useState('');

  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  const selectedNote = notes.find((n) => n.id === selectedNoteId) || notes[0];
  const aiContextNote = notes.find((n) => n.id === aiContextNoteId) || selectedNote;

  useEffect(() => {
    if (decks.length > 0 && !targetDeckId) {
      setTargetDeckId(decks[0].id);
    }
  }, [decks, targetDeckId]);

  useEffect(() => {
    setAiContextNoteId(selectedNoteId);
  }, [selectedNoteId]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  // Notes handlers
  const handleUpdateNote = (updates: Partial<MultiNote>) => {
    if (!selectedNote) return;
    setSaveStatus('SAVING');
    rpgStore.updateNote(selectedNote.id, updates);
    const updatedList = rpgStore.getNotes();
    setNotes(updatedList);
    setTimeout(() => setSaveStatus('SAVED'), 300);
  };

  const handleCreateNote = () => {
    audioEngine.playClick();
    const newNote = rpgStore.addNote({
      title: 'Untitled Note',
      content: '# New Study Note\n\n- Key concepts:\n- Invariants:\n- Summary:\n',
      subject: 'General Study',
      tags: ['Notes'],
      pinned: false,
    });
    setNotes(rpgStore.getNotes());
    setSelectedNoteId(newNote.id);
  };

  const handleDuplicateNote = (note: MultiNote) => {
    audioEngine.playClick();
    const dup = rpgStore.addNote({
      title: `${note.title} (Copy)`,
      content: note.content,
      subject: note.subject,
      tags: [...note.tags],
      pinned: false,
    });
    setNotes(rpgStore.getNotes());
    setSelectedNoteId(dup.id);
  };

  const handleTogglePinNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    audioEngine.playClick();
    const note = notes.find((n) => n.id === id);
    if (note) {
      handleUpdateNote({ pinned: !note.pinned });
    }
  };

  const handleDeleteNote = (id: string) => {
    if (window.confirm('Delete this note permanently?')) {
      audioEngine.playClick();
      rpgStore.deleteNote(id);
      const remaining = rpgStore.getNotes();
      setNotes(remaining);
      if (selectedNoteId === id) {
        setSelectedNoteId(remaining[0]?.id || '');
      }
    }
  };

  const handleExportNote = () => {
    if (!selectedNote) return;
    audioEngine.playClick();
    const blob = new Blob([selectedNote.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedNote.title.replace(/\s+/g, '_')}_${Date.now()}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyNote = () => {
    if (!selectedNote) return;
    audioEngine.playClick();
    navigator.clipboard.writeText(selectedNote.content);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 1500);
  };

  // AI Question Handler
  const handleAskAi = async (customPrompt?: string) => {
    const questionText = (customPrompt || aiInput).trim();
    if (!questionText || isAiLoading) return;

    audioEngine.playClick();
    const userMsg: AIChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: questionText,
      timestamp: Date.now(),
      contextNoteTitle: aiContextNote?.title,
      sourceType: aiService.hasLiveApiKey() ? 'LIVE_API' : 'LOCAL_ENGINE',
    };

    setChatHistory((prev) => [...prev, userMsg]);
    setAiInput('');
    setIsAiLoading(true);

    try {
      const response = await aiService.askQuestion(
        aiContextNote?.content || '',
        aiContextNote?.title || 'Untitled Note',
        questionText,
        chatHistory
      );

      const assistantMsg: AIChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: response.answer,
        timestamp: Date.now(),
        contextNoteTitle: aiContextNote?.title,
        sourceType: response.sourceType,
      };

      setChatHistory((prev) => [...prev, assistantMsg]);

      // If draft cards were generated, open approval modal
      if (response.draftCards && response.draftCards.length > 0) {
        setDraftCards(response.draftCards);
        setShowDraftModal(true);
      }
    } catch (err: any) {
      setChatHistory((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ Analysis halted: ${err.message || 'Unable to process request.'}`,
          timestamp: Date.now(),
          sourceType: 'LOCAL_ENGINE',
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopyAiAnswer = (msg: AIChatMessage) => {
    audioEngine.playClick();
    navigator.clipboard.writeText(msg.text);
    setCopiedAnswerId(msg.id);
    setTimeout(() => setCopiedAnswerId(null), 1500);
  };

  const handleAppendAnswerToNote = (text: string) => {
    if (!selectedNote) return;
    audioEngine.playClick();
    const newContent = `${selectedNote.content}\n\n---\n### AI Study Note Insight\n${text}`;
    handleUpdateNote({ content: newContent });
    alert('Answer appended to your active note!');
  };

  const handleSaveDraftCards = () => {
    audioEngine.playVictoryJingle();
    const approved = draftCards.filter((c) => c.approved);
    if (approved.length === 0) {
      alert('Please approve at least one card to save.');
      return;
    }

    const currentCards = rpgStore.getFlashcards();
    const newCards: Flashcard[] = approved.map((c, idx) => ({
      id: `c-ai-${Date.now()}-${idx}`,
      deckId: targetDeckId || decks[0]?.id || 'deck-cs',
      question: c.question,
      answer: c.answer,
      repetitions: 0,
      intervalDays: 1,
      easeFactor: 2.5,
      dueDate: Date.now(),
    }));

    const updated = [...currentCards, ...newCards];
    rpgStore.saveFlashcards(updated);
    setCards(updated);
    rpgStore.awardXp(approved.length * 10, `Generated ${approved.length} flashcards from note`);
    setShowDraftModal(false);
    alert(`Successfully added ${approved.length} active recall flashcards to your deck!`);
  };

  // Filter notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(noteSearch.toLowerCase()) ||
      n.content.toLowerCase().includes(noteSearch.toLowerCase());
    const matchesSubject = subjectFilter === 'ALL' || n.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  const uniqueSubjects = Array.from(new Set(notes.map((n) => n.subject).filter(Boolean)));

  // Flashcards review handlers
  const activeDeckCards = cards.filter((c) => c.deckId === selectedDeckId);
  const dueCards = activeDeckCards.filter((c) => c.dueDate <= Date.now());

  const startReviewSession = () => {
    audioEngine.playClick();
    setIsReviewing(true);
    setReviewCardIndex(0);
    setShowAnswer(false);
    setReviewCompleted(false);
    setReviewedCount(0);
  };

  const handleRateCard = (rating: 1 | 2 | 3) => {
    audioEngine.playClick();
    const currentCard = activeDeckCards[reviewCardIndex];
    if (currentCard) {
      rpgStore.reviewCard(currentCard.id, rating);
      setCards(rpgStore.getFlashcards());
      setReviewedCount((prev) => prev + 1);
    }

    if (reviewCardIndex + 1 < activeDeckCards.length) {
      setReviewCardIndex((prev) => prev + 1);
      setShowAnswer(false);
    } else {
      audioEngine.playVictoryJingle();
      setReviewCompleted(true);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* Header & Sub-tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-pink flex items-center justify-center text-white font-pixel text-xs font-bold shadow-pixel-sm">
            📖
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              AI NOTEBOOK &amp; ACTIVE RECALL
            </h1>
            <p className="text-[10px] text-gray-400">
              Interactive AI-assisted study workspace, note analysis, and SuperMemo SM-2 flashcard decks
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Panel Toggle Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setShowAiPanel(!showAiPanel);
            }}
            className={`px-3 py-1.5 font-silkscreen text-xs uppercase border flex items-center gap-1.5 transition-all ${
              showAiPanel
                ? 'border-arcade-cyan bg-cyan-950/70 text-arcade-cyan font-bold shadow-pixel-sm'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
          >
            <Bot size={14} />
            <span>{showAiPanel ? 'HIDE AI PANEL' : 'ASK AI'}</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('NOTES');
            }}
            className={`px-3 py-1.5 font-silkscreen text-xs uppercase border ${
              activeTab === 'NOTES'
                ? 'border-arcade-pink bg-pink-950/70 text-pink-300 font-bold shadow-pixel-sm'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
          >
            NOTES ({notes.length})
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('FLASHCARDS');
            }}
            className={`px-3 py-1.5 font-silkscreen text-xs uppercase border ${
              activeTab === 'FLASHCARDS'
                ? 'border-green-400 bg-green-950/70 text-green-300 font-bold shadow-pixel-sm'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
          >
            FLASHCARDS ({cards.length})
          </button>
        </div>
      </div>

      {/* --- SUBTAB 1: AI NOTEBOOK WORKSPACE --- */}
      {activeTab === 'NOTES' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
          {/* 1. Left Column: Notes List & Search (3 cols) */}
          <div className="lg:col-span-3 bg-void-card pixel-border border-arcade-border p-3 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-pink uppercase">
                STUDY NOTES ({filteredNotes.length})
              </span>
              <button
                onClick={handleCreateNote}
                className="pixel-btn px-2 py-0.5 text-[9px] text-arcade-gold hover:text-white flex items-center gap-1"
                title="Create a new note"
              >
                <Plus size={11} />
                <span>NEW</span>
              </button>
            </div>

            {/* Search across all notes */}
            <div className="relative">
              <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search notes..."
                value={noteSearch}
                onChange={(e) => setNoteSearch(e.target.value)}
                className="w-full pl-7 pr-2 py-1 bg-void border border-arcade-border text-white text-[10px] outline-none focus:border-arcade-pink"
              />
            </div>

            {/* Subject filter */}
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full bg-void border border-arcade-border px-2 py-1 text-gray-300 text-[10px] outline-none"
            >
              <option value="ALL">ALL SUBJECTS</option>
              {uniqueSubjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Notes List */}
            <div className="space-y-1.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredNotes.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-[10px] border border-dashed border-arcade-border/50">
                  No notes found.
                </div>
              ) : (
                filteredNotes.map((note) => {
                  const isSelected = note.id === selectedNoteId;
                  return (
                    <div
                      key={note.id}
                      onClick={() => {
                        audioEngine.playClick();
                        setSelectedNoteId(note.id);
                      }}
                      className={`p-2 border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-arcade-pink bg-pink-950/40 text-white shadow-pixel-sm'
                          : 'border-arcade-border bg-void hover:border-gray-500 text-gray-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold truncate text-xs">{note.title || 'Untitled'}</span>
                        <button
                          onClick={(e) => handleTogglePinNote(note.id, e)}
                          className={note.pinned ? 'text-arcade-gold' : 'text-gray-600 hover:text-gray-400'}
                          title={note.pinned ? 'Unpin' : 'Pin note'}
                        >
                          <Pin size={11} fill={note.pinned ? '#F5C242' : 'none'} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-[9px] text-gray-500 mt-1">
                        <span className="text-arcade-cyan truncate">{note.subject}</span>
                        <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* 2. Middle Column: Note Editor / Preview (5 or 9 cols depending on AI panel) */}
          <div className={`${showAiPanel ? 'lg:col-span-5' : 'lg:col-span-9'} bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3`}>
            {selectedNote ? (
              <>
                {/* Editor Header: Title, Actions */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-arcade-border">
                  <input
                    type="text"
                    value={selectedNote.title}
                    onChange={(e) => handleUpdateNote({ title: e.target.value })}
                    className="font-silkscreen text-sm bg-transparent border-b border-transparent hover:border-arcade-border focus:border-arcade-pink text-white outline-none flex-1 min-w-[180px]"
                    placeholder="Note Title..."
                  />

                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Save status */}
                    <span className="text-[9px] text-gray-500 font-pixel mr-1">
                      {saveStatus === 'SAVED' ? '✓ SAVED' : '...SAVING'}
                    </span>

                    {/* Mode toggle (Edit vs Preview) */}
                    <button
                      onClick={() => setPreviewMode(!previewMode)}
                      className={`p-1 border text-[10px] flex items-center gap-1 ${
                        previewMode ? 'border-arcade-cyan text-arcade-cyan bg-cyan-950/40' : 'border-arcade-border text-gray-400 hover:text-white'
                      }`}
                      title={previewMode ? 'Switch to Edit' : 'Preview Markdown'}
                    >
                      {previewMode ? <Edit3 size={11} /> : <Eye size={11} />}
                      <span className="hidden sm:inline">{previewMode ? 'EDIT' : 'PREVIEW'}</span>
                    </button>

                    {/* Copy */}
                    <button
                      onClick={handleCopyNote}
                      className="p-1 border border-arcade-border text-gray-400 hover:text-white text-[10px]"
                      title="Copy note content"
                    >
                      {copiedNote ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                    </button>

                    {/* Duplicate */}
                    <button
                      onClick={() => handleDuplicateNote(selectedNote)}
                      className="p-1 border border-arcade-border text-gray-400 hover:text-arcade-gold text-[10px]"
                      title="Duplicate note"
                    >
                      <RotateCw size={11} />
                    </button>

                    {/* Export */}
                    <button
                      onClick={handleExportNote}
                      className="p-1 border border-arcade-border text-gray-400 hover:text-arcade-gold text-[10px]"
                      title="Export as Markdown"
                    >
                      <Download size={11} />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteNote(selectedNote.id)}
                      className="p-1 border border-arcade-border text-gray-400 hover:text-red-400 hover:border-red-500 text-[10px]"
                      title="Delete note"
                    >
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Subject & Quick Focus Trigger */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">SUBJECT:</span>
                    <input
                      type="text"
                      value={selectedNote.subject}
                      onChange={(e) => handleUpdateNote({ subject: e.target.value })}
                      className="bg-void border border-arcade-border px-2 py-0.5 text-arcade-cyan text-[10px] outline-none"
                    />
                  </div>

                  {/* Start Focus Session directly from this note */}
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      if (onStartFocusSession) {
                        onStartFocusSession(selectedNote.subject, selectedNote.title);
                      } else {
                        window.location.hash = 'timer';
                      }
                    }}
                    className="pixel-btn px-2.5 py-0.5 text-[10px] text-arcade-gold hover:text-white flex items-center gap-1"
                    title="Launch a focused study session on this topic"
                  >
                    <Play size={10} fill="currentColor" />
                    <span>FOCUS ON THIS</span>
                  </button>
                </div>

                {/* Editor Content Area / Preview Mode */}
                {previewMode ? (
                  <div className="w-full h-80 p-3 bg-void border border-arcade-border text-gray-200 text-xs font-mono leading-relaxed overflow-y-auto space-y-2">
                    {selectedNote.content.split('\n').map((line, idx) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={idx} className="text-base font-bold text-arcade-gold border-b border-arcade-border/50 pb-1 mt-2">{line.replace('# ', '')}</h1>;
                      }
                      if (line.startsWith('## ')) {
                        return <h2 key={idx} className="text-sm font-bold text-arcade-cyan mt-2">{line.replace('## ', '')}</h2>;
                      }
                      if (line.startsWith('- ') || line.startsWith('* ')) {
                        return <li key={idx} className="ml-4 list-disc text-gray-300">{line.replace(/^[-*]\s+/, '')}</li>;
                      }
                      if (line.startsWith('> ')) {
                        return <blockquote key={idx} className="border-l-2 border-arcade-gold pl-2 italic text-gray-400 my-1">{line.replace('> ', '')}</blockquote>;
                      }
                      return <p key={idx} className="my-1">{line || '\u00A0'}</p>;
                    })}
                  </div>
                ) : (
                  <textarea
                    value={selectedNote.content}
                    onChange={(e) => handleUpdateNote({ content: e.target.value })}
                    placeholder="Type study notes, equations, code, or markdown here..."
                    className="w-full h-80 p-3 bg-void border border-arcade-border text-gray-200 text-xs font-mono leading-relaxed outline-none focus:border-arcade-pink resize-y"
                  />
                )}

                {/* Word & Char Count Footer */}
                <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1">
                  <span>
                    Chars: {selectedNote.content.length} | Words: {selectedNote.content.trim().split(/\s+/).filter(Boolean).length}
                  </span>
                  <span className="text-arcade-cyan">Autosaved to Local Storage</span>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-gray-500">
                <p>No note selected. Create a new note to start writing!</p>
              </div>
            )}
          </div>

          {/* 3. Right Column: Dedicated AI Assistant Panel (4 cols) */}
          {showAiPanel && (
            <div className="lg:col-span-4 bg-void-card pixel-border border-arcade-cyan p-3 shadow-pixel flex flex-col h-[520px]">
              {/* AI Panel Header */}
              <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
                <div className="flex items-center gap-1.5">
                  <Bot size={15} className="text-arcade-cyan" />
                  <span className="font-silkscreen text-xs text-arcade-cyan uppercase">
                    AI NOTEBOOK ASSISTANT
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Provider Engine Badge */}
                  <span
                    className={`px-1.5 py-0.5 border text-[8px] font-pixel ${
                      aiService.hasLiveApiKey()
                        ? 'border-green-400 bg-green-950 text-green-300'
                        : 'border-arcade-border bg-void text-gray-400'
                    }`}
                    title={aiService.hasLiveApiKey() ? 'Using live Gemini API' : 'Using intelligent local semantic analyzer'}
                  >
                    {aiService.hasLiveApiKey() ? 'LIVE GEMINI' : 'LOCAL ENGINE'}
                  </span>

                  {/* API Key Configure Button */}
                  <button
                    onClick={() => setShowApiKeyModal(true)}
                    className="p-1 border border-arcade-border text-gray-400 hover:text-arcade-gold"
                    title="Configure AI API Key"
                  >
                    <Key size={11} />
                  </button>
                </div>
              </div>

              {/* Context Note Selector Pill */}
              <div className="py-2 border-b border-arcade-border/60 flex items-center justify-between gap-1 text-[9px]">
                <span className="text-gray-500 font-pixel shrink-0">CONTEXT:</span>
                <select
                  value={aiContextNoteId}
                  onChange={(e) => setAiContextNoteId(e.target.value)}
                  className="bg-void border border-arcade-border text-arcade-gold text-[9px] px-1 py-0.5 outline-none truncate max-w-[190px]"
                >
                  {notes.map((n) => (
                    <option key={n.id} value={n.id}>
                      {n.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 overflow-y-auto space-y-2.5 py-2.5 pr-1 text-xs">
                {chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-2.5 border leading-relaxed ${
                      msg.sender === 'user'
                        ? 'border-arcade-gold/80 bg-amber-950/30 text-white ml-3'
                        : 'border-arcade-cyan/80 bg-void text-gray-200 mr-2 shadow-pixel-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[8px] text-gray-400 mb-1 font-pixel">
                      <span>{msg.sender === 'user' ? 'YOU' : 'AI COMPANION'}</span>
                      {msg.sender === 'assistant' && (
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleCopyAiAnswer(msg)}
                            className="hover:text-white"
                            title="Copy answer"
                          >
                            {copiedAnswerId === msg.id ? <Check size={10} className="text-green-400" /> : <Copy size={10} />}
                          </button>
                          <button
                            onClick={() => handleAppendAnswerToNote(msg.text)}
                            className="hover:text-arcade-gold"
                            title="Append to active note"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1 text-xs whitespace-pre-wrap">{msg.text}</div>
                  </div>
                ))}

                {isAiLoading && (
                  <div className="p-2 border border-arcade-cyan/60 bg-void text-arcade-cyan text-xs flex items-center gap-2 animate-pulse">
                    <Sparkles size={12} />
                    <span>Analyzing note context and synthesizing response...</span>
                  </div>
                )}
                <div ref={chatBottomRef} />
              </div>

              {/* Quick Prompt Chips */}
              <div className="py-1.5 border-t border-arcade-border/60 flex items-center gap-1 overflow-x-auto scrollbar-none text-[8px]">
                <button
                  onClick={() => handleAskAi('Explain this note in simple terms')}
                  className="px-1.5 py-0.5 border border-arcade-border bg-void hover:border-arcade-cyan text-gray-300 shrink-0"
                >
                  💡 Simple terms
                </button>
                <button
                  onClick={() => handleAskAi('Summarize the key concepts')}
                  className="px-1.5 py-0.5 border border-arcade-border bg-void hover:border-arcade-gold text-gray-300 shrink-0"
                >
                  📋 Summarize
                </button>
                <button
                  onClick={() => handleAskAi('Generate five practice questions')}
                  className="px-1.5 py-0.5 border border-arcade-border bg-void hover:border-green-400 text-gray-300 shrink-0"
                >
                  ❓ Practice Quiz
                </button>
                <button
                  onClick={() => handleAskAi('Turn this note into flashcards')}
                  className="px-1.5 py-0.5 border border-arcade-border bg-void hover:border-arcade-pink text-gray-300 shrink-0"
                >
                  🃏 Flashcards
                </button>
              </div>

              {/* Question Input Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAskAi();
                }}
                className="pt-1.5 flex gap-1.5"
              >
                <input
                  type="text"
                  placeholder="Ask a question about this note..."
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  disabled={isAiLoading}
                  className="flex-1 p-2 bg-void border border-arcade-border text-xs text-white outline-none focus:border-arcade-cyan"
                />
                <button
                  type="submit"
                  disabled={isAiLoading || !aiInput.trim()}
                  className="pixel-btn-primary px-3 py-1 font-pixel text-[10px] text-black uppercase shrink-0 disabled:opacity-50"
                >
                  <Send size={12} />
                </button>
              </form>
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB 2: FLASHCARDS & SPACED REPETITION --- */}
      {activeTab === 'FLASHCARDS' && (
        <div className="space-y-5">
          {/* Deck Selector & Quick Stats Bar */}
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="font-silkscreen text-xs text-green-400">SELECT DECK:</span>
              <select
                value={selectedDeckId}
                onChange={(e) => {
                  audioEngine.playClick();
                  setSelectedDeckId(e.target.value);
                  setIsReviewing(false);
                }}
                className="bg-void border border-arcade-border text-white text-xs px-2.5 py-1 outline-none"
              >
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.subject})
                  </option>
                ))}
              </select>

              <button
                onClick={() => setShowNewDeckModal(true)}
                className="pixel-btn px-2 py-0.5 text-[10px] text-arcade-gold hover:text-white"
              >
                + NEW DECK
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] text-gray-400">
                Total: {activeDeckCards.length} | Due: <span className="text-arcade-gold font-bold">{dueCards.length}</span>
              </span>

              <button
                onClick={() => setShowNewCardModal(true)}
                className="pixel-btn px-2.5 py-1 text-xs text-arcade-cyan hover:text-white flex items-center gap-1"
              >
                <Plus size={13} />
                <span>ADD CARD</span>
              </button>

              {activeDeckCards.length > 0 && !isReviewing && (
                <button
                  onClick={startReviewSession}
                  className="pixel-btn-primary px-3 py-1 text-xs font-pixel text-black flex items-center gap-1 uppercase"
                >
                  <Zap size={13} />
                  <span>START REVIEW</span>
                </button>
              )}
            </div>
          </div>

          {/* ACTIVE REVIEW MODE */}
          {isReviewing ? (
            <div className="bg-void-card pixel-border border-arcade-gold p-6 max-w-xl mx-auto shadow-pixel text-center space-y-4">
              {!reviewCompleted ? (
                <>
                  <div className="flex items-center justify-between pb-2 border-b border-arcade-border text-[10px] text-gray-400">
                    <span>
                      CARD {reviewCardIndex + 1} OF {activeDeckCards.length}
                    </span>
                    <button
                      onClick={() => setIsReviewing(false)}
                      className="hover:text-white text-xs"
                    >
                      ✕ EXIT REVIEW
                    </button>
                  </div>

                  {/* Question Box */}
                  <div className="p-6 bg-void border-2 border-arcade-border text-left min-h-[140px] flex flex-col justify-center">
                    <span className="font-pixel text-[9px] text-arcade-gold mb-2 block">
                      QUESTION:
                    </span>
                    <p className="text-sm text-gray-100 font-bold leading-relaxed">
                      {activeDeckCards[reviewCardIndex]?.question}
                    </p>
                  </div>

                  {/* Answer Box */}
                  {showAnswer ? (
                    <div className="p-6 bg-void-darkest border-2 border-green-500/80 text-left min-h-[120px] animate-fadeIn">
                      <span className="font-pixel text-[9px] text-green-400 mb-2 block">
                        ANSWER:
                      </span>
                      <p className="text-sm text-gray-200 leading-relaxed">
                        {activeDeckCards[reviewCardIndex]?.answer}
                      </p>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        audioEngine.playClick();
                        setShowAnswer(true);
                      }}
                      className="pixel-btn-primary w-full py-2.5 font-pixel text-xs text-black uppercase"
                    >
                      [ REVEAL ANSWER ]
                    </button>
                  )}

                  {/* Spaced Repetition Rating Buttons */}
                  {showAnswer && (
                    <div className="space-y-2 pt-2">
                      <div className="text-[10px] text-gray-400 font-silkscreen uppercase">
                        RATE YOUR RECALL (SM-2 INTERVAL SCHEDULER):
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <button
                          onClick={() => handleRateCard(1)}
                          className="pixel-btn p-2 text-red-300 hover:border-red-500 text-center"
                        >
                          <div className="font-pixel text-[9px]">DIFFICULT</div>
                          <div className="text-[8px] text-gray-400 mt-0.5">Review 1d</div>
                        </button>

                        <button
                          onClick={() => handleRateCard(2)}
                          className="pixel-btn p-2 text-yellow-300 hover:border-arcade-gold text-center"
                        >
                          <div className="font-pixel text-[9px]">GOOD</div>
                          <div className="text-[8px] text-gray-400 mt-0.5">Steady progress</div>
                        </button>

                        <button
                          onClick={() => handleRateCard(3)}
                          className="pixel-btn p-2 text-green-300 hover:border-green-400 text-center"
                        >
                          <div className="font-pixel text-[9px]">EASY</div>
                          <div className="text-[8px] text-gray-400 mt-0.5">Bonus interval</div>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="py-6 space-y-3">
                  <div className="text-4xl animate-bounce">🏆</div>
                  <h3 className="font-pixel text-sm text-arcade-gold">DECK REVISION COMPLETED!</h3>
                  <p className="text-xs text-gray-300">
                    You reviewed {reviewedCount} cards. Synaptic pathways reinforced, +{reviewedCount * 15} XP awarded!
                  </p>
                  <button
                    onClick={() => setIsReviewing(false)}
                    className="pixel-btn-primary px-6 py-2 font-pixel text-xs text-black uppercase mt-3"
                  >
                    [ RETURN TO CARDS ]
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Cards Deck Table */
            <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
                <span className="font-silkscreen text-xs text-white uppercase">
                  CARDS IN THIS DECK ({activeDeckCards.length})
                </span>
                <span className="text-[9px] text-gray-500">SuperMemo SM-2 Active</span>
              </div>

              {activeDeckCards.length === 0 ? (
                <div className="p-8 text-center text-gray-500 border border-dashed border-arcade-border">
                  <p>No cards in this deck yet.</p>
                  <button
                    onClick={() => setShowNewCardModal(true)}
                    className="mt-2 text-arcade-gold text-xs underline"
                  >
                    + Add Question &amp; Answer Card
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  {activeDeckCards.map((card, i) => (
                    <div
                      key={card.id}
                      className="p-3 bg-void border border-arcade-border flex items-start justify-between gap-3 hover:border-gray-500"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-gray-200">
                          <span className="text-arcade-gold mr-1.5">Q{i + 1}:</span>
                          {card.question}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1 pl-4 border-l border-arcade-border">
                          {card.answer}
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-[9px] text-gray-500">
                        <div>Reps: {card.repetitions}</div>
                        <div>Interval: {card.intervalDays}d</div>
                        <div className="text-arcade-cyan">Ease: {card.easeFactor.toFixed(1)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* New Deck Modal */}
          {showNewDeckModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-sm w-full shadow-pixel">
                <h3 className="font-silkscreen text-xs text-arcade-gold mb-3">CREATE REVISION DECK</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newDeckTitle.trim()) return;
                    audioEngine.playClick();
                    const newDeck: FlashcardDeck = {
                      id: `deck-${Date.now()}`,
                      title: newDeckTitle.trim(),
                      subject: newDeckSubject.trim() || 'General',
                      description: 'Revision study deck',
                      createdAt: Date.now(),
                    };
                    const updated = [newDeck, ...decks];
                    setDecks(updated);
                    rpgStore.saveDecks(updated);
                    setSelectedDeckId(newDeck.id);
                    setNewDeckTitle('');
                    setNewDeckSubject('');
                    setShowNewDeckModal(false);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-gray-300 block mb-1">Deck Title *</label>
                    <input
                      type="text"
                      required
                      value={newDeckTitle}
                      onChange={(e) => setNewDeckTitle(e.target.value)}
                      placeholder="e.g. Operating Systems Invariants"
                      className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 block mb-1">Subject</label>
                    <input
                      type="text"
                      value={newDeckSubject}
                      onChange={(e) => setNewDeckSubject(e.target.value)}
                      placeholder="e.g. Computer Science"
                      className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-arcade-border">
                    <button
                      type="button"
                      onClick={() => setShowNewDeckModal(false)}
                      className="pixel-btn px-3 py-1 text-gray-400 hover:text-white"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="pixel-btn-primary px-3 py-1 text-black font-bold uppercase"
                    >
                      CREATE
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* New Card Modal */}
          {showNewCardModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
              <div className="bg-void-card pixel-border border-arcade-cyan p-5 max-w-md w-full shadow-pixel">
                <h3 className="font-silkscreen text-xs text-arcade-cyan mb-3">ADD QUESTION &amp; ANSWER CARD</h3>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newCardQuestion.trim() || !newCardAnswer.trim()) return;
                    audioEngine.playClick();
                    const newCard: Flashcard = {
                      id: `card-${Date.now()}`,
                      deckId: selectedDeckId,
                      question: newCardQuestion.trim(),
                      answer: newCardAnswer.trim(),
                      repetitions: 0,
                      intervalDays: 1,
                      easeFactor: 2.5,
                      dueDate: Date.now(),
                    };
                    const updated = [...cards, newCard];
                    setCards(updated);
                    rpgStore.saveFlashcards(updated);
                    setNewCardQuestion('');
                    setNewCardAnswer('');
                    setShowNewCardModal(false);
                  }}
                  className="space-y-3"
                >
                  <div>
                    <label className="text-gray-300 block mb-1">Question / Prompt *</label>
                    <textarea
                      required
                      value={newCardQuestion}
                      onChange={(e) => setNewCardQuestion(e.target.value)}
                      placeholder="e.g. What is the difference between TCP and UDP?"
                      className="w-full p-2 bg-void border border-arcade-border text-white text-xs h-20 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 block mb-1">Answer / Explanation *</label>
                    <textarea
                      required
                      value={newCardAnswer}
                      onChange={(e) => setNewCardAnswer(e.target.value)}
                      placeholder="e.g. TCP is connection-oriented; UDP is connectionless and lightweight."
                      className="w-full p-2 bg-void border border-arcade-border text-white text-xs h-24 outline-none"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-arcade-border">
                    <button
                      type="button"
                      onClick={() => setShowNewCardModal(false)}
                      className="pixel-btn px-3 py-1 text-gray-400 hover:text-white"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="pixel-btn-primary px-3 py-1 text-black font-bold uppercase"
                    >
                      SAVE CARD
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* --- DRAFT FLASHCARDS APPROVAL MODAL ---                   */}
      {/* ======================================================== */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-green-500 p-5 max-w-2xl w-full shadow-pixel max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
              <div className="flex items-center gap-2">
                <span className="text-green-400 font-pixel text-xs">🃏</span>
                <h3 className="font-silkscreen text-xs text-green-400 uppercase">
                  REVIEW AI-GENERATED FLASHCARDS ({draftCards.length} DRAFTS)
                </h3>
              </div>
              <button
                onClick={() => setShowDraftModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-[10px] text-gray-400 mb-3">
              Review and edit the questions and answers extracted from your note before approving them for your spaced repetition deck:
            </p>

            <div className="flex items-center gap-2 mb-3">
              <span className="text-gray-400 text-[10px]">SAVE TO DECK:</span>
              <select
                value={targetDeckId}
                onChange={(e) => setTargetDeckId(e.target.value)}
                className="bg-void border border-arcade-border text-arcade-gold text-xs px-2 py-1 outline-none"
              >
                {decks.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.subject})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              {draftCards.map((card, idx) => (
                <div key={card.id} className="p-3 bg-void border border-arcade-border space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={card.approved}
                        onChange={(e) => {
                          const updated = draftCards.map((c) =>
                            c.id === card.id ? { ...c, approved: e.target.checked } : c
                          );
                          setDraftCards(updated);
                        }}
                        className="accent-green-400 cursor-pointer"
                      />
                      <span className="font-bold text-xs text-arcade-gold">Card #{idx + 1} (Approved)</span>
                    </label>
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 font-pixel">QUESTION:</span>
                    <input
                      type="text"
                      value={card.question}
                      onChange={(e) => {
                        const updated = draftCards.map((c) =>
                          c.id === card.id ? { ...c, question: e.target.value } : c
                        );
                        setDraftCards(updated);
                      }}
                      className="w-full p-1.5 bg-void-darkest border border-arcade-border text-white text-xs outline-none mt-0.5"
                    />
                  </div>

                  <div>
                    <span className="text-[9px] text-gray-400 font-pixel">ANSWER:</span>
                    <textarea
                      value={card.answer}
                      onChange={(e) => {
                        const updated = draftCards.map((c) =>
                          c.id === card.id ? { ...c, answer: e.target.value } : c
                        );
                        setDraftCards(updated);
                      }}
                      className="w-full p-1.5 bg-void-darkest border border-arcade-border text-white text-xs outline-none h-14 mt-0.5"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-arcade-border flex justify-end gap-2">
              <button
                onClick={() => setShowDraftModal(false)}
                className="pixel-btn px-3 py-1.5 text-gray-400 hover:text-white"
              >
                CANCEL
              </button>
              <button
                onClick={handleSaveDraftCards}
                className="pixel-btn-primary px-4 py-1.5 text-black font-bold uppercase"
              >
                [ ✓ APPROVE &amp; SAVE TO DECK ]
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* --- AI API KEY CONFIGURATION MODAL ---                   */}
      {/* ======================================================== */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-cyan p-5 max-w-md w-full shadow-pixel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-arcade-cyan" />
                <h3 className="font-silkscreen text-xs text-arcade-cyan uppercase">
                  CONFIGURE AI STUDY ASSISTANT
                </h3>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-[10px] text-gray-300 leading-relaxed">
              FocusVerse includes an intelligent local semantic analyzer by default. To unlock live cloud LLM capabilities, paste your Google Gemini API key below:
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                aiService.saveConfig({
                  apiKey: apiKeyInput.trim(),
                  provider: 'gemini',
                  model: apiModelInput.trim() || 'gemini-1.5-flash',
                });
                audioEngine.playVictoryJingle();
                setShowApiKeyModal(false);
                alert('AI Assistant configuration updated!');
              }}
              className="space-y-3"
            >
              <div>
                <label className="text-gray-300 block mb-1">Google Gemini API Key:</label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-cyan font-mono"
                />
                <span className="text-[9px] text-gray-500 mt-1 block">
                  Get a free key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-arcade-gold underline">Google AI Studio</a>. Saved locally in your browser.
                </span>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Model:</label>
                <input
                  type="text"
                  value={apiModelInput}
                  onChange={(e) => setApiModelInput(e.target.value)}
                  placeholder="gemini-1.5-flash"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none font-mono"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-arcade-border">
                {apiKeyInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setApiKeyInput('');
                      aiService.saveConfig({ apiKey: '', provider: 'gemini', model: 'gemini-1.5-flash' });
                      alert('API key removed. Reverted to Local Semantic Engine.');
                      setShowApiKeyModal(false);
                    }}
                    className="pixel-btn px-2.5 py-1 text-red-400 hover:text-white mr-auto"
                  >
                    CLEAR KEY
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowApiKeyModal(false)}
                  className="pixel-btn px-3 py-1 text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="pixel-btn-primary px-4 py-1 text-black font-bold uppercase"
                >
                  SAVE CONFIG
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
