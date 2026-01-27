<template>
  <div class="flex items-center justify-center py-12">
    <div class="flex flex-col items-center gap-3">
      <div class="relative">
        <div class="w-10 h-10 border-3 border-[var(--color-surface-elevated)] rounded-full"></div>
        <div class="absolute inset-0 w-10 h-10 border-3 border-transparent border-t-[var(--color-primary)] rounded-full animate-spin"></div>
      </div>
      <p v-if="text" class="text-muted text-sm">{{ text }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text?: string
}>()
</script>

<style scoped>
.border-3 {
  border-width: 3px;
}
</style>
