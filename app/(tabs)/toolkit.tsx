import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SpotifyPlayer } from '../../components/SpotifyPlayer';

interface ToolCard {
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  externalUrl?: string;
}

const TOOLS: ToolCard[] = [
  {
    title: '4-7-8 Breathing',
    description: 'Ancient technique to calm the nervous system in under 2 minutes',
    icon: '🫁',
    color: '#3B82F6',
    route: '/(modals)/breathing',
  },
  {
    title: 'Cold Shower Timer',
    description: '3-minute cold shower to reset dopamine and boost willpower',
    icon: '🚿',
    color: '#06B6D4',
    route: '/(modals)/cold-shower',
  },
  {
    title: 'Remember Your Why',
    description: "Reconnect with your deeper purpose and update today's journal",
    icon: '❤️',
    color: '#EC4899',
    route: '/(tabs)/journal',
  },
  {
    title: 'NoFap Community',
    description: 'Read real stories and advice from people quitting porn and bad habits',
    icon: '🧠',
    color: '#F97316',
    route: '',
    externalUrl: 'https://www.reddit.com/r/NoFap/',
  },
];

export default function ToolkitScreen() {
  const [whyText] = React.useState([
    "Every urge is temporary. Your goals are permanent.",
    "You are stronger than your cravings.",
    "Real men control their energy.",
    "Your future self will thank you.",
    "This moment of resistance builds your character.",
  ]);
  const [whyIndex, setWhyIndex] = React.useState(() => Math.floor(Math.random() * whyText.length));
  const randomWhy = whyText[whyIndex];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0F0F0F' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF' }}>Urge Toolkit</Text>
          <Text style={{ fontSize: 13, color: '#9CA3AF' }}>Tools to overcome difficult moments</Text>
        </View>

        {/* PANIC Button */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={() => router.push('/(modals)/breathing')}
            activeOpacity={0.85}
            style={{
              backgroundColor: '#EF4444',
              borderRadius: 20,
              padding: 24,
              alignItems: 'center',
              shadowColor: '#EF4444',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
              elevation: 12,
            }}
          >
            <Text style={{ fontSize: 48, marginBottom: 8 }}>🆘</Text>
            <Text style={{ fontSize: 24, fontWeight: '800', color: '#FFFFFF', letterSpacing: 3 }}>
              PANIC BUTTON
            </Text>
            <Text style={{ fontSize: 13, color: '#FCA5A5', marginTop: 6, textAlign: 'center' }}>
              Tap now for immediate help
            </Text>
          </TouchableOpacity>
        </View>

        {/* Remember Your Why */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => setWhyIndex(Math.floor(Math.random() * whyText.length))}
            style={{
              backgroundColor: '#1A1A1A',
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: '#EC489940',
              borderLeftWidth: 4,
              borderLeftColor: '#EC4899',
            }}
          >
            <Text style={{ fontSize: 12, color: '#EC4899', fontWeight: '700', marginBottom: 8, letterSpacing: 1 }}>
              REMEMBER YOUR WHY
            </Text>
            <Text style={{ fontSize: 16, color: '#FFFFFF', lineHeight: 24, fontStyle: 'italic' }}>
              "{randomWhy}"
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tool Cards */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
            Coping Tools
          </Text>
          {TOOLS.map((tool) => (
            <TouchableOpacity
              key={tool.title}
              onPress={() => {
                if (tool.externalUrl) {
                  Linking.openURL(tool.externalUrl);
                  return;
                }
                if (tool.title === 'Remember Your Why') {
                  router.push('/(tabs)/journal');
                  return;
                }
                router.push(tool.route as any);
              }}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#1A1A1A',
                borderRadius: 16,
                padding: 16,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: tool.color + '30',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  backgroundColor: tool.color + '20',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 14,
                }}
              >
                <Text style={{ fontSize: 28 }}>{tool.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#FFFFFF', marginBottom: 4 }}>
                  {tool.title}
                </Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF', lineHeight: 17 }}>
                  {tool.description}
                </Text>
              </View>
              <Text style={{ fontSize: 18, color: tool.color }}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Spotify Player */}
        <View style={{ paddingHorizontal: 16, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
            Focus Music
          </Text>
          <SpotifyPlayer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
