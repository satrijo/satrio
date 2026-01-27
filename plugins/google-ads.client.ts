// Google Ads lazy loading plugin - loads after Nuxt is ready
export default defineNuxtPlugin(() => {
  // Only run on client-side
  if (import.meta.server) return

  // Use useScript to lazy load Google Ads
  useScript({
    src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4268093070731551',
    crossorigin: 'anonymous'
  }, {
    trigger: 'onNuxtReady'
  })
})
