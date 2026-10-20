import React, { useState } from 'react';
import { 
  CheckSquare, 
  Plus, 
  Trash2, 
  Play, 
  Calendar, 
  Clock, 
  Search, 
  Filter, 
  Sparkles, 
  Edit3, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { RPGTask, TaskPriority, StudyPlannerBlock } from '../types/rpg';
import { rpgStore, getTodayDateString } from '../utils/rpgStore';
import { audioEngine } from '../utils/audioEngine';

interface TaskPlannerViewProps {
  onStartFocusWithTask: (task: RPGTask) => void;
}

export const TaskPlannerView: React.FC<TaskPlannerViewProps> = ({
  onStartFocusWithTask,
}) => {
  const [activeTab, setActiveTab] = useState<'TASKS' | 'PLANNER'>('TASKS');
  const [tasks, setTasks] = useState<RPGTask[]>(rpgStore.getTasks());
  const [plannerBlocks, setPlannerBlocks] = useState<StudyPlannerBlock[]>(rpgStore.getPlannerBlocks());

  // Task Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  // New Task Form Modal / Inline
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSubject, setNewSubject] = useState('Computer Science');
  const [newPriority, setNewPriority] = useState<TaskPriority>('MED');
  const [newEstMinutes, setNewEstMinutes] = useState(30);
  const [newDeadline, setNewDeadline] = useState(getTodayDateString());
  const [subtasksInput, setSubtasksInput] = useState('');

  // Expanded subtasks toggle
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const refreshTasks = () => {
    setTasks(rpgStore.getTasks());
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    audioEngine.playClick();
    const parsedSubtasks = subtasksInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s, idx) => ({ id: `sub-${Date.now()}-${idx}`, text: s, completed: false }));

    rpgStore.addTask({
      title: newTitle.trim(),
      description: newDesc.trim(),
      subject: newSubject.trim() || 'General Study',
      priority: newPriority,
      estimatedMinutes: Number(newEstMinutes) || 25,
      deadline: newDeadline,
      completed: false,
      subtasks: parsedSubtasks,
      notes: '',
      recurring: 'NONE',
    });

    setNewTitle('');
    setNewDesc('');
    setSubtasksInput('');
    setShowNewTaskModal(false);
    refreshTasks();
  };

  const handleToggleComplete = (id: string) => {
    const isNowDone = rpgStore.toggleTaskComplete(id);
    if (isNowDone) audioEngine.playTaskComplete();
    else audioEngine.playClick();
    refreshTasks();
  };

  const handleDeleteTask = (id: string) => {
    if (window.confirm('Are you sure you want to delete this study task?')) {
      audioEngine.playClick();
      rpgStore.deleteTask(id);
      refreshTasks();
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    const updatedSubtasks = task.subtasks.map((st) =>
      st.id === subtaskId ? { ...st, completed: !st.completed } : st
    );
    rpgStore.updateTask(taskId, { subtasks: updatedSubtasks });
    audioEngine.playClick();
    refreshTasks();
  };

  // Planner block completion toggle
  const handleTogglePlannerBlock = (id: string) => {
    audioEngine.playClick();
    const updated = plannerBlocks.map((b) =>
      b.id === id ? { ...b, completed: !b.completed } : b
    );
    setPlannerBlocks(updated);
    rpgStore.savePlannerBlocks(updated);
  };

  // Auto-schedule AI Assistant
  const handleAutoSchedule = () => {
    audioEngine.playClick();
    const sampleBlocks: StudyPlannerBlock[] = [
      { id: `pb-${Date.now()}-1`, dayOfWeek: 1, timeSlot: '09:00 - 10:00', subject: 'High Priority Tasks', targetMinutes: 50, completed: false },
      { id: `pb-${Date.now()}-2`, dayOfWeek: 2, timeSlot: '14:00 - 15:00', subject: 'Active Recall & Flashcards', targetMinutes: 45, completed: false },
      { id: `pb-${Date.now()}-3`, dayOfWeek: 3, timeSlot: '10:00 - 11:30', subject: 'Deep Problem Solving', targetMinutes: 60, completed: false },
      { id: `pb-${Date.now()}-4`, dayOfWeek: 4, timeSlot: '13:00 - 14:00', subject: 'Review Weak Topics', targetMinutes: 45, completed: false },
      { id: `pb-${Date.now()}-5`, dayOfWeek: 5, timeSlot: '15:00 - 16:00', subject: 'Weekly Synthesis', targetMinutes: 50, completed: false },
    ];
    setPlannerBlocks(sampleBlocks);
    rpgStore.savePlannerBlocks(sampleBlocks);
    alert('Study schedule automatically populated based on your active task queue and deadlines!');
  };

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPriority = filterPriority === 'ALL' || t.priority === filterPriority;
    const matchesStatus = filterStatus === 'ALL' ||
      (filterStatus === 'ACTIVE' && !t.completed) ||
      (filterStatus === 'COMPLETED' && t.completed);
    return matchesSearch && matchesPriority && matchesStatus;
  });

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* Top Navigation & Subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-gold flex items-center justify-center text-black font-pixel text-xs font-bold shadow-pixel-sm">
            ✓
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              TASK PROTOCOL &amp; STUDY PLANNER
            </h1>
            <p className="text-[10px] text-gray-400">
              Manage study queues, link focus timers, and structure weekly routines
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('TASKS');
            }}
            className={`px-3 py-1.5 font-silkscreen text-xs uppercase border ${
              activeTab === 'TASKS'
                ? 'border-arcade-gold bg-amber-950/70 text-arcade-gold font-bold shadow-pixel-sm'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
          >
            TASK PROTOCOL ({tasks.length})
          </button>

          <button
            onClick={() => {
              audioEngine.playClick();
              setActiveTab('PLANNER');
            }}
            className={`px-3 py-1.5 font-silkscreen text-xs uppercase border ${
              activeTab === 'PLANNER'
                ? 'border-arcade-cyan bg-cyan-950/70 text-arcade-cyan font-bold shadow-pixel-sm'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
          >
            WEEKLY PLANNER
          </button>
        </div>
      </div>

      {/* --- SUBTAB 1: TASK PROTOCOL --- */}
      {activeTab === 'TASKS' && (
        <div className="space-y-4">
          {/* Action Bar (Search, Filters, New Task Button) */}
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
              {/* Search */}
              <div className="relative flex-1 min-w-[180px]">
                <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks by title or subject..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-void border border-arcade-border text-gray-200 text-xs outline-none focus:border-arcade-gold"
                />
              </div>

              {/* Status Filter */}
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="bg-void border border-arcade-border px-2 py-1.5 text-gray-300 text-xs outline-none"
              >
                <option value="ALL">ALL STATUS</option>
                <option value="ACTIVE">ACTIVE ONLY</option>
                <option value="COMPLETED">COMPLETED ONLY</option>
              </select>

              {/* Priority Filter */}
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="bg-void border border-arcade-border px-2 py-1.5 text-gray-300 text-xs outline-none"
              >
                <option value="ALL">ALL PRIORITIES</option>
                <option value="HIGH">HIGH PRIORITY</option>
                <option value="MED">MED PRIORITY</option>
                <option value="LOW">LOW PRIORITY</option>
              </select>
            </div>

            <button
              onClick={() => {
                audioEngine.playClick();
                setShowNewTaskModal(true);
              }}
              className="pixel-btn-primary px-3 py-1.5 text-xs font-pixel flex items-center gap-1.5 uppercase"
            >
              <Plus size={14} />
              <span>NEW TASK</span>
            </button>
          </div>

          {/* Task List Table */}
          {filteredTasks.length === 0 ? (
            <div className="p-12 text-center bg-void-card pixel-border border-arcade-border text-gray-500">
              <p className="text-sm">No tasks found matching your filter criteria.</p>
              <button
                onClick={() => setShowNewTaskModal(true)}
                className="mt-3 pixel-btn px-4 py-1.5 text-arcade-gold text-xs"
              >
                + Add your first task
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTasks.map((task) => {
                const subtasksCount = task.subtasks.length;
                const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
                const subtaskPercent = subtasksCount > 0 ? Math.round((completedSubtasks / subtasksCount) * 100) : 0;
                const isExpanded = expandedTaskId === task.id;

                return (
                  <div
                    key={task.id}
                    className={`bg-void-card pixel-border border-arcade-border p-3.5 transition-all ${
                      task.completed ? 'opacity-70 border-arcade-border/50' : 'hover:border-arcade-gold/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      {/* Checkbox + Title */}
                      <div className="flex items-start gap-3 min-w-0 flex-1">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className={`mt-1 w-5 h-5 border flex items-center justify-center shrink-0 ${
                            task.completed
                              ? 'border-green-400 bg-green-950 text-green-400'
                              : 'border-gray-500 hover:border-arcade-gold'
                          }`}
                        >
                          {task.completed && '✓'}
                        </button>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`font-bold text-sm ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-100'
                              }`}
                            >
                              {task.title}
                            </span>

                            {/* Priority Badge */}
                            <span
                              className={`px-1.5 py-0.5 text-[8px] font-pixel border ${
                                task.priority === 'HIGH'
                                  ? 'border-red-500 bg-red-950/70 text-red-300'
                                  : task.priority === 'MED'
                                  ? 'border-amber-500 bg-amber-950/70 text-amber-300'
                                  : 'border-blue-500 bg-blue-950/70 text-blue-300'
                              }`}
                            >
                              {task.priority}
                            </span>

                            <span className="px-1.5 py-0.5 text-[9px] bg-void border border-arcade-border text-arcade-cyan">
                              {task.subject}
                            </span>
                          </div>

                          {task.description && (
                            <p className="text-gray-400 text-xs mt-1 leading-relaxed">
                              {task.description}
                            </p>
                          )}

                          {/* Metadata row */}
                          <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500 flex-wrap">
                            <span className="flex items-center gap-1">
                              <Clock size={11} /> Est: {task.estimatedMinutes}m
                            </span>
                            {task.deadline && (
                              <span className="flex items-center gap-1">
                                <Calendar size={11} /> Due: {task.deadline}
                              </span>
                            )}
                            {subtasksCount > 0 && (
                              <button
                                onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                                className="text-arcade-gold hover:underline flex items-center gap-1"
                              >
                                <span>Subtasks: {completedSubtasks}/{subtasksCount} ({subtaskPercent}%)</span>
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        {!task.completed && (
                          <button
                            onClick={() => {
                              audioEngine.playClick();
                              onStartFocusWithTask(task);
                            }}
                            className="pixel-btn-primary px-2.5 py-1 text-[10px] font-pixel flex items-center gap-1 uppercase"
                            title="Launch focus session linked to this task"
                          >
                            <Play size={11} />
                            <span>FOCUS</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1 border border-arcade-border text-gray-500 hover:text-red-400 hover:border-red-500 text-xs"
                          title="Delete task"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {/* Subtasks Accordion */}
                    {isExpanded && subtasksCount > 0 && (
                      <div className="mt-3 pt-3 border-t border-arcade-border/60 pl-8 space-y-1.5">
                        {task.subtasks.map((st) => (
                          <div key={st.id} className="flex items-center gap-2 text-xs">
                            <input
                              type="checkbox"
                              checked={st.completed}
                              onChange={() => handleToggleSubtask(task.id, st.id)}
                              className="accent-arcade-gold cursor-pointer"
                            />
                            <span className={st.completed ? 'line-through text-gray-500' : 'text-gray-300'}>
                              {st.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* --- SUBTAB 2: STUDY PLANNER & TIME BLOCKING --- */}
      {activeTab === 'PLANNER' && (
        <div className="space-y-4">
          <div className="p-3 bg-void-card pixel-border border-arcade-border flex items-center justify-between gap-3">
            <div>
              <div className="font-silkscreen text-xs text-arcade-cyan">
                WEEKLY TIME-BLOCK CALENDAR (MON - SUN)
              </div>
              <div className="text-[10px] text-gray-400">
                Structure dedicated focus blocks for deliberate practice
              </div>
            </div>

            <button
              onClick={handleAutoSchedule}
              className="pixel-btn px-3 py-1.5 text-xs text-arcade-gold hover:text-white flex items-center gap-1.5"
            >
              <Sparkles size={13} />
              <span>AI AUTO-SCHEDULE</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {[1, 2, 3, 4, 5, 6, 0].map((dayIdx) => {
              const dayName = daysOfWeek[dayIdx];
              const blocks = plannerBlocks.filter((b) => b.dayOfWeek === dayIdx);
              const dayTotalMins = blocks.reduce((sum, b) => sum + b.targetMinutes, 0);

              return (
                <div
                  key={dayIdx}
                  className="bg-void-card pixel-border border-arcade-border p-3 flex flex-col justify-between min-h-[220px]"
                >
                  <div>
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-arcade-border">
                      <span className="font-pixel text-[9px] text-arcade-gold uppercase">
                        {dayName.slice(0, 3)}
                      </span>
                      <span className="text-[9px] text-gray-500">{dayTotalMins}m</span>
                    </div>

                    <div className="space-y-2">
                      {blocks.length === 0 ? (
                        <div className="p-3 text-center text-[10px] text-gray-600 border border-dashed border-arcade-border/40">
                          Rest or self-study
                        </div>
                      ) : (
                        blocks.map((block) => (
                          <div
                            key={block.id}
                            onClick={() => handleTogglePlannerBlock(block.id)}
                            className={`p-2 border cursor-pointer text-[10px] transition-all select-none ${
                              block.completed
                                ? 'border-green-500/60 bg-green-950/40 text-green-300 line-through'
                                : 'border-arcade-border bg-void hover:border-arcade-cyan text-gray-200'
                            }`}
                          >
                            <div className="font-bold">{block.timeSlot}</div>
                            <div className="text-arcade-cyan truncate">{block.subject}</div>
                            <div className="text-[8px] text-gray-400 mt-0.5">{block.targetMinutes} mins</div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const timeSlot = prompt('Enter time slot (e.g., 10:00 - 11:00):', '10:00 - 11:00');
                      if (!timeSlot) return;
                      const subject = prompt('Enter subject / target task:', 'Mathematics');
                      if (!subject) return;
                      const newBlock: StudyPlannerBlock = {
                        id: `pb-${Date.now()}`,
                        dayOfWeek: dayIdx,
                        timeSlot,
                        subject,
                        targetMinutes: 45,
                        completed: false,
                      };
                      const updated = [...plannerBlocks, newBlock];
                      setPlannerBlocks(updated);
                      rpgStore.savePlannerBlocks(updated);
                    }}
                    className="mt-3 text-[9px] text-gray-400 hover:text-arcade-gold text-center border border-dashed border-arcade-border py-1"
                  >
                    + Add Block
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* --- CREATE NEW TASK MODAL --- */}
      {showNewTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-void-card pixel-border border-arcade-gold p-5 max-w-md w-full shadow-pixel">
            <div className="flex items-center justify-between pb-2 mb-4 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-gold">
                INITIALIZE NEW STUDY TASK
              </span>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-gray-300 block mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Implement Dijkstra Algorithm"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-gold"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Subject / Domain</label>
                <input
                  type="text"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  placeholder="e.g. Computer Science, Chemistry, History"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none focus:border-arcade-gold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-300 block mb-1">Priority</label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  >
                    <option value="HIGH">HIGH (Boss Fight)</option>
                    <option value="MED">MED (Standard Quest)</option>
                    <option value="LOW">LOW (Side Quest)</option>
                  </select>
                </div>

                <div>
                  <label className="text-gray-300 block mb-1">Estimated Minutes</label>
                  <input
                    type="number"
                    min="5"
                    max="360"
                    value={newEstMinutes}
                    onChange={(e) => setNewEstMinutes(parseInt(e.target.value, 10))}
                    className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-gray-300 block mb-1">Deadline Date</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 block mb-1">
                  Subtasks (1 per line, optional)
                </label>
                <textarea
                  value={subtasksInput}
                  onChange={(e) => setSubtasksInput(e.target.value)}
                  placeholder="Write test cases&#10;Implement edge cases&#10;Verify complexity"
                  className="w-full p-2 bg-void border border-arcade-border text-white text-xs h-16 outline-none focus:border-arcade-gold"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-arcade-border">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="pixel-btn px-3 py-1.5 text-gray-400 hover:text-white"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="pixel-btn-primary px-4 py-1.5 text-black font-bold uppercase"
                >
                  CREATE TASK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
