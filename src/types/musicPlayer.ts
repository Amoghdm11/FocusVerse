export interface YouTubeTrack {
  id: string; // unique ID in queue or playlist
  videoId: string;
  title: string;
  channel: string;
  duration?: string;
  thumbnail: string;
  category?: string;
  description?: string;
  addedAt?: number;
}

export interface YouTubePlaylist {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isCurated?: boolean;
  tracks: YouTubeTrack[];
  createdAt: number;
}

export type YouTubePlayerMode = 'VIDEO' | 'AUDIO_FOCUSED';
export type RepeatMode = 'OFF' | 'ALL' | 'ONE';
export type PlayerTab = 'LIBRARY' | 'PLAYER' | 'QUEUE';
