# Bardo Web

## Architecture (based on Leopardo)

- **State:** Pinia stores; pages and components use only **composables**, never stores directly.
- **GraphQL:** All client requests go through the app proxy `POST /api/gql`. The server forwards to the GraphQL upstream with auth and uses a shared error handler.

### GraphQL flow

1. **Client:** Composables use `useMutation` or `useQuery` from `useGql`. These call the plugin `$gql`, which adds `Authorization: Bearer <token>` when the user is logged in.
2. **Server:** `server/api/gql.post.ts` reads `query` or `mutation` and `variables`, builds a `GraphQLClient` with the upstream URL and forwarded headers, and returns the result. On failure, `server/utils/gql.ts` normalizes errors and returns a structured `{ error }` with status.
3. **Definitions:** Queries and mutations live under `app/gql/queries/` and `app/gql/mutations/`, each file exporting a `gql`-tagged document.

### File layout

```
web/app/
  gql/
    queries/     # e.g. me.ts, backstories.ts, world.ts
    mutations/  # e.g. login.ts, saveBackstory.ts
  composables/  # useGql (useQuery, useMutation), useLogin, useSaveBackstory, ...
  plugins/
    gql.ts       # provides $gql with auth
  stores/        # user store (used only inside composables/plugins)
web/server/
  api/
    gql.post.ts  # proxy to GraphQL upstream
  utils/
    gql.ts       # handleGraphQLError
```

### Cursor rules

Project-specific Cursor rules are in `.cursor/rules/` (general, vuejs-expert, nuxt-v4) and define conventions for code style, composables vs stores, and GraphQL usage.
