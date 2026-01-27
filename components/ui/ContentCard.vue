<template>
  <NuxtLink
    v-if="to"
    :to="to"
    class="surface-card block p-5 cursor-pointer group"
  >
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <h3 class="text-heading text-base font-semibold mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {{ title }}
        </h3>
        
        <!-- Meta row -->
        <div class="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted">
          <slot name="meta">
            <span v-if="date" class="flex items-center gap-1">
              <Icon name="mdi:calendar-outline" class="w-3.5 h-3.5" />
              {{ date }}
            </span>
          </slot>
        </div>
        
        <!-- Badges -->
        <div v-if="$slots.badges" class="flex flex-wrap gap-1.5 mb-3">
          <slot name="badges" />
        </div>
        
        <!-- Description -->
        <p v-if="description" class="text-body text-sm leading-relaxed line-clamp-2">
          {{ description }}
        </p>
      </div>
      
      <!-- Arrow icon -->
      <div v-if="to" class="flex-shrink-0 mt-1">
        <div class="w-8 h-8 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
          <Icon 
            name="heroicons:arrow-right-20-solid" 
            class="w-4 h-4 text-muted group-hover:text-[var(--color-background)] transition-colors" 
          />
        </div>
      </div>
    </div>
  </NuxtLink>
  <div
    v-else
    class="surface-card block p-5"
  >
    <div class="flex justify-between items-start gap-4">
      <div class="flex-1 min-w-0">
        <!-- Title -->
        <h3 class="text-heading text-base font-semibold mb-1">
          {{ title }}
        </h3>
        
        <!-- Meta row -->
        <div class="flex flex-wrap items-center gap-2 mb-2 text-xs text-muted">
          <slot name="meta">
            <span v-if="date" class="flex items-center gap-1">
              <Icon name="mdi:calendar-outline" class="w-3.5 h-3.5" />
              {{ date }}
            </span>
          </slot>
        </div>
        
        <!-- Badges -->
        <div v-if="$slots.badges" class="flex flex-wrap gap-1.5 mb-3">
          <slot name="badges" />
        </div>
        
        <!-- Description -->
        <p v-if="description" class="text-body text-sm leading-relaxed line-clamp-2">
          {{ description }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  date?: string
  to?: string
}>()
</script>
