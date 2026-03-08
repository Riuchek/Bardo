import { deleteWorldMutation } from '~/gql/mutations/deleteWorld';

interface DeleteWorldResult {
  deleteWorld: boolean;
}

export function useDeleteWorld() {
  const pending = ref(false);
  const error = ref<Error | null>(null);

  async function deleteWorld(id: string) {
    pending.value = true;
    error.value = null;
    try {
      const data = await useMutation<DeleteWorldResult>(deleteWorldMutation, {
        id,
      });
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
