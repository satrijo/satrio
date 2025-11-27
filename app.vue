<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useHead } from '#imports'
const route = useRoute()
const config = useRuntimeConfig()

// Base URL untuk canonical dan og:url
const baseUrl = 'https://satrio.dev'
const currentUrl = computed(() => `${baseUrl}${route.path}`)

useHead({
  htmlAttrs: {
    lang: 'en'
  },
  bodyAttrs: {
    class: 'w-full max-w-screen-sm mx-auto px-4 py-2 bg-black'
  },
  link: [
    {
      rel: 'canonical',
      href: currentUrl
    }
  ]
})
</script>