<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useHead } from '#imports'
useHead({
  bodyAttrs: {
    class: 'w-full max-w-screen-sm mx-auto px-4 py-2 bg-black'
  }
})
</script>