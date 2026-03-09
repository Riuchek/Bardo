const AUTH_COOKIE_NAME = 'bardo_best_friend';
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export function useAuthCookie() {
  const cookie = useCookie<string | null>(AUTH_COOKIE_NAME, {
    maxAge: AUTH_COOKIE_MAX_AGE,
    path: '/',
    sameSite: 'lax',
  });

  function set(token: string, user: { id: string; username: string; email: string }) {
    cookie.value = JSON.stringify({ token, user });
  }

  function clear() {
    cookie.value = null;
  }

  return { set, clear };
}
