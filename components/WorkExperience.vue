<template>
  <section class="section">
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Work Experience</h2>
      <NuxtLink to="/work" class="section-link">
        View all
        <Icon name="heroicons:arrow-right-20-solid" class="w-4 h-4" />
      </NuxtLink>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="work-list">
      <div v-for="n in 2" :key="n" class="work-skeleton">
        <div class="skeleton h-3 w-24 mb-2"></div>
        <div class="skeleton h-5 w-48 mb-1"></div>
        <div class="skeleton h-4 w-36"></div>
      </div>
    </div>
    
    <!-- Work list -->
    <div v-else class="work-list">
      <article 
        v-for="work in workExperience" 
        :key="work.path"
        class="work-item"
      >
        <div class="work-header">
          <div class="work-info">
            <p class="work-date">{{ formatDateRange(work.start_date, work.end_date) }}</p>
            <h3 class="work-company">{{ work.company }}</h3>
            <p class="work-position">{{ work.position }}</p>
          </div>
          <span v-if="!work.end_date" class="work-current">Current</span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
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
      .slice(0, 2)
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
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid var(--color-border);
}

.section-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.section-link {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.section-link:hover {
  color: var(--color-primary);
}

.work-list {
  display: flex;
  flex-direction: column;
}

.work-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.work-item:last-child {
  border-bottom: none;
}

.work-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
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
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-heading);
  line-height: 1.3;
}

.work-position {
  font-size: 0.875rem;
  color: var(--color-primary);
}

.work-current {
  padding: 0.125rem 0.5rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: #10B981;
  background-color: rgba(16, 185, 129, 0.1);
  border-radius: 9999px;
  flex-shrink: 0;
}

.work-skeleton {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}
</style>
