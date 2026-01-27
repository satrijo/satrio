<template>
  <section>
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Work Experience</h2>
      <NuxtLink to="/work" class="link-primary text-sm font-medium flex items-center gap-1">
        View all
        <Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4" />
      </NuxtLink>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="space-y-6">
      <div v-for="n in 3" :key="n" class="flex gap-4">
        <div class="flex flex-col items-center">
          <div class="skeleton w-3 h-3 rounded-full"></div>
          <div class="skeleton w-0.5 h-full mt-2" v-if="n < 3"></div>
        </div>
        <div class="flex-1 pb-6">
          <div class="skeleton h-4 w-32 mb-2"></div>
          <div class="skeleton h-5 w-48 mb-1"></div>
          <div class="skeleton h-4 w-40 mb-3"></div>
          <div class="skeleton h-3 w-full mb-1"></div>
          <div class="skeleton h-3 w-4/5"></div>
        </div>
      </div>
    </div>
    
    <!-- Timeline -->
    <div v-else class="relative">
      <!-- Timeline line -->
      <div class="absolute left-[5px] top-2 bottom-2 w-0.5 bg-[var(--color-border)]"></div>
      
      <!-- Work items -->
      <div 
        v-for="(work, index) in workExperience" 
        :key="work._path"
        class="relative flex gap-4 pb-8 last:pb-0"
      >
        <!-- Timeline dot -->
        <div class="relative z-10 flex-shrink-0">
          <div 
            class="w-3 h-3 rounded-full mt-1.5"
            :class="!work.end_date ? 'bg-[var(--color-primary)] ring-4 ring-[var(--color-primary)]/20' : 'bg-[var(--color-surface-elevated)]'"
          ></div>
        </div>
        
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <!-- Date range -->
          <p class="text-muted text-xs font-medium mb-1">
            {{ formatDateRange(work.start_date, work.end_date) }}
          </p>
          
          <!-- Company & Position -->
          <h3 class="text-heading font-semibold text-base mb-0.5">
            {{ work.company }}
          </h3>
          <p class="text-[var(--color-primary)] text-sm font-medium mb-3">
            {{ work.position }}
          </p>
          
          <!-- Description -->
          <div class="prose prose-sm text-body max-w-none">
            <ContentRenderer :value="work" />
          </div>
        </div>
        
        <!-- Current badge -->
        <Badge v-if="!work.end_date" variant="success" class="flex-shrink-0 self-start mt-1">
          Current
        </Badge>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Badge from '~/components/ui/Badge.vue'

const { data: workExperience, pending } = await useAsyncData(
  'work-experience-home',
  async () => {
    const all = await queryCollection('work').all()
    return all
      .sort((a, b) => {
        if (!a.end_date && b.end_date) return -1
        if (a.end_date && !b.end_date) return 1
        if (!a.end_date && !b.end_date) return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        return new Date(b.end_date!).getTime() - new Date(a.end_date!).getTime()
      })
      .slice(0, 3)
  },
  { lazy: true }
)

const formatDateRange = (startDate: Date | string, endDate?: Date | string) => {
  if (!startDate) return ''
  const start = new Date(startDate)
  const startFormatted = start.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
  if (!endDate) {
    return `${startFormatted} - Present`
  }
  const end = new Date(endDate)
  const endFormatted = end.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
  return `${startFormatted} - ${endFormatted}`
}
</script>
