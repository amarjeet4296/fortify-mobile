import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useJournalStore } from '../../store/journalStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/dateUtils';

const TODAY_LABEL = new Date().toLocaleDateString('en-US', {
  weekday: 'short',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

const MOOD_EMOJI = ['😞', '😔', '😐', '🙂', '😊', '😄', '🤩'];

function getMoodEmoji(mood: number) {
  return MOOD_EMOJI[Math.min(Math.floor((mood / 10) * MOOD_EMOJI.length), MOOD_EMOJI.length - 1)];
}

export default function JournalScreen() {
  const {
    todayNotes, todaySaved,
    setTodayNotes,
    saveEntry, entries, latestInsight, insightLoading,
    generateInsight, fetchEntries, deleteEntryForDate,
  } = useJournalStore();
  const { userId } = useSettingsStore();

  const [title, setTitle] = React.useState('');

  useEffect(() => {
    fetchEntries(userId);
  }, []);

  const handleSave = async () => {
    // Combine title + body into notes, separated by a blank line
    const body = todayNotes.trim();
    const t = title.trim();
    const fullNotes = t && body ? `${t}\n\n${body}` : t || body;
    setTodayNotes(fullNotes);
    await saveEntry(userId);
    // Clear the form after saving
    setTitle('');
    setTodayNotes('');
  };

  const recentEntries = Object.values(entries)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 10);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>

        {/* Toolbar — matches screenshot style */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 8,
          borderBottomWidth: 1,
          borderBottomColor: '#1A1A1A',
        }}>
          <TouchableOpacity style={{ padding: 8, marginRight: 2 }}>
            <Ionicons name="list-outline" size={22} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8, marginRight: 2 }}>
            <Ionicons name="color-palette-outline" size={22} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity style={{ padding: 8 }}>
            <Ionicons name="add-circle-outline" size={22} color="#4B5563" />
          </TouchableOpacity>

          <View style={{ flex: 1 }} />

          <TouchableOpacity
            onPress={handleSave}
            style={{
              backgroundColor: todaySaved ? '#22C55E18' : '#252525',
              borderRadius: 20,
              paddingHorizontal: 20,
              paddingVertical: 8,
              marginRight: 6,
              borderWidth: 1,
              borderColor: todaySaved ? '#22C55E40' : '#333333',
            }}
          >
            <Text style={{ color: todaySaved ? '#22C55E' : '#D1D5DB', fontWeight: '600', fontSize: 14 }}>
              {todaySaved ? 'Saved ✓' : 'Save'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              Alert.alert('Journal Options', '', [
                { text: 'Generate AI Insight', onPress: () => generateInsight(userId) },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
            style={{ padding: 8 }}
          >
            <Ionicons name="ellipsis-vertical" size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 60 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Title input */}
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Add title"
            placeholderTextColor="#252525"
            style={{
              fontSize: 30,
              fontWeight: '400',
              color: '#FFFFFF',
              paddingHorizontal: 16,
              paddingTop: 22,
              paddingBottom: 6,
            }}
          />

          {/* Date row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 18 }}>
            <Ionicons name="calendar-outline" size={15} color="#4B5563" />
            <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 6 }}>{TODAY_LABEL}</Text>
          </View>

          {/* Body / notes */}
          <TextInput
            value={todayNotes}
            onChangeText={setTodayNotes}
            placeholder="What's on your mind?"
            placeholderTextColor="#252525"
            multiline
            style={{
              fontSize: 16,
              color: '#E5E7EB',
              paddingHorizontal: 16,
              minHeight: 180,
              textAlignVertical: 'top',
              lineHeight: 26,
            }}
          />

          {/* Section divider */}
          <View style={{ height: 1, backgroundColor: '#151515', marginHorizontal: 16, marginTop: 28, marginBottom: 24 }} />

          {/* AI Insight (collapsed, minimal) */}
          <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#4B5563' }}>Weekly AI Insight</Text>
              <TouchableOpacity onPress={() => generateInsight(userId)}>
                <Text style={{ fontSize: 12, color: '#EC4899', fontWeight: '600' }}>
                  {insightLoading ? 'Generating...' : 'Refresh ↻'}
                </Text>
              </TouchableOpacity>
            </View>

            {insightLoading ? (
              <Text style={{ fontSize: 13, color: '#6B7280' }}>Generating your insight...</Text>
            ) : latestInsight?.hasInsight ? (
              <View style={{ backgroundColor: '#111111', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#1A1A1A' }}>
                <Text style={{ fontSize: 14, color: '#9CA3AF', lineHeight: 21, marginBottom: 8 }}>
                  {latestInsight.summary}
                </Text>
                {latestInsight.recommendations?.slice(0, 2).map((rec, i) => (
                  <View key={i} style={{ flexDirection: 'row', marginBottom: 4 }}>
                    <Text style={{ color: '#22C55E', marginRight: 8, fontSize: 13 }}>→</Text>
                    <Text style={{ fontSize: 13, color: '#6B7280', flex: 1, lineHeight: 19 }}>{rec}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ fontSize: 13, color: '#4B5563' }}>
                {latestInsight?.message || 'Save at least one journal entry, then tap Refresh to generate your weekly AI insight.'}
              </Text>
            )}
          </View>

          {/* Past Entries list */}
          {recentEntries.length > 0 && (
            <View style={{ paddingHorizontal: 16 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 10 }}>
                Past Entries
              </Text>
              {recentEntries.map((entry) => (
                <TouchableOpacity
                  key={entry.date}
                  onPress={() => router.push({ pathname: '/(modals)/journal-entry', params: { date: entry.date } })}
                  style={{
                    paddingVertical: 12,
                    borderBottomWidth: 1,
                    borderBottomColor: '#151515',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, color: '#9CA3AF', fontWeight: '500', marginBottom: 2 }}>
                      {formatDate(entry.date)}
                    </Text>
                    {entry.notes ? (
                      <Text style={{ fontSize: 12, color: '#3A3A3A' }} numberOfLines={1}>
                        {entry.notes}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                    <Text style={{ fontSize: 14 }}>{getMoodEmoji(entry.mood)}</Text>
                    <TouchableOpacity
                      onPress={(e) => {
                        e.stopPropagation();
                        Alert.alert(
                          'Delete entry?',
                          `Delete entry for ${formatDate(entry.date)}?`,
                          [
                            { text: 'Cancel', style: 'cancel' },
                            { text: 'Delete', style: 'destructive', onPress: () => deleteEntryForDate(userId, entry.date) },
                          ],
                        );
                      }}
                      style={{ marginLeft: 14, padding: 4 }}
                    >
                      <Ionicons name="trash-outline" size={15} color="#2A2A2A" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
