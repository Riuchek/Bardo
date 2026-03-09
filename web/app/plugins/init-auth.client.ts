export default defineNuxtPlugin({
  name: 'init-auth',
  setup() {
    const cookie = useCookie<string | null>('bardo_auth', { path: '/' });
    const userStore = useUserStore();

    if (cookie.value) {
      try {
        const parsed = JSON.parse(cookie.value) as {
          token?: string;
          user?: { id: string; username: string; email: string };
        };
        if (parsed?.token && parsed?.user) {
          userStore.setAuth({ token: parsed.token, user: parsed.user });
        }
      } catch {
        cookie.value = null;
      }
    }
  },
});
