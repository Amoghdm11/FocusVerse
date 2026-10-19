import React, { useState, useEffect, useRef } from 'react';
import { CheckSquare, Square, Trash2, Plus, Sparkles, AlertCircle } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export type TaskPriority = 'HIGH' | 'MED' | 'LOW';

export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
  priority: TaskPriority;
  createdAt: number;
}

interface TodoWidgetProps {
  onTaskAction?: () => void;
  accentColor?: string;
}

export const TodoWidget: React.FC<TodoWidgetProps> = ({
  onTaskAction,
  accentColor = '#F5C242',
}) => {
  const [tasks, setTasks] = useState<TodoItem[]>(() => {
    try {
      const saved = localStorage.getItem('focusverse_tasks');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return [
      { id: '1', text: 'Calibrate neural focus frequency', completed: false, priority: 'HIGH', createdAt: Date.now() - 10000 },
      { id: '2', text: 'Review Rust memory layout', completed: false, priority: 'MED', createdAt: Date.now() - 5000 },
      { id: '3', text: 'Complete 2x 25-minute study sprints', completed: true, priority: 'LOW', createdAt: Date.now() },
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('MED');
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'DONE'>('ALL');
  const [sparkActive, setSparkActive] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('focusverse_tasks', JSON.stringify(tasks));
    } catch (_) {}
  }, [tasks]);

  const addTask = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal.trim()) return;

    audioEngine.playClick();
    const newTask: TodoItem = {
      id: Date.now().toString(),
      text: inputVal.trim(),
      completed: false,
      priority,
      createdAt: Date.now(),
    };

    setTasks([newTask, ...tasks]);
    setInputVal('');
    if (onTaskAction) onTaskAction();
  };

  const toggleTask = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    const willBeCompleted = !task.completed;
    if (willBeCompleted) {
      audioEngine.playTaskComplete();
      triggerPixelSparks();
    } else {
      audioEngine.playClick();
    }

    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, completed: willBeCompleted } : t))
    );
    if (onTaskAction) onTaskAction();
  };

  const deleteTask = (id: string) => {
    audioEngine.playClick();
    setTasks(tasks.filter((t) => t.id !== id));
    if (onTaskAction) onTaskAction();
  };

  const clearDone = () => {
    audioEngine.playClick();
    setTasks(tasks.filter((t) => !t.completed));
  };

  // Pixel Spark Animation Burst
  const triggerPixelSparks = () => {
    setSparkActive(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = (canvas.width = canvas.parentElement?.clientWidth || 300);
    const h = (canvas.height = canvas.parentElement?.clientHeight || 200);

    const sparks = Array.from({ length: 30 }, () => ({
      x: w / 2,
      y: h / 3,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8 - 2,
      color: ['#F5C242', '#00F0FF', '#FF007F', '#FFFFFF'][Math.floor(Math.random() * 4)],
      size: Math.random() > 0.5 ? 4 : 2,
      alpha: 1,
    }));

    let animId: number;
    let frames = 0;

    const runSparks = () => {
      frames++;
      ctx.clearRect(0, 0, w, h);

      sparks.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.25; // gravity
        s.alpha = Math.max(0, 1 - frames / 35);

        ctx.fillStyle = s.color;
        ctx.globalAlpha = s.alpha;
        ctx.fillRect(Math.floor(s.x), Math.floor(s.y), s.size, s.size);
      });

      if (frames < 35) {
        animId = requestAnimationFrame(runSparks);
      } else {
        ctx.clearRect(0, 0, w, h);
        setSparkActive(false);
      }
    };

    runSparks();
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === 'ACTIVE') return !t.completed;
    if (filter === 'DONE') return t.completed;
    return true;
  });

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="relative bg-void-card pixel-border border-arcade-border p-3.5 shadow-pixel">
      {/* Pixel Spark Burst Canvas */}
      <canvas
        ref={canvasRef}
        className={`absolute inset-0 pointer-events-none z-30 w-full h-full ${
          sparkActive ? 'block' : 'hidden'
        }`}
      />

      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-arcade-border select-none">
        <div className="flex items-center gap-2">
          <CheckSquare size={16} className="text-arcade-gold" />
          <h3 className="font-silkscreen text-xs text-arcade-gold tracking-wider uppercase">
            ACTIVE TASK PROTOCOL
          </h3>
        </div>
        <div className="text-[10px] font-mono text-gray-400">
          COMPLETED: <span className="text-arcade-cyan font-bold">{completedCount}/{tasks.length}</span>
        </div>
      </div>

      {/* Task Input Form */}
      <form onSubmit={addTask} className="space-y-2 mb-3">
        <div className="flex gap-1.5">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="> add new focus objective..."
            className="flex-1 bg-void-darkest border border-arcade-border px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 font-mono outline-none focus:border-arcade-gold transition-colors"
          />
          <button
            type="submit"
            className="pixel-btn px-2.5 py-1 text-xs font-bold text-arcade-gold flex items-center gap-1"
          >
            <Plus size={14} />
            <span>ADD</span>
          </button>
        </div>

        {/* Priority Selector Bar */}
        <div className="flex items-center justify-between text-[10px] font-mono">
          <span className="text-gray-500">PRIORITY:</span>
          <div className="flex gap-1">
            {(['HIGH', 'MED', 'LOW'] as TaskPriority[]).map((p) => {
              const isActive = priority === p;
              const colorClass =
                p === 'HIGH'
                  ? 'border-red-500 text-red-400 bg-red-950/40'
                  : p === 'MED'
                  ? 'border-arcade-gold text-arcade-gold bg-amber-950/40'
                  : 'border-arcade-cyan text-arcade-cyan bg-cyan-950/40';

              return (
                <button
                  type="button"
                  key={p}
                  onClick={() => {
                    audioEngine.playClick();
                    setPriority(p);
                  }}
                  className={`px-2 py-0.5 border text-[9px] font-bold uppercase transition-all ${
                    isActive ? colorClass : 'border-arcade-border text-gray-600 hover:text-gray-300'
                  }`}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </form>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between text-[10px] font-mono border-y border-arcade-border/60 py-1 mb-2 select-none">
        <div className="flex gap-2">
          {(['ALL', 'ACTIVE', 'DONE'] as const).map((f) => (
            <button
              key={f}
              onClick={() => {
                audioEngine.playClick();
                setFilter(f);
              }}
              className={`hover:text-arcade-gold transition-colors ${
                filter === f ? 'text-arcade-gold font-bold underline' : 'text-gray-500'
              }`}
            >
              [{f}]
            </button>
          ))}
        </div>

        {completedCount > 0 && (
          <button
            onClick={clearDone}
            className="text-red-400/80 hover:text-red-300 transition-colors"
          >
            PURGE DONE
          </button>
        )}
      </div>

      {/* Task List */}
      <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-4 text-xs font-mono text-gray-600 italic">
            // No objectives logged in this quadrant.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const priorityBadge =
              t.priority === 'HIGH'
                ? 'border-red-500/80 text-red-400'
                : t.priority === 'MED'
                ? 'border-arcade-gold/80 text-arcade-gold'
                : 'border-arcade-cyan/80 text-arcade-cyan';

            return (
              <div
                key={t.id}
                className={`group flex items-center justify-between p-1.5 border text-xs font-mono transition-all ${
                  t.completed
                    ? 'border-arcade-border/40 bg-void/40 text-gray-600'
                    : 'border-arcade-border bg-void-darkest text-gray-200 hover:border-arcade-gold/60'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
                  <button
                    onClick={() => toggleTask(t.id)}
                    className="shrink-0 text-arcade-gold hover:text-white transition-colors"
                  >
                    {t.completed ? <CheckSquare size={14} /> : <Square size={14} />}
                  </button>
                  <span
                    className={`truncate cursor-pointer select-none ${
                      t.completed ? 'line-through text-gray-500' : ''
                    }`}
                    onClick={() => toggleTask(t.id)}
                  >
                    {t.text}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`px-1 py-0.2 border text-[8px] font-bold ${priorityBadge}`}>
                    {t.priority}
                  </span>
                  <button
                    onClick={() => deleteTask(t.id)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition-opacity"
                    title="Delete objective"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
