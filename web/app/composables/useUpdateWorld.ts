import { updateWorldMutation } from '~/gql/mutations/updateWorld';
import type { UpdateWorldInput, World } from '~/types/bardo';

interface UpdateWorldResult {
  updateWorld: World;
}

export function useUpdateWorld() {
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function updateWorld(id: string, input: UpdateWorldInput) {
    pending.value = true;
    error.value = null;
    try {
      const data = await useMutation<UpdateWorldResult>(updateWorldMutation, {
        id,
        input,
      });
      if (data?.updateWorld) {
        return data.updateWorld;
      }
      throw new Error('Invalid response');
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      pending.value = false;
    }
  }

  return { updateWorld, pending, error };
}
