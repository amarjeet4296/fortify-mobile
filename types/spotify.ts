export type SpotifyCategory = 'meditation' | 'focus' | 'deep_work' | 'sleep';

export interface SpotifyTrack {
  id: string;
  title: string;
  artist: string;
  duration: number; // seconds
  imageUrl?: string;
}

export interface SpotifyPlaylist {
  label: string;
  playlistId: string;
  playlistUrl: string;
  mockTracks: SpotifyTrack[];
}
