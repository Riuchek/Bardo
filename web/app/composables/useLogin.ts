import { loginMutation } from '~/gql/mutations/login';
import { useUserStore } from '~/stores/user';
import type { AuthPayload, LoginInput } from '~/types/bardo';

interface LoginResult {
  login: AuthPayload;
}

export function useLogin() {
  const userStore = useUserStore();
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function login(input: LoginInput) {
    pending.value = true;
    error.value = null;
    try {
      const data = await useMutation<LoginResult>(loginMutation, { input });
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
