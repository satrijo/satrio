<template>
  <!-- Loading state -->
  <div v-if="pending" class="py-8">
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
  <article v-else class="py-8">
    <!-- Project header -->
    <header class="mb-10 text-center">
      <!-- Title -->
      <h1 class="text-heading text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
        {{ project.title }}
      </h1>

      <!-- Meta info -->
      <div class="flex items-center justify-center gap-4 text-muted text-sm mb-6">
        <time 
          :datetime="project.date ? new Date(project.date).toISOString() : ''"
          class="flex items-center gap-1.5"
        >
          <Icon name="mdi:calendar-outline" class="w-4 h-4" />
          {{ formatDate(project.date) }}
        </time>
      </div>

      <!-- Live demo button -->
      <a 
        v-if="project.link" 
        :href="project.link" 
        target="_blank" 
        rel="noopener noreferrer"
        class="btn btn-primary"
      >
        <Icon name="mdi:open-in-new" class="w-4 h-4" />
        View Live Demo
      </a>
    </header>

    <!-- Project content -->
    <div class="surface-card p-6 sm:p-8 mb-8">
      <div class="prose prose-lg max-w-none">
        <ContentRenderer :value="project" />
      </div>
    </div>

    <!-- Back button -->
    <div class="pt-8 border-t border-[var(--color-border)]">
      <NuxtLink to="/projects" class="link-primary inline-flex items-center gap-2">
        <Icon name="heroicons:arrow-left-20-solid" class="w-4 h-4" />
        Back to Projects
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import LoadingSpinner from '~/components/ui/LoadingSpinner.vue'

const route = useRoute()
const baseUrl = 'https://satrio.dev'

const { data: project, pending } = await useAsyncData(
  route.path,
  () => queryCollection('projects').path(route.path).first()
)

// SEO meta tags
watchEffect(() => {
  if (project.value) {
     const projectUrl = `${baseUrl}${project.value.path || route.path}`
    const projectDate = project.value.date ? new Date(project.value.date).toISOString() : ''
    const description = project.value.description || `Project: ${project.value.title}`
    
    useHead({
      title: `${project.value.title} | Satrio's Projects`,
      meta: [
        { name: 'description', content: description },
        { property: 'og:title', content: project.value.title },
        { property: 'og:description', content: description },
        { property: 'og:type', content: 'article' },
        { property: 'og:url', content: projectUrl },
        { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
        { property: 'article:published_time', content: projectDate },
        { property: 'article:author', content: 'Satrio' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: project.value.title },
        { name: 'twitter:description', content: description },
        { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` }
      ],
      link: [{ rel: 'canonical', href: projectUrl }],
      script: [
        {
          type: 'application/ld+json',
          children: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.value.title,
            description: description,
            datePublished: projectDate,
            creator: { '@type': 'Person', name: 'Satrio', url: baseUrl },
            url: projectUrl
          })
        }
      ]
    })
  }
})

const formatDate = (date: Date | string | undefined) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  })
}
</script>
