<template>
  <div class="project-article">
    <!-- Loading state -->
    <div v-if="pending" class="py-16 text-center">
      <LoadingSpinner text="Loading project..." />
    </div>

    <!-- Not found state -->
    <div v-else-if="!project" class="text-center py-16">
      <Icon name="mdi:folder-alert-outline" class="w-20 h-20 text-muted mx-auto mb-4" />
      <h1 class="text-heading text-2xl font-bold mb-2">Project Not Found</h1>
      <p class="text-muted mb-6">The project you're looking for doesn't exist or has been moved.</p>
      <NuxtLink to="/projects" class="btn btn-primary">
        <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
        Back to Projects
      </NuxtLink>
    </div>

    <!-- Project content -->
    <article v-else>
      <!-- Header -->
      <header class="article-header">
        <h1 class="article-title">{{ project.title }}</h1>
        
        <div class="article-meta">
          <span>{{ formatDate(project.date) }}</span>
          <template v-if="project.link">
            <span class="meta-dot">·</span>
            <a 
              :href="project.link" 
              target="_blank" 
              rel="noopener noreferrer"
              class="demo-link"
            >
              <Icon name="mdi:open-in-new" class="w-4 h-4" />
              View Live Demo
            </a>
          </template>
        </div>
      </header>

      <!-- Content -->
      <div class="prose prose-lg">
        <ContentRenderer :value="project" />
      </div>

      <!-- Footer -->
      <footer class="article-footer">
        <NuxtLink to="/projects" class="back-link">
<Icon name="mdi:arrow-left" class="w-4 h-4" />
          All Projects
        </NuxtLink>
      </footer>
    </article>
  </div>
</template>

<script setup lang="ts">
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const route = useRoute()
const baseUrl = 'https://satrio.dev'

const { data: project, pending } = await useAsyncData(
  route.path,
  () => queryCollection('projects').path(route.path).first(),
  { watch: [() => route.path] }
)

watchEffect(() => {
  if (project.value) {
    const projectUrl = `${baseUrl}${project.value.path || route.path}`
    const projectDate = project.value.date ? new Date(project.value.date).toISOString() : ''
    const description = project.value.description || `Project: ${project.value.title}`
    
    useHead({
      title: `${project.value.title} | Satrio`,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: project.value.title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: projectUrl },
        { property: 'og:image', content: `${baseUrl}/og-image.jpg` }
      ],
      link: [{ rel: 'canonical', href: projectUrl }]
    })
  }
})

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short'
  })
}
</script>

<style scoped>
.project-article {
  max-width: 680px;
  margin: 0 auto;
  padding: 0 1rem;
}

.article-header {
  padding: 2rem 0 1.5rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 2rem;
}

.article-title {
  font-family: "Inter", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: var(--color-text-heading);
  margin-bottom: 1rem;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
}

.meta-dot {
  color: var(--color-text-muted);
}

.demo-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--color-primary);
  transition: opacity 0.15s ease;
}

.demo-link:hover {
  opacity: 0.8;
}

.article-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.9375rem;
  color: var(--color-text-muted);
  transition: color 0.15s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .article-title {
    font-size: 1.875rem;
  }
}
</style>
