import React, { useState } from 'react';
import { 
  Users, 
  Copy, 
  Check, 
  Send, 
  Play, 
  Flame, 
  Coffee, 
  Star, 
  Sparkles,
  Lock,
  Globe
} from 'lucide-react';
import { rpgStore } from '../utils/rpgStore';
import { StudyRoom } from '../types/rpg';
import { audioEngine } from '../utils/audioEngine';

export const StudyRoomsView: React.FC = () => {
  const [room, setRoom] = useState<StudyRoom>(rpgStore.getStudyRoom());
  const [copiedCode, setCopiedCode] = useState(false);
  const [customCheer, setCustomCheer] = useState('');
  const [joinCodeInput, setJoinCodeInput] = useState('');

  const handleCopyCode = () => {
    audioEngine.playClick();
    navigator.clipboard.writeText(room.code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleSendQuickCheer = (cheerText: string) => {
    audioEngine.playClick();
    rpgStore.sendCheer(`You sent ${cheerText}!`);
    setRoom(rpgStore.getStudyRoom());
  };

  const handleSendCustomCheer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCheer.trim()) return;
    audioEngine.playClick();
    rpgStore.sendCheer(`You: "${customCheer.trim()}"`);
    setCustomCheer('');
    setRoom(rpgStore.getStudyRoom());
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) return;
    audioEngine.playClick();
    alert(`Connected to Study Room: ${joinCodeInput.toUpperCase()}! Synchronizing focus sprint...`);
    setJoinCodeInput('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-cyan flex items-center justify-center text-black font-pixel text-xs font-bold shadow-pixel-sm">
            👥
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              VIRTUAL ACCOUNTABILITY STUDY ROOM
            </h1>
            <p className="text-[10px] text-gray-400">
              Synchronized focus sprints, shared goals, and peer accountability
            </p>
          </div>
        </div>

        {/* Room Code Pill */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 bg-void border border-arcade-gold flex items-center gap-2">
            <span className="text-[10px] text-gray-400 font-pixel">ROOM CODE:</span>
            <span className="font-silkscreen text-xs text-arcade-gold font-bold">{room.code}</span>
          </div>

          <button
            onClick={handleCopyCode}
            className="pixel-btn px-2.5 py-1 text-xs text-gray-300 hover:text-white flex items-center gap-1"
            title="Copy room invite link"
          >
            {copiedCode ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
            <span>{copiedCode ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* Main Room Arena Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Active Shared Sprint & Cheer Protocol (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Shared Sprint Mission Box */}
          <div className="bg-void-card pixel-border border-arcade-cyan p-5 shadow-pixel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-cyan uppercase">
                SHARED STUDY SPRINT // {room.name}
              </span>
              <span className="px-2 py-0.5 bg-green-950/70 border border-green-500 text-green-300 text-[9px] font-bold">
                ● LIVE SYNC
              </span>
            </div>

            <div className="p-3 bg-void border border-arcade-border">
              <div className="text-[9px] text-arcade-gold font-pixel mb-1">ROOM OBJECTIVE:</div>
              <p className="text-xs text-gray-100 font-bold leading-relaxed">
                &ldquo;{room.sharedGoal}&rdquo;
              </p>
            </div>

            {/* Quick Cheers Reaction Bar */}
            <div className="space-y-2 pt-2">
              <div className="text-[10px] text-gray-400 font-silkscreen uppercase">
                SEND ACCOUNTABILITY CHEER:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { text: 'High-Five! ✋', icon: '✋' },
                  { text: 'Hot Coffee! ☕', icon: '☕' },
                  { text: 'Focus Fire! 🔥', icon: '🔥' },
                  { text: 'Star Power! ⭐', icon: '⭐' },
                  { text: 'Lock In! 🦾', icon: '🦾' },
                ].map((item) => (
                  <button
                    key={item.text}
                    onClick={() => handleSendQuickCheer(item.text)}
                    className="pixel-btn px-2.5 py-1 text-[11px] text-gray-200 hover:text-arcade-gold flex items-center gap-1"
                  >
                    <span>{item.icon}</span>
                    <span>{item.text}</span>
                  </button>
                ))}
              </div>

              {/* Custom message input */}
              <form onSubmit={handleSendCustomCheer} className="flex gap-2 pt-2">
                <input
                  type="text"
                  placeholder="Send quick encouraging whisper..."
                  value={customCheer}
                  onChange={(e) => setCustomCheer(e.target.value)}
                  className="flex-1 p-2 bg-void border border-arcade-border text-xs text-white outline-none focus:border-arcade-cyan"
                />
                <button
                  type="submit"
                  className="pixel-btn-primary px-3 py-1 font-pixel text-[10px] text-black uppercase"
                >
                  SEND
                </button>
              </form>
            </div>
          </div>

          {/* Recent Cheers Ticker */}
          <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-arcade-border text-xs">
              <span className="font-silkscreen text-arcade-gold">ACTIVITY FEED</span>
              <span className="text-[9px] text-gray-500 font-pixel">REAL-TIME</span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {room.recentCheers.map((ch, i) => (
                <div key={i} className="text-xs text-gray-300 py-1 border-b border-arcade-border/40 flex items-center gap-2">
                  <span className="text-arcade-cyan">&gt;</span>
                  <span>{ch}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Participants List & Join Another Room (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Active Scholars In Room */}
          <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-white uppercase">
                SCHOLARS IN ROOM ({room.participants.length})
              </span>
              <span className="text-[9px] text-green-400 font-pixel">ONLINE</span>
            </div>

            <div className="space-y-2">
              {room.participants.map((p) => (
                <div
                  key={p.id}
                  className="p-2.5 bg-void border border-arcade-border flex items-center justify-between gap-3 hover:border-gray-500"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-void border border-arcade-border flex items-center justify-center text-lg">
                      {p.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-gray-100">{p.name}</div>
                      {p.currentTask && (
                        <div className="text-[9px] text-gray-400 truncate max-w-[140px]">
                          {p.currentTask}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`px-1.5 py-0.5 text-[8px] font-pixel border block ${
                        p.status === 'FOCUSING'
                          ? 'border-green-500 bg-green-950/70 text-green-300'
                          : 'border-amber-500 bg-amber-950/70 text-amber-300'
                      }`}
                    >
                      {p.status}
                    </span>
                    <span className="text-[9px] text-gray-500 mt-0.5 block">
                      {p.minutesToday}m today
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Another Room Form */}
          <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-2">
            <div className="font-silkscreen text-xs text-arcade-gold">JOIN ANOTHER STUDY ROOM</div>
            <form onSubmit={handleJoinRoom} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Enter 8-digit Room Code..."
                value={joinCodeInput}
                onChange={(e) => setJoinCodeInput(e.target.value)}
                className="flex-1 p-2 bg-void border border-arcade-border text-xs text-white outline-none focus:border-arcade-gold uppercase"
              />
              <button
                type="submit"
                className="pixel-btn-primary px-3 py-1 font-pixel text-[10px] text-black uppercase"
              >
                JOIN
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
