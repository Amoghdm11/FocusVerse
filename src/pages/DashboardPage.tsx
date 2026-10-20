import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Target, 
  Flame, 
  CheckCircle2, 
  Play, 
  ChevronRight, 
  Award, 
  Zap, 
  BookOpen, 
  PenTool, 
  Calendar,
  Sparkles,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { Character } from '../types/character';
import { rpgStore, getTodayDateString } from '../utils/rpgStore';
import { UserRPGProfile, RPGTask, StudySessionRecord, DailyQuest, DailyReflection } from '../types/rpg';
import { TUTOR_ARCHETYPES } from '../data/tutorArchetypes';
import { audioEngine } from '../utils/audioEngine';
import { NotesWidget } from '../components/NotesWidget';

interface DashboardPageProps {
  character: Character;
  onNavigate: (section: string) => void;
  onStartSessionWithTask?: (task: RPGTask) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  character,
  onNavigate,
  onStartSessionWithTask,
}) => {
  const [profile, setProfile] = useState<UserRPGProfile>(rpgStore.getProfile());
  const [todayMins, setTodayMins] = useState<number>(rpgStore.getTodayMins());
  const [tasks, setTasks] = useState<RPGTask[]>(rpgStore.getTasks());
  const [sessions, setSessions] = useState<StudySessionRecord[]>(rpgStore.getSessions());
  const [quests, setQuests] = useState<DailyQuest[]>(rpgStore.getDailyQuests());
  const [settings] = useState(rpgStore.getSettings());
  const [weeklyData] = useState(rpgStore.getWeeklyMinutes());

  // Reflection modal
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [reflectionAccomplish, setReflectionAccomplish] = useState('');
  const [reflectionDifficult, setReflectionDifficult] = useState('');
  const [reflectionTomorrow, setReflectionTomorrow] = useState('');

  // Tutor Dialogue Quote
  const [tutorMessage, setTutorMessage] = useState<string>('');

  useEffect(() => {
    // Generate contextual tutor quote based on time & streak
    const archetypeKey = 'FRIENDLY_COMPANION';
    const meta = TUTOR_ARCHETYPES[archetypeKey];
    if (meta) {
      const msgs = meta.dialogue.greetings;
      setTutorMessage(msgs[Math.floor(Math.random() * msgs.length)]);
    }
  }, [character]);

  const refreshData = () => {
    setProfile(rpgStore.getProfile());
    setTodayMins(rpgStore.getTodayMins());
    setTasks(rpgStore.getTasks());
    setSessions(rpgStore.getSessions());
    setQuests(rpgStore.getDailyQuests());
  };

  useEffect(() => {
    window.addEventListener('focusverse_xp_awarded', refreshData);
    return () => window.removeEventListener('focusverse_xp_awarded', refreshData);
  }, []);

  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTodaySessions = sessions.filter((s) => s.date === getTodayDateString()).length;

  const goalPercent = Math.min(100, Math.round((todayMins / settings.dailyGoalMinutes) * 100));
  const xpPercent = Math.min(100, Math.round((profile.currentXp / profile.nextLevelXp) * 100));

  const handleToggleTask = (id: string) => {
    audioEngine.playTaskComplete();
    rpgStore.toggleTaskComplete(id);
    refreshData();
  };

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    audioEngine.playClick();
    rpgStore.saveReflection({
      date: getTodayDateString(),
      accomplishments: reflectionAccomplish,
      difficulties: reflectionDifficult,
      prioritiesTomorrow: reflectionTomorrow,
      rating: 5,
    });
    setShowReflectionModal(false);
    refreshData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* --- HERO STATUS & TUTOR BRIEFING --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Tutor Speech & Personality Card (7 cols) */}
        <div className="lg:col-span-7 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel flex flex-col justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-void border-2 border-arcade-gold flex items-center justify-center text-2xl shadow-pixel-sm shrink-0">
              {character.genderOrSpirit === 'girl' ? '🧙‍♀️' : '👾'}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <span className="font-pixel text-[9px] text-arcade-gold uppercase">
                    ACTIVE TUTOR COMPANION
                  </span>
                  <h2 className="font-silkscreen text-sm text-white">
                    {character.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      onNavigate('HOME');
                    }}
                    className="pixel-btn px-2 py-0.5 text-[9px] text-gray-400 hover:text-white"
                    title="Return to the starting front page"
                  >
                    🏠 FRONT PAGE
                  </button>
                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      onNavigate('TUTORS');
                    }}
                    className="pixel-btn px-2 py-0.5 text-[9px] text-arcade-cyan hover:text-white"
                  >
                    CHANGE TUTOR &gt;
                  </button>
                </div>
              </div>

              {/* Speech bubble */}
              <div className="mt-3 p-3 bg-void border border-arcade-border/80 relative">
                <p className="italic text-gray-300 text-[11px] leading-relaxed">
                  &ldquo;{tutorMessage || character.quote}&rdquo;
                </p>
                <div className="mt-2 flex items-center gap-2 text-[9px] text-arcade-gold">
                  <span className="w-1.5 h-1.5 bg-arcade-gold animate-ping rounded-full" />
                  <span>{character.tagline}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Action Prompt Footer */}
          <div className="mt-4 pt-3 border-t border-arcade-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400">STATUS:</span>
              <span className="px-1.5 py-0.5 bg-green-950/60 border border-green-500 text-green-300 text-[9px] font-bold">
                READY FOR FOCUS
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  onNavigate('TIMER');
                }}
                className="pixel-btn-primary px-3 py-1 text-[10px] font-pixel flex items-center gap-1 uppercase"
              >
                <Play size={11} />
                <span>START SPRINT (25M)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right: RPG Level Progression & Streaks (5 cols) */}
        <div className="lg:col-span-5 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-gold uppercase">
                HERO TELEMETRY // RPG LEVEL
              </span>
              <span className="font-pixel text-[9px] text-arcade-cyan">
                RANK: {profile.selectedTitle}
              </span>
            </div>

            {/* Level & XP Gauge */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-pixel text-xs text-white">LEVEL {profile.level}</span>
                <span className="text-gray-400 text-[10px]">
                  {profile.currentXp} / {profile.nextLevelXp} XP ({xpPercent}%)
                </span>
              </div>
              <div className="w-full h-3 bg-void border border-arcade-border overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-arcade-gold to-yellow-300 transition-all duration-500 shadow-pixel-sm"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
            </div>

            {/* Streak & Consistency Metrics */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="p-2.5 bg-void border border-arcade-border">
                <div className="flex items-center gap-1.5 text-orange-400 font-pixel text-[9px] mb-1">
                  <Flame size={12} />
                  <span>CURRENT STREAK</span>
                </div>
                <div className="text-xl font-silkscreen text-white">
                  {profile.streakDays} DAYS
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5">
                  Personal Best: {profile.longestStreakDays}d
                </div>
              </div>

              <div className="p-2.5 bg-void border border-arcade-border">
                <div className="flex items-center gap-1.5 text-arcade-cyan font-pixel text-[9px] mb-1">
                  <Target size={12} />
                  <span>DAILY GOAL</span>
                </div>
                <div className="text-xl font-silkscreen text-white">
                  {goalPercent}%
                </div>
                <div className="text-[9px] text-gray-500 mt-0.5">
                  {todayMins} of {settings.dailyGoalMinutes} mins
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-arcade-border flex justify-between items-center text-[10px] text-gray-400">
            <span>Next Level Reward: +1 Badge &amp; Sound</span>
            <button
              onClick={() => onNavigate('ACHIEVEMENTS')}
              className="text-arcade-gold hover:underline"
            >
              View Quests &gt;
            </button>
          </div>
        </div>
      </div>

      {/* --- 4 QUICK STAT TILES --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-gray-400 text-[10px] mb-1">FOCUSED TODAY</div>
          <div className="text-2xl font-silkscreen text-arcade-gold">{todayMins}m</div>
          <div className="text-[9px] text-gray-500 mt-1">Target: {settings.dailyGoalMinutes}m</div>
        </div>

        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-gray-400 text-[10px] mb-1">COMPLETED SPRINTS</div>
          <div className="text-2xl font-silkscreen text-arcade-cyan">{completedTodaySessions}</div>
          <div className="text-[9px] text-gray-500 mt-1">Sessions today</div>
        </div>

        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-gray-400 text-[10px] mb-1">TASKS CLEARED</div>
          <div className="text-2xl font-silkscreen text-green-400">{completedTasks}</div>
          <div className="text-[9px] text-gray-500 mt-1">{pendingTasks.length} pending in queue</div>
        </div>

        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-gray-400 text-[10px] mb-1">TOTAL XP BANKED</div>
          <div className="text-2xl font-silkscreen text-purple-400">{profile.currentXp}</div>
          <div className="text-[9px] text-gray-500 mt-1">Rank {profile.level} Scholar</div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: ACTIVE TASKS & WEEKLY FOCUS OVERVIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Active Study Tasks Protocol (7 cols) */}
        <div className="lg:col-span-7 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={15} className="text-arcade-gold" />
              <h3 className="font-silkscreen text-xs text-arcade-gold uppercase">
                ACTIVE TASK PROTOCOL ({pendingTasks.length} PENDING)
              </h3>
            </div>
            <button
              onClick={() => {
                audioEngine.playClick();
                onNavigate('TASKS');
              }}
              className="pixel-btn px-2 py-0.5 text-[9px] text-arcade-cyan hover:text-white"
            >
              TASK PLANNER &gt;
            </button>
          </div>

          {pendingTasks.length === 0 ? (
            <div className="p-6 text-center border border-dashed border-arcade-border text-gray-500">
              <p>All protocol tasks cleared! Great work, scholar.</p>
              <button
                onClick={() => onNavigate('TASKS')}
                className="mt-2 text-arcade-gold text-[10px] underline"
              >
                + Create new task
              </button>
            </div>
          ) : (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {pendingTasks.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  className="p-2.5 bg-void border border-arcade-border flex items-center justify-between gap-3 hover:border-arcade-gold/60 transition-colors"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 text-gray-500 hover:text-green-400 shrink-0"
                    >
                      <div className="w-4 h-4 border border-gray-500 hover:border-green-400" />
                    </button>
                    <div className="min-w-0">
                      <div className="font-bold text-gray-200 truncate">{task.title}</div>
                      <div className="flex items-center gap-2 text-[9px] text-gray-400 mt-0.5">
                        <span className="text-arcade-cyan">{task.subject}</span>
                        <span>•</span>
                        <span>Est: {task.estimatedMinutes}m</span>
                        {task.priority === 'HIGH' && (
                          <span className="text-red-400 font-bold">[HIGH PRIORITY]</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      audioEngine.playClick();
                      if (onStartSessionWithTask) onStartSessionWithTask(task);
                      onNavigate('TIMER');
                    }}
                    className="pixel-btn px-2 py-1 text-[9px] text-arcade-gold hover:text-white shrink-0 flex items-center gap-1"
                    title="Launch timer with this task"
                  >
                    <Play size={10} />
                    <span className="hidden sm:inline">FOCUS</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Focus Overview & Daily Quests (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Weekly Heat Bars */}
          <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-cyan uppercase">
                7-DAY FOCUS OVERVIEW
              </span>
              <button
                onClick={() => onNavigate('STATS')}
                className="text-gray-400 hover:text-white text-[9px]"
              >
                FULL STATS &gt;
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1.5 items-end h-28 pt-4 pb-1">
              {weeklyData.map((d, i) => {
                const maxVal = Math.max(60, ...weeklyData.map((w) => w.mins));
                const heightPercent = Math.min(100, Math.round((d.mins / maxVal) * 100));
                return (
                  <div key={i} className="flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[8px] text-gray-400">{d.mins}m</span>
                    <div className="w-full bg-void border border-arcade-border h-20 relative flex items-end">
                      <div
                        className="w-full bg-arcade-cyan hover:bg-arcade-gold transition-all"
                        style={{ height: `${Math.max(6, heightPercent)}%` }}
                        title={`${d.day}: ${d.mins} mins`}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold">{d.day}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Daily Quests Board */}
          <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-gold uppercase">
                DAILY QUESTS
              </span>
              <span className="text-[9px] text-gray-400 font-pixel">REWARDS</span>
            </div>

            <div className="space-y-2">
              {quests.slice(0, 3).map((quest) => {
                const pct = Math.min(100, Math.round((quest.progress / quest.target) * 100));
                return (
                  <div key={quest.id} className="p-2 bg-void border border-arcade-border text-[10px]">
                    <div className="flex items-center justify-between mb-1">
                      <span className={quest.completed ? 'line-through text-gray-500' : 'text-gray-200'}>
                        {quest.title}
                      </span>
                      <span className="font-pixel text-[9px] text-arcade-gold">
                        +{quest.xpReward} XP
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-void-darkest border border-arcade-border overflow-hidden">
                      <div
                        className={`h-full ${quest.completed ? 'bg-green-400' : 'bg-arcade-cyan'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* --- BOTTOM SECTION: RECENT SESSIONS & SCRATCHPAD & DAILY REVIEW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Recent Session History (7 cols) */}
        <div className="lg:col-span-7 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
            <span className="font-silkscreen text-xs text-white uppercase">
              RECENT FOCUS SESSIONS
            </span>
            <button
              onClick={() => onNavigate('STATS')}
              className="text-arcade-gold text-[9px] hover:underline"
            >
              Export CSV / History &gt;
            </button>
          </div>

          {sessions.length === 0 ? (
            <div className="p-6 text-center text-gray-500 border border-dashed border-arcade-border">
              <p>No study sessions logged yet today.</p>
              <button
                onClick={() => onNavigate('TIMER')}
                className="mt-2 pixel-btn px-3 py-1 text-[10px] text-arcade-cyan"
              >
                Start First Session
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {sessions.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  className="p-2 bg-void border border-arcade-border flex items-center justify-between text-[11px]"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-pixel text-[9px] text-arcade-gold">
                      {s.durationMinutes}M
                    </span>
                    <span className="text-gray-200">{s.subject || 'General Study'}</span>
                    {s.taskTitle && (
                      <span className="text-[9px] text-gray-400 truncate max-w-[150px]">
                        // {s.taskTitle}
                      </span>
                    )}
                  </div>
                  <div className="text-[9px] text-gray-500">
                    {new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Scratchpad & Daily Reflection Launcher (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <NotesWidget accentColor={character.palette.accentSecondary} />

          {/* End-of-Day Review Action Banner */}
          <div className="p-3 bg-void border-2 border-arcade-gold/50 flex items-center justify-between gap-3 shadow-pixel-sm">
            <div>
              <div className="font-silkscreen text-xs text-arcade-gold">END-OF-DAY REFLECTION</div>
              <div className="text-[9px] text-gray-400 mt-0.5">
                Consolidate your learning and earn +30 XP!
              </div>
            </div>
            <button
              onClick={() => {
                audioEngine.playClick();
                setShowReflectionModal(true);
              }}
              className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-gold hover:text-white shrink-0"
            >
              LOG REVIEW &gt;
            </button>
          </div>
        </div>
      </div>

      {/* --- DAILY REFLECTION MODAL --- */}
      {showReflectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
          <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-lg w-full shadow-pixel text-xs font-mono">
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-gold">
                DAILY STUDY REFLECTION PROTOCOL
              </span>
              <button
                onClick={() => setShowReflectionModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveReflection} className="space-y-3">
              <div>
                <label className="text-gray-300 block mb-1">
                  1. What did you accomplish today?
                </label>
                <textarea
                  value={reflectionAccomplish}
                  onChange={(e) => setReflectionAccomplish(e.target.value)}
                  placeholder="Summarize your key breakthroughs and completed tasks..."
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs h-16 outline-none focus:border-arcade-gold"
                  required
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">
                  2. What was challenging or difficult?
                </label>
                <textarea
                  value={reflectionDifficult}
                  onChange={(e) => setReflectionDifficult(e.target.value)}
                  placeholder="Note conceptual roadblocks, distractions, or difficult problems..."
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs h-16 outline-none focus:border-arcade-gold"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">
                  3. What should you prioritize tomorrow?
                </label>
                <textarea
                  value={reflectionTomorrow}
                  onChange={(e) => setReflectionTomorrow(e.target.value)}
                  placeholder="Set your prime focus target for the next study routine..."
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs h-16 outline-none focus:border-arcade-gold"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-arcade-border">
                <button
                  type="button"
                  onClick={() => setShowReflectionModal(false)}
                  className="pixel-btn px-3 py-1.5 text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="pixel-btn-primary px-4 py-1.5 text-black font-bold uppercase"
                >
                  SAVE REFLECTION (+30 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
