import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useJournalStore } from '../../store/journalStore';
import { useSettingsStore } from '../../store/settingsStore';
import { formatDate } from '../../utils/dateUtils';
import { Ionicons } from '@expo/vector-icons';

/** Split saved notes into title + body (title is text before first \n\n) */
function parseNotes(raw: string): { title: string; body: string } {
  const sep = raw.indexOf('\n\n');
  if (sep > 0) {
    return { title: raw.slice(0, sep).trim(), body: raw.slice(sep + 2).trim() };
  }
  return { title: '', body: raw };
}

export default function JournalEntryModal() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const getEntryForDate = useJournalStore((s) => s.getEntryForDate);
  const deleteEntryForDate = useJournalStore((s) => s.deleteEntryForDate);
  const userId = useSettingsStore((s) => s.userId);
  const entry = date ? getEntryForDate(date) : null;

  const { title, body } = parseNotes(entry?.notes || '');

  const entryDate = date
    ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
        weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      })
    : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>

      {/* Toolbar */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#1A1A1A',
      }}>
        <TouchableOpacity onPress={() => router.back()} style={{ padding: 8 }}>
          <Ionicons name="close-outline" size={24} color="#4B5563" />
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {entry && date && (
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                'Delete entry?',
                `Delete journal entry for ${formatDate(date)}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                      await deleteEntryForDate(userId, date);
                      router.back();
                    },
                  },
                ],
              )
            }
            style={{ padding: 8 }}
          >
            <Ionicons name="trash-outline" size={20} color="#3A3A3A" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {entry ? (
          <>
            {/* Title */}
            {title ? (
              <Text style={{
                fontSize: 30,
                fontWeight: '400',
                color: '#FFFFFF',
                paddingHorizontal: 16,
                paddingTop: 22,
                paddingBottom: 6,
              }}>
                {title}
              </Text>
            ) : null}

            {/* Date row */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingBottom: 18,
              paddingTop: title ? 0 : 22,
            }}>
              <Ionicons name="calendar-outline" size={15} color="#4B5563" />
              <Text style={{ fontSize: 14, color: '#4B5563', marginLeft: 6 }}>{entryDate}</Text>
            </View>

            {/* Body */}
            {body ? (
              <Text style={{
                fontSize: 16,
                color: '#E5E7EB',
                paddingHorizontal: 16,
                lineHeight: 26,
                marginBottom: 24,
              }}>
                {body}
              </Text>
            ) : null}

            {/* Timestamp */}
            <Text style={{ fontSize: 11, color: '#2A2A2A', textAlign: 'center' }}>
              {entry.createdAt ? new Date(entry.createdAt).toLocaleString() : ''}
            </Text>
          </>
        ) : (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Text style={{ fontSize: 40, marginBottom: 16 }}>📭</Text>
            <Text style={{ fontSize: 16, color: '#4B5563', textAlign: 'center', lineHeight: 22 }}>
              No entry found for this day.
            </Text>
            <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
              <Text style={{ color: '#EC4899', fontWeight: '600', fontSize: 14 }}>Go Back</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
