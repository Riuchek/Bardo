import { GraphQLClient } from 'graphql-request';
import type { TypedDocumentNode } from 'graphql';
import { useUserStore } from '~/stores/user';

export function useGqlClient() {
  const config = useRuntimeConfig();
  const userStore = useUserStore();
  const endpoint = config.public.graphqlUrl as string;

  function createClient() {
    return new GraphQLClient(endpoint, {
      headers: userStore.token
        ? { Authorization: `Bearer ${userStore.token}` }
        : {},
    });
  }

  async function request<T, V extends Record<string, unknown> = Record<string, unknown>>(
    document: TypedDocumentNode<T, V>,
    variables?: V
  ): Promise<T> {
    return createClient().request(document, variables as V);
  }

  return {
    get client() {
      return createClient();
    },
    request,
  };
}
