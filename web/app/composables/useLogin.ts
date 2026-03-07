import { loginMutation } from '~/graphql/mutations/login';
import { useUserStore } from '~/stores/user';
import type { AuthPayload, LoginInput } from '~/types/bardo';
import { useGqlClient } from './useGqlClient';

interface LoginResult {
  login: AuthPayload;
}

export function useLogin() {
  const { request } = useGqlClient();
  const userStore = useUserStore();
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function login(input: LoginInput) {
    pending.value = true;
    error.value = null;
    try {
      const data = await request<LoginResult, { input: LoginInput }>(
        loginMutation as never,
        { input }
      );
      if (data?.login) {
        userStore.setAuth({
          user: data.login.user,
          token: data.login.token,
        });
        return data.login;
      }
      throw new Error('Invalid response');
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      pending.value = false;
    }
  }

  return { login, pending, error };
}
