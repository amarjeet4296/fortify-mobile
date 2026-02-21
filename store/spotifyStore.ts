import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SpotifyCategory, SpotifyTrack } from '../types/spotify';
import { SPOTIFY_PLAYLISTS } from '../constants/spotify';
import { Linking } from 'react-native';

interface SpotifyState {
  isConnected: boolean;
  activeCategory: SpotifyCategory | null;
  currentTrack: SpotifyTrack | null;
  currentTrackIndex: number;
  isPlaying: boolean;
  selectCategory: (category: SpotifyCategory) => void;
  openInSpotify: () => void;
  skipTrack: () => void;
  prevTrack: () => void;
  togglePlay: () => void;
}

export const useSpotifyStore = create<SpotifyState>()(
  persist(
    (set, get) => ({
      isConnected: false,
      activeCategory: 'meditation',
      currentTrack: SPOTIFY_PLAYLISTS['meditation'].mockTracks[0],
      currentTrackIndex: 0,
      isPlaying: false,

      selectCategory: (category) => {
        const tracks = SPOTIFY_PLAYLISTS[category].mockTracks;
        set({
          activeCategory: category,
          currentTrack: tracks[0],
          currentTrackIndex: 0,
          isPlaying: false,
        });
      },

      openInSpotify: () => {
        const { activeCategory } = get();
        if (!activeCategory) return;
        const playlist = SPOTIFY_PLAYLISTS[activeCategory];
        Linking.openURL(playlist.playlistUrl).catch(() => {
          Linking.openURL('https://open.spotify.com');
        });
      },

      skipTrack: () => {
        const { activeCategory, currentTrackIndex } = get();
        if (!activeCategory) return;
        const tracks = SPOTIFY_PLAYLISTS[activeCategory].mockTracks;
        const nextIndex = (currentTrackIndex + 1) % tracks.length;
        set({ currentTrack: tracks[nextIndex], currentTrackIndex: nextIndex });
      },

      prevTrack: () => {
        const { activeCategory, currentTrackIndex } = get();
        if (!activeCategory) return;
        const tracks = SPOTIFY_PLAYLISTS[activeCategory].mockTracks;
        const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
        set({ currentTrack: tracks[prevIndex], currentTrackIndex: prevIndex });
      },

      togglePlay: () => {
        const { isPlaying, activeCategory } = get();
        if (!isPlaying && activeCategory) {
          // Open Spotify in the background for real playback
          const playlist = SPOTIFY_PLAYLISTS[activeCategory];
          Linking.openURL(`spotify:playlist:${playlist.playlistId}`).catch(() => {});
        }
        set({ isPlaying: !isPlaying });
      },
    }),
    {
      name: 'fortify-spotify',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        activeCategory: state.activeCategory,
        currentTrackIndex: state.currentTrackIndex,
      }),
    },
  ),
);
