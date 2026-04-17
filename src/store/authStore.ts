import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import Cookies from 'js-cookie';

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        set({ user, token, isAuthenticated: true });
        // Set cookies for middleware
        Cookies.set('tb_token', token, { expires: 1 }); // 1 day
        Cookies.set('tb_role', user.role, { expires: 1 });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        Cookies.remove('tb_token');
        Cookies.remove('tb_role');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('tb_token');
          localStorage.removeItem('tb_user');
        }
      },
    }),
    {
      name: 'tb-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
