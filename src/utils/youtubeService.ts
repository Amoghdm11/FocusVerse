import { YouTubeTrack, YouTubePlaylist } from '../types/musicPlayer';
import { CURATED_TRACKS, DEFAULT_PLAYLISTS } from '../data/curatedMusicCatalog';

const STORAGE_PLAYLISTS = 'focusverse_yt_playlists';
const STORAGE_QUEUE = 'focusverse_yt_queue';
const STORAGE_FAVORITES = 'focusverse_yt_favorites';
const STORAGE_RECENT = 'focusverse_yt_recent';
const STORAGE_API_KEY = 'focusverse_yt_api_key';
const STORAGE_VOLUME = 'focusverse_yt_volume';
const STORAGE_MODE = 'focusverse_yt_mode';
const STORAGE_SHUFFLE = 'focusverse_yt_shuffle';
const STORAGE_REPEAT = 'focusverse_yt_repeat';

class YouTubeService {
  /**
   * Extract video ID from any standard YouTube URL or raw ID
   */
  public extractVideoId(input: string): string | null {
    if (!input) return null;
    const trimmed = input.trim();

    // Raw 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      return trimmed;
    }

    // Standard YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]{11})/,
    ];

    for (const pattern of patterns) {
      const match = trimmed.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  }

  /**
   * Get user configured YouTube Data API v3 key
   */
  public getApiKey(): string {
    try {
      return localStorage.getItem(STORAGE_API_KEY) || '';
    } catch (_) {
      return '';
    }
  }

  public saveApiKey(key: string) {
    try {
      localStorage.setItem(STORAGE_API_KEY, key.trim());
    } catch (_) {}
  }

  /**
   * Search YouTube for videos:
   * 1. If URL or raw ID passed -> extract and resolve metadata.
   * 2. If API key present -> query real YouTube Data API v3.
   * 3. Fallback -> match against comprehensive curated catalog.
   */
  public async searchYouTube(query: string): Promise<YouTubeTrack[]> {
    const trimmed = query.trim();
    if (!trimmed) return [];

    // Check if input is a direct YouTube link or ID
    const extractedId = this.extractVideoId(trimmed);
    if (extractedId) {
      const known = CURATED_TRACKS.find((t) => t.videoId === extractedId);
      if (known) {
        return [known];
      }

      // Resolve metadata via noembed oEmbed proxy
      try {
        const res = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${extractedId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.title) {
            return [
              {
                id: `custom-${extractedId}-${Date.now()}`,
                videoId: extractedId,
                title: data.title || 'YouTube Track',
                channel: data.author_name || 'YouTube Creator',
                thumbnail: `https://i.ytimg.com/vi/${extractedId}/hqdefault.jpg`,
                category: 'Imported',
                duration: 'Custom Length',
                description: `Pasted YouTube Link: ${data.author_url || ''}`,
              },
            ];
          }
        }
      } catch (err) {
        console.warn('oEmbed fetch error, using fallback ID presentation', err);
      }

      // Direct fallback track if metadata fetch fails
      return [
        {
          id: `custom-${extractedId}-${Date.now()}`,
          videoId: extractedId,
          title: `YouTube Video (${extractedId})`,
          channel: 'Direct YouTube Stream',
          thumbnail: `https://i.ytimg.com/vi/${extractedId}/hqdefault.jpg`,
          category: 'Direct Link',
          duration: 'Streaming',
        },
      ];
    }

    // Check if Live YouTube Data API v3 key is available
    const apiKey = this.getApiKey();
    if (apiKey && apiKey.length > 10) {
      try {
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&videoEmbeddable=true&maxResults=12&q=${encodeURIComponent(
          trimmed
        )}&key=${apiKey}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.items && Array.isArray(data.items)) {
            const results: YouTubeTrack[] = data.items.map((item: any, idx: number) => ({
              id: `yt-api-${item.id.videoId}-${idx}`,
              videoId: item.id.videoId,
              title: item.snippet.title,
              channel: item.snippet.channelTitle,
              thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.medium?.url || `https://i.ytimg.com/vi/${item.id.videoId}/hqdefault.jpg`,
              category: 'YouTube Search Result',
              description: item.snippet.description,
            }));
            if (results.length > 0) {
              return results;
            }
          }
        } else {
          console.warn('YouTube API returned status', res.status);
        }
      } catch (err) {
        console.warn('YouTube API call failed, falling back to curated library search:', err);
      }
    }

    // Local semantic matching across curated real catalog
    const qLower = trimmed.toLowerCase();
    const matches = CURATED_TRACKS.filter((track) => {
      return (
        track.title.toLowerCase().includes(qLower) ||
        track.channel.toLowerCase().includes(qLower) ||
        (track.category && track.category.toLowerCase().includes(qLower)) ||
        (track.description && track.description.toLowerCase().includes(qLower))
      );
    });

    if (matches.length > 0) {
      return matches;
    }

    // If query has no direct match, return a diverse subset of curated tracks
    return CURATED_TRACKS.slice(0, 8);
  }

  // --- PLAYLISTS PERSISTENCE ---
  public getPlaylists(): YouTubePlaylist[] {
    try {
      const data = localStorage.getItem(STORAGE_PLAYLISTS);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}

    this.savePlaylists(DEFAULT_PLAYLISTS);
    return DEFAULT_PLAYLISTS;
  }

  public savePlaylists(playlists: YouTubePlaylist[]) {
    try {
      localStorage.setItem(STORAGE_PLAYLISTS, JSON.stringify(playlists));
    } catch (_) {}
  }

  public createPlaylist(name: string, icon = '🎵', description = ''): YouTubePlaylist {
    const playlists = this.getPlaylists();
    const newPlaylist: YouTubePlaylist = {
      id: `pl-${Date.now()}`,
      name: name.trim() || 'Custom Playlist',
      description,
      icon,
      isCurated: false,
      tracks: [],
      createdAt: Date.now(),
    };
    playlists.push(newPlaylist);
    this.savePlaylists(playlists);
    return newPlaylist;
  }

  public deletePlaylist(id: string) {
    const playlists = this.getPlaylists().filter((p) => p.id !== id);
    this.savePlaylists(playlists);
  }

  public addTrackToPlaylist(playlistId: string, track: YouTubeTrack) {
    const playlists = this.getPlaylists().map((p) => {
      if (p.id === playlistId) {
        const alreadyHas = p.tracks.some((t) => t.videoId === track.videoId);
        if (alreadyHas) return p;
        return {
          ...p,
          tracks: [...p.tracks, { ...track, id: `track-${Date.now()}-${track.videoId}`, addedAt: Date.now() }],
        };
      }
      return p;
    });
    this.savePlaylists(playlists);
  }

  public removeTrackFromPlaylist(playlistId: string, trackId: string) {
    const playlists = this.getPlaylists().map((p) => {
      if (p.id === playlistId) {
        return {
          ...p,
          tracks: p.tracks.filter((t) => t.id !== trackId && t.videoId !== trackId),
        };
      }
      return p;
    });
    this.savePlaylists(playlists);
  }

  // --- QUEUE PERSISTENCE ---
  public getQueue(): YouTubeTrack[] {
    try {
      const data = localStorage.getItem(STORAGE_QUEUE);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_) {}

    // Default initial queue from Minecraft and Lofi tracks
    const initial = [
      CURATED_TRACKS[0], // Sweden
      CURATED_TRACKS[1], // Subwoofer Lullaby
      CURATED_TRACKS[6], // Lofi Girl
      CURATED_TRACKS[10], // Peaceful Piano
    ];
    this.saveQueue(initial);
    return initial;
  }

  public saveQueue(queue: YouTubeTrack[]) {
    try {
      localStorage.setItem(STORAGE_QUEUE, JSON.stringify(queue));
    } catch (_) {}
  }

  // --- FAVORITES (LIKED TRACKS) ---
  public getFavorites(): YouTubeTrack[] {
    try {
      const data = localStorage.getItem(STORAGE_FAVORITES);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}

    const initial = [CURATED_TRACKS[0], CURATED_TRACKS[6]];
    this.saveFavorites(initial);
    return initial;
  }

  public saveFavorites(favorites: YouTubeTrack[]) {
    try {
      localStorage.setItem(STORAGE_FAVORITES, JSON.stringify(favorites));
    } catch (_) {}
  }

  public toggleFavorite(track: YouTubeTrack): boolean {
    const favs = this.getFavorites();
    const existingIdx = favs.findIndex((f) => f.videoId === track.videoId);
    let isNowFavorited = false;
    if (existingIdx >= 0) {
      favs.splice(existingIdx, 1);
      isNowFavorited = false;
    } else {
      favs.unshift(track);
      isNowFavorited = true;
    }
    this.saveFavorites(favs);
    return isNowFavorited;
  }

  public isFavorite(videoId: string): boolean {
    return this.getFavorites().some((f) => f.videoId === videoId);
  }

  // --- RECENTLY PLAYED ---
  public getRecentlyPlayed(): YouTubeTrack[] {
    try {
      const data = localStorage.getItem(STORAGE_RECENT);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (_) {}
    return [];
  }

  public addRecentlyPlayed(track: YouTubeTrack) {
    const recents = this.getRecentlyPlayed().filter((t) => t.videoId !== track.videoId);
    recents.unshift(track);
    const capped = recents.slice(0, 20);
    try {
      localStorage.setItem(STORAGE_RECENT, JSON.stringify(capped));
    } catch (_) {}
  }

  // --- SETTINGS (VOLUME, MODE, SHUFFLE, REPEAT) ---
  public getVolume(): number {
    try {
      const v = localStorage.getItem(STORAGE_VOLUME);
      return v !== null ? parseFloat(v) : 75;
    } catch (_) {
      return 75;
    }
  }

  public saveVolume(vol: number) {
    try {
      localStorage.setItem(STORAGE_VOLUME, String(vol));
    } catch (_) {}
  }

  public getPlayerMode(): 'VIDEO' | 'AUDIO_FOCUSED' {
    try {
      const m = localStorage.getItem(STORAGE_MODE);
      return m === 'VIDEO' ? 'VIDEO' : 'AUDIO_FOCUSED';
    } catch (_) {
      return 'AUDIO_FOCUSED';
    }
  }

  public savePlayerMode(mode: 'VIDEO' | 'AUDIO_FOCUSED') {
    try {
      localStorage.setItem(STORAGE_MODE, mode);
    } catch (_) {}
  }

  public getShuffle(): boolean {
    try {
      return localStorage.getItem(STORAGE_SHUFFLE) === 'true';
    } catch (_) {
      return false;
    }
  }

  public saveShuffle(shuffle: boolean) {
    try {
      localStorage.setItem(STORAGE_SHUFFLE, String(shuffle));
    } catch (_) {}
  }

  public getRepeat(): 'OFF' | 'ALL' | 'ONE' {
    try {
      const r = localStorage.getItem(STORAGE_REPEAT);
      if (r === 'ALL' || r === 'ONE') return r;
      return 'OFF';
    } catch (_) {
      return 'OFF';
    }
  }

  public saveRepeat(repeat: 'OFF' | 'ALL' | 'ONE') {
    try {
      localStorage.setItem(STORAGE_REPEAT, repeat);
    } catch (_) {}
  }
}

export const youtubeService = new YouTubeService();
