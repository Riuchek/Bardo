export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method Not Allowed' });
  }
  const config = useRuntimeConfig();
  const upstream = config.graphqlUpstream as string;
  const body = await readBody(event);
  const auth = getHeader(event, 'authorization');
  const headers: Record<string, string> = {
    'content-type': 'application/json',
  };
  if (auth) {
    headers['Authorization'] = auth;
  }
  const res = await $fetch(upstream, {
    method: 'POST',
    body,
    headers,
  }).catch((err) => {
    throw createError({
      statusCode: err.statusCode ?? 502,
      statusMessage: err.statusMessage ?? 'Bad Gateway',
      data: err.data,
    });
  });
  return res;
});
