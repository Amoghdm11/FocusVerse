import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Music, 
  Radio, 
  Video, 
  Headphones, 
  Search, 
  Star, 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Layers,
  Check
} from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';
import { MINECRAFT_STUDY_COLLECTION, MinecraftTrack } from '../data/minecraftTracks';

export type PlaybackSourceType = 'AMBIENCE' | 'SYNTH' | 'MINECRAFT' | 'YOUTUBE';
export type YouTubePlayerMode = 'VIDEO' | 'AUDIO_FOCUSED';

interface MusicCenterProps {
  initialAmbienceProfile?: string;
  onAudioStateChange?: (isPlaying: boolean, trackName: string) => void;
}

export const MusicCenter: React.FC<MusicCenterProps> = ({
  initialAmbienceProfile = 'rain',
  onAudioStateChange,
}) => {
  const [activeSource, setActiveSource] = useState<PlaybackSourceType>('AMBIENCE');
  const [isExpanded, setIsExpanded] = useState(false);

  // Ambience State
  const [selectedAmbience, setSelectedAmbience] = useState<string>(initialAmbienceProfile);
  const [isAmbiencePlaying, setIsAmbiencePlaying] = useState(false);
  const [ambienceVol, setAmbienceVol] = useState(0.4);

  // Chiptune Synth State
  const [isSynthPlaying, setIsSynthPlaying] = useState(false);
  const [synthVol, setSynthVol] = useState(0.3);

  // Minecraft / Sandbox Tracks State
  const [activeMinecraftTrack, setActiveMinecraftTrack] = useState<MinecraftTrack>(MINECRAFT_STUDY_COLLECTION[0]);
  const [minecraftSearch, setMinecraftSearch] = useState('');
  const [minecraftCategory, setMinecraftCategory] = useState<string>('ALL');

  // YouTube State
  const [ytUrlInput, setYtUrlInput] = useState('');
  const [ytVideoId, setYtVideoId] = useState<string>('ha3KQ8gB83w'); // C418 Subwoofer Lullaby default
  const [ytVideoTitle, setYtVideoTitle] = useState('C418 - Subwoofer Lullaby (Minecraft Volume Alpha)');
  const [ytMode, setYtMode] = useState<YouTubePlayerMode>('AUDIO_FOCUSED');
  const [isYtPlaying, setIsYtPlaying] = useState(false);
  const [ytError, setYtError] = useState<string | null>(null);

  // Master Mute
  const [isMuted, setIsMuted] = useState(false);

  // Favorites list persisted
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('focusverse_audio_favorites');
      return saved ? JSON.parse(saved) : ['mc-sweden', 'rain', 'mc-subwoofer-lullaby'];
    } catch (_) {
      return ['mc-sweden', 'rain'];
    }
  });

  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id) ? favorites.filter((f) => f !== id) : [...favorites, id];
    setFavorites(next);
    try {
      localStorage.setItem('focusverse_audio_favorites', JSON.stringify(next));
    } catch (_) {}
  };

  // Ambience Profiles
  const ambienceProfiles = [
    { id: 'rain', label: 'Pixel Rain', icon: '🌧️', desc: 'Gentle downpour against cyber glass' },
    { id: 'lofi', label: 'Warm Lo-Fi Tape', icon: '📼', desc: 'Cassette deck warmth and vinyl crackle' },
    { id: 'space', label: 'Deep Space Orbit', icon: '🌌', desc: 'Ethereal sub-bass and cosmic reverberation' },
    { id: 'sonar', label: 'Subterranean Sonar', icon: '🦇', desc: 'Echoing radar frequencies and low drone' },
    { id: 'matrix', label: 'Terminal Code Rain', icon: '💻', desc: 'Digital data streams and computing clicks' },
    { id: 'fire', label: 'Pixel Fireplace', icon: '🔥', desc: 'Cozy hearth wood crackle and embers' },
    { id: 'wind', label: 'High Altitude Wind', icon: '🌬️', desc: 'Mountain breezes and open sky whispers' },
    { id: 'purr', label: 'Warm Cat Purr', icon: '🐱', desc: 'Rhythmic feline purrs and hearth calm' },
  ];

  // Master Stop / Switch Source Manager (prevents overlapping streams)
  const stopAllAudio = () => {
    if (isAmbiencePlaying) {
      audioEngine.stopAmbience();
      setIsAmbiencePlaying(false);
    }
    if (isSynthPlaying) {
      audioEngine.stopSynth();
      setIsSynthPlaying(false);
    }
    if (isYtPlaying) {
      setIsYtPlaying(false);
    }
  };

  const handleToggleAmbience = (profileId: string) => {
    audioEngine.playClick();
    if (activeSource !== 'AMBIENCE') {
      stopAllAudio();
      setActiveSource('AMBIENCE');
    }

    if (isAmbiencePlaying && selectedAmbience === profileId) {
      audioEngine.stopAmbience();
      setIsAmbiencePlaying(false);
    } else {
      setSelectedAmbience(profileId);
      audioEngine.startAmbience(profileId);
      setIsAmbiencePlaying(true);
    }
  };

  const handleToggleSynth = () => {
    audioEngine.playClick();
    if (activeSource !== 'SYNTH') {
      stopAllAudio();
      setActiveSource('SYNTH');
    }

    const playing = audioEngine.toggleSynth();
    setIsSynthPlaying(playing);
  };

  const handlePlayMinecraftTrack = (track: MinecraftTrack) => {
    audioEngine.playClick();
    stopAllAudio();
    setActiveSource('MINECRAFT');
    setActiveMinecraftTrack(track);

    if (track.youtubeId) {
      setYtVideoId(track.youtubeId);
      setYtVideoTitle(`${track.artist} - ${track.title}`);
      setIsYtPlaying(true);
    } else {
      audioEngine.startAmbience(track.proceduralFallbackProfile);
      setIsAmbiencePlaying(true);
    }
  };

  // YouTube URL Extraction & Validation
  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleLoadYouTubeUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setYtError(null);
    const id = extractYouTubeId(ytUrlInput.trim());
    if (!id) {
      setYtError('Invalid YouTube URL. Please provide a standard watch or youtu.be link.');
      return;
    }

    stopAllAudio();
    setActiveSource('YOUTUBE');
    setYtVideoId(id);
    setYtVideoTitle(`Custom Track [${id}]`);
    setIsYtPlaying(true);
    setYtUrlInput('');
  };

  const handleToggleMute = () => {
    audioEngine.playClick();
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  // Sync readout
  const getCurrentStatusText = () => {
    if (isMuted) return 'MUTED // SILENT PROTOCOL';
    if (activeSource === 'AMBIENCE' && isAmbiencePlaying) {
      return `PLAYING // AMBIENCE: ${selectedAmbience.toUpperCase()}`;
    }
    if (activeSource === 'SYNTH' && isSynthPlaying) {
      return 'PLAYING // 8-BIT CHIPTUNE SYNTH';
    }
    if (activeSource === 'MINECRAFT' && isYtPlaying) {
      return `PLAYING // MINECRAFT: ${activeMinecraftTrack.title.toUpperCase()}`;
    }
    if (activeSource === 'YOUTUBE' && isYtPlaying) {
      return `PLAYING // YOUTUBE: ${ytVideoTitle.slice(0, 30).toUpperCase()}`;
    }
    return 'STANDBY // READY TO PLAY';
  };

  // Filtered Minecraft Tracks
  const filteredMinecraftTracks = MINECRAFT_STUDY_COLLECTION.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(minecraftSearch.toLowerCase()) ||
      t.category.toLowerCase().includes(minecraftSearch.toLowerCase());
    const matchesCat = minecraftCategory === 'ALL' || t.category === minecraftCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="bg-void-card pixel-border border-arcade-border p-4 shadow-pixel text-xs font-mono text-gray-200 space-y-3 select-none">
      {/* --- PANEL HEADER --- */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-arcade-border">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-arcade-cyan flex items-center justify-center text-black font-pixel text-[10px] font-bold shadow-pixel-sm">
            ♫
          </div>
          <div>
            <h3 className="font-silkscreen text-xs text-arcade-cyan uppercase tracking-wider">
              MUSIC &amp; AMBIENCE CENTER
            </h3>
            <div className="text-[9px] text-arcade-gold font-pixel mt-0.5 animate-pulse">
              {getCurrentStatusText()}
            </div>
          </div>
        </div>

        {/* Header Action Controls */}
        <div className="flex items-center gap-2">
          {/* Mute button */}
          <button
            onClick={handleToggleMute}
            className={`px-2 py-1 border text-[10px] flex items-center gap-1 ${
              isMuted
                ? 'border-red-500 bg-red-950 text-red-300'
                : 'border-arcade-border text-gray-400 hover:text-white'
            }`}
            title="Mute / Unmute all sound output"
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            <span>{isMuted ? 'MUTED' : 'MUTE'}</span>
          </button>

          {/* Expand / Collapse Full Library Toggle */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-gold hover:text-white flex items-center gap-1 font-silkscreen"
          >
            <span>{isExpanded ? 'COLLAPSE' : 'EXPAND LIBRARY'}</span>
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* --- PLAYBACK SOURCE SELECTOR TABS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[10px] font-silkscreen">
        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveSource('AMBIENCE');
          }}
          className={`py-1.5 px-2 border flex items-center justify-center gap-1.5 transition-all ${
            activeSource === 'AMBIENCE'
              ? 'border-arcade-cyan bg-cyan-950/70 text-arcade-cyan font-bold shadow-pixel-sm'
              : 'border-arcade-border bg-void text-gray-400 hover:text-white'
          }`}
        >
          <Radio size={12} />
          <span>AMBIENCE</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveSource('MINECRAFT');
          }}
          className={`py-1.5 px-2 border flex items-center justify-center gap-1.5 transition-all ${
            activeSource === 'MINECRAFT'
              ? 'border-green-400 bg-green-950/70 text-green-300 font-bold shadow-pixel-sm'
              : 'border-arcade-border bg-void text-gray-400 hover:text-white'
          }`}
        >
          <span>⛏️</span>
          <span>SANDBOX / C418</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveSource('YOUTUBE');
          }}
          className={`py-1.5 px-2 border flex items-center justify-center gap-1.5 transition-all ${
            activeSource === 'YOUTUBE'
              ? 'border-red-500 bg-red-950/70 text-red-300 font-bold shadow-pixel-sm'
              : 'border-arcade-border bg-void text-gray-400 hover:text-white'
          }`}
        >
          <Video size={12} />
          <span>YOUTUBE PLAYER</span>
        </button>

        <button
          onClick={() => {
            audioEngine.playClick();
            setActiveSource('SYNTH');
          }}
          className={`py-1.5 px-2 border flex items-center justify-center gap-1.5 transition-all ${
            activeSource === 'SYNTH'
              ? 'border-arcade-pink bg-pink-950/70 text-pink-300 font-bold shadow-pixel-sm'
              : 'border-arcade-border bg-void text-gray-400 hover:text-white'
          }`}
        >
          <Music size={12} />
          <span>8-BIT SYNTH</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* SOURCE 1: PROCEDURAL AMBIENT AUDIO                       */}
      {/* ======================================================== */}
      {activeSource === 'AMBIENCE' && (
        <div className="space-y-3 pt-1">
          {/* Quick 8 Ambience Chips */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {ambienceProfiles.map((item) => {
              const isPlayingThis = isAmbiencePlaying && selectedAmbience === item.id;
              const isFav = favorites.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleToggleAmbience(item.id)}
                  className={`p-2 border cursor-pointer transition-all flex flex-col justify-between ${
                    isPlayingThis
                      ? 'border-arcade-cyan bg-cyan-950/40 text-arcade-cyan shadow-pixel-sm'
                      : 'border-arcade-border bg-void text-gray-300 hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base">{item.icon}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(item.id);
                      }}
                      className="text-gray-500 hover:text-arcade-gold"
                    >
                      <Star size={11} fill={isFav ? '#F5C242' : 'none'} className={isFav ? 'text-arcade-gold' : ''} />
                    </button>
                  </div>

                  <div className="mt-1">
                    <div className="font-bold text-xs truncate">{item.label}</div>
                    <div className="text-[8px] text-gray-400 truncate">{item.desc}</div>
                  </div>

                  <div className="mt-2 text-[9px] font-pixel flex items-center justify-between">
                    <span>{isPlayingThis ? 'PLAYING' : 'STOPPED'}</span>
                    <span>{isPlayingThis ? '■' : '▶'}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-3 pt-2 border-t border-arcade-border/50">
            <span className="text-[10px] text-gray-400 shrink-0">AMBIENCE VOLUME:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={ambienceVol}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setAmbienceVol(val);
                audioEngine.setAmbienceVolume(val);
              }}
              className="w-full accent-arcade-cyan h-1.5 bg-void cursor-pointer"
            />
            <span className="text-arcade-cyan text-[10px] w-8 text-right font-bold">
              {Math.round(ambienceVol * 100)}%
            </span>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* SOURCE 2: SANDBOX & PIXEL WORLDS (MINECRAFT STUDY COLLECTION) */}
      {/* ======================================================== */}
      {activeSource === 'MINECRAFT' && (
        <div className="space-y-3 pt-1">
          {/* Subheader and Category Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="relative flex-1 min-w-[180px]">
              <Search size={12} className="absolute left-2.5 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search Minecraft tracks (Sweden, Subwoofer, Cave...)"
                value={minecraftSearch}
                onChange={(e) => setMinecraftSearch(e.target.value)}
                className="w-full pl-7 pr-3 py-1 bg-void border border-arcade-border text-white text-xs outline-none focus:border-green-400"
              />
            </div>

            <select
              value={minecraftCategory}
              onChange={(e) => setMinecraftCategory(e.target.value)}
              className="bg-void border border-arcade-border px-2 py-1 text-gray-300 text-[10px] outline-none"
            >
              <option value="ALL">ALL CATEGORIES</option>
              <option value="Calm Creative-Mode">Calm Creative-Mode</option>
              <option value="Peaceful Building">Peaceful Building</option>
              <option value="Overworld Exploration">Overworld Exploration</option>
              <option value="Cave Ambience">Cave Ambience</option>
              <option value="Ocean Exploration">Ocean Exploration</option>
              <option value="Nighttime Survival">Nighttime Survival</option>
              <option value="Long-Form Study Mix">Long-Form Study Mix</option>
            </select>
          </div>

          {/* Minecraft Track Cards List */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {filteredMinecraftTracks.map((track) => {
              const isSelected = activeMinecraftTrack.id === track.id && isYtPlaying;
              const isFav = favorites.includes(track.id);

              return (
                <div
                  key={track.id}
                  className={`p-2.5 border flex items-center justify-between gap-3 transition-all ${
                    isSelected
                      ? 'border-green-400 bg-green-950/40 text-white shadow-pixel-sm'
                      : 'border-arcade-border bg-void hover:border-gray-500 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => handlePlayMinecraftTrack(track)}
                      className={`w-7 h-7 border flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'border-green-400 bg-green-950 text-green-300'
                          : 'border-arcade-border bg-void-card hover:border-arcade-gold text-arcade-gold'
                      }`}
                    >
                      {isSelected ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs truncate">{track.title}</span>
                        <span className="px-1 text-[8px] bg-void border border-green-500/50 text-green-300">
                          {track.artist}
                        </span>
                        {track.isOfficial && (
                          <span className="text-[8px] text-arcade-gold">● OFFICIAL</span>
                        )}
                      </div>
                      <div className="text-[9px] text-gray-400 truncate mt-0.5">
                        {track.category} • {track.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[9px] text-gray-500">{track.duration}</span>
                    <button
                      onClick={() => toggleFavorite(track.id)}
                      className="text-gray-500 hover:text-arcade-gold"
                    >
                      <Star size={12} fill={isFav ? '#F5C242' : 'none'} className={isFav ? 'text-arcade-gold' : ''} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Minecraft Player Footer */}
          {activeMinecraftTrack && isYtPlaying && (
            <div className="p-3 bg-void-darkest border border-green-500/80 rounded-none space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-green-400 font-bold">
                  NOW PLAYING: {activeMinecraftTrack.artist} - {activeMinecraftTrack.title}
                </span>
                <button
                  onClick={stopAllAudio}
                  className="pixel-btn px-2 py-0.5 text-[9px] text-red-400 hover:text-white"
                >
                  STOP
                </button>
              </div>

              {/* Responsive Embedded YouTube Player for authorized track */}
              <div className="aspect-video w-full max-h-48 overflow-hidden border border-arcade-border">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${activeMinecraftTrack.youtubeId}?autoplay=1&enablejsapi=1`}
                  title={activeMinecraftTrack.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SOURCE 3: YOUTUBE VIDEO & AUDIO PLAYER                   */}
      {/* ======================================================== */}
      {activeSource === 'YOUTUBE' && (
        <div className="space-y-3 pt-1">
          {/* URL Input Form */}
          <form onSubmit={handleLoadYouTubeUrl} className="flex gap-2">
            <input
              type="text"
              placeholder="Paste YouTube Link (e.g. https://www.youtube.com/watch?v=...)"
              value={ytUrlInput}
              onChange={(e) => setYtUrlInput(e.target.value)}
              className="flex-1 p-2 bg-void border border-arcade-border text-xs text-white outline-none focus:border-red-500"
            />
            <button
              type="submit"
              className="pixel-btn-primary px-3 py-1 font-pixel text-[10px] text-black uppercase shrink-0"
            >
              LOAD VIDEO
            </button>
          </form>

          {ytError && (
            <div className="p-2 bg-red-950/80 border border-red-500 text-red-300 text-[10px]">
              {ytError}
            </div>
          )}

          {/* Mode Toggle: Video Mode vs Audio-Focused Mode */}
          <div className="flex items-center justify-between pt-1 text-[10px]">
            <span className="text-gray-400">PLAYBACK VIEWPORT MODE:</span>
            <div className="flex items-center gap-1 border border-arcade-border">
              <button
                onClick={() => setYtMode('AUDIO_FOCUSED')}
                className={`px-2.5 py-1 flex items-center gap-1 uppercase font-silkscreen ${
                  ytMode === 'AUDIO_FOCUSED'
                    ? 'bg-arcade-cyan text-black font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Headphones size={12} />
                <span>AUDIO-FOCUSED</span>
              </button>

              <button
                onClick={() => setYtMode('VIDEO')}
                className={`px-2.5 py-1 flex items-center gap-1 uppercase font-silkscreen ${
                  ytMode === 'VIDEO'
                    ? 'bg-red-500 text-white font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <Video size={12} />
                <span>VIDEO DISPLAY</span>
              </button>
            </div>
          </div>

          {/* Active Player View */}
          {ytVideoId ? (
            <div className="space-y-2">
              {ytMode === 'VIDEO' ? (
                /* 16:9 Video Player */
                <div className="aspect-video w-full max-h-64 overflow-hidden border-2 border-arcade-border bg-black shadow-pixel">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=${isYtPlaying ? 1 : 0}&enablejsapi=1`}
                    title="YouTube Focus Player"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                /* Audio-Focused Compact Player Container */
                <div className="p-3 bg-void-darkest border border-arcade-cyan flex items-center justify-between gap-3 shadow-pixel-sm">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 bg-cyan-950 border border-arcade-cyan flex items-center justify-center text-arcade-cyan animate-pulse shrink-0">
                      <Headphones size={16} />
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-xs text-white truncate">{ytVideoTitle}</div>
                      <div className="text-[9px] text-arcade-cyan">COMPLIANT EMBEDDED AUDIO STREAM</div>
                    </div>
                  </div>

                  {/* Compact embed iframe conforming to YouTube TOS without scraping */}
                  <div className="w-24 h-12 overflow-hidden border border-arcade-border/50 shrink-0">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${ytVideoId}?autoplay=1&enablejsapi=1`}
                      title="Audio Stream"
                      className="w-full h-full border-0"
                      allow="autoplay; encrypted-media"
                    />
                  </div>
                </div>
              )}

              {/* Quick Curated Study Presets */}
              <div className="pt-2 border-t border-arcade-border/60">
                <span className="text-[9px] text-gray-500 font-pixel block mb-1.5">POPULAR STUDY STREAMS:</span>
                <div className="flex flex-wrap gap-1.5 text-[9px]">
                  {[
                    { id: 'jfKfPfyJRdk', title: 'Lofi Girl - Study Beats' },
                    { id: '5qap5aO4i9A', title: 'Minecraft Lo-Fi Mix' },
                    { id: '4xDzrJKXOOY', title: 'Synthwave Radio' },
                    { id: 'WPni755-Krg', title: 'Cyberpunk Ambient City' },
                  ].map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        stopAllAudio();
                        setActiveSource('YOUTUBE');
                        setYtVideoId(preset.id);
                        setYtVideoTitle(preset.title);
                        setIsYtPlaying(true);
                      }}
                      className="px-2 py-0.5 border border-arcade-border bg-void hover:border-arcade-gold text-gray-300"
                    >
                      {preset.title}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 border border-dashed border-arcade-border text-xs">
              Paste any valid YouTube study link or select a preset stream above.
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* SOURCE 4: 8-BIT CHIPTUNE SYNTH MELODY                    */}
      {/* ======================================================== */}
      {activeSource === 'SYNTH' && (
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-void border border-arcade-pink flex items-center justify-between gap-3">
            <div>
              <div className="font-bold text-xs text-arcade-pink">PROCEDURAL 8-BIT ARPEGGIATOR</div>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Generates continuous retro square/triangle harmonies in your tutor’s musical key
              </div>
            </div>

            <button
              onClick={handleToggleSynth}
              className={`pixel-btn px-3 py-1.5 text-xs font-bold uppercase transition-all ${
                isSynthPlaying
                  ? 'border-arcade-pink bg-pink-950 text-pink-300'
                  : 'border-arcade-border text-gray-400 hover:text-white'
              }`}
            >
              {isSynthPlaying ? 'STOP SYNTH' : 'PLAY SYNTH ▶'}
            </button>
          </div>

          {/* Synth Volume */}
          <div className="flex items-center gap-3 pt-2 border-t border-arcade-border/50">
            <span className="text-[10px] text-gray-400 shrink-0">SYNTH VOLUME:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={synthVol}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setSynthVol(val);
                audioEngine.setSynthVolume(val);
              }}
              className="w-full accent-arcade-pink h-1.5 bg-void cursor-pointer"
            />
            <span className="text-arcade-pink text-[10px] w-8 text-right font-bold">
              {Math.round(synthVol * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
