<template>
  <div class="max-w-[720px] mx-auto">
    <!-- Page header -->
    <PageHeader
      title="Projects"
      subtitle="A collection of my work, side projects, and experiments. Each project represents a unique challenge and learning experience."
    />
    
    <!-- Loading skeleton -->
    <div v-if="pending" class="grid sm:grid-cols-2 gap-4">
      <SkeletonCard v-for="n in 4" :key="n" />
    </div>
    
    <!-- Empty state -->
    <div v-else-if="!projects?.length" class="text-center py-16">
      <Icon name="mdi:folder-open-outline" class="w-16 h-16 text-muted mx-auto mb-4" />
      <h3 class="text-heading text-lg font-semibold mb-2">No projects yet</h3>
      <p class="text-muted">Projects will be added soon.</p>
    </div>
    
     <!-- Projects grid -->
     <div v-else class="grid sm:grid-cols-2 gap-4">
       <ContentCard
         v-for="project in projects"
         :key="project.path"
         :title="project.title"
         :description="getDescription(project)"
         :date="formatDate(project.date)"
         :to="project.path"
       >
        <template #meta>
          <span class="flex items-center gap-1">
            <Icon name="mdi:calendar-outline" class="w-3.5 h-3.5" />
            {{ formatDate(project.date) }}
          </span>
        </template>
        
        <template #badges>
          <Badge v-if="project.link" variant="primary" icon="mdi:open-in-new">
            Live Demo
          </Badge>
        </template>
      </ContentCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '~/components/ui/PageHeader.vue'
import SkeletonCard from '~/components/ui/SkeletonCard.vue'
import ContentCard from '~/components/ui/ContentCard.vue'
import Badge from '~/components/ui/Badge.vue'

const baseUrl = 'https://satrio.dev'

useHead({
  title: 'Projects | Satrio - Portfolio & Work Showcase',
  meta: [
    {
      name: 'description',
      content: 'A collection of Satrio\'s work, portfolio, and projects. Full-stack web applications built with modern technologies.'
    },
    { name: 'keywords', content: 'portfolio, projects, web development, software projects, full-stack development' },
    { property: 'og:title', content: 'Projects | Satrio - Portfolio & Work Showcase' },
    { property: 'og:description', content: 'A collection of Satrio\'s work, portfolio, and projects.' },
    { property: 'og:url', content: `${baseUrl}/projects` },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:image', content: `${baseUrl}/og-image.jpg` },
    { name: 'twitter:title', content: 'Projects | Satrio' },
    { name: 'twitter:description', content: 'A collection of Satrio\'s work, portfolio, and projects.' }
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
    month: 'long'
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
