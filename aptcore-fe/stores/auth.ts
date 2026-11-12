import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User, AuthState } from '@/app/_types/user';


export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      roles: [],
      permissions: [],
      isAuthenticated: false,
      _hasHydrated: false,

      setUser: (user: User | null) => set({ user }),
      setRoles: (roles: string[]) => set({ roles }),
      setPermissions: (permissions: string[]) => set({ permissions }),

      login: ({ user, roles, permissions }) =>
        set({
          user,
          roles,
          permissions,
          isAuthenticated: true,
        }),

      logout: () =>
        set({
          user: null,
          roles: [],
          permissions: [],
          isAuthenticated: false,
        }),
      
      setHasHydrated: (state) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        return (state, error) => {
          if (error) console.error('Error during auth store hydration:', error);
          (state as AuthState).setHasHydrated(true);
        };
      },
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated, roles: state.roles, permissions: state.permissions }),
    }
  )
);