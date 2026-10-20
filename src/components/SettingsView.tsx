import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Volume2, 
  VolumeX, 
  Sliders, 
  Palette, 
  ShieldCheck, 
  Download, 
  Trash2, 
  Bell, 
  Eye, 
  Check,
  RotateCcw
} from 'lucide-react';
import { rpgStore } from '../utils/rpgStore';
import { AppSettings } from '../types/rpg';
import { audioEngine } from '../utils/audioEngine';

export const SettingsView: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>(rpgStore.getSettings());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleUpdate = (updates: Partial<AppSettings>) => {
    const updated = { ...settings, ...updates };
    setSettings(updated);
    rpgStore.saveSettings(updated);

    // Apply sound volumes to engine
    if (updates.ambienceVol !== undefined) audioEngine.setAmbienceVolume(updates.ambienceVol);
    if (updates.synthVol !== undefined) audioEngine.setSynthVolume(updates.synthVol);

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 1500);
  };

  const handleExportBackup = () => {
    audioEngine.playClick();
    const dataStr = rpgStore.exportData();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `focusverse_full_backup_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('CAUTION: This will reset all your sessions, tasks, notes, and XP! Are you sure?')) {
      audioEngine.playClick();
      rpgStore.clearAllData();
      alert('All FocusVerse data cleared. Reloading page...');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 w-full space-y-6 font-mono text-xs text-gray-200">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b-2 border-arcade-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-arcade-gold flex items-center justify-center text-black font-pixel text-xs font-bold shadow-pixel-sm">
            ⚙️
          </div>
          <div>
            <h1 className="font-silkscreen text-base sm:text-lg text-white">
              SETTINGS &amp; HARDWARE CALIBRATION
            </h1>
            <p className="text-[10px] text-gray-400">
              Customize visual themes, audio generators, timer presets, and local telemetry
            </p>
          </div>
        </div>

        {savedSuccess && (
          <span className="px-2.5 py-1 bg-green-950/80 border border-green-500 text-green-300 font-pixel text-[10px] flex items-center gap-1 animate-fadeIn">
            <Check size={12} />
            <span>CALIBRATION SAVED</span>
          </span>
        )}
      </div>

      {/* 1. Visual Theme Selection */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-arcade-border">
          <Palette size={16} className="text-arcade-gold" />
          <h3 className="font-silkscreen text-xs text-arcade-gold uppercase">
            VISUAL THEME &amp; ACCENTS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          {[
            { id: 'cyberpunk', name: 'Cyberpunk Void', desc: 'Default gold & cyan retro arcade' },
            { id: 'night', name: 'Midnight Indigo', desc: 'Softer deep violet & blue glow' },
            { id: 'neon', name: 'Neon High-Contrast', desc: 'Electric lime & radiant pink' },
            { id: 'retro-amber', name: 'Warm Amber CRT', desc: 'Monochrome amber terminal' },
          ].map((th) => {
            const isSelected = settings.theme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => {
                  audioEngine.playClick();
                  handleUpdate({ theme: th.id as any });
                }}
                className={`p-3 border text-left transition-all ${
                  isSelected
                    ? 'border-arcade-gold bg-amber-950/40 text-arcade-gold font-bold shadow-pixel-sm'
                    : 'border-arcade-border bg-void text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="font-silkscreen text-xs">{th.name}</div>
                <div className="text-[9px] text-gray-400 mt-1 leading-snug">{th.desc}</div>
                {isSelected && <div className="mt-2 text-[9px] text-arcade-gold">● ACTIVE</div>}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Timer Presets & Daily Goals */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-arcade-border">
          <Sliders size={16} className="text-arcade-cyan" />
          <h3 className="font-silkscreen text-xs text-arcade-cyan uppercase">
            TIMER PRESETS &amp; DAILY TARGETS
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-gray-400 block mb-1">Focus Duration (mins)</label>
            <input
              type="number"
              min="5"
              max="120"
              value={settings.timerPresets.focus}
              onChange={(e) =>
                handleUpdate({
                  timerPresets: { ...settings.timerPresets, focus: parseInt(e.target.value, 10) || 25 },
                })
              }
              className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Short Break (mins)</label>
            <input
              type="number"
              min="1"
              max="30"
              value={settings.timerPresets.shortBreak}
              onChange={(e) =>
                handleUpdate({
                  timerPresets: { ...settings.timerPresets, shortBreak: parseInt(e.target.value, 10) || 5 },
                })
              }
              className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Long Break (mins)</label>
            <input
              type="number"
              min="5"
              max="60"
              value={settings.timerPresets.longBreak}
              onChange={(e) =>
                handleUpdate({
                  timerPresets: { ...settings.timerPresets, longBreak: parseInt(e.target.value, 10) || 15 },
                })
              }
              className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
            />
          </div>

          <div>
            <label className="text-gray-400 block mb-1">Daily Goal (mins)</label>
            <input
              type="number"
              min="15"
              max="600"
              value={settings.dailyGoalMinutes}
              onChange={(e) => handleUpdate({ dailyGoalMinutes: parseInt(e.target.value, 10) || 100 })}
              className="w-full p-2 bg-void border border-arcade-border text-white text-xs outline-none"
            />
          </div>
        </div>
      </div>

      {/* 3. Audio & Acoustic Calibration */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-arcade-border">
          <Volume2 size={16} className="text-arcade-pink" />
          <h3 className="font-silkscreen text-xs text-arcade-pink uppercase">
            AUDIO ENGINE &amp; SOUND VOLUMES
          </h3>
        </div>

        <div className="space-y-3 max-w-md">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">Procedural Ambience Volume</span>
              <span className="text-arcade-cyan">{Math.round(settings.ambienceVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.ambienceVol}
              onChange={(e) => handleUpdate({ ambienceVol: parseFloat(e.target.value) })}
              className="w-full accent-arcade-cyan h-1.5 bg-void cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-300">8-Bit Chiptune Synth Melody</span>
              <span className="text-arcade-pink">{Math.round(settings.synthVol * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.synthVol}
              onChange={(e) => handleUpdate({ synthVol: parseFloat(e.target.value) })}
              className="w-full accent-arcade-pink h-1.5 bg-void cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-gray-300">Sound Effects &amp; Fanfares</span>
            <input
              type="checkbox"
              checked={settings.soundEffects}
              onChange={(e) => handleUpdate({ soundEffects: e.target.checked })}
              className="accent-arcade-gold cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 4. Accessibility & Notifications */}
      <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-arcade-border">
          <Eye size={16} className="text-green-400" />
          <h3 className="font-silkscreen text-xs text-green-400 uppercase">
            ACCESSIBILITY &amp; DESKTOP NOTIFICATIONS
          </h3>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-gray-200 font-bold">Browser Desktop Notifications</div>
              <div className="text-[10px] text-gray-500">Alert on timer sprint and break completions</div>
            </div>
            <button
              onClick={() => {
                if ('Notification' in window) {
                  Notification.requestPermission().then((perm) => {
                    handleUpdate({ notificationsEnabled: perm === 'granted' });
                  });
                } else {
                  alert('Notifications not supported in this browser.');
                }
              }}
              className="pixel-btn px-3 py-1 text-xs text-arcade-gold"
            >
              {settings.notificationsEnabled ? 'ENABLED' : 'REQUEST PERMISSION'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-arcade-border/50">
            <div>
              <div className="text-gray-200 font-bold">Reduced Motion</div>
              <div className="text-[10px] text-gray-500">Minimize animations and particle effects</div>
            </div>
            <input
              type="checkbox"
              checked={settings.reducedMotion}
              onChange={(e) => handleUpdate({ reducedMotion: e.target.checked })}
              className="accent-arcade-gold cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* 5. Data Export & Danger Zone */}
      <div className="bg-void-card pixel-border border-red-500/50 p-4 shadow-pixel space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-red-500/50">
          <ShieldCheck size={16} className="text-red-400" />
          <h3 className="font-silkscreen text-xs text-red-400 uppercase">
            TELEMETRY DATA &amp; STORAGE MANAGEMENT
          </h3>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-gray-200 font-bold">Export Complete Data Backup</div>
            <div className="text-[10px] text-gray-500">Download all tasks, study history, notes, and XP records as JSON</div>
          </div>
          <button
            onClick={handleExportBackup}
            className="pixel-btn px-3 py-1.5 text-xs text-arcade-gold hover:text-white flex items-center gap-1.5"
          >
            <Download size={13} />
            <span>DOWNLOAD BACKUP JSON</span>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-red-500/30">
          <div>
            <div className="text-red-400 font-bold">Wipe All Local Telemetry</div>
            <div className="text-[10px] text-gray-500">Permanently clears sessions, tasks, notes, and resets RPG level</div>
          </div>
          <button
            onClick={handleResetData}
            className="pixel-btn px-3 py-1.5 text-xs text-red-400 hover:bg-red-950 flex items-center gap-1.5"
          >
            <Trash2 size={13} />
            <span>RESET ALL DATA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
