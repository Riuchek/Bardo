import type { RequestDocument, Variables } from 'graphql-request';
import { GraphQLClient } from 'graphql-request';
import { handleGraphQLError } from '../utils/gql';

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }

  try {
    const config = useRuntimeConfig();
    const upstream = config.graphqlUpstream as string;
    const body = await readBody<{
      query?: RequestDocument;
      mutation?: RequestDocument;
      variables?: Variables;
    }>(event);

    const { query, mutation, variables } = body;
    const auth = getHeader(event, 'authorization');

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (auth) {
      headers['Authorization'] = auth;
    }

    const client = new GraphQLClient(upstream, { headers });
    const document = mutation ?? query;

    if (!document) {
      setResponseStatus(event, 400);
      return {
        error: {
          message: 'Missing query or mutation',
          statusCode: 400,
        },
      };
    }

    const response = await client.request(document, variables);
    return response;
  } catch (error) {
    return handleGraphQLError(error, event);
  }
});
