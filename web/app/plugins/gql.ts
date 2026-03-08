export default defineNuxtPlugin({
  setup() {
    const gql = $fetch.create({
      method: 'POST',
      onRequest({ options }) {
        const store = useUserStore();
        const token = store.token ?? '';
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        (options as unknown as { headers?: Record<string, string> }).headers = {
          ...(options.headers as unknown as Record<string, string>),
          ...headers,
        };
      },
      onResponseError({ response }) {
        console.error('GraphQL request failed', {
          status: response.status,
          statusText: response.statusText,
          url: response.url,
        });
      },
    });

    return {
      provide: {
        gql,
      },
    };
  },
});
