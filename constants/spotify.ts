import { SpotifyPlaylist } from '../types/spotify';

export const SPOTIFY_PLAYLISTS: Record<string, SpotifyPlaylist> = {
  meditation: {
    label: 'Meditation',
    playlistId: '37i9dQZF1DWZqd5JICZI0u',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZqd5JICZI0u',
    mockTracks: [
      { id: '1', title: '432 Hz Deep Healing', artist: 'Meditative Mind', duration: 360 },
      { id: '2', title: 'Morning Stillness', artist: 'Calm Radio', duration: 420 },
      { id: '3', title: 'Inner Peace', artist: 'Mindful Audio', duration: 540 },
    ],
  },
  focus: {
    label: 'Focus',
    playlistId: '37i9dQZF1DX8NTLI2TtZa6',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX8NTLI2TtZa6',
    mockTracks: [
      { id: '4', title: 'Flow State', artist: 'Lo-Fi Hip Hop', duration: 195 },
      { id: '5', title: 'Deep Concentration', artist: 'Study Music', duration: 280 },
      { id: '6', title: 'Alpha Waves', artist: 'Brain Music', duration: 360 },
    ],
  },
  deep_work: {
    label: 'Deep Work',
    playlistId: '37i9dQZF1DX9sIqqvKsjEK',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DX9sIqqvKsjEK',
    mockTracks: [
      { id: '7', title: 'Binaural Beta Waves', artist: 'Brain.fm', duration: 600 },
      { id: '8', title: 'Productivity Boost', artist: 'Focus Flow', duration: 450 },
    ],
  },
  sleep: {
    label: 'Sleep',
    playlistId: '37i9dQZF1DWZd79rJ6a7lp',
    playlistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DWZd79rJ6a7lp',
    mockTracks: [
      { id: '9', title: 'Delta Wave Sleep', artist: 'Sleep Sounds', duration: 480 },
      { id: '10', title: 'Rain & Thunder', artist: 'Nature Sounds', duration: 600 },
      { id: '11', title: 'Deep Sleep', artist: 'Calm Night', duration: 720 },
    ],
  },
};

export const CATEGORY_ICONS: Record<string, string> = {
  meditation: '🧘',
  focus: '🎯',
  deep_work: '💼',
  sleep: '🌙',
};
