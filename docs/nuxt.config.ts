// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/image',
    '@nuxt/icon',
    '@nuxt/test-utils',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/main.css'],

})