import { saveBackstoryMutation } from '~/graphql/mutations/saveBackstory';
import type { Backstory } from '~/types/bardo';
import { useGqlClient } from './useGqlClient';

interface SaveBackstoryResult {
  saveBackstory: Backstory;
}

export function useSaveBackstory() {
  const { request } = useGqlClient();
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
      const data = await request<
        SaveBackstoryResult,
        { title: string; content: string; worldId: string; characterName: string }
      >(saveBackstoryMutation as never, {
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
