import type { User } from '~/types/bardo';

interface UserState {
  user: User;
  token: string | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {
      id: '',
      username: '',
      email: '',
    },
    token: null,
  }),

  getters: {
    user: (state) => state.user,
    isAuthenticated: (state) => !!state.token,
  },

  actions: {
    setAuth(payload: { user: User; token: string }) {
      this.user = payload.user;
      this.token = payload.token;
    },
    clearAuth() {
      this.user = { id: '', username: '', email: '' };
      this.token = null;
    },
  },
});