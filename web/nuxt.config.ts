// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/apollo',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/ui',
    '@pinia/nuxt'
  ],
  css: ['~/assets/css/main.css'],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'http://localhost:8080/query',
      }
    }
  }
})