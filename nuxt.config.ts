export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: '2026-05-22',
  experimental: {
    viteEnvironmentApi: true
  },
  runtimeConfig: {
    googleDriveFolderId: process.env.GOOGLE_DRIVE_FOLDER_ID || '',
    googleDrivePrimaryFolderId: process.env.GOOGLE_DRIVE_PRIMARY_FOLDER_ID || '',
    googleDriveJuniorFolderId: process.env.GOOGLE_DRIVE_JUNIOR_FOLDER_ID || '',
    googleServiceAccountKey: process.env.GOOGLE_SERVICE_ACCOUNT_KEY || ''
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
