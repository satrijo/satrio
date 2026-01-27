<template>
  <NuxtImg
    :src="src"
    :alt="alt || ''"
    :width="width"
    :height="height"
    loading="lazy"
    format="webp"
    quality="80"
    class="prose-img rounded-lg shadow-md mx-auto my-8"
    :placeholder="[50, 25, 75, 5]"
  />
</template>

<script setup lang="ts">
defineProps<{
  src: string
  alt?: string
  width?: string | number
  height?: string | number
}>()
</script>

<style scoped>
.prose-img {
  max-width: 100%;
  height: auto;
}
</style>
