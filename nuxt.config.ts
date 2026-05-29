export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-05-22',
  experimental: {
    viteEnvironmentApi: true
  },
  css: ['~/assets/css/global.css'],
  app: {
    head: {
      title: 'School Application Form',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1' }
      ]
    }
  }
})
