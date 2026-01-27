<template>
  <div class="projects-page">
    <!-- Page header -->
    <header class="page-header">
      <h1 class="page-title">Projects</h1>
      <p class="page-subtitle">
        A collection of my work, side projects, and experiments.
      </p>
    </header>
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="projects-list">
      <div v-for="n in 4" :key="n" class="project-skeleton">
        <div class="skeleton h-5 w-3/4 mb-2"></div>
        <div class="skeleton h-4 w-full mb-2"></div>
        <div class="skeleton h-3 w-24"></div>
      </div>
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!projects?.length" class="empty-state">
      <Icon name="mdi:folder-open-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No projects yet</h3>
      <p class="text-muted">Projects will be added soon.</p>
    </div>
    
    <!-- Projects list -->
    <div v-else class="projects-list">
      <article 
        v-for="project in projects" 
        :key="project.path"
        class="project-card"
      >
        <NuxtLink :to="project.path" class="project-link">
          <h2 class="project-title">{{ project.title }}</h2>
          <p v-if="getDescription(project)" class="project-description">
            {{ getDescription(project) }}
          </p>
          <div class="project-meta">
            <span class="project-date">{{ formatDate(project.date) }}</span>
            <template v-if="project.link">
              <span class="meta-dot">·</span>
              <span class="project-demo">
                <Icon name="mdi:open-in-new" class="w-3.5 h-3.5" />
                Live Demo
              </span>
            </template>
          </div>
        </NuxtLink>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
const baseUrl = 'https://satrio.dev'

useHead({
  title: 'Projects | Satrio',
  meta: [
    {
      name: 'description',
      content: 'A collection of Satrio\'s work, portfolio, and projects.'
    },
    { property: 'og:title', content: 'Projects | Satrio' },
    { property: 'og:description', content: 'A collection of Satrio\'s work, portfolio, and projects.' },
    { property: 'og:url', content: `${baseUrl}/projects` },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` }
  ],
  link: [{ rel: 'canonical', href: `${baseUrl}/projects` }]
})

const { data: projects, pending } = await useAsyncData(
  'projects',
  () => queryCollection('projects').order('date', 'DESC').all(),
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
    return project.description.length > 160 
      ? project.description.substring(0, 160) + '...' 
      : project.description
  }
  return ''
}
</script>

<style scoped>
.projects-page {
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

.projects-list {
  display: flex;
  flex-direction: column;
}

.project-card {
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--color-border);
}

.project-card:last-child {
  border-bottom: none;
}

.project-link {
  display: block;
}

.project-title {
  font-family: var(--font-prose);
  font-size: 1.375rem;
  font-weight: 700;
  line-height: 1.3;
  color: var(--color-text-heading);
  margin-bottom: 0.375rem;
  transition: color 0.15s ease;
}

.project-link:hover .project-title {
  color: var(--color-primary);
}

.project-description {
  font-size: 0.9375rem;
  line-height: 1.5;
  color: var(--color-text-muted);
  margin-bottom: 0.75rem;
}

.project-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
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
  
  .project-title {
    font-size: 1.125rem;
  }
}
</style>
