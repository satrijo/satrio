<template>
  <span :class="badgeClass">
    <Icon v-if="icon" :name="icon" class="w-3.5 h-3.5" />
    <slot />
  </span>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'accent' | 'surface' | 'success' | 'warning' | 'purple'
  icon?: string
}>(), {
  variant: 'surface'
})

const badgeClass = computed(() => {
  const base = 'badge'
  const variants: Record<string, string> = {
    primary: 'badge-primary',
    accent: 'badge-accent',
    surface: 'badge-surface',
    success: 'badge-success',
    warning: 'badge-warning',
    purple: 'badge-purple'
  }
  return `${base} ${variants[props.variant]}`
})
</script>
