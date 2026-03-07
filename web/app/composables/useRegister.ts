import { registerMutation } from '~/graphql/mutations/register';
import { useUserStore } from '~/stores/user';
import type { AuthPayload, RegisterInput } from '~/types/bardo';
import { useGqlClient } from './useGqlClient';

interface RegisterResult {
  register: AuthPayload;
}

export function useRegister() {
  const { request } = useGqlClient();
  const userStore = useUserStore();
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function register(input: RegisterInput) {
    pending.value = true;
    error.value = null;
    try {
      const data = await request<RegisterResult, { input: RegisterInput }>(
        registerMutation as never,
        { input }
      );
      if (data?.register) {
        userStore.setAuth({
          user: data.register.user,
          token: data.register.token,
        });
        return data.register;
      }
      throw new Error('Invalid response');
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      pending.value = false;
    }
  }

  return { register, pending, error };
}
