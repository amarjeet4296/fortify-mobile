import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useSpotifyStore } from '../store/spotifyStore';
import { SPOTIFY_PLAYLISTS, CATEGORY_ICONS } from '../constants/spotify';
import { SpotifyCategory } from '../types/spotify';
import { formatDuration } from '../utils/dateUtils';

export function SpotifyPlayer() {
  const {
    activeCategory,
    currentTrack,
    isPlaying,
    selectCategory,
    openInSpotify,
    togglePlay,
    skipTrack,
    prevTrack,
  } = useSpotifyStore();

  const categories = Object.keys(SPOTIFY_PLAYLISTS) as SpotifyCategory[];

  return (
    <View
      style={{
        backgroundColor: '#1A1A1A',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#2A2A2A',
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
        <Text style={{ fontSize: 18, marginRight: 8 }}>🎵</Text>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', flex: 1 }}>
          Focus Music
        </Text>
        <TouchableOpacity onPress={openInSpotify}>
          <Text style={{ fontSize: 11, color: '#1DB954', fontWeight: '600' }}>Open Spotify →</Text>
        </TouchableOpacity>
      </View>

      {/* Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
        {categories.map((cat) => {
          const active = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => selectCategory(cat)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: active ? '#1DB95430' : '#2A2A2A',
                borderWidth: 1,
                borderColor: active ? '#1DB954' : '#3A3A3A',
                marginRight: 8,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 14, marginRight: 4 }}>{CATEGORY_ICONS[cat]}</Text>
              <Text style={{ fontSize: 12, color: active ? '#1DB954' : '#9CA3AF', fontWeight: active ? '600' : '400' }}>
                {SPOTIFY_PLAYLISTS[cat].label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Current Track */}
      {currentTrack && (
        <View
          style={{
            backgroundColor: '#111111',
            borderRadius: 12,
            padding: 12,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {/* Album art placeholder */}
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 8,
              backgroundColor: '#1DB95420',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 22 }}>
              {activeCategory ? CATEGORY_ICONS[activeCategory] : '🎵'}
            </Text>
          </View>

          {/* Track info */}
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#FFFFFF' }} numberOfLines={1}>
              {currentTrack.title}
            </Text>
            <Text style={{ fontSize: 11, color: '#9CA3AF' }} numberOfLines={1}>
              {currentTrack.artist} · {formatDuration(currentTrack.duration)}
            </Text>
          </View>

          {/* Controls */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={prevTrack} style={{ padding: 6 }}>
              <Text style={{ fontSize: 18 }}>⏮</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={togglePlay}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: '#1DB954',
                alignItems: 'center',
                justifyContent: 'center',
                marginHorizontal: 6,
              }}
            >
              <Text style={{ fontSize: 16 }}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={skipTrack} style={{ padding: 6 }}>
              <Text style={{ fontSize: 18 }}>⏭</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <Text style={{ fontSize: 10, color: '#6B7280', textAlign: 'center', marginTop: 10 }}>
        Requires Spotify app · Placeholder mode
      </Text>
    </View>
  );
}
