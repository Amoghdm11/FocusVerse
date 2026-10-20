import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Award, Clock, Flame, ChevronRight, CheckSquare, AlertTriangle, Coffee } from 'lucide-react';
import { Character } from '../types/character';
import { audioEngine } from '../utils/audioEngine';
import { UserFocusAction } from './AudioCodeFooter';
import { rpgStore } from '../utils/rpgStore';
import { RPGTask } from '../types/rpg';
import { tutorDialogueService } from '../utils/tutorDialogueService';

export type TimerType = 'POMODORO' | 'STOPWATCH' | 'COUNTDOWN';
export type PomoPhase = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

interface TimerWidgetProps {
  character?: Character | null;
  onActionChange: (action: UserFocusAction) => void;
  onModeChange?: (mode: string) => void;
  initialTask?: RPGTask | null;
}

interface CompletedBlock {
  id: string;
  noteName: string;
  freq: number;
  durationMinutes: number;
  timestamp: number;
}

export const TimerWidget: React.FC<TimerWidgetProps> = ({
  character,
  onActionChange,
  onModeChange,
  initialTask,
}) => {
  const [timerType, setTimerType] = useState<TimerType>('POMODORO');
  const [pomoPhase, setPomoPhase] = useState<PomoPhase>('FOCUS');

  // Custom durations in seconds
  const [focusDur, setFocusDur] = useState(25 * 60);
  const [shortBreakDur, setShortBreakDur] = useState(5 * 60);
  const [longBreakDur, setLongBreakDur] = useState(15 * 60);

  // Active Timer state
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeftMs, setTimeLeftMs] = useState(25 * 60 * 1000);
  const [totalDurationMs, setTotalDurationMs] = useState(25 * 60 * 1000);

  // Stopwatch state
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [laps, setLaps] = useState<number[]>([]);

  // Distraction Counter
  const [distractions, setDistractions] = useState<number>(0);

  // Task Association
  const [tasks, setTasks] = useState<RPGTask[]>(rpgStore.getTasks());
  const [selectedTaskId, setSelectedTaskId] = useState<string>(initialTask?.id || '');

  // Daily Goal state
  const [settings] = useState(rpgStore.getSettings());
  const [todayCompletedMins, setTodayCompletedMins] = useState<number>(() => rpgStore.getTodayMins());

  // Completed Session Notes (Musical Focus Song)
  const [sessionNotes, setSessionNotes] = useState<CompletedBlock[]>(() => {
    try {
      const saved = localStorage.getItem('focusverse_session_notes');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: '1', noteName: 'NOTE 1 (C4)', freq: 261.63, durationMinutes: 25, timestamp: Date.now() - 3600000 },
      { id: '2', noteName: 'NOTE 2 (E4)', freq: 329.63, durationMinutes: 20, timestamp: Date.now() - 1800000 },
    ];
  });

  // Retro Sunset Victory Animation
  const [showVictory, setShowVictory] = useState(false);
  const [breakOffered, setBreakOffered] = useState(false);

  // Timestamp references for drift-free timing
  const endTimeRef = useRef<number>(0);
  const stopwatchStartRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Update selected task when initialTask changes
  useEffect(() => {
    if (initialTask) {
      setSelectedTaskId(initialTask.id);
    }
  }, [initialTask]);

  // Handle visibility change (tab switches, sleep wake)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isRunning) {
        if (timerType === 'STOPWATCH') {
          const now = Date.now();
          setStopwatchMs(now - stopwatchStartRef.current);
        } else {
          const remaining = Math.max(0, endTimeRef.current - Date.now());
          setTimeLeftMs(remaining);
          if (remaining <= 0) {
            handleCompletion();
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isRunning, timerType]);

  useEffect(() => {
    try {
      localStorage.setItem('focusverse_session_notes', JSON.stringify(sessionNotes));
    } catch (_) {}
  }, [sessionNotes]);

  // Sync mode with parent
  useEffect(() => {
    if (onModeChange) {
      onModeChange(timerType === 'POMODORO' ? `POMO: ${pomoPhase}` : timerType);
    }
  }, [timerType, pomoPhase, onModeChange]);

  // Reset or switch phases
  const selectPomoPhase = (phase: PomoPhase) => {
    audioEngine.playClick();
    setIsRunning(false);
    setPomoPhase(phase);
    let dur = focusDur;
    if (phase === 'SHORT_BREAK') dur = shortBreakDur;
    if (phase === 'LONG_BREAK') dur = longBreakDur;
    setTotalDurationMs(dur * 1000);
    setTimeLeftMs(dur * 1000);
    onActionChange(phase === 'FOCUS' ? 'IDLE' : 'BREAK');

    if (phase === 'SHORT_BREAK' || phase === 'LONG_BREAK') {
      tutorDialogueService.triggerEvent('BREAK_START', character?.id);
    } else {
      tutorDialogueService.triggerEvent('BREAK_RETURN', character?.id);
    }
  };

  // Change focus preset duration
  const selectFocusPreset = (mins: number) => {
    audioEngine.playClick();
    setIsRunning(false);
    setFocusDur(mins * 60);
    if (pomoPhase === 'FOCUS' || timerType !== 'POMODORO') {
      setTotalDurationMs(mins * 60 * 1000);
      setTimeLeftMs(mins * 60 * 1000);
    }
  };

  // Start / Pause
  const toggleTimer = () => {
    audioEngine.playClick();
    if (isRunning) {
      // Pause
      setIsRunning(false);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      onActionChange('IDLE');
      tutorDialogueService.triggerEvent('SESSION_PAUSE', character?.id);
    } else {
      // Start
      setIsRunning(true);
      if (timerType === 'STOPWATCH') {
        stopwatchStartRef.current = Date.now() - stopwatchMs;
      } else {
        endTimeRef.current = Date.now() + timeLeftMs;
      }
      onActionChange(pomoPhase === 'FOCUS' || timerType !== 'POMODORO' ? 'FOCUSING' : 'BREAK');

      if (pomoPhase === 'FOCUS' || timerType !== 'POMODORO') {
        if (timeLeftMs < totalDurationMs) {
          tutorDialogueService.triggerEvent('SESSION_RESUME', character?.id);
        } else {
          tutorDialogueService.triggerEvent('SESSION_START', character?.id);
        }
      }
    }
  };

  // Reset
  const resetTimer = () => {
    audioEngine.playClick();
    setIsRunning(false);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (timerType === 'STOPWATCH') {
      setStopwatchMs(0);
      setLaps([]);
    } else {
      let dur = focusDur;
      if (timerType === 'POMODORO') {
        if (pomoPhase === 'SHORT_BREAK') dur = shortBreakDur;
        if (pomoPhase === 'LONG_BREAK') dur = longBreakDur;
      }
      setTimeLeftMs(dur * 1000);
      setTotalDurationMs(dur * 1000);
    }
    onActionChange('IDLE');
  };

  // Record Lap
  const recordLap = () => {
    audioEngine.playClick();
    if (timerType === 'STOPWATCH' && isRunning) {
      setLaps([stopwatchMs, ...laps]);
    }
  };

  // Drift-Free animation loop using Date.now()
  useEffect(() => {
    if (!isRunning) return;

    const tick = () => {
      const now = Date.now();

      if (timerType === 'STOPWATCH') {
        const elapsed = now - stopwatchStartRef.current;
        setStopwatchMs(elapsed);
        animFrameRef.current = requestAnimationFrame(tick);
      } else {
        const remaining = Math.max(0, endTimeRef.current - now);
        setTimeLeftMs(remaining);

        if (remaining <= 0) {
          // Timer Completed!
          handleCompletion();
        } else {
          animFrameRef.current = requestAnimationFrame(tick);
        }
      }
    };

    animFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isRunning, timerType]);

  const handleCompletion = () => {
    setIsRunning(false);
    setShowVictory(true);
    setBreakOffered(true);
    onActionChange('COMPLETED');

    const minutesAdded = Math.round(totalDurationMs / (60 * 1000));

    // Only record focus sessions (exclude breaks from focus minutes)
    if (pomoPhase === 'FOCUS' || timerType !== 'POMODORO') {
      const activeTask = tasks.find((t) => t.id === selectedTaskId);
      const effectiveTutorId = character?.id || 'peter-parker';

      // Record to persistent RPG Store
      rpgStore.addSession({
        durationMinutes: minutesAdded,
        plannedMinutes: Math.round(totalDurationMs / 60000),
        timerType,
        subject: activeTask?.subject || 'General Study',
        taskId: activeTask?.id,
        taskTitle: activeTask?.title,
        tutorId: effectiveTutorId,
        distractionCount: distractions,
        completed: true,
      });

      // Trigger tutor completion dialogue
      tutorDialogueService.triggerEvent('SESSION_COMPLETE', effectiveTutorId);

      // Check daily goal celebration
      const prevMins = todayCompletedMins;
      const newTotalMins = rpgStore.getTodayMins();
      setTodayCompletedMins(newTotalMins);
      if (newTotalMins >= settings.dailyGoalMinutes && prevMins < settings.dailyGoalMinutes) {
        tutorDialogueService.triggerEvent('DAILY_GOAL_REACHED', effectiveTutorId);
      }

      // If tied to task, increment actual minutes
      if (activeTask) {
        rpgStore.updateTask(activeTask.id, {
          actualMinutes: (activeTask.actualMinutes || 0) + minutesAdded,
          sessionsCount: (activeTask.sessionsCount || 0) + 1,
        });
      }

      // Add a note to the Focus Song
      const noteNames = ['C4', 'D4', 'E4', 'G4', 'A4', 'C5', 'D5', 'E5'];
      const freqs = character?.synthNotes || [261.63, 293.66, 329.63, 392.00, 440.00, 523.25];
      const pickIdx = sessionNotes.length % freqs.length;
      const newBlock: CompletedBlock = {
        id: Date.now().toString(),
        noteName: `NOTE ${sessionNotes.length + 1} (${noteNames[pickIdx % noteNames.length]})`,
        freq: freqs[pickIdx],
        durationMinutes: minutesAdded,
        timestamp: Date.now(),
      };
      setSessionNotes((prev) => [...prev, newBlock]);
    }

    // Play Victory Jingle
    audioEngine.playVictoryJingle(character?.synthNotes);

    // Desktop Notification
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('FocusSprint Completed! ★', {
        body: `${minutesAdded} minutes of deep focus logged in FocusVerse!`,
        icon: '/favicon.ico',
      });
    }
  };

  // Format Helpers
  const formatTime = (ms: number) => {
    const totalSecs = Math.ceil(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const formatStopwatch = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  // Progress Percent
  const progressPercent =
    totalDurationMs > 0 ? Math.min(100, Math.max(0, ((totalDurationMs - timeLeftMs) / totalDurationMs) * 100)) : 0;

  // Segmented progress bar (20 blocks)
  const dailyGoalMins = settings.dailyGoalMinutes || 100;
  const goalPercent = Math.min(100, Math.round((todayCompletedMins / dailyGoalMins) * 100));
  const activeSegments = Math.round((goalPercent / 100) * 20);

  const activeTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="relative bg-void-card pixel-border border-arcade-border p-3.5 shadow-pixel">
      {/* RETRO SUNSET VICTORY STRIPES OVERLAY */}
      {showVictory && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 p-4 border-2 border-arcade-gold animate-fadeIn">
          {/* 3 Horizontal Retro Victory Sunset Bands */}
          <div className="w-full h-8 bg-[#7A283B] mb-1 victory-band" />
          <div className="w-full h-8 bg-[#B85A32] mb-1 victory-band" style={{ animationDelay: '0.2s' }} />
          <div className="w-full h-8 bg-[#F2C14E] mb-3 victory-band" style={{ animationDelay: '0.4s' }} />

          {/* Glowing Badge */}
          <div className="relative px-4 py-2 bg-void-darkest border-2 border-arcade-gold shadow-pixel text-center">
            <div className="font-pixel text-xs text-arcade-gold tracking-widest uppercase mb-1 animate-pulse">
              ★ SPRINT COMPLETE // FOCUS BANKED ★
            </div>
            <p className="text-[11px] font-mono text-gray-300">
              +{Math.round(totalDurationMs / 60000)}m logged • +{Math.round(totalDurationMs / 60000) * 2 + 20} XP Earned
            </p>
            {activeTask && (
              <p className="text-[10px] font-mono text-arcade-cyan mt-1">
                Linked Task: {activeTask.title}
              </p>
            )}
          </div>

          {/* Break Options Prompt */}
          {breakOffered && (
            <div className="mt-3 flex items-center gap-2">
              <button
                onClick={() => {
                  setShowVictory(false);
                  setBreakOffered(false);
                  selectPomoPhase('SHORT_BREAK');
                }}
                className="pixel-btn px-2.5 py-1 text-[10px] text-green-300 border-green-500"
              >
                ☕ 5M REST
              </button>
              <button
                onClick={() => {
                  setShowVictory(false);
                  setBreakOffered(false);
                  selectPomoPhase('LONG_BREAK');
                }}
                className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-cyan border-arcade-cyan"
              >
                🏖️ 15M BREAK
              </button>
              <button
                onClick={() => {
                  setShowVictory(false);
                  setBreakOffered(false);
                  resetTimer();
                }}
                className="pixel-btn-primary px-3 py-1 text-[10px] font-pixel text-black"
              >
                NEXT FOCUS ▶
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode Navigation Tabs */}
      <div className="grid grid-cols-3 gap-1 mb-2 text-[10px] font-silkscreen select-none">
        {(['POMODORO', 'STOPWATCH', 'COUNTDOWN'] as TimerType[]).map((mode) => (
          <button
            key={mode}
            onClick={() => {
              audioEngine.playClick();
              setIsRunning(false);
              setTimerType(mode);
            }}
            className={`py-1.5 border text-center transition-all ${
              timerType === mode
                ? 'border-arcade-gold bg-arcade-gold text-black font-bold shadow-pixel-sm'
                : 'border-arcade-border bg-void-darkest text-gray-400 hover:text-white'
            }`}
          >
            {mode}
          </button>
        ))}
      </div>

      {/* Focus Presets (15, 25, 45, 50, 90 mins) */}
      <div className="flex items-center justify-between gap-1 mb-3 text-[9px] font-mono select-none">
        <span className="text-gray-500 text-[8px] font-pixel">PRESETS:</span>
        {[15, 25, 45, 50, 90].map((mins) => (
          <button
            key={mins}
            onClick={() => selectFocusPreset(mins)}
            className={`px-1.5 py-0.5 border ${
              focusDur === mins * 60 && pomoPhase === 'FOCUS'
                ? 'border-arcade-gold bg-amber-950/60 text-arcade-gold font-bold'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
          >
            {mins}M
          </button>
        ))}
      </div>

      {/* Pomodoro Sub-Phases */}
      {timerType === 'POMODORO' && (
        <div className="flex gap-1 mb-3 text-[9px] font-mono select-none">
          {(
            [
              { key: 'FOCUS', label: `FOCUS (${Math.round(focusDur / 60)}M)` },
              { key: 'SHORT_BREAK', label: 'REST (5M)' },
              { key: 'LONG_BREAK', label: 'LONG (15M)' },
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              onClick={() => selectPomoPhase(item.key)}
              className={`flex-1 py-1 border uppercase text-center transition-all ${
                pomoPhase === item.key
                  ? 'border-arcade-cyan bg-arcade-cyan/20 text-arcade-cyan font-bold'
                  : 'border-arcade-border text-gray-500 hover:text-gray-300'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Big Stat Counter Box */}
      <div className="bg-void-darkest border-2 border-arcade-border p-4 text-center shadow-pixel mb-3 relative">
        <div className="text-[10px] font-mono text-gray-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1">
          <Clock size={12} className="text-arcade-gold" />
          <span>
            {timerType === 'STOPWATCH'
              ? 'ELAPSED EXECUTION TIME'
              : `${pomoPhase} TIME REMAINING`}
          </span>
        </div>

        {/* Big Pixel Display */}
        <div className="font-pixel text-3xl sm:text-4xl text-arcade-gold tracking-tight py-1 select-none">
          {timerType === 'STOPWATCH' ? formatStopwatch(stopwatchMs) : formatTime(timeLeftMs)}
        </div>

        {/* Active Task Link Banner */}
        {activeTask && (
          <div className="mt-1 px-2 py-0.5 bg-void border border-arcade-border text-[9px] text-arcade-cyan truncate">
            TARGET: <span className="text-white font-bold">{activeTask.title}</span> ({activeTask.subject})
          </div>
        )}

        <div className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mt-1.5 flex items-center justify-between px-1">
          <span>STATUS: <span className={isRunning ? 'text-green-400 font-bold' : 'text-gray-400'}>{isRunning ? 'RUNNING' : 'PAUSED'}</span></span>
          <span className="text-arcade-gold">DRIFT-FREE TIMESTAMP</span>
        </div>
      </div>

      {/* Square-Wave Interactive Progress Tracker */}
      <div className="mb-3 space-y-1">
        <div className="flex items-center justify-between text-[9px] font-mono text-arcade-cyan select-none">
          <span>[ LO: 0x00 ]</span>
          <span className="text-arcade-gold font-bold">{Math.round(progressPercent)}% COMPLETE</span>
          <span>[ HI: 0xFF ]</span>
        </div>

        {/* Track Line with Moving Pixel Node Cursor */}
        <div className="relative h-4 bg-void-darkest border border-arcade-border overflow-hidden">
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-dashed border-[#2A234E]" />

          <div
            className="absolute top-0 bottom-0 left-0 bg-arcade-gold/20 border-r-2 border-arcade-gold transition-all duration-100"
            style={{ width: `${progressPercent}%` }}
          />

          <div
            className="absolute top-0 bottom-0 w-2.5 bg-arcade-gold border border-black transition-all duration-100 flex items-center justify-center"
            style={{ left: `calc(${progressPercent}% - 5px)` }}
          >
            <div className="w-1 h-1 bg-black" />
          </div>
        </div>
      </div>

      {/* Timer Action Controls */}
      <div className="flex items-center gap-2 mb-3">
        <button
          onClick={toggleTimer}
          className={`flex-1 py-2 text-xs font-silkscreen font-bold border flex items-center justify-center gap-1.5 transition-all ${
            isRunning
              ? 'border-arcade-border bg-[#1A1230] text-gray-300 hover:border-arcade-gold'
              : 'border-arcade-gold bg-arcade-gold text-black shadow-pixel hover:bg-[#FFE082]'
          }`}
        >
          {isRunning ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
          <span>{isRunning ? 'PAUSE TIMER' : 'LOCK IN ▶'}</span>
        </button>

        {timerType === 'STOPWATCH' && isRunning && (
          <button
            onClick={recordLap}
            className="pixel-btn px-3 py-2 text-xs font-bold text-arcade-cyan flex items-center gap-1"
          >
            <Flag size={14} />
            <span>LAP</span>
          </button>
        )}

        <button
          onClick={resetTimer}
          className="pixel-btn px-3 py-2 text-xs font-bold text-gray-400 hover:text-white"
          title="Reset timer"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Distraction Counter & Task Link Row */}
      <div className="grid grid-cols-2 gap-2 mb-3 border border-arcade-border/60 p-2 bg-void text-[10px] font-mono">
        {/* Task selector */}
        <div>
          <span className="text-gray-400 block mb-0.5 text-[8px] font-pixel">LINK TO TASK:</span>
          <select
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
            className="w-full bg-void-darkest border border-arcade-border text-white text-[10px] p-1 outline-none truncate"
          >
            <option value="">(No specific task)</option>
            {tasks.filter((t) => !t.completed).map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Distraction counter */}
        <div>
          <span className="text-gray-400 block mb-0.5 text-[8px] font-pixel">DISTRACTIONS:</span>
          <div className="flex items-center justify-between">
            <span className="text-arcade-gold font-bold text-xs">{distractions}</span>
            <div className="flex gap-1">
              <button
                onClick={() => setDistractions((d) => Math.max(0, d - 1))}
                className="w-5 h-5 border border-arcade-border text-gray-400 hover:text-white"
              >
                -
              </button>
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setDistractions((d) => {
                    const next = d + 1;
                    if (next >= 3) {
                      tutorDialogueService.triggerEvent('STRUGGLING_TASK', character?.id);
                    }
                    return next;
                  });
                }}
                className="w-5 h-5 border border-red-500/70 text-red-300 hover:bg-red-950 font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Laps Display (when Stopwatch mode has laps) */}
      {timerType === 'STOPWATCH' && laps.length > 0 && (
        <div className="mb-3 max-h-24 overflow-y-auto space-y-1 border border-arcade-border/60 p-1.5 bg-void-darkest text-[10px] font-mono">
          {laps.map((l, idx) => (
            <div key={idx} className="flex justify-between text-gray-400">
              <span>LAP {String(laps.length - idx).padStart(2, '0')}:</span>
              <span className="text-arcade-gold">{formatStopwatch(l)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Daily Focus Goal Tracker */}
      <div className="border-t border-arcade-border pt-2.5 mb-3">
        <div className="flex items-center justify-between text-[10px] font-mono mb-1">
          <span className="text-gray-400 flex items-center gap-1">
            <Flame size={12} className="text-arcade-gold" />
            <span>DAILY FOCUS GOAL</span>
          </span>
          <span className="text-arcade-gold font-bold">
            {todayCompletedMins}m / {dailyGoalMins}m ({goalPercent}%)
          </span>
        </div>

        <div className="grid grid-cols-20 gap-0.5 h-3 bg-void-darkest border border-arcade-border p-0.5">
          {Array.from({ length: 20 }).map((_, idx) => (
            <div
              key={idx}
              className={`h-full ${
                idx < activeSegments
                  ? 'bg-arcade-gold'
                  : 'bg-[#1C1738]/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Focus Song (Completed Musical Notes Track) */}
      <div className="border-t border-arcade-border/60 pt-2">
        <div className="flex items-center justify-between text-[9px] font-mono text-gray-400 mb-1.5">
          <span>// YOUR FOCUS SONG MELODY ({sessionNotes.length} BLOCKS)</span>
          <span className="text-arcade-cyan">CHIPTUNE HARMONY</span>
        </div>

        <div className="flex flex-wrap gap-1">
          {sessionNotes.length === 0 ? (
            <span className="text-[10px] text-gray-600 font-mono italic">
              Complete your first block to generate a song note.
            </span>
          ) : (
            sessionNotes.map((b) => (
              <button
                key={b.id}
                onClick={() => audioEngine.playVictoryJingle([b.freq])}
                className="px-1.5 py-0.5 bg-void-darkest border border-arcade-cyan/70 text-arcade-cyan text-[9px] font-mono hover:border-arcade-gold hover:text-arcade-gold transition-colors"
                title={`Play frequency: ${b.freq}Hz`}
              >
                ♪ {b.noteName}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
