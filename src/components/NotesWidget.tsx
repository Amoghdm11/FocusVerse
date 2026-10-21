import React, { useState, useEffect } from 'react';
import { FileText, Download, Trash2, Copy, Check } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface NotesWidgetProps {
  accentColor?: string;
}

export const NotesWidget: React.FC<NotesWidgetProps> = ({
  accentColor = '#5CE1E6',
}) => {
  const [content, setContent] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('focusverse_notes');
      if (saved !== null) return saved;
    } catch (_) {}
    return [
      '# FOCUS LOG // SESSION NOTES',
      '- [x] Calibrate environment acoustics',
      '- [ ] Isolate key algorithmic invariants',
      '- [ ] Commit final diff before midnight',
      '',
      '> "Small disciplines repeated with consistency lead to great achievements."',
    ].join('\n');
  });

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('focusverse_notes', content);
    } catch (_) {}
  }, [content]);

  const downloadTxt = () => {
    audioEngine.playClick();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusverse_notes_${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyNotes = () => {
    audioEngine.playClick();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const clearNotes = () => {
    if (window.confirm('Clear all scratchpad contents?')) {
      audioEngine.playClick();
      setContent('');
    }
  };

  const charCount = content.length;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const lineCount = content.split('\n').length;

  return (
    <div className="bg-void-card pixel-border border-arcade-border p-3.5 shadow-pixel flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-arcade-border select-none">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-arcade-cyan" />
          <h3 className="font-silkscreen text-xs text-arcade-cyan tracking-wider uppercase">
            SCRATCHPAD PROTOCOL
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={copyNotes}
            className="p-1 border border-arcade-border text-gray-400 hover:text-arcade-cyan hover:border-arcade-cyan text-[10px] flex items-center gap-1"
            title="Copy to clipboard"
          >
            {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
            <span className="hidden sm:inline">{copied ? 'COPIED' : 'COPY'}</span>
          </button>

          <button
            onClick={downloadTxt}
            className="p-1 border border-arcade-border text-gray-400 hover:text-arcade-gold hover:border-arcade-gold text-[10px] flex items-center gap-1"
            title="Export as .txt"
          >
            <Download size={12} />
            <span className="hidden sm:inline">.TXT</span>
          </button>

          <button
            onClick={clearNotes}
            className="p-1 border border-arcade-border text-gray-400 hover:text-red-400 hover:border-red-500 text-[10px]"
            title="Clear notes"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Textarea Monospace Editor */}
      <textarea
        aria-label="Study notes"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="// Record study observations, formulas, and insights..."
        className="w-full flex-1 min-h-[140px] bg-void-darkest border border-arcade-border p-2.5 text-xs text-gray-200 placeholder-gray-600 font-mono resize-none outline-none focus:border-arcade-cyan leading-relaxed transition-colors"
        spellCheck={false}
      />

      {/* Telemetry Footer */}
      <div className="flex items-center justify-between pt-2 mt-2 border-t border-arcade-border/60 text-[10px] font-mono text-gray-500 select-none">
        <div className="flex items-center gap-3">
          <span>LINES: <strong className="text-gray-300">{lineCount}</strong></span>
          <span>WORDS: <strong className="text-gray-300">{wordCount}</strong></span>
          <span>CHARS: <strong className="text-gray-300">{charCount}</strong></span>
        </div>
        <span className="text-arcade-cyan/80">AUTO-SAVED IN LOCALSTORAGE</span>
      </div>
    </div>
  );
};
