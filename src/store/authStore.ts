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
        // Set cookies for middleware with global path
        Cookies.set('tb_token', token, { expires: 1, path: '/' });
        Cookies.set('tb_role', user.role, { expires: 1, path: '/' });
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        // Thoroughly clear cookies
        Cookies.remove('tb_token', { path: '/' });
        Cookies.remove('tb_role', { path: '/' });
        // Double check for some browsers that require explicit removal
        document.cookie = "tb_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        document.cookie = "tb_role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

        if (typeof window !== 'undefined') {
          localStorage.removeItem('tb-auth-storage'); 
          localStorage.clear(); // Nuclear option to ensure no residues
          // Force a full page reload to clear any memory states
          window.location.href = '/login';
        }
      },
    }),
    {
      name: 'tb-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
