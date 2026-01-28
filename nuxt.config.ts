// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: false },

  runtimeConfig: {
    // Support both API_AI_KEY and NUXT_API_AI_KEY for Netlify compatibility
    apiAiKey: process.env.API_AI_KEY || process.env.NUXT_API_AI_KEY || '',
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
    cssLayer: 'base',
    // Bundle only used icon collections
    serverBundle: {
      collections: ['mdi', 'logos', 'circle-flags']
    }
  },

  // Image optimization configuration
  image: {
    quality: 80,
    format: ['webp', 'avif', 'png', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    },
    domains: ['satrio.dev']
  },
  // --- END BAGIAN YANG SUDAH ADA ---


  // Script Netlify Identity sudah dimuat khusus di `public/admin/index.html`
  // sehingga tidak perlu di-load global di semua halaman Nuxt

  // Google Ads - lazy loaded via @nuxt/scripts for better performance
  scripts: {
    defaultScriptOptions: {
      trigger: 'onNuxtReady'
    }
  },

  // Performance optimizations
  experimental: {
    payloadExtraction: true, // Enable for better caching
    renderJsonPayloads: true,
    viewTransition: true // Enable view transitions API
  },

  // Nitro configuration for Node.js server (Docker/Kubernetes)
  nitro: {
    preset: 'node-server',
    compressPublicAssets: true,
    sourceMap: false,
    // Prerender key routes at build time
    prerender: {
      crawlLinks: false, // Disable crawler to avoid dynamic routes
      routes: [
        '/',
        '/blog',
        '/projects',
        '/work'
      ]
    }
  },

  // Disable source maps in production to reduce memory
  sourcemap: {
    server: false,
    client: false
  },

  // Router options for better UX
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },

  // Route rules for caching and optimization
  routeRules: {
    // Homepage - ISR with 10 min revalidation
    '/': { 
      isr: 600,
      headers: {
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin'
      }
    },
    // Blog list - ISR with 5 min revalidation
    '/blog': { isr: 300 },
    // Blog posts - SWR (Stale-While-Revalidate) - must fetch from source
    '/blog/**': { 
      swr: true,
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
      }
    },
    // Projects - ISR with 10 min revalidation
    '/projects': { isr: 600 },
    // Project details - SWR
    '/projects/**': { swr: true },
    // Static assets - long cache
    '/_nuxt/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    '/uploads/**': {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    },
    // Admin panel - no cache + noindex
    '/admin/**': { 
      headers: { 
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'X-Robots-Tag': 'noindex, nofollow'
      } 
    },
    // API routes - no cache
    '/api/**': { cors: true, headers: { 'Cache-Control': 'no-cache' } }
  },

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
