import { saveBackstoryMutation } from '~/gql/mutations/saveBackstory';
import type { Backstory } from '~/types/bardo';

interface SaveBackstoryResult {
  saveBackstory: Backstory;
}

export function useSaveBackstory() {
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function saveBackstory(
    title: string,
    content: string,
    worldId: string,
    characterName: string
  ) {
    pending.value = true;
    error.value = null;
    try {
      const data = await useMutation<SaveBackstoryResult>(saveBackstoryMutation, {
        title,
        content,
        worldId,
        characterName,
      });
      if (data?.saveBackstory) {
        return data.saveBackstory;
      }
      throw new Error('Invalid response');
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      pending.value = false;
    }
  }

  return { saveBackstory, pending, error };
}
