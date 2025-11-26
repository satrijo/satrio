<template>
  <section class="mt-16">
    <h3 class="text-xl font-bold mb-4">Tinggalkan Komentar</h3>
    <p v-if="!shortname" class="text-sm text-red-400 mb-4">
      Disqus belum dikonfigurasi. Setel variabel lingkungan `DISQUS_SHORTNAME`.
    </p>
    <div v-else id="disqus_thread" class="bg-gray-900 border border-gray-800 rounded-xl p-4" />
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  identifier?: string
  title?: string
}>()

const route = useRoute()
const config = useRuntimeConfig()
const shortname = config.public.disqusShortname

const configureDisqus = () => {
  if (typeof window === 'undefined' || !shortname) {
    return
  }

  const configFn = function configFn(this: DisqusJSConfig) {
    this.page.url = window.location.href
    this.page.identifier = props.identifier || route.fullPath
    this.page.title = props.title || document.title
  }

  if (window.DISQUS) {
    window.DISQUS.reset({
      reload: true,
      config: configFn
    })
  } else {
    window.disqus_config = configFn
    const d = document
    const s = d.createElement('script')
    s.src = `https://${shortname}.disqus.com/embed.js`
    s.setAttribute('data-timestamp', Date.now().toString())
    ;(d.head || d.body).appendChild(s)
  }
}

onMounted(configureDisqus)
watch(() => route.fullPath, () => configureDisqus())

declare global {
  interface DisqusInstance {
    reset?: (args: { reload: boolean; config: () => void }) => void
  }

  interface DisqusJSConfig {
    page: {
      url: string
      identifier: string
      title: string
    }
  }

  interface Window {
    DISQUS?: DisqusInstance
    disqus_config?: () => void
  }
}
</script>

<style scoped>
#disqus_thread {
  min-height: 200px;
}
</style>

