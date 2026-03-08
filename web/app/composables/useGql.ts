import type { RequestDocument, Variables } from 'graphql-request';

export function useQuery<T>(query: RequestDocument, variables?: Variables) {
  const { $gql } = useNuxtApp();
  return useFetch<T>('/api/gql', {
    $fetch: $gql as typeof $fetch,
    body: {
      query,
      variables,
    },
  });
}

export async function useMutation<T>(
  mutation: RequestDocument,
  variables?: Variables
): Promise<T> {
  const { $gql } = useNuxtApp();
  const data = await ($gql as typeof $fetch)<T>('/api/gql', {
    body: {
      mutation,
      variables,
    },
  });
  return data as T;
}
