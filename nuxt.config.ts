// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      disqusShortname: process.env.DISQUS_SHORTNAME || ''
    }
  },

  // --- BAGIAN INI SUDAH ADA DI KONFIGURASI ANDA ---
  modules: [
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/ui',
    '@nuxt/content' // Bagus, ini sudah ada!
  ],
  css: ['~/assets/css/main.css'],
  icon: {
    mode: 'css',
    cssLayer: 'base'
  },
  // --- END BAGIAN YANG SUDAH ADA ---


  // +++ TAMBAHKAN BAGIAN INI +++
  // Menambahkan skrip Netlify Identity ke <head> di semua halaman
  // Ini diperlukan agar Decap CMS bisa melakukan otentikasi
  app: {
    head: {
      script: [
        {
          src: 'https://identity.netlify.com/v1/netlify-identity-widget.js'
        }
      ]
    }
  }
})