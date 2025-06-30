<script setup>
import { useHead } from '#imports'
useHead({
  bodyAttrs: {
    class: 'w-full max-w-screen-sm mx-auto px-4 py-2 bg-black'
  }
})
</script>

<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>