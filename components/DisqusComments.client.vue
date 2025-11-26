<template>
  <section class="mt-16">
    <h3 class="text-xl font-bold mb-4">Tinggalkan Komentar</h3>
    <p v-if="!shortname" class="text-sm text-red-400 mb-4">
      Disqus belum dikonfigurasi. Setel variabel lingkungan `DISQUS_SHORTNAME`.
    </p>
    <div
      v-else
      ref="threadRef"
      id="disqus_thread"
      class="border border-gray-800 rounded-xl p-4 bg-transparent"
    />
  </section>
</template>

<script setup lang="ts">
const threadRef = ref<HTMLElement | null>(null)

const props = defineProps<{
  identifier?: string
  title?: string
}>()

const route = useRoute()
const config = useRuntimeConfig()
const shortname = config.public.disqusShortname

const injectDisqus = () => {
  if (typeof window === 'undefined' || !shortname) {
    return
  }

  window.disqus_config = function configFn(this: DisqusJSConfig) {
    this.page.url = window.location.href
    this.page.identifier = props.identifier || route.fullPath
    this.page.title = props.title || document.title
  }

  const existingScript = document.getElementById('dsq-embed-scr')
  if (existingScript) {
    existingScript.remove()
  }

  if (threadRef.value) {
    threadRef.value.innerHTML = ''
  }

  const d = document
  const s = d.createElement('script')
  s.id = 'dsq-embed-scr'
  s.src = `https://${shortname}.disqus.com/embed.js`
  s.setAttribute('data-timestamp', Date.now().toString())
  s.async = true
  ;(d.head || d.body).appendChild(s)
}

onMounted(() => {
  injectDisqus()
})
watch(() => route.fullPath, () => {
  injectDisqus()
})

declare global {
  interface DisqusJSConfig {
    page: {
      url: string
      identifier: string
      title: string
    }
  }

  interface Window {
    disqus_config?: () => void
  }
}
</script>

<style scoped>
#disqus_thread {
  min-height: 200px;
}
</style>

