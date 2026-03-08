import { registerMutation } from '~/gql/mutations/register';
import { useUserStore } from '~/stores/user';
import type { AuthPayload, RegisterInput } from '~/types/bardo';

interface RegisterResult {
  register: AuthPayload;
}

export function useRegister() {
  const userStore = useUserStore();
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function register(input: RegisterInput) {
    pending.value = true;
    error.value = null;
    try {
      const data = await useMutation<RegisterResult>(registerMutation, {
        input,
      });
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
