import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  email: string | null;
  username: string | null;
  memberSince: string | null;
  setUser: (user: { userId: string; email: string; username: string; memberSince: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      userId: null,
      email: null,
      username: null,
      memberSince: null,

      setUser: (user) =>
        set({
          isLoggedIn: true,
          userId: user.userId,
          email: user.email,
          username: user.username,
          memberSince: user.memberSince,
        }),

      logout: () =>
        set({
          isLoggedIn: false,
          userId: null,
          email: null,
          username: null,
          memberSince: null,
        }),
    }),
    {
      name: 'fortify-auth',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
