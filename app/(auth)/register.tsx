import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuthStore } from '../../store/authStore';
import { useSettingsStore } from '../../store/settingsStore';
import * as authService from '../../services/authService';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);
  const setUserId = useSettingsStore((s) => s.setUserId);
  const setUserName = useSettingsStore((s) => s.setUserName);

  const handleRegister = async () => {
    const trimEmail = email.trim();
    const trimUser = username.trim() || 'Warrior';
    const trimPass = password.trim();

    if (!trimEmail || !trimPass) {
      Alert.alert('Missing fields', 'Please enter your email and password.');
      return;
    }
    if (trimPass !== confirm.trim()) {
      Alert.alert('Password mismatch', 'Passwords do not match.');
      return;
    }
    if (trimPass.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const user = await authService.register(trimEmail, trimPass, trimUser);
      setUser(user);
      setUserId(user.userId);
      setUserName(user.username);
      router.replace('/(tabs)');
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Registration failed. Please try again.';
      Alert.alert('Registration failed', msg);
    } finally {
      setLoading(false);
    }
  };

  const inputBox = {
    backgroundColor: '#151515',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1E1E1E',
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0D0D' }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <View style={{ alignItems: 'center', marginBottom: 48 }}>
            <Text style={{ fontSize: 40, fontWeight: '800', color: '#FFFFFF', letterSpacing: -1 }}>
              Fortify
            </Text>
            <Text style={{ fontSize: 14, color: '#4B5563', marginTop: 6 }}>
              Create your account. Begin your journey.
            </Text>
          </View>

          {/* Form */}
          <View style={{ gap: 12 }}>
            {/* Username */}
            <View>
              <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: '500' }}>
                USERNAME
              </Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Warrior"
                placeholderTextColor="#2A2A2A"
                autoCapitalize="words"
                style={{
                  backgroundColor: '#151515',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#1E1E1E',
                }}
              />
            </View>

            {/* Email */}
            <View>
              <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: '500' }}>
                EMAIL
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor="#2A2A2A"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={{
                  backgroundColor: '#151515',
                  borderRadius: 12,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  fontSize: 15,
                  color: '#FFFFFF',
                  borderWidth: 1,
                  borderColor: '#1E1E1E',
                }}
              />
            </View>

            {/* Password */}
            <View>
              <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: '500' }}>
                PASSWORD
              </Text>
              <View style={inputBox}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Min. 6 characters"
                  placeholderTextColor="#2A2A2A"
                  secureTextEntry={!showPassword}
                  style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#FFFFFF' }}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} style={{ paddingHorizontal: 14 }}>
                  <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 6, fontWeight: '500' }}>
                CONFIRM PASSWORD
              </Text>
              <View style={inputBox}>
                <TextInput
                  value={confirm}
                  onChangeText={setConfirm}
                  placeholder="••••••••"
                  placeholderTextColor="#2A2A2A"
                  secureTextEntry={!showConfirm}
                  style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: '#FFFFFF' }}
                />
                <TouchableOpacity onPress={() => setShowConfirm((v) => !v)} style={{ paddingHorizontal: 14 }}>
                  <Ionicons name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color="#4B5563" />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={loading}
              activeOpacity={0.85}
              style={{
                backgroundColor: '#EC4899',
                borderRadius: 14,
                paddingVertical: 16,
                alignItems: 'center',
                marginTop: 8,
                shadowColor: '#EC4899',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 6,
              }}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFFFFF' }}>
                  Create Account
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 32 }}>
            <Text style={{ fontSize: 14, color: '#4B5563' }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={{ fontSize: 14, color: '#EC4899', fontWeight: '600' }}>
                Log In
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
