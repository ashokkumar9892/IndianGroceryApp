import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';
import { MOCK_USERS } from '../data/mockUsers';

interface AuthStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  error: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, password: string, phone?: string) => boolean;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      currentUser: null,
      isAuthenticated: false,
      error: null,

      login: (email, password) => {
        const allUsers = [...MOCK_USERS, ...JSON.parse(localStorage.getItem('bs_registered_users') || '[]')];
        const user = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (user) {
          set({ currentUser: user, isAuthenticated: true, error: null });
          return true;
        }
        set({ error: 'Invalid email or password.' });
        return false;
      },

      logout: () => {
        set({ currentUser: null, isAuthenticated: false, error: null });
      },

      register: (name, email, password, phone) => {
        const allUsers = [...MOCK_USERS, ...JSON.parse(localStorage.getItem('bs_registered_users') || '[]')];
        const exists = allUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
        if (exists) {
          set({ error: 'An account with this email already exists.' });
          return false;
        }
        const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          password,
          name,
          phone,
          role: 'customer',
          createdAt: new Date().toISOString().split('T')[0],
        };
        const registered = JSON.parse(localStorage.getItem('bs_registered_users') || '[]');
        registered.push(newUser);
        localStorage.setItem('bs_registered_users', JSON.stringify(registered));
        set({ currentUser: newUser, isAuthenticated: true, error: null });
        return true;
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'bs_auth', partialize: (s) => ({ currentUser: s.currentUser, isAuthenticated: s.isAuthenticated }) }
  )
);
