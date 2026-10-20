import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Search, 
  Plus, 
  Trash2, 
  Heart, 
  ListMusic, 
  Video, 
  Headphones, 
  Maximize2, 
  Minimize2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  FolderPlus, 
  Check, 
  X, 
  ExternalLink, 
  Sparkles, 
  ArrowUp, 
  ArrowDown, 
  Layers, 
  Music,
  AlertTriangle,
  Radio,
  Sliders,
  Key
} from 'lucide-react';
import { YouTubeTrack, YouTubePlaylist, YouTubePlayerMode, RepeatMode, PlayerTab } from '../types/musicPlayer';
import { youtubeService } from '../utils/youtubeService';
import { audioEngine } from '../utils/audioEngine';

export type { YouTubePlayerMode };

interface MusicCenterProps {
  initialAmbienceProfile?: string;
  onAudioStateChange?: (isPlaying: boolean, trackName: string) => void;
}

// Global declaration for YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

export const MusicCenter: React.FC<MusicCenterProps> = ({
  initialAmbienceProfile,
  onAudioStateChange,
}) => {
  // --- PLAYER PERSISTED STATE ---
  const [queue, setQueue] = useState<YouTubeTrack[]>(() => youtubeService.getQueue());
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolume] = useState<number>(() => youtubeService.getVolume());
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playerMode, setPlayerMode] = useState<YouTubePlayerMode>(() => youtubeService.getPlayerMode());
  const [isShuffle, setIsShuffle] = useState<boolean>(() => youtubeService.getShuffle());
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(() => youtubeService.getRepeat());
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<PlayerTab>('PLAYER');

  // --- PLAYLISTS & FAVORITES STATE ---
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>(() => youtubeService.getPlaylists());
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<YouTubeTrack[]>(() => youtubeService.getFavorites());
  const [recentTracks, setRecentTracks] = useState<YouTubeTrack[]>(() => youtubeService.getRecentlyPlayed());

  // --- SEARCH STATE ---
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<YouTubeTrack[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  // --- MODALS & TOOLTIPS ---
  const [showNewPlaylistModal, setShowNewPlaylistModal] = useState<boolean>(false);
  const [newPlaylistName, setNewPlaylistName] = useState<string>('');
  const [newPlaylistIcon, setNewPlaylistIcon] = useState<string>('🎵');
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<boolean>(false);
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState<YouTubeTrack | null>(null);
  const [showApiKeyModal, setShowApiKeyModal] = useState<boolean>(false);
  const [apiKeyInput, setApiKeyInput] = useState<string>(() => youtubeService.getApiKey());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // --- YOUTUBE IFRAME PLAYER REFS ---
  const playerRef = useRef<any>(null);
  const playerContainerId = useRef<string>(`yt-player-${Math.random().toString(36).substring(2, 9)}`);
  const progressIntervalRef = useRef<any>(null);
  const isAdvancingRef = useRef<boolean>(false);

  // Current active track
  const currentTrack = queue[currentIndex] || queue[0] || null;

  // --- YOUTUBE IFRAME API INITIALIZATION ---
  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!isMounted || !window.YT || !window.YT.Player) return;
      if (playerRef.current) return;

      const container = document.getElementById(playerContainerId.current);
      if (!container) return;

      try {
        playerRef.current = new window.YT.Player(playerContainerId.current, {
          height: '100%',
          width: '100%',
          videoId: currentTrack ? currentTrack.videoId : 'aBkTkxKDduc',
          playerVars: {
            autoplay: 0,
            controls: 1,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            playsinline: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event: any) => {
              if (!isMounted) return;
              event.target.setVolume(volume);
              if (isMuted) event.target.mute();
            },
            onStateChange: (event: any) => {
              if (!isMounted) return;
              handlePlayerStateChange(event.data);
            },
            onError: (event: any) => {
              if (!isMounted) return;
              handlePlayerError(event.data);
            },
          },
        });
      } catch (err) {
        console.warn('Error creating YT.Player instance:', err);
      }
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (_) {}
        playerRef.current = null;
      }
    };
  }, []);

  // --- SYNC CURRENT TRACK TO YOUTUBE PLAYER ---
  useEffect(() => {
    if (!currentTrack || !playerRef.current) return;

    try {
      if (typeof playerRef.current.getVideoData === 'function') {
        const currentData = playerRef.current.getVideoData();
        if (currentData && currentData.video_id === currentTrack.videoId) {
          return;
        }
      }

      if (isPlaying) {
        playerRef.current.loadVideoById(currentTrack.videoId);
      } else {
        playerRef.current.cueVideoById(currentTrack.videoId);
      }

      // Add to recent tracks
      youtubeService.addRecentlyPlayed(currentTrack);
      setRecentTracks(youtubeService.getRecentlyPlayed());

      if (onAudioStateChange) {
        onAudioStateChange(isPlaying, currentTrack.title);
      }
    } catch (err) {
      console.warn('Error loading video by ID:', err);
    }
  }, [currentIndex, currentTrack?.videoId]);

  // --- PROGRESS INTERVAL TRACKER ---
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          try {
            const time = playerRef.current.getCurrentTime() || 0;
            const dur = playerRef.current.getDuration() || 0;
            setCurrentTime(time);
            if (dur > 0) setDuration(dur);
          } catch (_) {}
        }
      }, 500);
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    };
  }, [isPlaying]);

  // --- PLAYER STATE EVENT HANDLER ---
  const handlePlayerStateChange = (state: number) => {
    // YT.PlayerState: -1=unstarted, 0=ended, 1=playing, 2=paused, 3=buffering, 5=video cued
    if (state === 1) {
      // PLAYING
      setIsPlaying(true);
      setIsBuffering(false);
      setErrorMessage(null);
      isAdvancingRef.current = false;
    } else if (state === 2) {
      // PAUSED
      setIsPlaying(false);
      setIsBuffering(false);
    } else if (state === 3) {
      // BUFFERING
      setIsBuffering(true);
    } else if (state === 0) {
      // ENDED: Automatic Queue Advancement
      if (isAdvancingRef.current) return;
      isAdvancingRef.current = true;
      handleTrackEnded();
    }
  };

  // Handle Track Completion
  const handleTrackEnded = () => {
    if (repeatMode === 'ONE') {
      if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
        playerRef.current.seekTo(0);
        playerRef.current.playVideo();
        setTimeout(() => { isAdvancingRef.current = false; }, 1000);
      }
      return;
    }

    if (currentIndex < queue.length - 1) {
      handleNextTrack();
    } else if (repeatMode === 'ALL') {
      setCurrentIndex(0);
      setTimeout(() => { isAdvancingRef.current = false; }, 1000);
    } else {
      setIsPlaying(false);
      isAdvancingRef.current = false;
    }
  };

  // --- ERROR HANDLER (NON-EMBEDDABLE & RESTRICTED VIDEOS) ---
  const handlePlayerError = (errorCode: number) => {
    let msg = 'Playback error occurred.';
    if (errorCode === 101 || errorCode === 150) {
      msg = 'Creator restricted video from being embedded outside YouTube.';
    } else if (errorCode === 100) {
      msg = 'Video not found or removed.';
    } else if (errorCode === 2) {
      msg = 'Invalid video ID parameter.';
    }
    setErrorMessage(`${msg} Auto-skipping to next track in queue...`);

    // Gracefully skip to next track after 2 seconds
    setTimeout(() => {
      if (queue.length > 1) {
        handleNextTrack();
      }
    }, 2200);
  };

  // --- CONTROLS: PLAY, PAUSE, NEXT, PREV, SEEK, VOLUME ---
  const handleTogglePlay = () => {
    audioEngine.playClick();
    if (!playerRef.current) return;

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo();
        setIsPlaying(false);
      } else {
        playerRef.current.playVideo();
        setIsPlaying(true);
      }
    } catch (_) {}
  };

  const handleNextTrack = () => {
    audioEngine.playClick();
    if (queue.length === 0) return;

    if (isShuffle && queue.length > 2) {
      let randIdx = Math.floor(Math.random() * queue.length);
      while (randIdx === currentIndex && queue.length > 1) {
        randIdx = Math.floor(Math.random() * queue.length);
      }
      setCurrentIndex(randIdx);
      return;
    }

    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else if (repeatMode === 'ALL') {
      setCurrentIndex(0);
    }
  };

  const handlePrevTrack = () => {
    audioEngine.playClick();
    if (currentTime > 5 && playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(0);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(queue.length - 1);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(newTime, true);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setVolume(val);
    youtubeService.saveVolume(val);
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(val);
      if (val > 0 && isMuted) {
        playerRef.current.unMute();
        setIsMuted(false);
      }
    }
  };

  const handleToggleMute = () => {
    audioEngine.playClick();
    if (!playerRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    try {
      if (nextMuted) playerRef.current.mute();
      else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    } catch (_) {}
  };

  const handleToggleShuffle = () => {
    audioEngine.playClick();
    const next = !isShuffle;
    setIsShuffle(next);
    youtubeService.saveShuffle(next);
  };

  const handleCycleRepeat = () => {
    audioEngine.playClick();
    const modes: RepeatMode[] = ['OFF', 'ALL', 'ONE'];
    const nextIdx = (modes.indexOf(repeatMode) + 1) % modes.length;
    const next = modes[nextIdx];
    setRepeatMode(next);
    youtubeService.saveRepeat(next);
  };

  const handleToggleMode = () => {
    audioEngine.playClick();
    const nextMode: YouTubePlayerMode = playerMode === 'VIDEO' ? 'AUDIO_FOCUSED' : 'VIDEO';
    setPlayerMode(nextMode);
    youtubeService.savePlayerMode(nextMode);
  };

  // --- QUEUE ACTIONS ---
  const handlePlayTrackImmediately = (track: YouTubeTrack) => {
    audioEngine.playClick();
    const existingIdx = queue.findIndex((t) => t.videoId === track.videoId);
    if (existingIdx >= 0) {
      setCurrentIndex(existingIdx);
    } else {
      const newQueue = [...queue];
      newQueue.splice(currentIndex + 1, 0, track);
      setQueue(newQueue);
      youtubeService.saveQueue(newQueue);
      setCurrentIndex(currentIndex + 1);
    }
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById(track.videoId);
    }
  };

  const handlePlayNext = (track: YouTubeTrack) => {
    audioEngine.playClick();
    const newQueue = [...queue];
    newQueue.splice(currentIndex + 1, 0, {
      ...track,
      id: `queue-${Date.now()}-${track.videoId}`,
    });
    setQueue(newQueue);
    youtubeService.saveQueue(newQueue);
  };

  const handleAddToQueue = (track: YouTubeTrack) => {
    audioEngine.playClick();
    const newQueue = [
      ...queue,
      {
        ...track,
        id: `queue-${Date.now()}-${track.videoId}`,
      },
    ];
    setQueue(newQueue);
    youtubeService.saveQueue(newQueue);
  };

  const handleRemoveFromQueue = (indexToRemove: number) => {
    audioEngine.playClick();
    if (queue.length <= 1) return;
    const newQueue = queue.filter((_, idx) => idx !== indexToRemove);
    setQueue(newQueue);
    youtubeService.saveQueue(newQueue);
    if (indexToRemove < currentIndex) {
      setCurrentIndex((prev) => Math.max(0, prev - 1));
    } else if (indexToRemove === currentIndex && currentIndex >= newQueue.length) {
      setCurrentIndex(newQueue.length - 1);
    }
  };

  const handleMoveQueueItem = (fromIdx: number, toIdx: number) => {
    audioEngine.playClick();
    if (toIdx < 0 || toIdx >= queue.length || fromIdx === toIdx) return;
    const newQueue = [...queue];
    const [moved] = newQueue.splice(fromIdx, 1);
    newQueue.splice(toIdx, 0, moved);
    setQueue(newQueue);
    youtubeService.saveQueue(newQueue);
    if (currentIndex === fromIdx) {
      setCurrentIndex(toIdx);
    } else if (fromIdx < currentIndex && toIdx >= currentIndex) {
      setCurrentIndex((prev) => prev - 1);
    } else if (fromIdx > currentIndex && toIdx <= currentIndex) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleClearUpcoming = () => {
    audioEngine.playClick();
    if (queue.length <= 1) return;
    const newQueue = [queue[currentIndex]];
    setQueue(newQueue);
    setCurrentIndex(0);
    youtubeService.saveQueue(newQueue);
  };

  const handleShuffleQueue = () => {
    audioEngine.playClick();
    if (queue.length <= 2) return;
    const upcoming = queue.slice(currentIndex + 1);
    for (let i = upcoming.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [upcoming[i], upcoming[j]] = [upcoming[j], upcoming[i]];
    }
    const newQueue = [...queue.slice(0, currentIndex + 1), ...upcoming];
    setQueue(newQueue);
    youtubeService.saveQueue(newQueue);
  };

  const handleSaveQueueAsPlaylist = () => {
    audioEngine.playClick();
    const name = prompt('Enter a name for this new playlist:', 'Queued Focus Mix');
    if (!name || !name.trim()) return;
    const created = youtubeService.createPlaylist(name.trim(), '🎧', `Created from active study queue (${queue.length} tracks)`);
    queue.forEach((t) => youtubeService.addTrackToPlaylist(created.id, t));
    setPlaylists(youtubeService.getPlaylists());
    alert(`Playlist "${name}" saved with ${queue.length} tracks!`);
  };

  // --- PLAYLIST ACTIONS ---
  const handlePlayEntirePlaylist = (pl: YouTubePlaylist, shuffle = false) => {
    audioEngine.playClick();
    if (!pl.tracks || pl.tracks.length === 0) {
      alert('This playlist is currently empty. Add tracks using Search or Queue!');
      return;
    }
    let list = [...pl.tracks];
    if (shuffle) {
      for (let i = list.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
    }
    setQueue(list);
    setCurrentIndex(0);
    youtubeService.saveQueue(list);
    setIsPlaying(true);
    if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
      playerRef.current.loadVideoById(list[0].videoId);
    }
  };

  const handleCreatePlaylistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    audioEngine.playClick();
    const created = youtubeService.createPlaylist(newPlaylistName.trim(), newPlaylistIcon);
    setPlaylists(youtubeService.getPlaylists());
    setSelectedPlaylistId(created.id);
    setNewPlaylistName('');
    setShowNewPlaylistModal(false);
  };

  const handleDeletePlaylist = (id: string, name: string) => {
    if (!confirm(`Delete playlist "${name}"?`)) return;
    audioEngine.playClick();
    youtubeService.deletePlaylist(id);
    setPlaylists(youtubeService.getPlaylists());
    if (selectedPlaylistId === id) setSelectedPlaylistId(null);
  };

  // --- FAVORITE / LIKE TOGGLE ---
  const handleToggleFavoriteCurrent = () => {
    audioEngine.playClick();
    if (!currentTrack) return;
    youtubeService.toggleFavorite(currentTrack);
    setFavorites(youtubeService.getFavorites());
  };

  // --- SEARCH EXECUTION ---
  const executeSearch = async (queryToRun: string) => {
    if (!queryToRun.trim()) return;
    setIsSearching(true);
    setErrorMessage(null);
    try {
      const results = await youtubeService.searchYouTube(queryToRun);
      setSearchResults(results);
      setActiveTab('LIBRARY');
    } catch (err: any) {
      setErrorMessage(`Search error: ${err.message || 'Check network connection'}`);
    } finally {
      setIsSearching(false);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Determine if current track is in favorites
  const isCurrentFavorited = currentTrack ? youtubeService.isFavorite(currentTrack.videoId) : false;

  return (
    <div className="bg-void-card pixel-border border-arcade-border shadow-[0_4px_20px_rgba(0,0,0,0.6)] font-mono text-xs text-gray-200 overflow-hidden select-none">
      {/* ======================================================== */}
      {/* 1. COMPACT PLAYER HEADER (REQ 6)                         */}
      {/* ======================================================== */}
      <div className="px-3.5 py-2.5 bg-void-darkest border-b border-arcade-border flex flex-wrap items-center justify-between gap-2.5">
        {/* Left: Icon, Title, and Pulse Indicator */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <div className="w-6 h-6 bg-void border border-arcade-gold flex items-center justify-center text-xs shrink-0 shadow-pixel-sm">
            <Music size={13} className="text-arcade-gold animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-silkscreen text-[11px] text-white uppercase tracking-wider truncate">
                YOUTUBE MUSIC &amp; AMBIENCE CENTER
              </span>
              <span
                className={`px-1.5 py-0.2 border text-[8px] font-pixel ${
                  isPlaying
                    ? 'border-green-500 bg-green-950/80 text-green-300 animate-pulse'
                    : 'border-arcade-border bg-void text-gray-400'
                }`}
              >
                {isPlaying ? '● PLAYING' : '■ PAUSED'}
              </span>
              <span className="px-1.5 py-0.2 border border-arcade-cyan/70 bg-cyan-950/40 text-arcade-cyan text-[8px] font-pixel hidden sm:inline">
                {playerMode === 'VIDEO' ? 'MODE: VIDEO' : 'MODE: AUDIO'}
              </span>
            </div>
            <p className="text-[10px] text-arcade-gold font-pixel truncate mt-0.5">
              &gt; {currentTrack ? `${currentTrack.title} [${currentTrack.channel}]` : 'NO TRACK LOADED'}
            </p>
          </div>
        </div>

        {/* Right: Quick Controls, Queue Pill & Expand Toggle */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Volume & Mute */}
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-void border border-arcade-border">
            <button
              onClick={handleToggleMute}
              className="text-gray-400 hover:text-white"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX size={12} className="text-red-400" />
              ) : (
                <Volume2 size={12} className="text-arcade-cyan" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="100"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-14 h-1 accent-arcade-cyan bg-void-darkest cursor-pointer"
              title={`Volume: ${isMuted ? 0 : volume}%`}
            />
          </div>

          {/* Queue Count Pill */}
          <button
            onClick={() => {
              setIsExpanded(true);
              setActiveTab('QUEUE');
            }}
            className="px-2 py-1 bg-void border border-arcade-border hover:border-arcade-gold text-[9px] font-pixel text-gray-300 hover:text-white flex items-center gap-1"
            title="View Up Next Queue"
          >
            <ListMusic size={11} className="text-arcade-gold" />
            <span>QUEUE: {queue.length}</span>
          </button>

          {/* Video / Audio Toggle */}
          <button
            onClick={handleToggleMode}
            className={`p-1 border text-[9px] flex items-center gap-1 ${
              playerMode === 'VIDEO'
                ? 'border-arcade-cyan bg-cyan-950/70 text-arcade-cyan font-bold'
                : 'border-arcade-border bg-void text-gray-400 hover:text-white'
            }`}
            title={playerMode === 'VIDEO' ? 'Switch to Audio-focused Mode' : 'Switch to Video Mode'}
          >
            {playerMode === 'VIDEO' ? <Video size={12} /> : <Headphones size={12} />}
          </button>

          {/* Expand / Collapse Button */}
          <button
            onClick={() => {
              audioEngine.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="pixel-btn p-1 text-gray-400 hover:text-white"
            title={isExpanded ? 'Collapse Music Center' : 'Expand Full Studio'}
          >
            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* COLLAPSED NOW PLAYING STRIP (WHEN EXPANDED === FALSE)    */}
      {/* ======================================================== */}
      {!isExpanded && (
        <div className="p-3 bg-void/80 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 min-w-0">
            {currentTrack?.thumbnail && (
              <img
                src={currentTrack.thumbnail}
                alt=""
                className="w-9 h-9 object-cover border border-arcade-border shrink-0 shadow-pixel-sm"
              />
            )}
            <div className="min-w-0">
              <span className="text-white font-bold text-[11px] truncate block">
                {currentTrack ? currentTrack.title : 'Ready to stream'}
              </span>
              <span className="text-[9px] text-gray-400 truncate block">
                {currentTrack ? currentTrack.channel : 'Search YouTube or select a playlist'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handlePrevTrack}
              className="p-1 border border-arcade-border text-gray-400 hover:text-white"
              title="Previous Track"
            >
              <SkipBack size={13} />
            </button>
            <button
              onClick={handleTogglePlay}
              className="p-1.5 bg-arcade-gold text-black border border-arcade-gold font-bold hover:bg-yellow-400"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
            </button>
            <button
              onClick={handleNextTrack}
              className="p-1 border border-arcade-border text-gray-400 hover:text-white"
              title="Next Track"
            >
              <SkipForward size={13} />
            </button>
            <button
              onClick={() => setIsExpanded(true)}
              className="pixel-btn px-2 py-1 text-[9px] text-arcade-gold font-pixel ml-1"
            >
              EXPAND STUDIO &gt;
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. EXPANDED SPOTIFY-INSPIRED STUDIO (REQ 2, 3, 4, 5)     */}
      {/* ======================================================== */}
      {isExpanded && (
        <div className="p-3.5 space-y-3.5 bg-void-card/90">
          {/* Subtabs for Responsive Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-arcade-border/60">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  audioEngine.playClick();
                  setActiveTab('LIBRARY');
                }}
                className={`px-2.5 py-1 text-[10px] font-pixel border uppercase flex items-center gap-1 ${
                  activeTab === 'LIBRARY'
                    ? 'border-arcade-cyan bg-cyan-950/70 text-arcade-cyan font-bold shadow-pixel-sm'
                    : 'border-arcade-border bg-void text-gray-400 hover:text-white'
                }`}
              >
                <Layers size={11} />
                <span>LIBRARY &amp; SEARCH</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  setActiveTab('PLAYER');
                }}
                className={`px-2.5 py-1 text-[10px] font-pixel border uppercase flex items-center gap-1 ${
                  activeTab === 'PLAYER'
                    ? 'border-arcade-gold bg-amber-950/60 text-arcade-gold font-bold shadow-pixel-sm'
                    : 'border-arcade-border bg-void text-gray-400 hover:text-white'
                }`}
              >
                <Music size={11} />
                <span>NOW PLAYING</span>
              </button>

              <button
                onClick={() => {
                  audioEngine.playClick();
                  setActiveTab('QUEUE');
                }}
                className={`px-2.5 py-1 text-[10px] font-pixel border uppercase flex items-center gap-1 ${
                  activeTab === 'QUEUE'
                    ? 'border-green-500 bg-green-950/70 text-green-300 font-bold shadow-pixel-sm'
                    : 'border-arcade-border bg-void text-gray-400 hover:text-white'
                }`}
              >
                <ListMusic size={11} />
                <span>UP NEXT QUEUE ({queue.length})</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              {/* API Key Modal Button */}
              <button
                onClick={() => setShowApiKeyModal(true)}
                className="px-2 py-0.5 border border-arcade-border text-gray-400 hover:text-arcade-gold text-[9px] flex items-center gap-1"
                title="Configure optional YouTube Data API Key"
              >
                <Key size={10} />
                <span className="hidden sm:inline">API KEY</span>
              </button>

              {/* View Mode Toggle Pill */}
              <div className="flex items-center border border-arcade-border">
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setPlayerMode('AUDIO_FOCUSED');
                    youtubeService.savePlayerMode('AUDIO_FOCUSED');
                  }}
                  className={`px-2 py-0.5 text-[9px] font-pixel ${
                    playerMode === 'AUDIO_FOCUSED'
                      ? 'bg-arcade-cyan text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Audio-focused retro album art view"
                >
                  🎧 AUDIO
                </button>
                <button
                  onClick={() => {
                    audioEngine.playClick();
                    setPlayerMode('VIDEO');
                    youtubeService.savePlayerMode('VIDEO');
                  }}
                  className={`px-2 py-0.5 text-[9px] font-pixel ${
                    playerMode === 'VIDEO'
                      ? 'bg-arcade-gold text-black font-bold'
                      : 'text-gray-400 hover:text-white'
                  }`}
                  title="Prominent YouTube video view"
                >
                  📹 VIDEO
                </button>
              </div>
            </div>
          </div>

          {/* Non-Embeddable / Error Warning Notification */}
          {errorMessage && (
            <div className="p-2.5 bg-red-950/80 border border-red-500 text-red-200 text-[10px] flex items-center justify-between gap-2 animate-fadeIn">
              <div className="flex items-center gap-2">
                <AlertTriangle size={13} className="text-red-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button
                onClick={handleNextTrack}
                className="pixel-btn px-2 py-0.5 text-[9px] text-white hover:text-arcade-gold shrink-0"
              >
                [ SKIP TO NEXT ]
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* 3-COLUMN OR ADAPTIVE TABBED CONTENT                      */}
          {/* ======================================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* ------------------------------------------------------ */}
            {/* AREA A: MUSIC LIBRARY & SEARCH (3 COLS ON WIDE)       */}
            {/* ------------------------------------------------------ */}
            <div
              className={`${
                activeTab === 'LIBRARY' ? 'block' : 'hidden lg:block'
              } lg:col-span-4 bg-void/60 border border-arcade-border p-3 space-y-3 max-h-[500px] flex flex-col`}
            >
              {/* Search Bar & Direct URL/ID Input */}
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    executeSearch(searchQuery);
                  }}
                  className="flex items-center gap-1"
                >
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search YouTube or paste URL/ID..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-void-darkest border border-arcade-border text-white text-[10px] px-2 py-1 pl-6 outline-none focus:border-arcade-cyan"
                    />
                    <Search size={11} className="absolute left-1.5 top-2 text-gray-500" />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="pixel-btn px-2.5 py-1 text-[10px] text-arcade-cyan hover:text-white shrink-0"
                  >
                    {isSearching ? '...' : 'FIND'}
                  </button>
                </form>
              </div>

              {/* Library Category Shortcuts */}
              <div className="flex gap-1 overflow-x-auto pb-1 text-[8px] font-pixel scrollbar-none">
                {[
                  { id: 'ALL', label: 'ALL' },
                  { id: 'PLAYLISTS', label: 'PLAYLISTS' },
                  { id: 'FAVORITES', label: 'LIKED (★)' },
                  { id: 'RECENT', label: 'RECENT' },
                  { id: 'Minecraft Music', label: 'MINECRAFT' },
                  { id: 'Lo-Fi Study', label: 'LO-FI' },
                  { id: 'Piano and Instrumentals', label: 'PIANO' },
                  { id: 'Game Soundtracks', label: 'OST' },
                  { id: 'Ambient and Focus Music', label: 'AMBIENT' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      audioEngine.playClick();
                      setActiveCategoryFilter(cat.id);
                      if (cat.id !== 'ALL' && cat.id !== 'PLAYLISTS' && cat.id !== 'FAVORITES' && cat.id !== 'RECENT') {
                        executeSearch(cat.id);
                      }
                    }}
                    className={`px-1.5 py-0.5 border shrink-0 uppercase transition-all ${
                      activeCategoryFilter === cat.id
                        ? 'border-arcade-gold bg-amber-950 text-arcade-gold font-bold'
                        : 'border-arcade-border bg-void text-gray-400 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Dynamic Library Body */}
              <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-[10px]">
                {/* Search Results Display (When Search Performed) */}
                {searchResults.length > 0 && activeCategoryFilter !== 'PLAYLISTS' && activeCategoryFilter !== 'FAVORITES' && activeCategoryFilter !== 'RECENT' && (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[9px] font-pixel text-arcade-gold pb-1 border-b border-arcade-border/40">
                      <span>SEARCH RESULTS ({searchResults.length})</span>
                      <button
                        onClick={() => setSearchResults([])}
                        className="text-gray-500 hover:text-gray-300"
                      >
                        [ CLEAR ]
                      </button>
                    </div>
                    {searchResults.map((track) => (
                      <div
                        key={track.id}
                        className="p-1.5 bg-void border border-arcade-border hover:border-arcade-cyan flex items-center justify-between gap-2 group transition-all"
                      >
                        <img
                          src={track.thumbnail}
                          alt=""
                          className="w-10 h-7 object-cover shrink-0 border border-arcade-border"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-white text-[10px] font-medium truncate group-hover:text-arcade-gold">
                            {track.title}
                          </p>
                          <p className="text-[8px] text-gray-400 truncate">{track.channel}</p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handlePlayTrackImmediately(track)}
                            className="p-1 border border-arcade-gold bg-amber-950/60 text-arcade-gold hover:bg-arcade-gold hover:text-black"
                            title="Play Now"
                          >
                            <Play size={10} className="fill-current" />
                          </button>
                          <button
                            onClick={() => handlePlayNext(track)}
                            className="p-1 border border-arcade-border text-gray-400 hover:text-white"
                            title="Play Next"
                          >
                            +Next
                          </button>
                          <button
                            onClick={() => handleAddToQueue(track)}
                            className="p-1 border border-arcade-border text-gray-400 hover:text-white"
                            title="Add to Queue"
                          >
                            +Queue
                          </button>
                          <button
                            onClick={() => {
                              setTrackToAddToPlaylist(track);
                              setShowAddToPlaylistModal(true);
                            }}
                            className="p-1 border border-arcade-border text-gray-400 hover:text-arcade-cyan"
                            title="Add to Playlist"
                          >
                            +PL
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Liked Tracks View */}
                {activeCategoryFilter === 'FAVORITES' && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-pixel text-arcade-gold pb-1 border-b border-arcade-border/40 flex justify-between">
                      <span>LIKED TRACKS ({favorites.length})</span>
                      <button
                        onClick={() => {
                          if (favorites.length > 0) {
                            setQueue(favorites);
                            setCurrentIndex(0);
                            setIsPlaying(true);
                          }
                        }}
                        className="text-arcade-cyan hover:underline"
                      >
                        PLAY ALL
                      </button>
                    </div>
                    {favorites.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-[9px]">No liked tracks yet. Click ★ to save favorites!</p>
                    ) : (
                      favorites.map((track) => (
                        <div
                          key={track.videoId}
                          className="p-1.5 bg-void border border-arcade-border hover:border-arcade-gold flex items-center justify-between gap-2"
                        >
                          <img src={track.thumbnail} alt="" className="w-8 h-6 object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-[10px] truncate">{track.title}</p>
                            <p className="text-[8px] text-gray-400 truncate">{track.channel}</p>
                          </div>
                          <button
                            onClick={() => handlePlayTrackImmediately(track)}
                            className="p-1 border border-arcade-gold text-arcade-gold hover:bg-arcade-gold hover:text-black"
                            title="Play Track"
                          >
                            <Play size={10} className="fill-current" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Recently Played View */}
                {activeCategoryFilter === 'RECENT' && (
                  <div className="space-y-1.5">
                    <div className="text-[9px] font-pixel text-arcade-cyan pb-1 border-b border-arcade-border/40">
                      RECENTLY PLAYED ({recentTracks.length})
                    </div>
                    {recentTracks.length === 0 ? (
                      <p className="text-gray-500 text-center py-4 text-[9px]">No recent playback history.</p>
                    ) : (
                      recentTracks.map((track) => (
                        <div
                          key={track.videoId}
                          className="p-1.5 bg-void border border-arcade-border hover:border-arcade-cyan flex items-center justify-between gap-2"
                        >
                          <img src={track.thumbnail} alt="" className="w-8 h-6 object-cover shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-white text-[10px] truncate">{track.title}</p>
                            <p className="text-[8px] text-gray-400 truncate">{track.channel}</p>
                          </div>
                          <button
                            onClick={() => handlePlayTrackImmediately(track)}
                            className="p-1 border border-arcade-cyan text-arcade-cyan hover:bg-arcade-cyan hover:text-black"
                          >
                            <Play size={10} className="fill-current" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Playlists View (Default if no active search or when PLAYLISTS clicked) */}
                {(activeCategoryFilter === 'PLAYLISTS' || (searchResults.length === 0 && activeCategoryFilter !== 'FAVORITES' && activeCategoryFilter !== 'RECENT')) && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between pb-1 border-b border-arcade-border/40">
                      <span className="text-[9px] font-pixel text-arcade-cyan">
                        PLAYLIST CATALOG ({playlists.length})
                      </span>
                      <button
                        onClick={() => setShowNewPlaylistModal(true)}
                        className="pixel-btn px-2 py-0.5 text-[8px] text-arcade-gold hover:text-white flex items-center gap-1"
                      >
                        <Plus size={10} />
                        <span>NEW PLAYLIST</span>
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {playlists.map((pl) => (
                        <div
                          key={pl.id}
                          className={`p-2 border transition-all ${
                            selectedPlaylistId === pl.id
                              ? 'border-arcade-gold bg-amber-950/40 text-white'
                              : 'border-arcade-border/80 bg-void hover:border-arcade-cyan'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              onClick={() => setSelectedPlaylistId(selectedPlaylistId === pl.id ? null : pl.id)}
                              className="flex items-center gap-2 cursor-pointer flex-1 min-w-0"
                            >
                              <span className="text-sm">{pl.icon || '🎵'}</span>
                              <div className="min-w-0 flex-1">
                                <p className="font-pixel text-[10px] text-white truncate">{pl.name}</p>
                                <p className="text-[8px] text-gray-400">{pl.tracks.length} tracks</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handlePlayEntirePlaylist(pl, false)}
                                className="px-1.5 py-0.5 border border-arcade-gold text-[8px] font-pixel text-arcade-gold hover:bg-arcade-gold hover:text-black"
                                title="Play All"
                              >
                                ▶ PLAY
                              </button>
                              <button
                                onClick={() => handlePlayEntirePlaylist(pl, true)}
                                className="p-1 border border-arcade-border text-gray-400 hover:text-white"
                                title="Shuffle Playlist"
                              >
                                <Shuffle size={10} />
                              </button>
                              {!pl.isCurated && (
                                <button
                                  onClick={() => handleDeletePlaylist(pl.id, pl.name)}
                                  className="p-1 text-gray-500 hover:text-red-400"
                                  title="Delete Playlist"
                                >
                                  <Trash2 size={10} />
                                </button>
                              )}
                            </div>
                          </div>

                          {/* Expanded Playlist Tracklist */}
                          {selectedPlaylistId === pl.id && (
                            <div className="mt-2 pt-2 border-t border-arcade-border/50 space-y-1">
                              {pl.tracks.length === 0 ? (
                                <p className="text-[8px] text-gray-500 italic">No tracks yet.</p>
                              ) : (
                                pl.tracks.map((t, idx) => (
                                  <div
                                    key={t.id || idx}
                                    className="flex items-center justify-between text-[9px] py-0.5 hover:text-arcade-gold group"
                                  >
                                    <span
                                      onClick={() => handlePlayTrackImmediately(t)}
                                      className="truncate flex-1 cursor-pointer"
                                    >
                                      {idx + 1}. {t.title}
                                    </span>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
                                      <button
                                        onClick={() => handlePlayNext(t)}
                                        className="text-[8px] text-gray-400 hover:text-white"
                                        title="Play Next"
                                      >
                                        +Next
                                      </button>
                                      {!pl.isCurated && (
                                        <button
                                          onClick={() => {
                                            youtubeService.removeTrackFromPlaylist(pl.id, t.id);
                                            setPlaylists(youtubeService.getPlaylists());
                                          }}
                                          className="text-gray-500 hover:text-red-400"
                                          title="Remove track"
                                        >
                                          ✕
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ------------------------------------------------------ */}
            {/* AREA B: NOW PLAYING & YOUTUBE PLAYER (5 COLS ON WIDE) */}
            {/* ------------------------------------------------------ */}
            <div
              className={`${
                activeTab === 'PLAYER' ? 'block' : 'hidden lg:block'
              } lg:col-span-5 bg-void-darkest border border-arcade-gold/80 p-3.5 space-y-3.5 shadow-pixel flex flex-col`}
            >
              {/* Top Track Header */}
              <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-arcade-border/60">
                <div className="min-w-0 flex-1">
                  <span className="text-[8px] font-pixel text-arcade-cyan uppercase tracking-wider block">
                    CURRENT FREQUENCY // {currentTrack?.category || 'YOUTUBE STREAM'}
                  </span>
                  <h3 className="font-silkscreen text-xs text-white truncate mt-0.5">
                    {currentTrack ? currentTrack.title : 'Ready for focus session'}
                  </h3>
                  <p className="text-[9px] text-gray-400 truncate">
                    {currentTrack ? currentTrack.channel : 'Search YouTube or load a curated playlist'}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={handleToggleFavoriteCurrent}
                    className={`p-1.5 border ${
                      isCurrentFavorited
                        ? 'border-arcade-gold bg-amber-950/70 text-arcade-gold'
                        : 'border-arcade-border bg-void text-gray-400 hover:text-white'
                    }`}
                    title={isCurrentFavorited ? 'Remove from Liked' : 'Add to Liked'}
                  >
                    <Heart size={13} className={isCurrentFavorited ? 'fill-current' : ''} />
                  </button>
                  <button
                    onClick={() => {
                      if (currentTrack) {
                        setTrackToAddToPlaylist(currentTrack);
                        setShowAddToPlaylistModal(true);
                      }
                    }}
                    className="p-1.5 border border-arcade-border bg-void text-gray-400 hover:text-arcade-cyan"
                    title="Add current track to a playlist"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* YouTube Screen (Video Mode VS Audio-Focused Mode) */}
              <div className="relative w-full aspect-video bg-black pixel-border border border-arcade-border/80 overflow-hidden flex items-center justify-center">
                {/* 1. Real YouTube Iframe Target Container (Always Alive to prevent reloading audio) */}
                <div
                  className={`w-full h-full transition-opacity duration-300 ${
                    playerMode === 'VIDEO'
                      ? 'opacity-100 pointer-events-auto'
                      : 'opacity-0 pointer-events-none absolute inset-0'
                  }`}
                >
                  <div id={playerContainerId.current} className="w-full h-full" />
                </div>

                {/* 2. Audio-Focused Presentation (Visible when playerMode === 'AUDIO_FOCUSED') */}
                {playerMode === 'AUDIO_FOCUSED' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-[#1A122E] via-[#0D0818] to-black p-4 flex flex-col justify-between items-center text-center animate-fadeIn select-none">
                    {/* Retro Scanlines Overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none opacity-60" />

                    <div className="w-full flex items-center justify-between text-[8px] font-pixel text-gray-400 z-10">
                      <span>AUDIO FOCUS PROTOCOL</span>
                      <span className="text-arcade-gold">100% DISTRACTION FREE</span>
                    </div>

                    {/* Album Art with Floating Pixel Glow */}
                    <div className="relative z-10 my-auto">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto pixel-border border-2 border-arcade-gold/80 overflow-hidden shadow-[0_0_24px_rgba(245,194,66,0.3)] bg-void flex items-center justify-center">
                        {currentTrack?.thumbnail ? (
                          <img
                            src={currentTrack.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Music size={36} className="text-arcade-gold" />
                        )}
                      </div>

                      {/* Animated Soundwave Frequency Bars when Playing */}
                      <div className="flex items-center justify-center gap-1 mt-3">
                        {[0.6, 1.2, 0.4, 0.9, 1.5, 0.7, 1.1, 0.5, 1.3].map((heightScale, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-arcade-cyan transition-all duration-200 ${
                              isPlaying ? 'animate-pulse' : 'h-1 opacity-30'
                            }`}
                            style={{
                              height: isPlaying ? `${Math.max(4, Math.round(heightScale * 14))}px` : '4px',
                              animationDelay: `${i * 120}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="z-10 w-full truncate">
                      <p className="text-white font-silkscreen text-[11px] truncate">
                        {currentTrack ? currentTrack.title : 'Ready for focus session'}
                      </p>
                      <p className="text-arcade-gold text-[9px] font-mono truncate">
                        {currentTrack ? currentTrack.channel : 'No channel'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Buffering Indicator */}
                {isBuffering && (
                  <div className="absolute inset-0 z-20 bg-black/60 backdrop-blur-xs flex items-center justify-center text-arcade-gold font-pixel text-xs gap-2">
                    <span className="w-2 h-2 bg-arcade-gold animate-ping rounded-full" />
                    <span>BUFFERING STREAM...</span>
                  </div>
                )}
              </div>

              {/* Progress Slider & Timestamps */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={duration || 100}
                  step="0.5"
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 accent-arcade-gold bg-void border border-arcade-border cursor-pointer"
                />
                <div className="flex justify-between text-[9px] font-mono text-gray-400">
                  <span className="text-arcade-gold">{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Playback Transport Bar */}
              <div className="flex items-center justify-between gap-2 pt-1 border-t border-arcade-border/60">
                {/* Shuffle */}
                <button
                  onClick={handleToggleShuffle}
                  className={`p-1.5 border text-xs ${
                    isShuffle
                      ? 'border-arcade-cyan bg-cyan-950/80 text-arcade-cyan font-bold'
                      : 'border-arcade-border text-gray-400 hover:text-white'
                  }`}
                  title={isShuffle ? 'Shuffle On' : 'Shuffle Off'}
                >
                  <Shuffle size={13} />
                </button>

                {/* Previous */}
                <button
                  onClick={handlePrevTrack}
                  className="p-1.5 border border-arcade-border text-gray-300 hover:text-white hover:border-arcade-gold"
                  title="Previous Track"
                >
                  <SkipBack size={15} />
                </button>

                {/* Main Play / Pause */}
                <button
                  onClick={handleTogglePlay}
                  className="px-4 py-2 bg-arcade-gold text-black border border-arcade-gold font-bold hover:bg-yellow-400 shadow-pixel-sm active:translate-y-0.5 flex items-center justify-center"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} className="fill-current ml-0.5" />
                  )}
                </button>

                {/* Next */}
                <button
                  onClick={handleNextTrack}
                  className="p-1.5 border border-arcade-border text-gray-300 hover:text-white hover:border-arcade-gold"
                  title="Next Track"
                >
                  <SkipForward size={15} />
                </button>

                {/* Repeat */}
                <button
                  onClick={handleCycleRepeat}
                  className={`p-1.5 border text-[10px] font-pixel flex items-center gap-0.5 ${
                    repeatMode !== 'OFF'
                      ? 'border-arcade-gold bg-amber-950/80 text-arcade-gold font-bold'
                      : 'border-arcade-border text-gray-400 hover:text-white'
                  }`}
                  title={`Repeat: ${repeatMode}`}
                >
                  <Repeat size={13} />
                  {repeatMode === 'ONE' && <span className="text-[8px] font-bold">1</span>}
                </button>
              </div>
            </div>

            {/* ------------------------------------------------------ */}
            {/* AREA C: UP NEXT QUEUE (3 COLS ON WIDE)                */}
            {/* ------------------------------------------------------ */}
            <div
              className={`${
                activeTab === 'QUEUE' ? 'block' : 'hidden lg:block'
              } lg:col-span-3 bg-void/60 border border-arcade-border p-3 space-y-3 max-h-[500px] flex flex-col`}
            >
              {/* Queue Header & Actions */}
              <div className="flex items-center justify-between pb-1.5 border-b border-arcade-border/60">
                <div className="flex items-center gap-1.5">
                  <ListMusic size={12} className="text-green-400" />
                  <span className="font-silkscreen text-[10px] text-white uppercase">
                    UP NEXT ({queue.length})
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={handleShuffleQueue}
                    className="p-1 text-gray-400 hover:text-arcade-cyan"
                    title="Shuffle Upcoming Queue"
                  >
                    <Shuffle size={11} />
                  </button>
                  <button
                    onClick={handleClearUpcoming}
                    className="p-1 text-gray-400 hover:text-red-400"
                    title="Clear Upcoming Tracks"
                  >
                    <Trash2 size={11} />
                  </button>
                  <button
                    onClick={handleSaveQueueAsPlaylist}
                    className="p-1 text-gray-400 hover:text-arcade-gold"
                    title="Save Queue as a Playlist"
                  >
                    <FolderPlus size={11} />
                  </button>
                </div>
              </div>

              {/* Scrollable Queue Tracklist */}
              <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 text-[10px]">
                {queue.map((track, idx) => {
                  const isCurrent = idx === currentIndex;
                  return (
                    <div
                      key={track.id || `${track.videoId}-${idx}`}
                      className={`p-1.5 border flex items-center justify-between gap-1.5 transition-all group ${
                        isCurrent
                          ? 'border-arcade-gold bg-amber-950/60 shadow-pixel-sm'
                          : 'border-arcade-border/70 bg-void hover:border-arcade-cyan'
                      }`}
                    >
                      {/* Left: Thumbnail & Playing State */}
                      <div
                        onClick={() => {
                          audioEngine.playClick();
                          setCurrentIndex(idx);
                          setIsPlaying(true);
                          if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
                            playerRef.current.loadVideoById(track.videoId);
                          }
                        }}
                        className="flex items-center gap-1.5 min-w-0 flex-1 cursor-pointer"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={track.thumbnail}
                            alt=""
                            className="w-8 h-6 object-cover border border-arcade-border"
                          />
                          {isCurrent && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 bg-arcade-gold animate-ping rounded-full" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-[9px] font-medium truncate ${
                              isCurrent ? 'text-arcade-gold font-bold' : 'text-gray-200'
                            }`}
                          >
                            {idx + 1}. {track.title}
                          </p>
                          <p className="text-[7px] text-gray-400 truncate">{track.channel}</p>
                        </div>
                      </div>

                      {/* Right: Reorder Up/Down & Remove */}
                      <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100">
                        {idx > 0 && (
                          <button
                            onClick={() => handleMoveQueueItem(idx, idx - 1)}
                            className="p-0.5 text-gray-500 hover:text-white"
                            title="Move Up"
                          >
                            <ArrowUp size={10} />
                          </button>
                        )}
                        {idx < queue.length - 1 && (
                          <button
                            onClick={() => handleMoveQueueItem(idx, idx + 1)}
                            className="p-0.5 text-gray-500 hover:text-white"
                            title="Move Down"
                          >
                            <ArrowDown size={10} />
                          </button>
                        )}
                        {queue.length > 1 && (
                          <button
                            onClick={() => handleRemoveFromQueue(idx)}
                            className="p-0.5 text-gray-500 hover:text-red-400"
                            title="Remove from Queue"
                          >
                            <X size={10} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Queue Footer Action: Add Direct URL/ID */}
              <div className="pt-2 border-t border-arcade-border/40">
                <button
                  onClick={() => {
                    const input = prompt('Paste a YouTube Video URL or Video ID to add to Queue:');
                    if (input) {
                      youtubeService.searchYouTube(input).then((res) => {
                        if (res.length > 0) handleAddToQueue(res[0]);
                      });
                    }
                  }}
                  className="w-full py-1 text-[8px] font-pixel border border-dashed border-arcade-border text-gray-400 hover:text-arcade-cyan hover:border-arcade-cyan text-center block uppercase"
                >
                  + PASTE YOUTUBE URL / ID
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 1: CREATE NEW PLAYLIST                             */}
      {/* ======================================================== */}
      {showNewPlaylistModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-gold p-4 max-w-sm w-full shadow-pixel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-gold uppercase">
                CREATE NEW PLAYLIST
              </span>
              <button
                onClick={() => setShowNewPlaylistModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <form onSubmit={handleCreatePlaylistSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-[9px] font-pixel text-gray-400 block mb-1">
                  PLAYLIST NAME
                </label>
                <input
                  type="text"
                  placeholder="e.g. Midnight Algorithmic Grind"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                  className="w-full bg-void-darkest border border-arcade-border text-white text-xs px-2.5 py-1.5 outline-none focus:border-arcade-gold"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-[9px] font-pixel text-gray-400 block mb-1">
                  PLAYLIST ICON (EMOJI)
                </label>
                <div className="flex gap-1.5 flex-wrap">
                  {['🎵', '☕', '🟩', '🎹', '🗡️', '🌌', '🌧️', '⚡', '🧙‍♂️', '🦇'].map((emoji) => (
                    <button
                      type="button"
                      key={emoji}
                      onClick={() => setNewPlaylistIcon(emoji)}
                      className={`w-7 h-7 border text-sm flex items-center justify-center ${
                        newPlaylistIcon === emoji
                          ? 'border-arcade-gold bg-amber-950'
                          : 'border-arcade-border bg-void text-gray-400'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPlaylistModal(false)}
                  className="pixel-btn px-2.5 py-1 text-[10px] text-gray-400"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="pixel-btn-primary px-3 py-1 text-[10px] font-pixel text-black font-bold uppercase"
                >
                  SAVE PLAYLIST
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 2: ADD TO PLAYLIST PICKER                          */}
      {/* ======================================================== */}
      {showAddToPlaylistModal && trackToAddToPlaylist && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-cyan p-4 max-w-sm w-full shadow-pixel space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
              <span className="font-silkscreen text-xs text-arcade-cyan uppercase">
                ADD TO PLAYLIST
              </span>
              <button
                onClick={() => {
                  setShowAddToPlaylistModal(false);
                  setTrackToAddToPlaylist(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[10px] text-gray-300 truncate">
              Adding: <strong className="text-arcade-gold">{trackToAddToPlaylist.title}</strong>
            </p>

            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => {
                    youtubeService.addTrackToPlaylist(pl.id, trackToAddToPlaylist);
                    setPlaylists(youtubeService.getPlaylists());
                    setShowAddToPlaylistModal(false);
                    setTrackToAddToPlaylist(null);
                    audioEngine.playTaskComplete();
                  }}
                  className="w-full p-2 bg-void border border-arcade-border hover:border-arcade-gold flex items-center justify-between text-left text-xs"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <span>{pl.icon || '🎵'}</span>
                    <span className="truncate">{pl.name}</span>
                  </span>
                  <span className="text-[9px] text-gray-500 font-pixel">
                    {pl.tracks.length} tracks
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => {
                  setShowAddToPlaylistModal(false);
                  setTrackToAddToPlaylist(null);
                }}
                className="pixel-btn px-2.5 py-1 text-[10px] text-gray-400"
              >
                CLOSE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL 3: YOUTUBE DATA API KEY CONFIGURATION              */}
      {/* ======================================================== */}
      {showApiKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-void-card pixel-border border-arcade-border p-4 max-w-md w-full shadow-pixel space-y-3 font-mono text-xs text-gray-200">
            <div className="flex items-center justify-between pb-2 border-b border-arcade-border">
              <div className="flex items-center gap-2">
                <Key size={14} className="text-arcade-gold" />
                <span className="font-silkscreen text-xs text-arcade-gold uppercase">
                  YOUTUBE DATA API CONFIGURATION
                </span>
              </div>
              <button
                onClick={() => setShowApiKeyModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={14} />
              </button>
            </div>

            <p className="text-[10px] text-gray-300 leading-relaxed">
              FocusVerse includes an extensive curated catalog of real YouTube focus streams, C418 soundtracks, and lofi beats that work immediately without an API key. You can also paste any YouTube URL or Video ID directly into search.
            </p>
            <p className="text-[10px] text-gray-400 leading-relaxed">
              To enable live YouTube search across millions of videos, enter your free Google YouTube Data API v3 key below. Stored strictly in your browser&apos;s localStorage:
            </p>

            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full bg-void-darkest border border-arcade-border text-white text-xs px-2.5 py-1.5 outline-none focus:border-arcade-cyan font-mono"
            />

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => {
                  youtubeService.saveApiKey('');
                  setApiKeyInput('');
                  setShowApiKeyModal(false);
                }}
                className="text-[9px] text-red-400 hover:underline"
              >
                Clear Key
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowApiKeyModal(false)}
                  className="pixel-btn px-2.5 py-1 text-[10px] text-gray-400"
                >
                  CANCEL
                </button>
                <button
                  onClick={() => {
                    youtubeService.saveApiKey(apiKeyInput);
                    setShowApiKeyModal(false);
                    audioEngine.playClick();
                  }}
                  className="pixel-btn-primary px-3 py-1 text-[10px] font-pixel text-black font-bold uppercase"
                >
                  SAVE KEY
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
