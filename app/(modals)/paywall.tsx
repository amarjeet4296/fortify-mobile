import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useSettingsStore } from '../../store/settingsStore';

const FEATURES = [
  { label: 'Streak tracking (all 3 types)', free: true },
  { label: 'Daily check-in & reset', free: true },
  { label: '90-day heatmap', free: true },
  { label: '7-day journal', free: true },
  { label: 'Breathing & cold shower tools', free: true },
  { label: '365-day full heatmap', free: false },
  { label: 'Weekly AI insights (Claude)', free: false },
  { label: 'Full Benefits Timeline', free: false },
  { label: 'Focus music categories', free: false },
  { label: 'Priority support', free: false },
];

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$4.99', period: '/month', badge: null },
  { id: 'annual', label: 'Annual', price: '$29.99', period: '/year', badge: 'BEST VALUE' },
  { id: 'lifetime', label: 'Lifetime', price: '$79.99', period: 'once', badge: null },
];

export default function PaywallModal() {
  const { isPremium, setPremium } = useSettingsStore();
  const [selectedPlan, setSelectedPlan] = useState('annual');

  const handleUpgrade = () => {
    setPremium(true);
    Alert.alert(
      '🎉 Welcome to Premium!',
      'All premium features are now unlocked. This is a mocked payment — no charge was made.',
      [{ text: 'Let\'s Go!', onPress: () => router.back() }],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A1A' }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Close */}
        <View style={{ padding: 20, flexDirection: 'row', justifyContent: 'flex-end' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#1A1A2A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#9CA3AF', fontSize: 18 }}>✕</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, marginBottom: 30 }}>
          <Text style={{ fontSize: 48, marginBottom: 10 }}>👑</Text>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#FFFFFF', textAlign: 'center', marginBottom: 10 }}>
            Unlock Fortify Premium
          </Text>
          <Text style={{ fontSize: 14, color: '#9CA3AF', textAlign: 'center', lineHeight: 20 }}>
            Get AI-powered insights, full history, and advanced tools to accelerate your transformation.
          </Text>
        </View>

        {/* Feature comparison */}
        <View style={{ paddingHorizontal: 20, marginBottom: 28 }}>
          <View
            style={{
              backgroundColor: '#1A1A2A',
              borderRadius: 16,
              overflow: 'hidden',
              borderWidth: 1,
              borderColor: '#2A2A3A',
            }}
          >
            {/* Header */}
            <View style={{ flexDirection: 'row', backgroundColor: '#111124', padding: 12 }}>
              <Text style={{ flex: 1, fontSize: 12, fontWeight: '700', color: '#9CA3AF', letterSpacing: 0.5 }}>FEATURES</Text>
              <Text style={{ width: 50, fontSize: 12, fontWeight: '700', color: '#9CA3AF', textAlign: 'center', letterSpacing: 0.5 }}>FREE</Text>
              <Text style={{ width: 70, fontSize: 12, fontWeight: '700', color: '#EAB308', textAlign: 'center', letterSpacing: 0.5 }}>PRO</Text>
            </View>

            {FEATURES.map((feature, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderTopWidth: 1,
                  borderTopColor: '#2A2A3A',
                }}
              >
                <Text style={{ flex: 1, fontSize: 13, color: '#FFFFFF' }}>{feature.label}</Text>
                <View style={{ width: 50, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16 }}>{feature.free ? '✓' : '—'}</Text>
                </View>
                <View style={{ width: 70, alignItems: 'center' }}>
                  <Text style={{ fontSize: 16, color: '#EAB308' }}>✓</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Plan Selection */}
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF', marginBottom: 12 }}>
            Choose Your Plan
          </Text>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={{
                backgroundColor: selectedPlan === plan.id ? '#1A1A3A' : '#111118',
                borderRadius: 14,
                padding: 16,
                marginBottom: 10,
                borderWidth: 2,
                borderColor: selectedPlan === plan.id ? '#EAB308' : '#2A2A3A',
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 2,
                  borderColor: selectedPlan === plan.id ? '#EAB308' : '#3A3A5A',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                {selectedPlan === plan.id && (
                  <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: '#EAB308' }} />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#FFFFFF' }}>{plan.label}</Text>
                <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{plan.period}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 17, fontWeight: '700', color: '#FFFFFF' }}>{plan.price}</Text>
                {plan.badge && (
                  <View style={{ backgroundColor: '#22C55E20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ fontSize: 9, color: '#22C55E', fontWeight: '700' }}>{plan.badge}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: 20 }}>
          <TouchableOpacity
            onPress={handleUpgrade}
            style={{
              backgroundColor: '#EAB308',
              borderRadius: 16,
              paddingVertical: 18,
              alignItems: 'center',
              shadowColor: '#EAB308',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 10,
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: '800', color: '#000000' }}>
              {isPremium ? '✓ Already Premium' : 'Start Free Trial →'}
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 11, color: '#6B7280', textAlign: 'center', marginTop: 10 }}>
            Mocked payment — no real charge. Cancel anytime.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
