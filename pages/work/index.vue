<template>
  <div class="work-page">
    <!-- Page header -->
    <header class="page-header">
      <h1 class="page-title">Work Experience</h1>
      <p class="page-subtitle">
        My professional journey in software development.
      </p>
    </header>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="work-list">
      <div v-for="n in 3" :key="n" class="work-skeleton">
        <div class="skeleton h-3 w-24 mb-2"></div>
        <div class="skeleton h-5 w-48 mb-1"></div>
        <div class="skeleton h-4 w-36 mb-3"></div>
        <div class="skeleton h-3 w-full mb-1"></div>
        <div class="skeleton h-3 w-4/5"></div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!workExperiences?.length" class="empty-state">
      <Icon name="mdi:briefcase-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No work experience yet</h3>
      <p class="text-muted">Work experience will be added soon.</p>
    </div>
    
    <!-- Work list -->
    <div v-else class="work-list">
      <article 
        v-for="work in workExperiences" 
        :key="work.path"
        class="work-card"
      >
        <div class="work-header">
          <div class="work-info">
            <p class="work-date">{{ formatDateRange(work.start_date, work.end_date) }}</p>
            <h2 class="work-company">{{ work.company }}</h2>
            <p class="work-position">{{ work.position }}</p>
          </div>
          <span v-if="!work.end_date" class="work-current">
            <span class="current-dot"></span>
            Current
          </span>
        </div>
        
        <div class="work-content prose prose-sm">
          <ContentRenderer :value="work" />
        </div>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = 'https://satrio.dev'

useHead({
  title: 'Work Experience | Satrio',
  meta: [
    {
      name: 'description',
      content: 'Professional journey and career history of Satrio.'
    },
    { property: 'og:title', content: 'Work Experience | Satrio' },
    { property: 'og:description', content: 'Professional journey and career history of Satrio.' },
    { property: 'og:url', content: `${baseUrl}/work` },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` }
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
    return `${startFormatted} — Present`
  }
  const end = new Date(endDate)
  const endFormatted = end.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short' 
  })
  return `${startFormatted} — ${endFormatted}`
}
</script>

<style scoped>
.work-page {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-header {
  padding: 3rem 0 2rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1.5rem;
}

.page-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--color-text-heading);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

.work-list {
  display: flex;
  flex-direction: column;
}

.work-card {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.work-card:last-child {
  border-bottom: none;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
}

.work-info {
  flex: 1;
}

.work-date {
  font-size: 0.8125rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.work-company {
  font-family: var(--font-prose);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-heading);
  line-height: 1.3;
}

.work-position {
  font-size: 0.9375rem;
  color: var(--color-primary);
  font-weight: 500;
}

.work-current {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #10B981;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: 9999px;
  flex-shrink: 0;
}

.current-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10B981;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.work-content {
  color: var(--color-text-body);
}

.work-content :deep(p) {
  margin-bottom: 0.75rem;
  line-height: 1.6;
}

.work-content :deep(ul) {
  margin: 0.5rem 0;
  padding-left: 1.25rem;
}

.work-content :deep(li) {
  margin: 0.375rem 0;
  line-height: 1.5;
}

.work-skeleton {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.empty-state {
  text-align: center;
  padding: 4rem 0;
}

@media (max-width: 640px) {
  .page-title {
    font-size: 2rem;
  }
  
  .work-header {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .work-current {
    align-self: flex-start;
  }
}
</style>
