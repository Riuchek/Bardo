import { deleteWorldMutation } from '~/graphql/mutations/deleteWorld';
import { useGqlClient } from './useGqlClient';

interface DeleteWorldResult {
  deleteWorld: boolean;
}

export function useDeleteWorld() {
  const { request } = useGqlClient();
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function deleteWorld(id: string) {
    pending.value = true;
    error.value = null;
    try {
      const data = await request<DeleteWorldResult, { id: string }>(
        deleteWorldMutation as never,
        { id }
      );
      return data?.deleteWorld ?? false;
    } catch (e) {
      error.value = e instanceof Error ? e : new Error(String(e));
      throw e;
    } finally {
      pending.value = false;
    }
  }

  return { deleteWorld, pending, error };
}
