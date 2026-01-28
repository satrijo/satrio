<template>
  <section class="section">
    <!-- Section header -->
    <div class="section-header">
      <h2 class="section-title">Projects</h2>
      <NuxtLink to="/projects" class="section-link">
        View all
        <Icon name="mdi:arrow-right" class="w-4 h-4" />
      </NuxtLink>
    </div>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="projects-list">
      <div v-for="n in 2" :key="n" class="project-skeleton">
        <div class="skeleton h-4 w-3/4 mb-2"></div>
        <div class="skeleton h-3 w-full mb-2"></div>
        <div class="skeleton h-3 w-24"></div>
      </div>
    </div>
    
    <!-- Projects list -->
    <div v-else class="projects-list">
      <article 
        v-for="project in projects" 
        :key="project.path"
        class="project-item"
      >
        <NuxtLink :to="project.path" class="project-link">
          <h3 class="project-title">{{ project.title }}</h3>
          <p v-if="getDescription(project)" class="project-description">
            {{ getDescription(project) }}
          </p>
          <div class="project-meta">
            <span>{{ formatDate(project.date) }}</span>
            <template v-if="project.link">
              <span class="meta-dot">·</span>
              <span class="project-demo">
                <Icon name="mdi:open-in-new" class="w-3.5 h-3.5" />
                Demo
              </span>
            </template>
          </div>
        </NuxtLink>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const { data: projects, pending } = await useAsyncData(
  'recent-projects',
  () => queryCollection('projects').order('date', 'DESC').limit(2).all(),
  { lazy: true }
)

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}

const getDescription = (project: any) => {
  if (project.description) {
    return project.description.length > 120 
      ? project.description.substring(0, 120) + '...' 
      : project.description
  }
  return ''
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

.projects-list {
  display: flex;
  flex-direction: column;
}

.project-item {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}

.project-item:last-child {
  border-bottom: none;
}

.project-link {
  display: block;
}

.project-title {
  font-family: var(--font-prose);
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text-heading);
  margin-bottom: 0.25rem;
  transition: color 0.15s ease;
}

.project-link:hover .project-title {
  color: var(--color-primary);
}

.project-description {
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  color: var(--color-text-muted);
}

.meta-dot {
  color: var(--color-text-muted);
}

.project-demo {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-primary);
}

.project-skeleton {
  padding: 1rem 0;
  border-bottom: 1px solid var(--color-border);
}
</style>
