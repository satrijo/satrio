// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  runtimeConfig: {
    public: {
      disqusShortname: process.env.DISQUS_SHORTNAME || 'satriodev-1'
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


  // Script Netlify Identity sudah dimuat khusus di `public/admin/index.html`
  // sehingga tidak perlu di-load global di semua halaman Nuxt

  // SEO Configuration
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'format-detection', content: 'telephone=no' },
        { name: 'author', content: 'Satrio' },
        { property: 'og:site_name', content: 'Satrio.dev' },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:creator', content: '@lensatrio' }
      ],
      link: [
        { rel: 'canonical', href: 'https://satrio.dev' }
      ]
    }
  }
})