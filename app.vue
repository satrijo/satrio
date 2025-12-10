<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { useHead } from "#imports";
const route = useRoute();
const config = useRuntimeConfig();

// Base URL untuk canonical dan og:url
const baseUrl = "https://satrio.dev";
const currentUrl = computed(() => `${baseUrl}${route.path}`);

useHead({
  htmlAttrs: {
    lang: "en",
  },
  bodyAttrs: {
    class: "w-full max-w-screen-lg mx-auto px-6 py-4 bg-gray-900",
  },
  link: [
    {
      rel: "canonical",
      href: currentUrl,
    },
  ],
});
</script>
