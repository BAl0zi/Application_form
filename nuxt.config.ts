export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-05-22',
  experimental: {
    viteEnvironmentApi: true
  },
  app: {
    head: {
      title: 'School Application Form'
    }
  }
})
