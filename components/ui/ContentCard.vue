<template>
  <div
    v-if="to"
    class="surface-card block p-5 cursor-pointer group transition-all duration-200"
    :class="{ 'opacity-60 scale-[0.99]': isClicked }"
    @click="handleClick"
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
      
      <!-- Arrow icon with loading state -->
      <div class="flex-shrink-0 mt-1">
        <div class="w-8 h-8 rounded-full bg-[var(--color-surface-elevated)] flex items-center justify-center group-hover:bg-[var(--color-primary)] transition-colors">
          <Icon 
            v-if="!isClicked"
            name="heroicons:arrow-right-20-solid" 
            class="w-4 h-4 text-muted group-hover:text-[var(--color-background)] transition-colors" 
          />
          <Icon
            v-else
            name="svg-spinners:ring-resize"
            class="w-4 h-4 text-[var(--color-primary)]"
          />
        </div>
      </div>
    </div>
  </div>
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
const props = defineProps<{
  title: string
  description?: string
  date?: string
  to?: string
}>()

const router = useRouter()
const isClicked = ref(false)

const handleClick = async () => {
  if (!props.to || isClicked.value) return
  
  isClicked.value = true
  
  try {
    // Force navigation with programmatic routing
    await navigateTo(props.to, { 
      replace: false,
      external: false
    })
  } catch (error) {
    console.error('Navigation error:', error)
    isClicked.value = false
  }
}
</script>
