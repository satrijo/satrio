<template>
  <div class="surface-card p-5 space-y-3">
    <!-- Title skeleton -->
    <div class="skeleton h-5 w-3/4"></div>
    
    <!-- Meta skeleton -->
    <div class="flex items-center gap-2">
      <div class="skeleton h-3 w-20"></div>
      <div class="skeleton h-3 w-16"></div>
    </div>
    
    <!-- Description skeleton -->
    <div class="space-y-2" v-if="showDescription">
      <div class="skeleton h-3 w-full"></div>
      <div class="skeleton h-3 w-5/6"></div>
    </div>
    
    <!-- Tags skeleton -->
    <div class="flex gap-2" v-if="showTags">
      <div class="skeleton h-6 w-16 rounded-full"></div>
      <div class="skeleton h-6 w-20 rounded-full"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  showDescription?: boolean
  showTags?: boolean
}>(), {
  showDescription: true,
  showTags: false
})
</script>
