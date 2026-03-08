import { createWorldMutation } from '~/gql/mutations/createWorld';
import type { World } from '~/types/bardo';

interface CreateWorldResult {
  createWorld: World;
}

export function useCreateWorld() {
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function createWorld(name: string, description?: string | null) {
    pending.value = true;
    error.value = null;
    try {
      const data = await useMutation<CreateWorldResult>(createWorldMutation, {
        name,
        description: description ?? undefined,
      });
      if (data?.createWorld) {
        return data.createWorld;
      }
      throw new Error('Invalid response');
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      pending.value = false;
    }
  }

  return { createWorld, pending, error };
}
