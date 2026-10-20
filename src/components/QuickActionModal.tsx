import React, { useState, useEffect } from 'react';
import { Play, Plus, FileText, BookOpen, PenTool, X } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: string) => void;
  onQuickTask?: () => void;
  onQuickNote?: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onQuickTask,
  onQuickNote,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          audioEngine.playClick();
          // can toggle via parent
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-void-card pixel-border border-arcade-border p-5 max-w-md w-full shadow-pixel">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-arcade-border">
          <div className="flex items-center gap-2">
            <span className="text-arcade-gold font-pixel text-xs">⚡</span>
            <h3 className="font-silkscreen text-xs text-arcade-gold uppercase tracking-wider">
              QUUCK ACTION COMMAND PALETTE
            </h3>
          </div>
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
            }}
            className="text-gray-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
          {/* Action 1: Start Focus Session */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
              onNavigate('TIMER');
            }}
            className="pixel-btn p-3 flex flex-col items-start gap-1 hover:border-arcade-gold text-left group"
          >
            <div className="flex items-center gap-2 text-arcade-gold font-bold">
              <Play size={16} className="text-arcade-gold group-hover:scale-110 transition-transform" />
              <span>START TIMER</span>
            </div>
            <span className="text-[10px] text-gray-400">Launch a focus session</span>
          </button>

          {/* Action 2: Create Task */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
              if (onQuickTask) onQuickTask();
              else onNavigate('TASKS');
            }}
            className="pixel-btn p-3 flex flex-col items-start gap-1 hover:border-arcade-cyan text-left group"
          >
            <div className="flex items-center gap-2 text-arcade-cyan font-bold">
              <Plus size={16} className="text-arcade-cyan group-hover:scale-110 transition-transform" />
              <span>CREATE TASK</span>
            </div>
            <span className="text-[10px] text-gray-400">Add an assignment or quest</span>
          </button>

          {/* Action 3: Take Note */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
              if (onQuickNote) onQuickNote();
              else onNavigate('NOTES');
            }}
            className="pixel-btn p-3 flex flex-col items-start gap-1 hover:border-arcade-pink text-left group"
          >
            <div className="flex items-center gap-2 text-arcade-pink font-bold">
              <FileText size={16} className="text-arcade-pink group-hover:scale-110 transition-transform" />
              <span>QUICK NOTE</span>
            </div>
            <span className="text-[10px] text-gray-400">Capture an insight or scratchpad</span>
          </button>

          {/* Action 4: Review Flashcards */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
              onNavigate('NOTES');
            }}
            className="pixel-btn p-3 flex flex-col items-start gap-1 hover:border-green-400 text-left group"
          >
            <div className="flex items-center gap-2 text-green-400 font-bold">
              <BookOpen size={16} className="text-green-400 group-hover:scale-110 transition-transform" />
              <span>FLASHCARDS</span>
            </div>
            <span className="text-[10px] text-gray-400">Active recall revision review</span>
          </button>

          {/* Action 5: Return to Starting Front Page */}
          <button
            onClick={() => {
              audioEngine.playClick();
              onClose();
              onNavigate('HOME');
            }}
            className="pixel-btn p-3 flex flex-col items-start gap-1 hover:border-arcade-gold text-left group sm:col-span-2"
          >
            <div className="flex items-center gap-2 text-white font-bold">
              <span className="text-base group-hover:scale-110 transition-transform">🏠</span>
              <span>STARTING FRONT PAGE (HOME SANCTUARY)</span>
            </div>
            <span className="text-[10px] text-gray-400">Return to the original cosmic gateway, lock-in, &amp; spirit cards</span>
          </button>
        </div>

        <div className="mt-4 pt-3 border-t border-arcade-border/50 text-[10px] text-gray-500 text-center font-mono">
          Tip: Press <kbd className="px-1 border border-arcade-border text-gray-300">Ctrl+K</kbd> anywhere to open
        </div>
      </div>
    </div>
  );
};
