import type { Variables, ClientError } from 'graphql-request';
import type { H3Event } from 'h3';

export interface GraphQLErrorExtract {
  message: string;
  statusCode: number;
  query: string | null;
  variables: Variables | null;
  errors: Array<{
    message: string;
    statusCode: number | null;
    path: Array<string | number> | null;
    locations: Array<{ line: number; column: number }> | null;
  }>;
}

function extractQueryName(query: string | null): string | null {
  if (!query) return null;
  const match = query.match(/(?:query|mutation|subscription)\s+(\w+)/i);
  return match ? match[1] : null;
}

function extractGraphQLError(error: unknown): GraphQLErrorExtract | null {
  try {
    const clientError = error as ClientError;
    if (!clientError?.response) return null;

    const requestQuery = clientError.request?.query;
    const query =
      typeof requestQuery === 'string'
        ? requestQuery
        : Array.isArray(requestQuery)
          ? requestQuery.join(' ')
          : null;
    const variables = clientError.request?.variables || null;
    const graphqlErrors = clientError.response.errors || [];

    const errors = graphqlErrors.map((err) => {
      let message = 'Unknown error';
      let statusCode: number | null = null;

      if (typeof err.message === 'string') {
        message = err.message;
      } else if (err.message && typeof err.message === 'object') {
        const msgObj = err.message as { body?: string; status_code?: number };
        message = msgObj.body || 'Unknown error';
        statusCode = msgObj.status_code ?? null;
      }

      return {
        message,
        statusCode,
        path: err.path ? [...err.path] : null,
        locations: err.locations
          ? err.locations.map((loc) => ({ line: loc.line, column: loc.column }))
          : null,
      };
    });

    const firstError = errors[0];
    const message = errors.map((err) => err.message).join(', ');
    const statusCode = firstError?.statusCode ?? 500;

    return {
      message,
      statusCode,
      query,
      variables,
      errors,
    };
  } catch {
    return null;
  }
}

export function handleGraphQLError(error: unknown, event: H3Event) {
  const errorInfo = extractGraphQLError(error);

  if (errorInfo) {
    const statusCode = errorInfo.statusCode;
    const message = errorInfo.message;
    setResponseStatus(event, statusCode, message);
    const queryName = extractQueryName(errorInfo.query);

    console.error('[GraphQL] request failed', {
      queryName: queryName ?? 'unknown',
      statusCode: errorInfo.statusCode,
      graphqlErrors: errorInfo.errors,
      hasVariables: !!errorInfo.variables,
    });

    return {
      error: {
        message: errorInfo.message,
        statusCode: errorInfo.statusCode,
        errors: errorInfo.errors,
      },
    };
  }

  setResponseStatus(event, 500);
  console.error('[GraphQL] unknown error', error);

  return {
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  };
}
