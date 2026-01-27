<template>
  <div class="max-w-[720px] mx-auto">
    <!-- Page header -->
    <PageHeader
      title="Work Experience"
      subtitle="My professional journey, highlighting key roles and contributions in the software development industry."
    />
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="space-y-6">
      <div v-for="n in 4" :key="n" class="flex gap-4">
        <div class="flex flex-col items-center">
          <div class="skeleton w-3 h-3 rounded-full"></div>
          <div class="skeleton w-0.5 flex-1 mt-2" v-if="n < 4"></div>
        </div>
        <div class="flex-1 pb-6">
          <div class="skeleton h-4 w-32 mb-2"></div>
          <div class="skeleton h-5 w-56 mb-1"></div>
          <div class="skeleton h-4 w-44 mb-3"></div>
          <div class="skeleton h-3 w-full mb-1"></div>
          <div class="skeleton h-3 w-4/5 mb-1"></div>
          <div class="skeleton h-3 w-3/4"></div>
        </div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!workExperiences?.length" class="text-center py-16">
      <Icon name="mdi:briefcase-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No work experience yet</h3>
      <p class="text-muted">Work experience will be added soon.</p>
    </div>
    
    <!-- Timeline -->
    <div v-else class="relative">
      <!-- Timeline line -->
      <div class="absolute left-[5px] top-2 bottom-2 w-0.5 bg-[var(--color-border)]"></div>
      
       <!-- Work items -->
       <article 
         v-for="(work, index) in workExperiences" 
         :key="work.path"
         class="relative flex gap-6 pb-10 last:pb-0"
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
          <!-- Header with date and badge -->
          <div class="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <!-- Date range -->
              <p class="text-muted text-xs font-medium mb-1">
                {{ formatDateRange(work.start_date, work.end_date) }}
              </p>
              
              <!-- Company -->
              <h2 class="text-heading font-bold text-xl mb-0.5">
                {{ work.company }}
              </h2>
              
              <!-- Position -->
              <p class="text-[var(--color-primary)] font-medium">
                {{ work.position }}
              </p>
            </div>
            
            <!-- Current badge -->
            <Badge v-if="!work.end_date" variant="success" class="flex-shrink-0">
              <Icon name="mdi:circle" class="w-2 h-2 animate-pulse" />
              Current
            </Badge>
          </div>
          
          <!-- Description -->
          <div class="surface-card p-5 mt-4">
            <div class="prose prose-sm text-body max-w-none">
              <ContentRenderer :value="work" />
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/ui/PageHeader.vue'
import Badge from '~/components/ui/Badge.vue'

const baseUrl = 'https://satrio.dev'

useHead({
  title: 'Work Experience | Satrio - Professional Journey',
  meta: [
    {
      name: 'description',
      content: 'Professional journey, work experience, and career history of Satrio. Full-Stack Engineer at BMKG and Lead Developer at Open Knowledge Association.'
    },
    { name: 'keywords', content: 'work experience, career, professional history, software engineer, developer' },
    { property: 'og:title', content: 'Work Experience | Satrio - Professional Journey' },
    { property: 'og:description', content: 'Professional journey, work experience, and career history of Satrio.' },
    { property: 'og:url', content: `${baseUrl}/work` },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:title', content: 'Work Experience | Satrio' },
    { name: 'twitter:description', content: 'Professional journey, work experience, and career history of Satrio.' }
  ],
  link: [{ rel: 'canonical', href: `${baseUrl}/work` }]
})

const { data: workExperiences, pending } = await useAsyncData(
  'work-experiences',
  async () => {
    const all = await queryCollection('work').all()
    return all.sort((a, b) => {
      if (!a.end_date && b.end_date) return -1
      if (a.end_date && !b.end_date) return 1
      if (!a.end_date && !b.end_date) return new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
      return new Date(b.end_date!).getTime() - new Date(a.end_date!).getTime()
    })
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
