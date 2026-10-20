import React, { useState } from 'react';
import { 
  BarChart2, 
  Download, 
  Calendar, 
  Clock, 
  Flame, 
  Target, 
  TrendingUp, 
  Filter,
  FileSpreadsheet
} from 'lucide-react';
import { rpgStore, getTodayDateString } from '../utils/rpgStore';
import { StudySessionRecord } from '../types/rpg';
import { audioEngine } from '../utils/audioEngine';

export const StatsView: React.FC = () => {
  const [sessions, setSessions] = useState<StudySessionRecord[]>(rpgStore.getSessions());
  const [timeFilter, setTimeFilter] = useState<'ALL' | 'WEEK' | 'MONTH'>('ALL');
  const [profile] = useState(rpgStore.getProfile());
  const [settings] = useState(rpgStore.getSettings());

  const todayStr = getTodayDateString();

  // Filtered sessions based on timeframe
  const filteredSessions = sessions.filter((s) => {
    if (timeFilter === 'ALL') return true;
    const now = Date.now();
    const sessionTime = s.timestamp;
    const daysDiff = (now - sessionTime) / (1000 * 60 * 60 * 24);
    if (timeFilter === 'WEEK') return daysDiff <= 7;
    if (timeFilter === 'MONTH') return daysDiff <= 30;
    return true;
  });

  // Analytics calculations
  const totalFocusMins = filteredSessions.reduce((acc, s) => acc + s.durationMinutes, 0);
  const totalFocusHours = (totalFocusMins / 60).toFixed(1);
  const totalSessionsCount = filteredSessions.length;
  const completedSessionsCount = filteredSessions.filter((s) => s.completed).length;
  const completionRate = totalSessionsCount > 0
    ? Math.round((completedSessionsCount / totalSessionsCount) * 100)
    : 100;
  const avgDuration = totalSessionsCount > 0
    ? Math.round(totalFocusMins / totalSessionsCount)
    : 0;

  // Breakdown by subject
  const subjectTotals: Record<string, number> = {};
  filteredSessions.forEach((s) => {
    const subj = s.subject || 'General Study';
    subjectTotals[subj] = (subjectTotals[subj] || 0) + s.durationMinutes;
  });

  // Breakdown by tutor
  const tutorTotals: Record<string, number> = {};
  filteredSessions.forEach((s) => {
    const t = s.tutorId || 'Default Tutor';
    tutorTotals[t] = (tutorTotals[t] || 0) + s.durationMinutes;
  });

  // Heatmap generation: 28 days
  const heatmapDays: { dateStr: string; mins: number; dayLetter: string }[] = [];
  const daysLetters = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const todayDate = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setDate(todayDate.getDate() - i);
    const dateStr = getTodayDateString(d);
    const dayMins = sessions
      .filter((s) => s.date === dateStr)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
    heatmapDays.push({
      dateStr,
      mins: dayMins,
      dayLetter: daysLetters[d.getDay()],
    });
  }

  // Export CSV
  const handleExportCSV = () => {
    audioEngine.playClick();
    if (sessions.length === 0) {
      alert('No sessions to export yet! Complete a focus session first.');
      return;
    }
    const headers = ['ID', 'Date', 'DurationMinutes', 'Subject', 'TaskTitle', 'Completed', 'DistractionCount', 'Timestamp'];
    const rows = sessions.map((s) => [
      s.id,
      s.date,
      s.durationMinutes,
      `"${s.subject || 'General Study'}"`,
      `"${s.taskTitle || ''}"`,
      s.completed,
      s.distractionCount || 0,
      new Date(s.timestamp).toISOString(),
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusverse_analytics_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export JSON
  const handleExportJSON = () => {
    audioEngine.playClick();
    const dataStr = JSON.stringify(sessions, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusverse_sessions_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-cyan flex items-center justify-center text-black font-pixel text-xs font-bold shadow-pixel-sm">
            📊
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              LEARNING ANALYTICS &amp; FOCUS TELEMETRY
            </h1>
            <p className="text-[10px] text-gray-400">
              Verified metrics derived strictly from your authentic study sprints
            </p>
          </div>
        </div>

        {/* Filters & Export Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center border border-arcade-border">
            {(['ALL', 'WEEK', 'MONTH'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  audioEngine.playClick();
                  setTimeFilter(filter);
                }}
                className={`px-2.5 py-1 text-[10px] uppercase font-silkscreen ${
                  timeFilter === filter
                    ? 'bg-arcade-gold text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {filter === 'ALL' ? 'ALL TIME' : filter === 'WEEK' ? '7 DAYS' : '30 DAYS'}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-gold hover:text-white flex items-center gap-1"
            title="Download CSV export"
          >
            <FileSpreadsheet size={13} />
            <span>EXPORT CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-cyan hover:text-white flex items-center gap-1"
            title="Download JSON telemetry"
          >
            <Download size={13} />
            <span>EXPORT JSON</span>
          </button>
        </div>
      </div>

      {/* 4 Core Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-[10px] text-gray-400">TOTAL FOCUS TIME</div>
          <div className="text-2xl font-silkscreen text-arcade-gold">{totalFocusHours}h</div>
          <div className="text-[9px] text-gray-500 mt-1">{totalFocusMins} total minutes logged</div>
        </div>

        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-[10px] text-gray-400">COMPLETED SPRINTS</div>
          <div className="text-2xl font-silkscreen text-arcade-cyan">{completedSessionsCount}</div>
          <div className="text-[9px] text-gray-500 mt-1">out of {totalSessionsCount} started</div>
        </div>

        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-[10px] text-gray-400">COMPLETION RATE</div>
          <div className="text-2xl font-silkscreen text-green-400">{completionRate}%</div>
          <div className="text-[9px] text-gray-500 mt-1">Focus commitment index</div>
        </div>

        <div className="p-3 bg-void-card pixel-border border-arcade-border">
          <div className="text-[10px] text-gray-400">AVG SPRINT DURATION</div>
          <div className="text-2xl font-silkscreen text-purple-400">{avgDuration}m</div>
          <div className="text-[9px] text-gray-500 mt-1">per completed block</div>
        </div>
      </div>

      {/* Middle: Heatmap & Subject Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* 28-Day Consistency Heatmap (7 cols) */}
        <div className="lg:col-span-7 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
            <span className="font-silkscreen text-xs text-arcade-cyan uppercase">
              28-DAY STUDY DENSITY HEATMAP
            </span>
            <div className="flex items-center gap-1 text-[8px] text-gray-400">
              <span>Less</span>
              <span className="w-2.5 h-2.5 bg-void border border-arcade-border" />
              <span className="w-2.5 h-2.5 bg-cyan-950 border border-arcade-border" />
              <span className="w-2.5 h-2.5 bg-cyan-700" />
              <span className="w-2.5 h-2.5 bg-arcade-cyan" />
              <span className="w-2.5 h-2.5 bg-arcade-gold" />
              <span>More</span>
            </div>
          </div>

          {/* Grid of 28 days (4 rows x 7 cols) */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {heatmapDays.map((hd, i) => {
              let bg = 'bg-void border border-arcade-border/50';
              if (hd.mins > 0 && hd.mins <= 25) bg = 'bg-cyan-950/70 border border-cyan-800 text-cyan-300';
              else if (hd.mins > 25 && hd.mins <= 50) bg = 'bg-cyan-700 text-black';
              else if (hd.mins > 50 && hd.mins <= 90) bg = 'bg-arcade-cyan text-black font-bold';
              else if (hd.mins > 90) bg = 'bg-arcade-gold text-black font-bold';

              return (
                <div
                  key={i}
                  className={`p-2 h-14 flex flex-col justify-between select-none transition-all ${bg}`}
                  title={`${hd.dateStr}: ${hd.mins} minutes studied`}
                >
                  <span className="text-[8px] opacity-75">{hd.dayLetter}</span>
                  <span className="text-[10px] font-pixel text-right">{hd.mins > 0 ? `${hd.mins}m` : '-'}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-3 pt-2 border-t border-arcade-border flex items-center justify-between text-[9px] text-gray-400">
            <span>Current Streak: {profile.streakDays} days</span>
            <span>Longest Streak: {profile.longestStreakDays} days</span>
          </div>
        </div>

        {/* Subject Breakdown (5 cols) */}
        <div className="lg:col-span-5 bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
            <span className="font-silkscreen text-xs text-arcade-gold uppercase">
              STUDY TIME BY SUBJECT
            </span>
            <span className="text-[9px] text-gray-500 font-pixel">SHARE</span>
          </div>

          {Object.keys(subjectTotals).length === 0 ? (
            <div className="p-8 text-center text-gray-500 border border-dashed border-arcade-border text-xs">
              No subject-categorized study time recorded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {Object.entries(subjectTotals).map(([subj, mins]) => {
                const pct = totalFocusMins > 0 ? Math.round((mins / totalFocusMins) * 100) : 0;
                return (
                  <div key={subj} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-200 font-bold">{subj}</span>
                      <span className="text-arcade-gold font-pixel text-[10px]">
                        {mins}m ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-void border border-arcade-border overflow-hidden">
                      <div
                        className="h-full bg-arcade-cyan transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom: Detailed Session History Log */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border">
          <span className="font-silkscreen text-xs text-white uppercase">
            DETAILED SESSIONS LEDGER ({filteredSessions.length} RECORDS)
          </span>
          <span className="text-[9px] text-gray-400">Auditable Log</span>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="p-10 text-center text-gray-500 border border-dashed border-arcade-border text-xs">
            No study sessions logged for the selected timeframe. Start a focus session to record real data!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-arcade-border text-gray-400 text-[10px]">
                  <th className="py-2 px-3">DATE / TIME</th>
                  <th className="py-2 px-3">DURATION</th>
                  <th className="py-2 px-3">SUBJECT</th>
                  <th className="py-2 px-3">TASK REFERENCE</th>
                  <th className="py-2 px-3">STATUS</th>
                  <th className="py-2 px-3">DISTRACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-arcade-border/40">
                {filteredSessions.slice(0, 15).map((s) => (
                  <tr key={s.id} className="hover:bg-void/50 transition-colors">
                    <td className="py-2 px-3 text-gray-300">
                      {s.date} <span className="text-[10px] text-gray-500">{new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </td>
                    <td className="py-2 px-3 font-pixel text-[10px] text-arcade-gold">
                      {s.durationMinutes} MINS
                    </td>
                    <td className="py-2 px-3 text-arcade-cyan">
                      {s.subject || 'General Study'}
                    </td>
                    <td className="py-2 px-3 text-gray-400 truncate max-w-[200px]">
                      {s.taskTitle || '-'}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`px-1.5 py-0.5 text-[8px] font-pixel border ${
                        s.completed
                          ? 'border-green-500 bg-green-950/60 text-green-300'
                          : 'border-yellow-500 bg-yellow-950/60 text-yellow-300'
                      }`}>
                        {s.completed ? 'COMPLETED' : 'INTERRUPTED'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-gray-400">
                      {s.distractionCount || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
