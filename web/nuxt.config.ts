// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt',
    '@nuxtjs/device'
  ],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      graphqlUrl: process.env.NUXT_PUBLIC_GRAPHQL_URL || '/api/gql',
    },
    graphqlUpstream: process.env.NUXT_GRAPHQL_UPSTREAM || 'http://localhost:8080/query',
  },
})